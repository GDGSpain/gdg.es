/**
 * RF-SYNC-002: repositorio de capítulos contra el emulador de Firestore.
 * Se ejecuta con `npm run test:emulator` (o en CI); sin emulador se omite.
 */
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { deleteApp, getApps } from "firebase-admin/app";
import type { ChapterSourceFields } from "@db/schemas/chapter.schema";
import { loadConfig } from "@/shared/config/config";
import { getServerFirestore } from "./admin";
import { FirestoreChapterRepository } from "./chapter-repository.adapter";

const emulator = process.env.FIRESTORE_EMULATOR_HOST;

const fields = (overrides: Partial<ChapterSourceFields> = {}): ChapterSourceFields => ({
  sourceId: 975,
  slug: "gdg-madrid",
  title: "GDG Madrid",
  city: "Madrid",
  sourceState: "Madrid",
  comunidadId: "MD",
  latitude: 40.42,
  longitude: -3.71,
  logoUrl: null,
  bannerUrl: null,
  descriptionHtml: "<p>Hola</p>",
  website: "http://gdg.es",
  twitter: "gdgmadrid",
  linkedin: null,
  instagram: null,
  membersCount: 2283,
  isCampus: false,
  sourceUrl: "https://gdg.community.dev/gdg-madrid/",
  ...overrides,
});

describe.skipIf(!emulator)("FirestoreChapterRepository (emulador)", () => {
  const db = getServerFirestore(
    loadConfig({ FIRESTORE_EMULATOR_HOST: emulator, FIREBASE_PROJECT_ID: "demo-gdg-es" }),
  );
  const repo = new FirestoreChapterRepository(db);
  const t1 = new Date("2026-11-12T04:00:00Z");
  const t2 = new Date("2026-11-13T04:00:00Z");

  beforeEach(async () => {
    await db.recursiveDelete(db.collection("chapters"));
  });

  afterAll(async () => {
    await Promise.all(getApps().map((a) => deleteApp(a)));
  });

  it("crea el capítulo con id = sourceId y luego lo actualiza (idempotente)", async () => {
    expect(await repo.upsertFromSource(fields(), t1)).toBe("created");
    expect(await repo.upsertFromSource(fields({ membersCount: 2300 }), t2)).toBe("updated");

    const snap = await db.doc("chapters/975").get();
    expect(snap.get("membersCount")).toBe(2300);
    expect(snap.get("createdAt").toDate()).toEqual(t1);
    expect(snap.get("syncedAt").toDate()).toEqual(t2);
    expect((await db.collection("chapters").get()).size).toBe(1);
  });

  it("no pisa los datos propios ni la ocultación", async () => {
    await repo.upsertFromSource(fields(), t1);
    await db
      .doc("chapters/975")
      .update({ own: { bio: "Escrita en gdg.es" }, hiddenAt: new Date("2026-11-12T10:00:00Z") });

    await repo.upsertFromSource(fields({ title: "GDG Madrid (nuevo nombre)" }), t2);

    const snap = await db.doc("chapters/975").get();
    expect(snap.get("title")).toBe("GDG Madrid (nuevo nombre)");
    expect(snap.get("own")).toEqual({ bio: "Escrita en gdg.es" });
    expect(snap.get("hiddenAt")).not.toBeNull();
  });

  it("marca inactivos solo los que estaban activos y los reactiva si vuelven", async () => {
    await repo.upsertFromSource(fields(), t1);
    await repo.upsertFromSource(fields({ sourceId: 968, slug: "gdg-santiago-de-compostela" }), t1);

    expect(await repo.markInactive([975, 999], t2)).toBe(1);
    expect(await repo.markInactive([975], t2)).toBe(0);
    expect(await repo.findAll()).toEqual(
      expect.arrayContaining([
        { sourceId: 975, slug: "gdg-madrid", active: false },
        { sourceId: 968, slug: "gdg-santiago-de-compostela", active: true },
      ]),
    );

    await repo.upsertFromSource(fields(), t2);
    const snap = await db.doc("chapters/975").get();
    expect(snap.get("active")).toBe(true);
    expect(snap.get("inactiveSince")).toBeNull();
  });

  it("rechaza datos que no cumplen el esquema", async () => {
    await expect(repo.upsertFromSource(fields({ sourceUrl: "no-es-una-url" }), t1)).rejects.toThrow();
  });
});
