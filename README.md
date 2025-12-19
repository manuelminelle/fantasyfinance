# MarketCraft

Simulatore di mercati finanziari con UI glassmorphism, motore deterministico e salvataggi locali/cloud.

## Stack
- React + TypeScript + Vite
- Zustand per stato globale
- Recharts per grafici
- Framer Motion per animazioni
- Firebase (Auth anonima + Firestore) per la persistenza cloud

## Struttura
- `src/engine` logica di simulazione pura
- `src/store` stato applicazione
- `src/components` UI
- `tests` test unitari del motore

## Comandi
- `npm install` installa le dipendenze
- `npm run dev` avvia il dev server
- `npm run build` build di produzione
- `npm run test` esegue i test
- `npm run lint` lint
- `npm run preview` preview della build

## Configurazione Firebase
Crea un file `.env` (puoi partire da `.env.example`) con:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Nella console Firebase:
- **Autenticazione** → **Metodo di accesso** → abilita **Anonimo**.
- **Firestore Database** → crea il database.
- **Regole** (Firestore):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Salvataggi
- Autosave locale (localStorage).
- Export/import JSON dalla pagina **Impostazioni**.
- Cloud sync attivo solo se le variabili `VITE_FIREBASE_*` sono configurate.

## Regole del gioco (sintesi)
- Obiettivo: far crescere il patrimonio netto con decisioni settimanali.
- Turni: ogni settimana aggiorna prezzi, macro e notizie.
- Trading: compra/vendi in base alla cassa (o leva se attiva).
- Rischio: volatilita e news impattano performance.
- Scenario: preset o personalizzazione (cassa, volatilita, eventi, recessione).

Guida completa: `docs/game-rules.md`.

## Deploy su Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Imposta le variabili ambiente `VITE_FIREBASE_*` nel pannello Netlify.
- Il redirect SPA e gestito da `netlify.toml`.
