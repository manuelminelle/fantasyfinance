# Repository Guidelines

# Piano di Progetto: MarketCraft

## Visione e Architettura
- SPA con React + TypeScript + Vite, routing con React Router.
- UI modulare: layout desktop-first con sidebar sinistra e contenuti a pannelli glassmorphism.
- Motore deterministico in `/src/engine` (funzioni pure) separato da UI e servizi.
- Stato app in `/src/store` con Zustand; persistenza in `/src/services` (Firebase + cache locale).
- Animazioni con Framer Motion; grafici con Recharts.
- Test unitari del motore con Vitest.

## Librerie Scelte (con razionale)
- Stato: **Zustand** (piu leggero di RTK, selettori semplici, perfetto per store modulare e performance).
- Grafici: **Recharts** (integrazione React nativa, stile coerente con tema, animazioni fluide).

## Design System Tokens (linee guida)
- Colori base: `--bg`, `--bg-2`, `--surface`, `--surface-2`, `--border`, `--text`, `--muted`.
- Accenti: `--accent`, `--accent-2`, `--success`, `--warning`, `--danger`.
- Glassmorphism: `--glass-blur` (12-24px), `--glass-opacity` (0.6-0.8).
- Raggio: `--radius-lg` (16-20px), `--radius-xl` (24-32px).
- Ombre: `--shadow-soft`, `--shadow-depth`.
- Gradienti: `--bg-gradient`, `--accent-gradient`.

## Modello Dati (Game State)
- `GameState`:
  - `gameVersion`, `seed`, `turn`, `week`
  - `settings`: `theme`, `sound`, `leverage`, `blindMode`, `infoLag`, `difficulty`, `analyticsTier`
  - `player`: `cash`, `debt`, `marginUsed`, `equity`, `netWorthHistory[]`
  - `macro`: `phase`, `rate`, `inflation`, `unemployment`, `gdp`, `sentiment`
  - `assets`: `stocks[]`, `bonds[]`, `etfs[]`, `commodities[]`
  - `portfolio`: `positions[]`, `realizedPnl`, `unrealizedPnl`
  - `market`: `priceHistoryById`, `volatilityById`, `regime`
  - `events`: `latestEvents[]`, `newsFeed[]`
  - `flags`: `dirty`, `lastSaveAt`
- `Company`: `sector`, `price`, `fairValue`, `fundamentals{revenue,costs,margin,debt,growth,risk,cash,capex}`.

## Schema Firebase
- Collezione `users/{uid}`:
  - `gameVersion`, `lastUpdated`, `settings`, `currentGameState`, `lastLocalHash`.
- Regole: accesso in lettura/scrittura solo all’utente autenticato.

## Fasi di Lavoro (ognuna termina con app funzionante)

### 1) Bootstrap UI + Routing (COMPLETATA)
- **Obiettivo:** app avviabile con layout premium, tema chiaro/scuro, sidebar e pagine base.
- **File/Moduli:** `src/pages`, `src/components`, `src/styles`, `src/store`, `src/assets`.
- **Checklist:**
  - `npm run dev` mostra layout completo con dati statici.
  - `npm run build` ok.
  - Toggle tema persistente in localStorage.
- **Comando:** `Avvia Fase 1`

### 2) Motore Deterministico + Test (COMPLETATA)
- **Obiettivo:** simulazione turn-based con seed, macro, asset pricing, eventi.
- **File/Moduli:** `src/engine`, `src/types`, `src/store`, `tests/*`.
- **Checklist:**
  - End Turn aggiorna prezzi e news.
  - Test Vitest: determinismo e bounds (no NaN/negativi).
  - `npm run build` ok.
- **Comando:** `Avvia Fase 2`

### 3) Gameplay & UX Completa (COMPLETATA)
- **Obiettivo:** mercati, portafoglio, notizie, ricerca, scenario editor, onboarding (5 step).
- **File/Moduli:** `src/pages`, `src/components`, `src/store`.
- **Checklist:**
  - Trade buy/sell funzionante.
  - Grafici coerenti e animati.
  - Onboarding in italiano con toggle principali.
- **Comando:** `Avvia Fase 3`

### 4) Persistenza e Retention
- **Obiettivo:** Firebase Auth anonima, Firestore, autosave, import/export, cache locale.
- **File/Moduli:** `src/services`, `.env.example`, `netlify.toml`.
- **Checklist:**
  - Salvataggio cloud e ripristino locale.
  - Reset account con conferma.
  - `npm run build` ok.
- **Comando:** `Avvia Fase 4`

### 5) Polishing, Accessibilita, Deploy
- **Obiettivo:** rifiniture UI, performance, accessibilita, audio SFX, README.
- **File/Moduli:** `src/components`, `src/styles`, `README.md`.
- **Checklist:**
  - Tabelle ottimizzate, focus visibile, reduced motion.
  - SFX opzionali e discreti.
  - README in italiano con Firebase + Netlify.
- **Comando:** `Avvia Fase 5`

## Note di Esecuzione
- Mi fermo dopo la pianificazione. Inizio le fasi solo su tua approvazione.
