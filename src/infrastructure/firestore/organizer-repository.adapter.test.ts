/**
 * RF-SYNC-003: equipo organizador contra el emulador de Firestore.
 * Se ejecuta con `npm run test:emulator` (o en CI); sin emulador se omite.
 */
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { deleteApp, getApps } from "firebase-admin/app";
import type { SourceTeamMember } from "@/modules/sync/ports/gdg-source.port";
import { loadConfig } from "@/shared/config/config";
import { getServerFirestore } from "./admin";
import { FirestoreOrganizerRepository } from "./organizer-repository.adapter";

const emulator = process.env.FIRESTORE_EMULATOR_HOST;
const m = (profileId: string, role = "GDG Organizer"): SourceTeamMember => ({
  profileId,
  name: `Persona ${profileId}`,
  avatarUrl: null,
  twitter: null,
  role,
});

describe.skipIf(!emulator)("FirestoreOrganizerRepository (emulador)", () => {
  const db = getServerFirestore(
    loadConfig({ FIRESTORE_EMULATOR_HOST: emulator, FIREBASE_PROJECT_ID: "demo-gdg-es" }),
  );
  const repo = new FirestoreOrganizerRepository(db);
  const t = new Date("2026-11-17T04:00:00Z");

  beforeEach(async () => {
    await db.recursiveDelete(db.collection("organizers"));
  });

  afterAll(async () => {
    await Promise.all(getApps().map((a) => deleteApp(a)));
  });

  it("una persona en dos capítulos es un solo documento con un rol por capítulo", async () => {
    await repo.replaceChapterTeam(975, [m("ana"), m("luis")], t);
    await repo.replaceChapterTeam(2488, [m("ana", "Organizer")], t);

    const ana = await db.doc("organizers/ana").get();
    expect(ana.get("chapterIds").sort()).toEqual([975, 2488]);
    expect(ana.get("roles")).toEqual({ "975": "GDG Organizer", "2488": "Organizer" });
    expect((await db.collection("organizers").get()).size).toBe(2);
  });

  it("quita el capítulo a quien sale del equipo sin borrar sus otros capítulos", async () => {
    await repo.replaceChapterTeam(975, [m("ana"), m("luis")], t);
    await repo.replaceChapterTeam(2488, [m("ana")], t);

    expect(await repo.replaceChapterTeam(975, [m("luis")], t)).toEqual({ members: 1, removed: 1 });

    const ana = await db.doc("organizers/ana").get();
    expect(ana.get("chapterIds")).toEqual([2488]);
    expect(ana.get("roles")).toEqual({ "2488": "GDG Organizer" });
  });

  it("es idempotente y no pisa datos propios ni la ocultación", async () => {
    await repo.replaceChapterTeam(975, [m("ana")], t);
    await db.doc("organizers/ana").update({ own: { bio: "propia" }, hiddenAt: new Date() });

    await repo.replaceChapterTeam(975, [{ ...m("ana"), name: "Ana Nueva" }], t);
    await repo.replaceChapterTeam(975, [{ ...m("ana"), name: "Ana Nueva" }], t);

    const ana = await db.doc("organizers/ana").get();
    expect(ana.get("name")).toBe("Ana Nueva");
    expect(ana.get("chapterIds")).toEqual([975]);
    expect(ana.get("own")).toEqual({ bio: "propia" });
    expect(ana.get("hiddenAt")).not.toBeNull();
  });

  it("borra a quien se queda sin capítulos, salvo si está oculto", async () => {
    await repo.replaceChapterTeam(975, [m("ana"), m("oculta")], t);
    await db.doc("organizers/oculta").update({ hiddenAt: new Date() });

    expect(await repo.replaceChapterTeam(975, [], t)).toEqual({ members: 0, removed: 2 });

    expect((await db.doc("organizers/ana").get()).exists).toBe(false);
    const oculta = await db.doc("organizers/oculta").get();
    expect(oculta.exists).toBe(true);
    expect(oculta.get("chapterIds")).toEqual([]);
  });
});
