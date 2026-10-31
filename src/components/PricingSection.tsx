import React, { useState } from 'react';
import { CreditCard, Check, Sparkles, Copy, X, Clock, ShieldCheck, Zap } from 'lucide-react';
import { createNormalAccount } from '../utils/accountStorage';
import { Account } from '../types';

interface PricingSectionProps {
  onTrialActivated: (account: Account) => void;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  badge?: string;
  period: string;
  popular?: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onTrialActivated }) => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'nequi'>('paypal');
  const [copiedInfo, setCopiedInfo] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);

  const plans: Plan[] = [
    {
      id: '1h',
      name: '1 Hora',
      price: 'Gratis',
      period: 'Prueba inmediata',
      badge: 'Free Trial',
    },
    {
      id: '1d',
      name: '1 Día',
      price: '1$',
      period: '24 horas de acceso',
    },
    {
      id: '2d',
      name: '2 Días',
      price: '2$',
      period: '48 horas de acceso',
    },
    {
      id: '1m',
      name: '1 Mes',
      price: '5$',
      period: '30 días completos',
      popular: true,
      badge: 'Más Popular',
    },
    {
      id: 'perm',
      name: 'Permanente',
      price: '8$',
      period: 'Acceso de por vida',
      badge: 'Mejor Valor',
    },
  ];

  const handleActivateFreeTrial = () => {
    setTrialLoading(true);
    setTimeout(() => {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const trialUser = `Invitado_${randomSuffix}`;
      const trialPass = `PRIME${randomSuffix}`;
      const newAcc = createNormalAccount(trialUser, trialPass, '1 hora', '1 persona');
      setTrialLoading(false);
      onTrialActivated(newAcc);
    }, 400);
  };

  const handleCopyPaymentInfo = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedInfo(true);
    setTimeout(() => setCopiedInfo(false), 2500);
  };

  return (
    <div className="w-full max-w-sm mt-5">
      {/* Container de Precios con estilo Cristal */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Planes y Precios
            </span>
          </div>
          <span className="text-[10px] text-neutral-400">Activación rápida</span>
        </div>

        {/* Lista de planes */}
        <div className="space-y-2">
          {plans.map((p) => {
            const isFree = p.price === 'Gratis';
            return (
              <div
                key={p.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  p.popular
                    ? 'bg-neutral-900/80 border-cyan-500/40 ring-1 ring-cyan-500/20'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-neutral-100">{p.name}</span>
                    {p.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-cyan-300 font-medium">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400">{p.period}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-white">{p.price}</span>
                  {isFree ? (
                    <button
                      onClick={handleActivateFreeTrial}
                      disabled={trialLoading}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-[11px] font-semibold transition-all active:scale-95"
                    >
                      {trialLoading ? 'Entrando...' : 'Probar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedPlan(p)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-200 text-[11px] font-semibold transition-all active:scale-95"
                    >
                      Comprar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Métodos de pago aceptados */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>PayPal (Todos los países)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            <span>Nequi (Colombia)</span>
          </div>
        </div>
      </div>

      {/* Modal de Pago / Compra */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-neutral-900/90 backdrop-blur-2xl border border-neutral-700/80 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-neutral-100">
                  Adquirir Plan: {selectedPlan.name} ({selectedPlan.price})
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-neutral-500 hover:text-neutral-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pestañas de método de pago */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  paymentMethod === 'paypal'
                    ? 'bg-neutral-800 text-white border-neutral-500 shadow-md ring-1 ring-cyan-500/20'
                    : 'bg-neutral-950/60 text-neutral-400 border-neutral-800'
                }`}
              >
                PayPal (Internacional)
              </button>

              <button
                onClick={() => setPaymentMethod('nequi')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  paymentMethod === 'nequi'
                    ? 'bg-neutral-800 text-white border-neutral-500 shadow-md ring-1 ring-violet-500/20'
                    : 'bg-neutral-950/60 text-neutral-400 border-neutral-800'
                }`}
              >
                Nequi (Colombia)
              </button>
            </div>

            {/* Detalles de PayPal */}
            {paymentMethod === 'paypal' && (
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs mb-4">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-500">Monto:</span>
                  <span className="font-bold text-white font-mono">{selectedPlan.price} USD</span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-500">PayPal Correo / ID:</span>
                  <span className="font-mono text-neutral-200">pagoslprimexprim@gmail.com</span>
                </div>
                <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-900">
                  Envía el pago como "Amigos o familiares" y envía la captura al administrador para recibir tu cuenta.
                </p>
                <button
                  onClick={() => handleCopyPaymentInfo('pagoslprimexprim@gmail.com')}
                  className="w-full py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedInfo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedInfo ? '¡Copiado!' : 'Copiar correo de PayPal'}</span>
                </button>
              </div>
            )}

            {/* Detalles de Nequi (Colombia) */}
            {paymentMethod === 'nequi' && (
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs mb-4">
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-500">Precio COP:</span>
                  <span className="font-bold text-white font-mono">
                    {selectedPlan.id === '1d'
                      ? '$4.500 COP'
                      : selectedPlan.id === '2d'
                      ? '$9.000 COP'
                      : selectedPlan.id === '1m'
                      ? '$22.000 COP'
                      : '$35.000 COP'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-500">Número Nequi:</span>
                  <span className="font-mono text-white font-bold tracking-wide">312 894 7721</span>
                </div>
                <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-900">
                  Envía el comprobante de transferencia Nequi al admin para activar tu usuario al instante.
                </p>
                <button
                  onClick={() => handleCopyPaymentInfo('3128947721')}
                  className="w-full py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedInfo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedInfo ? '¡Copiado!' : 'Copiar número Nequi'}</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedPlan(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-xs font-semibold transition-colors"
            >
              Listo, cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
