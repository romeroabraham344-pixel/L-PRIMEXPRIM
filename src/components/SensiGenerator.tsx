import React, { useState } from 'react';
import { ButtonOption, DpiOption, SensiConfig, SensiMode, SensiType } from '../types';
import { calculateSensibility } from '../utils/sensiCalculator';
import {
  Smartphone,
  Gauge,
  Sliders,
  Flame,
  Check,
  Copy,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  CircleDot,
} from 'lucide-react';

export const SensiGenerator: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 'result'>(1);
  const [phoneModel, setPhoneModel] = useState('');
  const [sensiType, setSensiType] = useState<SensiType | null>(null);
  const [dpiOption, setDpiOption] = useState<DpiOption | null>(null);
  const [buttonOption, setButtonOption] = useState<ButtonOption | null>(null);
  const [mode, setMode] = useState<SensiMode | null>(null);

  const [result, setResult] = useState<SensiConfig | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Submit model
  const handleModelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneModel.trim()) {
      setError('Escribe el modelo de tu teléfono');
      return;
    }
    setError('');
    setStep(2);
  };

  // Step 2: Select Sensi type (Altas 200-170, Medias 160-130, Bajas 120-90)
  const handleSelectSensi = (type: SensiType) => {
    setSensiType(type);
    setStep(3);
  };

  // Step 3: Select DPI
  const handleSelectDpi = (dpi: DpiOption) => {
    setDpiOption(dpi);
    setStep(4);
  };

  // Step 4: Nueva pregunta: Sin botón de disparo o con botón
  const handleSelectButton = (btn: ButtonOption) => {
    setButtonOption(btn);
    setStep(5);
  };

  // Step 5: Select Mode and generate
  const handleSelectMode = (selectedMode: SensiMode) => {
    setMode(selectedMode);

    const config = calculateSensibility({
      phoneModel: phoneModel.trim(),
      sensiType: sensiType || 'Alta',
      dpiOption: dpiOption || 'Sin dpi',
      buttonOption: buttonOption || 'Con botón',
      mode: selectedMode,
    });

    setResult(config);
    setStep('result');
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `🔥 SENSIBILIDAD L-PRIMEXPRIM 🔥
📱 Teléfono: ${result.phoneModel}
⚡ Modo: ${result.mode}
🎯 Sensi: ${result.sensiType} | ${result.dpiOption}

• General: ${result.general}
• Punto Rojo: ${result.redDot}
• Mira 2x: ${result.scope2x}
• Mira 4x: ${result.scope4x}
• Francotirador: ${result.sniper}
• Cámara 360: ${result.cam360}
${result.fireButton ? `• Botón de disparo: ${result.fireButton}\n` : '• Botón de disparo: Sin botón\n'}• DPI: ${result.dpi}
• Velocidad de puntero: ${result.pointerSpeed}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setStep(1);
    setPhoneModel('');
    setSensiType(null);
    setDpiOption(null);
    setButtonOption(null);
    setMode(null);
    setResult(null);
    setCopied(false);
    setError('');
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 flex flex-col items-center relative z-10">
      {/* PREGUNTA 1: MODELO DEL TELÉFONO */}
      {step === 1 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Pregunta 1 de 5
            </span>
            <div className="flex gap-1">
              <span className="w-4 h-1.5 rounded-full bg-neutral-200"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
            </div>
          </div>

          <form onSubmit={handleModelSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-2">
                <Smartphone className="w-4 h-4 text-neutral-400" />
                <span>¿Qué modelo es tu teléfono?</span>
              </label>
              <input
                type="text"
                value={phoneModel}
                onChange={(e) => {
                  setPhoneModel(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Escribe tu modelo..."
                autoFocus
                className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-700/70 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
              />
              {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600/70 text-neutral-100 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* PREGUNTA 2: TIPO DE SENSI (Altas 200-170, Medias 160-130, Bajas 120-90) */}
      {step === 2 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Pregunta 2 de 5
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-4 h-1.5 rounded-full bg-neutral-200"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
              <Gauge className="w-4 h-4 text-neutral-400" />
              <span>¿Qué tipo de sensi usarás?</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { type: 'Alta' as SensiType, range: '200 - 170' },
                { type: 'Media' as SensiType, range: '160 - 130' },
                { type: 'Baja' as SensiType, range: '120 - 90' },
              ].map(({ type, range }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectSensi(type)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-medium border text-left flex items-center justify-between transition-all ${
                    sensiType === type
                      ? 'bg-neutral-800 text-white border-neutral-500 shadow-md ring-1 ring-neutral-400/30'
                      : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <span className="font-semibold">{type}</span>
                  <span className="text-xs text-neutral-400 font-mono">({range})</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          </div>
        </div>
      )}

      {/* PREGUNTA 3: SIN DPI O CON DPI */}
      {step === 3 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Pregunta 3 de 5
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-4 h-1.5 rounded-full bg-neutral-200"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
              <Sliders className="w-4 h-4 text-neutral-400" />
              <span>¿Sin dpi o con dpi?</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {(['Sin dpi', 'Con dpi'] as DpiOption[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectDpi(opt)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-medium border text-left flex items-center justify-between transition-all ${
                    dpiOption === opt
                      ? 'bg-neutral-800 text-white border-neutral-500 shadow-md ring-1 ring-neutral-400/30'
                      : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <span>{opt}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-500" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          </div>
        </div>
      )}

      {/* PREGUNTA 4: SIN BOTÓN DE DISPARO O CON BOTÓN */}
      {step === 4 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Pregunta 4 de 5
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-4 h-1.5 rounded-full bg-neutral-200"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
              <CircleDot className="w-4 h-4 text-neutral-400" />
              <span>¿Sin botón de disparo o con botón?</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { opt: 'Sin botón' as ButtonOption, label: 'Sin botón de disparo' },
                { opt: 'Con botón' as ButtonOption, label: 'Con botón de disparo' },
              ].map(({ opt, label }) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectButton(opt)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-medium border text-left flex items-center justify-between transition-all ${
                    buttonOption === opt
                      ? 'bg-neutral-800 text-white border-neutral-500 shadow-md ring-1 ring-neutral-400/30'
                      : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <span>{label}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-500" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          </div>
        </div>
      )}

      {/* PREGUNTA 5: MODO */}
      {step === 5 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Pregunta 5 de 5
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-4 h-1.5 rounded-full bg-neutral-200"></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
              <Flame className="w-4 h-4 text-neutral-400" />
              <span>Selecciona el modo:</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {(['Modo de deku', 'Modo nagie', 'Modo L-PRIME'] as SensiMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectMode(m)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-medium border text-left flex items-center justify-between transition-all ${
                    mode === m
                      ? 'bg-neutral-800 text-white border-neutral-500 shadow-md ring-1 ring-neutral-400/30'
                      : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <span>{m}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-500" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="w-full py-2 text-xs text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          </div>
        </div>
      )}

      {/* CARTEL DE RESULTADOS: ESTILO CRISTAL (Gris semitransparente con desenfoque) */}
      {step === 'result' && result && (
        <div className="w-full bg-neutral-900/40 backdrop-blur-2xl border border-neutral-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_16px_45px_rgba(0,0,0,0.85)] ring-1 ring-white/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Reflejos de cristal ambiental */}
          <div className="absolute -top-16 -left-16 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-neutral-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center mb-5 relative z-10">
            <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-neutral-800/80 text-neutral-300 border border-neutral-600/50 backdrop-blur-md shadow-inner">
              ✨ Sensibilidad Calibrada
            </span>
            <h2 className="text-xl font-bold tracking-wide text-white uppercase mt-2 drop-shadow-sm">
              {result.phoneModel}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {result.mode} • Sensi {result.sensiType} • {result.dpiOption}
            </p>
          </div>

          {/* LISTA EN FILA CON ESTILO CRISTAL */}
          <div className="space-y-2 mb-5 relative z-10">
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
              <span className="text-xs text-neutral-300 font-medium">General</span>
              <span className="text-base font-bold text-white font-mono drop-shadow">{result.general}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
              <span className="text-xs text-neutral-300 font-medium">Punto Rojo</span>
              <span className="text-base font-bold text-white font-mono drop-shadow">{result.redDot}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
              <span className="text-xs text-neutral-300 font-medium">Mira 2x</span>
              <span className="text-base font-bold text-white font-mono drop-shadow">{result.scope2x}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
              <span className="text-xs text-neutral-300 font-medium">Mira 4x</span>
              <span className="text-base font-bold text-white font-mono drop-shadow">{result.scope4x}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
              <span className="text-xs text-neutral-300 font-medium">Francotirador</span>
              <span className="text-base font-bold text-white font-mono drop-shadow">{result.sniper}</span>
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
              <span className="text-xs text-neutral-300 font-medium">Cámara 360</span>
              <span className="text-base font-bold text-white font-mono drop-shadow">{result.cam360}</span>
            </div>

            {/* Fila botón de disparo */}
            {result.fireButton && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
                <span className="text-xs text-neutral-300 font-medium">Botón de disparo</span>
                <span className="text-base font-bold text-white font-mono drop-shadow">
                  {result.fireButton}
                </span>
              </div>
            )}

            {/* Fila DPI */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
              <span className="text-xs text-neutral-300 font-medium">DPI</span>
              <span className="text-xs font-semibold text-neutral-200">{result.dpi}</span>
            </div>

            {/* Fila Velocidad del puntero */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-950/45 backdrop-blur-md border border-neutral-700/60 hover:border-neutral-500/70 transition-all">
              <span className="text-xs text-neutral-300 font-medium">Velocidad del puntero</span>
              <span className="text-xs font-semibold text-neutral-200">{result.pointerSpeed}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-2 relative z-10">
            <button
              onClick={handleCopy}
              className="w-full py-3 px-4 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 border border-neutral-500/70 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] backdrop-blur-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>¡Sensibilidad Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Sensibilidad</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-950/70 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-xs flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generar otra sensibilidad</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
