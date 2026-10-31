import React, { useState } from 'react';
import { Account } from '../types';
import { Menu, X, LogOut, KeyRound } from 'lucide-react';
import { ADMIN_MENU_PASSWORD } from '../utils/accountStorage';
import { RainCloud } from './RainCloud';

interface TopNavProps {
  currentAccount: Account;
  onOpenAdmin: () => void;
  onLogout: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentAccount,
  onOpenAdmin,
  onLogout,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Normal users do not see or get the admin option
  const canSeeAdmin = currentAccount.role === 'boss' || currentAccount.role === 'admin';

  const handleAdminClick = () => {
    setIsMenuOpen(false);
    setShowAdminPasswordModal(true);
    setAdminPasswordInput('');
    setPasswordError('');
  };

  const handleVerifyAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === ADMIN_MENU_PASSWORD || adminPasswordInput.trim() === 'L-NAGIE') {
      setShowAdminPasswordModal(false);
      onOpenAdmin();
    } else {
      setPasswordError('Contraseña incorrecta');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-neutral-900/60 backdrop-blur-md border-b border-neutral-800/80 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-sm sm:text-base text-neutral-200">
              L-PRIMEXPRIM
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700/50">
              {currentAccount.username}
            </span>
          </div>

          <div className="relative">
            {/* Menú button con nubesita de lluvia */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-200 text-xs sm:text-sm backdrop-blur-sm transition-all shadow-sm"
            >
              <RainCloud size="sm" />
              <span>Menú</span>
              {isMenuOpen ? <X className="w-3.5 h-3.5 text-neutral-400" /> : <Menu className="w-3.5 h-3.5 text-neutral-400" />}
            </button>

            {/* Menú trasparentoso */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/80 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {canSeeAdmin ? (
                  <button
                    onClick={handleAdminClick}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm text-neutral-200 hover:bg-neutral-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <RainCloud size="sm" />
                      <span className="font-semibold text-neutral-100">Admin</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                      Panel
                    </span>
                  </button>
                ) : (
                  <div className="px-3 py-2 text-xs text-neutral-500 italic">
                    Acceso estándar (sin admin)
                  </div>
                )}

                <div className="h-px bg-neutral-800 my-1" />

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs sm:text-sm text-neutral-400 hover:text-red-400 hover:bg-neutral-800/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Admin Password Modal con nubesita */}
      {showAdminPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900/90 backdrop-blur-xl border border-neutral-700/80 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-neutral-800 border border-neutral-700">
                  <RainCloud size="md" />
                </div>
                <h3 className="text-base font-semibold text-neutral-100">Contraseña Admin</h3>
              </div>
              <button
                onClick={() => setShowAdminPasswordModal(false)}
                className="text-neutral-500 hover:text-neutral-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyAdminPassword} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1.5">
                  Introduce la contraseña del admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Contraseña"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950/80 border border-neutral-700 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-500"
                  />
                </div>
                {passwordError && (
                  <p className="mt-2 text-xs text-red-400">{passwordError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPasswordModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-white text-neutral-900 font-semibold text-xs transition-colors"
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
