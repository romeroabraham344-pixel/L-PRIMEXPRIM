import React, { useState } from 'react';
import { Account, AccountCapacity, AccountDuration, AdminPermissions } from '../types';
import {
  createAdminAccount,
  createNormalAccount,
  getStoredAccounts,
  toggleBlockAccount,
  deleteAccount,
} from '../utils/accountStorage';
import {
  ShieldAlert,
  UserPlus,
  UserCheck,
  Ban,
  Check,
  Copy,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Lock,
  User,
  Clock,
  Users,
} from 'lucide-react';
import { RainCloud } from './RainCloud';

interface AdminPanelProps {
  currentAccount: Account;
  onBackToGenerator: () => void;
}

type AdminTab = 'menu' | 'create_admin' | 'create_normal' | 'manage_users';

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentAccount, onBackToGenerator }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');

  // Permission flags
  const isBoss = currentAccount.role === 'boss';
  const canCreateAdmins = isBoss || !!currentAccount.permissions?.createAdmins;
  const canCreateUsers = isBoss || !!currentAccount.permissions?.createUsers;
  const canBlockUsers = isBoss || !!currentAccount.permissions?.blockUsers;

  // Stored accounts state for management
  const [accountsList, setAccountsList] = useState<Account[]>(() => getStoredAccounts());

  // Form state: Crear admin (Step 1 or 2)
  const [adminStep, setAdminStep] = useState<1 | 2 | 'result'>(1);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminPerms, setAdminPerms] = useState<AdminPermissions>({
    blockUsers: true,
    createUsers: true,
    createAdmins: false,
  });
  const [createdAdminResult, setCreatedAdminResult] = useState<Account | null>(null);
  const [adminFormError, setAdminFormError] = useState('');

  // Form state: Crear usuario normal (Step 1, 2, 3)
  const [normalStep, setNormalStep] = useState<1 | 2 | 3 | 'result'>(1);
  const [normalUser, setNormalUser] = useState('');
  const [normalPass, setNormalPass] = useState('');
  const [duration, setDuration] = useState<AccountDuration>('1 mes');
  const [capacity, setCapacity] = useState<AccountCapacity>('1 persona');
  const [createdNormalResult, setCreatedNormalResult] = useState<Account | null>(null);
  const [normalFormError, setNormalFormError] = useState('');

  // Copy state
  const [copied, setCopied] = useState(false);

  // Admin step 1 submit
  const handleAdminStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPass.trim()) {
      setAdminFormError('Escribe usuario y contraseña');
      return;
    }
    setAdminFormError('');
    setAdminStep(2);
  };

  // Admin step 2 finish
  const handleFinishAdmin = () => {
    const newAdmin = createAdminAccount(adminUser, adminPass, adminPerms);
    setCreatedAdminResult(newAdmin);
    setAccountsList(getStoredAccounts());
    setAdminStep('result');
  };

  // Normal user step 1 submit
  const handleNormalStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalUser.trim() || !normalPass.trim()) {
      setNormalFormError('Escribe los datos de la cuenta que vas a crear');
      return;
    }
    setNormalFormError('');
    setNormalStep(2);
  };

  // Normal user step 2 submit (Duration)
  const handleSelectDuration = (d: AccountDuration) => {
    setDuration(d);
    setNormalStep(3);
  };

  // Normal user step 3 submit (Capacity & finish)
  const handleSelectCapacity = (cap: AccountCapacity) => {
    setCapacity(cap);
    const newUser = createNormalAccount(normalUser, normalPass, duration, cap);
    setCreatedNormalResult(newUser);
    setAccountsList(getStoredAccounts());
    setNormalStep('result');
  };

  const handleToggleBlock = (id: string) => {
    const updated = toggleBlockAccount(id);
    setAccountsList(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta cuenta?')) {
      const updated = deleteAccount(id);
      setAccountsList(updated);
    }
  };

  const handleCopyAccountData = (acc: Account) => {
    const text = `🔐 DATOS DE LA CUENTA
👤 Usuario: ${acc.username}
🔑 Contraseña: ${acc.password}
🛡️ Tipo: ${acc.role === 'admin' ? 'Administrador' : 'Usuario Normal'}
${acc.duration ? `⏳ Duración: ${acc.duration}` : ''}
${acc.capacity ? `👥 Personas: ${acc.capacity}` : ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 flex flex-col items-center">
      {/* MENU PRINCIPAL ADMIN */}
      {activeTab === 'menu' && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-5">
            <button
              onClick={onBackToGenerator}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>
            <div className="flex items-center gap-1.5">
              <RainCloud size="sm" />
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-300">
                Panel Admin
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {canCreateAdmins && (
              <button
                onClick={() => {
                  setAdminStep(1);
                  setAdminUser('');
                  setAdminPass('');
                  setCreatedAdminResult(null);
                  setAdminFormError('');
                  setActiveTab('create_admin');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-800 text-neutral-200">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-100">Crear admin</div>
                    <div className="text-[11px] text-neutral-400">Preguntas paso a paso</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
              </button>
            )}

            {canCreateUsers && (
              <button
                onClick={() => {
                  setNormalStep(1);
                  setNormalUser('');
                  setNormalPass('');
                  setCreatedNormalResult(null);
                  setNormalFormError('');
                  setActiveTab('create_normal');
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-800 text-neutral-200">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-100">Crear usuario normal</div>
                    <div className="text-[11px] text-neutral-400">Preguntas para cliente</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
              </button>
            )}

            {canBlockUsers && (
              <button
                onClick={() => setActiveTab('manage_users')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-800 text-neutral-200">
                    <Ban className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-100">Bloqueo de usuarios</div>
                    <div className="text-[11px] text-neutral-400">Lista y permisos</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* FLUJO CREAR ADMIN: PASO 1 (CARTEL CHIQUITO) */}
      {activeTab === 'create_admin' && adminStep === 1 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Crear Admin • Pregunta 1 de 2
            </span>
            <div className="flex gap-1">
              <span className="w-5 h-1.5 rounded-full bg-neutral-200"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
            </div>
          </div>

          <form onSubmit={handleAdminStep1Submit} className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-neutral-200 mb-2">
                1. Usuario y Contraseña del admin
              </span>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={adminUser}
                    onChange={(e) => setAdminUser(e.target.value)}
                    placeholder="Usuario"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950/80 border border-neutral-700/70 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950/80 border border-neutral-700/70 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>
              {adminFormError && <p className="text-xs text-red-400 mt-1.5">{adminFormError}</p>}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="w-1/3 py-2.5 text-xs text-neutral-400 hover:text-white rounded-xl bg-neutral-950/70 border border-neutral-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600/70 text-neutral-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FLUJO CREAR ADMIN: PASO 2 (CARTEL CHIQUITO) */}
      {activeTab === 'create_admin' && adminStep === 2 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Crear Admin • Pregunta 2 de 2
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-5 h-1.5 rounded-full bg-neutral-200"></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-semibold text-neutral-200">
              2. ¿Qué puede usar el admin?
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  setAdminPerms({ ...adminPerms, blockUsers: !adminPerms.blockUsers })
                }
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  adminPerms.blockUsers
                    ? 'bg-neutral-800 text-white border-neutral-500 ring-1 ring-neutral-400/20'
                    : 'bg-neutral-950/60 text-neutral-400 border-neutral-800'
                }`}
              >
                <span className="text-xs font-medium">Bloqueo de usuarios</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    adminPerms.blockUsers
                      ? 'bg-neutral-100 border-neutral-100 text-black'
                      : 'border-neutral-700'
                  }`}
                >
                  {adminPerms.blockUsers && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAdminPerms({ ...adminPerms, createUsers: !adminPerms.createUsers })
                }
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  adminPerms.createUsers
                    ? 'bg-neutral-800 text-white border-neutral-500 ring-1 ring-neutral-400/20'
                    : 'bg-neutral-950/60 text-neutral-400 border-neutral-800'
                }`}
              >
                <span className="text-xs font-medium">Crear usuarios y contraseñas normales</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    adminPerms.createUsers
                      ? 'bg-neutral-100 border-neutral-100 text-black'
                      : 'border-neutral-700'
                  }`}
                >
                  {adminPerms.createUsers && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setAdminPerms({ ...adminPerms, createAdmins: !adminPerms.createAdmins })
                }
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  adminPerms.createAdmins
                    ? 'bg-neutral-800 text-white border-neutral-500 ring-1 ring-neutral-400/20'
                    : 'bg-neutral-950/60 text-neutral-400 border-neutral-800'
                }`}
              >
                <span className="text-xs font-medium">Crear admin también</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    adminPerms.createAdmins
                      ? 'bg-neutral-100 border-neutral-100 text-black'
                      : 'border-neutral-700'
                  }`}
                >
                  {adminPerms.createAdmins && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdminStep(1)}
                className="w-1/3 py-2.5 text-xs text-neutral-400 hover:text-white rounded-xl bg-neutral-950/70 border border-neutral-800"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleFinishAdmin}
                className="w-2/3 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600/70 text-neutral-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Crear Admin</span>
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESULTADO CREAR ADMIN: "Listo sale los datos de esa cuenta" */}
      {activeTab === 'create_admin' && adminStep === 'result' && createdAdminResult && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="text-center mb-4">
            <div className="inline-flex p-2 rounded-full bg-neutral-800 border border-neutral-700 mb-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-neutral-100 uppercase">
              Admin Creado
            </h3>
            <p className="text-[11px] text-neutral-400">Datos de la cuenta</p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs mb-4">
            <div className="flex justify-between">
              <span className="text-neutral-500">Usuario:</span>
              <span className="font-semibold text-neutral-100">{createdAdminResult.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Contraseña:</span>
              <span className="font-semibold text-neutral-100">{createdAdminResult.password}</span>
            </div>
            <div className="pt-1 border-t border-neutral-900 text-neutral-400 text-[11px]">
              {createdAdminResult.permissions?.blockUsers && <div>• Bloqueo de usuarios</div>}
              {createdAdminResult.permissions?.createUsers && <div>• Crear usuarios normales</div>}
              {createdAdminResult.permissions?.createAdmins && <div>• Crear admin también</div>}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleCopyAccountData(createdAdminResult)}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600/70 text-neutral-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Datos Copiados!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Datos</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className="w-full py-2 text-xs text-neutral-400 hover:text-white"
            >
              Volver al menú admin
            </button>
          </div>
        </div>
      )}

      {/* FLUJO CREAR USUARIO NORMAL: PASO 1 (CARTEL CHIQUITO) */}
      {activeTab === 'create_normal' && normalStep === 1 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Crear Usuario • Pregunta 1 de 3
            </span>
            <div className="flex gap-1">
              <span className="w-5 h-1.5 rounded-full bg-neutral-200"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
            </div>
          </div>

          <form onSubmit={handleNormalStep1Submit} className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-neutral-200 mb-2">
                1. Usuario y Contraseña
              </span>
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={normalUser}
                    onChange={(e) => setNormalUser(e.target.value)}
                    placeholder="Usuario"
                    autoFocus
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950/80 border border-neutral-700/70 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={normalPass}
                    onChange={(e) => setNormalPass(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950/80 border border-neutral-700/70 rounded-xl text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-400"
                  />
                </div>
              </div>
              {normalFormError && <p className="text-xs text-red-400 mt-1.5">{normalFormError}</p>}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className="w-1/3 py-2.5 text-xs text-neutral-400 hover:text-white rounded-xl bg-neutral-950/70 border border-neutral-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600/70 text-neutral-100 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FLUJO CREAR USUARIO NORMAL: PASO 2 (DURACIÓN) */}
      {activeTab === 'create_normal' && normalStep === 2 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Crear Usuario • Pregunta 2 de 3
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-5 h-1.5 rounded-full bg-neutral-200"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-800"></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>2. ¿Cuánto durará su cuenta?</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(['1 hora', '1 día', '1 mes', 'Permanente'] as AccountDuration[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleSelectDuration(d)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                    duration === d
                      ? 'bg-neutral-800 text-white border-neutral-500 shadow-md ring-1 ring-neutral-400/30'
                      : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <span>{d}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setNormalStep(1)}
              className="w-full py-1.5 text-xs text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          </div>
        </div>
      )}

      {/* FLUJO CREAR USUARIO NORMAL: PASO 3 (PERSONAS) */}
      {activeTab === 'create_normal' && normalStep === 3 && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
              Crear Usuario • Pregunta 3 de 3
            </span>
            <div className="flex gap-1">
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-2 h-1.5 rounded-full bg-neutral-600"></span>
              <span className="w-5 h-1.5 rounded-full bg-neutral-200"></span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
              <Users className="w-4 h-4 text-neutral-400" />
              <span>3. ¿Cuántas personas las pueden usar?</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(['1 persona', '2 personas', '3 personas', 'Infinitas'] as AccountCapacity[]).map(
                (cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => handleSelectCapacity(cap)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-medium border text-left flex items-center justify-between transition-all ${
                      capacity === cap
                        ? 'bg-neutral-800 text-white border-neutral-500 shadow-md ring-1 ring-neutral-400/30'
                        : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                    }`}
                  >
                    <span>{cap}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setNormalStep(2)}
              className="w-full py-1.5 text-xs text-neutral-500 hover:text-neutral-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          </div>
        </div>
      )}

      {/* RESULTADO CREAR USUARIO NORMAL: "Listo salen los datos de la cuenta" */}
      {activeTab === 'create_normal' && normalStep === 'result' && createdNormalResult && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="text-center mb-4">
            <div className="inline-flex p-2 rounded-full bg-neutral-800 border border-neutral-700 mb-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-neutral-100 uppercase">
              Cuenta Creada
            </h3>
            <p className="text-[11px] text-neutral-400">Datos para entregar al cliente</p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2 text-xs mb-4">
            <div className="flex justify-between">
              <span className="text-neutral-500">Usuario:</span>
              <span className="font-semibold text-neutral-100">{createdNormalResult.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Contraseña:</span>
              <span className="font-semibold text-neutral-100">{createdNormalResult.password}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Duración:</span>
              <span className="font-semibold text-neutral-200">{createdNormalResult.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Personas:</span>
              <span className="font-semibold text-neutral-200">{createdNormalResult.capacity}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleCopyAccountData(createdNormalResult)}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600/70 text-neutral-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Datos Copiados!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Datos del Cliente</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className="w-full py-2 text-xs text-neutral-400 hover:text-white"
            >
              Volver al menú admin
            </button>
          </div>
        </div>
      )}

      {/* GESTIÓN / BLOQUEO DE USUARIOS */}
      {activeTab === 'manage_users' && (
        <div className="w-full bg-neutral-900/70 backdrop-blur-xl border border-neutral-700/60 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80 mb-4">
            <button
              onClick={() => setActiveTab('menu')}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
            <span className="text-xs font-semibold text-neutral-200">
              Bloqueo de Usuarios
            </span>
          </div>

          {accountsList.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
              No hay cuentas registradas.
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {accountsList.map((acc) => (
                <div
                  key={acc.id}
                  className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-neutral-200">{acc.username}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                        {acc.role === 'admin' ? 'Admin' : 'Usuario'}
                      </span>
                      {acc.isBlocked && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-red-950 text-red-400">
                          Bloqueado
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-500 text-[10px] mt-0.5">
                      Pass: {acc.password} {acc.duration ? `• ${acc.duration}` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleBlock(acc.id)}
                      className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                        acc.isBlocked
                          ? 'bg-neutral-800 border-neutral-700 text-emerald-400'
                          : 'bg-neutral-900 border-neutral-800 text-amber-400'
                      }`}
                    >
                      {acc.isBlocked ? 'Desbloquear' : 'Bloquear'}
                    </button>

                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
