# Arquitectura de GDG.es en diagramas

Diagramas Mermaid de lo general a lo concreto. El *porqué* está en los [ADR](../adr/README.md). Si un
cambio contradice un diagrama, se actualiza en el mismo cambio.

## 1. Contexto (C4 nivel 1)

```mermaid
flowchart TB
    visitante(["Visitante<br/>(comunidad dev)"])
    organizador(["Organizador GDG"])
    admin(["Administrador"])
    subgraph gdges["GDG.es"]
        web["Web Next.js<br/>(público + /admin + /api)"]
        sync["Job de sincronización"]
        db[("Cloud Firestore")]
    end
    fuente["gdg.community.dev"]
    fauth["Firebase Authentication<br/>(Google)"]
    mapas["Google Maps Platform<br/>(Maps JS + Geocoding)"]
    sched["Cloud Scheduler"]

    visitante --> web
    organizador --> web
    admin --> web
    web --> db
    sync --> db
    sync -->|"solo España"| fuente
    web --> fauth
    web --> mapas
    sync --> mapas
    sched -->|"diario"| sync
```

## 2. Contenedores y capas (C4 nivel 2-3)

```mermaid
flowchart LR
    subgraph app["src/app (Next.js)"]
        pages["Páginas y route handlers"]
    end
    subgraph modules["src/modules/&lt;dominio&gt;"]
        uc["Casos de uso → Result&lt;T,E&gt;"]
        ports["Puertos"]
    end
    subgraph infra["src/infrastructure"]
        orm["Adaptador Firestore (Admin SDK)"]
        src["Adaptador GdgSource"]
        auth["Adaptador Firebase Auth"]
    end
    syncjob["src/sync"] --> uc
    pages --> uc
    uc --> ports
    orm -. implementa .-> ports
    src -. implementa .-> ports
    auth -. implementa .-> ports
```

## 3. Secuencia de sincronización

```mermaid
sequenceDiagram
    participant Cron
    participant Sync as Job sync
    participant Src as GdgSourcePort
    participant DB as Firestore
    Cron->>Sync: Cloud Scheduler → POST /api/sync/run
    Sync->>DB: abre registro de ejecución
    Sync->>Src: listar capítulos
    Src-->>Sync: capítulos (todos los países)
    Sync->>Sync: filtrar España
    loop por capítulo
        Sync->>Src: organizadores y eventos
        Sync->>DB: upsert por sourceId
    end
    Sync->>DB: marcar inactivos los que ya no están
    Sync->>DB: cierra registro (ok / errores)
```

## 4. Secuencia de inicio de sesión

```mermaid
sequenceDiagram
    participant N as Navegador
    participant FA as Firebase Auth
    participant W as Web (servidor)
    N->>FA: signInWithPopup(Google)
    FA-->>N: ID token
    N->>W: POST /api/auth/session (ID token)
    W->>FA: verifyIdToken + createSessionCookie
    W-->>N: Set-Cookie (httpOnly, secure)
    N->>W: peticiones con cookie
    W->>FA: verifySessionCookie → uid + claims (admin/organizer)
```
