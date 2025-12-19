import { lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppShell from "./components/layout/AppShell";
import { useSettingsStore } from "./store/settingsStore";
import { useUiStore } from "./store/uiStore";
import { startPersistence } from "./services/persistence";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Markets = lazy(() => import("./pages/Markets"));
const News = lazy(() => import("./pages/News"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Research = lazy(() => import("./pages/Research"));
const Scenario = lazy(() => import("./pages/Scenario"));
const Settings = lazy(() => import("./pages/Settings"));
const Rules = lazy(() => import("./pages/Rules"));

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="mercati" element={<Markets />} />
          <Route path="portafoglio" element={<Portfolio />} />
        <Route path="notizie" element={<News />} />
        <Route path="ricerca" element={<Research />} />
        <Route path="impostazioni" element={<Settings />} />
        <Route path="scenario" element={<Scenario />} />
        <Route path="regole" element={<Rules />} />
      </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const theme = useUiStore((state) => state.theme);
  const initTheme = useUiStore((state) => state.initTheme);
  const initOnboarding = useUiStore((state) => state.initOnboarding);
  const initSettings = useSettingsStore((state) => state.initSettings);

  useEffect(() => {
    initTheme();
    initSettings();
    initOnboarding();
    const stopPersistence = startPersistence();
    return () => stopPersistence();
  }, [initTheme, initSettings, initOnboarding]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
