import React, { useState } from 'react';
import { Account } from '../types';
import { authenticateUser } from '../utils/accountStorage';
import { Lock, User, AlertCircle, PlayCircle } from 'lucide-react';
import { PricingSection } from './PricingSection';

interface LoginModalProps {
  onLoginSuccess: (account: Account) => void;
  onReplayIntro: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onLoginSuccess,
  onReplayIntro,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Por favor escribe usuario y contraseña');
      return;
    }

    const res = authenticateUser(username, password);
    if (res.success && res.account) {
      onLoginSuccess(res.account);
    } else {
      setError(res.message || 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center py-10 px-4 relative z-10 overflow-y-auto">
      {/* Background ambient subtle gray glow */}
      <div className="absolute w-[450px] h-[450px] bg-neutral-900/30 rounded-full blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-[450px] h-[450px] bg-neutral-900/20 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      {/* Main Glassmorphic Login Container (medio gris trasparentoso) */}
      <div className="w-full max-w-sm bg-neutral-900/65 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 sm:p-7 shadow-2xl relative z-20">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold tracking-wider text-neutral-100 uppercase">
            L-PRIMEXPRIM
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Generador de Sensibilidad
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-neutral-950/90 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
              Usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Escribe tu usuario"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-950/80 border border-neutral-700/70 rounded-xl text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-400 transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escribe tu contraseña"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-950/80 border border-neutral-700/70 rounded-xl text-neutral-100 placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-400 transition-colors"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600/70 text-neutral-100 font-semibold rounded-xl text-xs transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <span>Ingresar</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <button
            type="button"
            onClick={onReplayIntro}
            className="flex items-center gap-1 hover:text-neutral-300 transition-colors"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Ver intro de nuevo</span>
          </button>
          <span>Acceso seguro</span>
        </div>
      </div>

      {/* SISTEMA DE COMPRAS ABAJO DEL LOGIN */}
      <PricingSection onTrialActivated={onLoginSuccess} />
    </div>
  );
};
