# Roadmap App Mobile (iOS + Android)

## Scelta della strada
La strada consigliata e' **React Native (CLI, bare)** per avere UI nativa di alto livello, riuso della logica TypeScript del motore, e pieno controllo in **Xcode** e **Android Studio** per rifiniture e test.

## Passaggi numerati (da eseguire uno per volta)

1. **Conferma requisiti**: iOS + Android, offline local save, nessuna feature nativa speciale, UX alta prioritaria.
2. **Decisione stack RN**: React Native CLI (bare) + TypeScript. Motivazione: accesso completo a Xcode/Android Studio e controlli di build.
3. **Definizione architettura condivisa**: separare la logica deterministica del motore in un modulo riusabile (es. `packages/engine`) senza dipendenze web.
4. **Definizione dei tipi**: consolidare i type condivisi (`GameState`, assets, settings) per garantire compatibilita fra web e mobile.
5. **Mappa delle schermate**: tradurre le pagine attuali in screen mobile (Dashboard, Mercati, Portafoglio, News, Ricerca, Scenario, Impostazioni, Regole).
6. **Navigazione mobile**: scelta di pattern (Bottom Tabs + Stack per dettagli), definire hierarchy e back behavior.
7. **Design system mobile**: definire typography, spacing, card, colori e componenti mobili coerenti con il brand.
8. **Scelta grafici**: valutare `victory-native` o `react-native-svg-charts` (con `react-native-svg`) per i grafici principali.
9. **Scelta storage locale**: valutare `AsyncStorage` (semplice) vs `MMKV` (performance).
10. **Setup progetto RN**: creare progetto, configurare TypeScript, lint, path alias, e struttura `src/`.
11. **Import del motore**: integrare il modulo engine nel progetto RN e verificare determinismo con test unitari.
12. **Core state management**: portare lo store (Zustand) e sostituire `localStorage` con storage mobile.
13. **App shell mobile**: costruire layout base, header, bottom tabs, safe area e theming.
14. **Onboarding mobile**: adattare onboarding con layout touch-friendly e microcopy.
15. **Dashboard mobile**: layout ottimizzato, chart responsive, metriche leggibili su schermi piccoli.
16. **Mercati mobile**: lista filtrabile, dettaglio asset e trade rapido con input mobili.
17. **Portafoglio mobile**: tabella convertita in card list o table scroll con UX mobile.
18. **News e Ricerca**: timeline e schede dati leggibili; valutare card stack.
19. **Scenario e Impostazioni**: controlli touch-friendly, toggle, slider, import/export locale.
20. **Regole del gioco**: pagina informativa con layout mobile e gerarchia chiara.
21. **Test su iOS**: simulatore + device reale in Xcode, verifica performance, gesture, safe area.
22. **Test su Android**: emulator + device in Android Studio, controlli di back navigation e performance.
23. **Ottimizzazioni**: riduzione re-render, memoizzazione, performance list (FlatList).
24. **Asset Store**: icone, splash screen, screenshot per iOS/Android.
25. **Signing iOS**: bundle id, provisioning, build in Xcode, TestFlight.
26. **Signing Android**: keystore, applicationId, release build in Android Studio/Gradle.
27. **Privacy e policy**: compilare privacy labels e data safety, anche se solo storage locale.
28. **Testing finale**: regression + test di installazione, aggiornamenti e offline.
29. **Release**: TestFlight + Internal testing (Google Play), poi pubblicazione.
30. **Post-release**: monitoraggio crash e feedback, pianificare versioni incrementali.

## Note importanti
- Ogni step e' pensato per essere eseguito singolarmente su richiesta.
- L'uso di Xcode e Android Studio e' garantito dal percorso React Native CLI (bare).

## Librerie consigliate (RN)
- **Navigazione**: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- **Gestione stato**: `zustand` (riuso del modello attuale)
- **Storage locale**: `react-native-mmkv` (veloce) oppure `@react-native-async-storage/async-storage` (semplice)
- **Grafici**: `victory-native` oppure `react-native-svg-charts` + `react-native-svg`
- **Animazioni**: `react-native-reanimated` + `moti`
- **Safe area**: `react-native-safe-area-context`
- **Gesture**: `react-native-gesture-handler`
