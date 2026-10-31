/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Account } from './types';
import { IntroVideo } from './components/IntroVideo';
import { LoginModal } from './components/LoginModal';
import { TopNav } from './components/TopNav';
import { SensiGenerator } from './components/SensiGenerator';
import { AdminPanel } from './components/AdminPanel';

type AppView = 'intro' | 'login' | 'generator' | 'admin';

export default function App() {
  const [view, setView] = useState<AppView>('intro');
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);

  const handleIntroComplete = () => {
    setView('login');
  };

  const handleLoginSuccess = (account: Account) => {
    setCurrentAccount(account);
    setView('generator');
  };

  const handleLogout = () => {
    setCurrentAccount(null);
    setView('login');
  };

  const handleOpenAdmin = () => {
    setView('admin');
  };

  const handleBackToGenerator = () => {
    setView('generator');
  };

  const handleReplayIntro = () => {
    setView('intro');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white relative">
      {/* 1. Intro Video Stage */}
      {view === 'intro' && <IntroVideo onComplete={handleIntroComplete} />}

      {/* 2. Login Stage */}
      {view === 'login' && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onReplayIntro={handleReplayIntro}
        />
      )}

      {/* 3. Main Stage: Top Nav + Generator or Admin Panel */}
      {(view === 'generator' || view === 'admin') && currentAccount && (
        <>
          <TopNav
            currentAccount={currentAccount}
            onOpenAdmin={handleOpenAdmin}
            onLogout={handleLogout}
          />

          <main className="flex-1 flex flex-col justify-center items-center py-6 px-2 relative z-10">
            {/* Subtle soft ambient glow */}
            <div className="absolute w-[500px] h-[500px] bg-neutral-900/40 rounded-full blur-3xl pointer-events-none -top-20" />

            {view === 'generator' && <SensiGenerator />}

            {view === 'admin' && (
              <AdminPanel
                currentAccount={currentAccount}
                onBackToGenerator={handleBackToGenerator}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}
