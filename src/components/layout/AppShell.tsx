import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Background from "./Background";
import MobileNav from "./MobileNav";
import Onboarding from "../onboarding/Onboarding";
import NamePrompt from "../onboarding/NamePrompt";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell() {
  return (
    <div className="relative min-h-screen">
      <Background />
      <NamePrompt />
      <Onboarding />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-8 lg:pb-8">
          <TopBar />
          <div className="mt-8">
            <Suspense
              fallback={
                <div className="glass-panel glass-highlight rounded-3xl p-6 text-sm text-muted">
                  Caricamento della console...
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
