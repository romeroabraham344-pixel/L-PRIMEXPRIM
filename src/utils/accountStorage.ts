import { Account, AccountCapacity, AccountDuration, AdminPermissions, UserRole } from '../types';

const STORAGE_KEY = 'l_prime_accounts_v1';

export const BOSS_ACCOUNT: Account = {
  id: 'boss-master',
  username: 'L-PRIMEXPRIM',
  password: 'L-NAGIE',
  role: 'boss',
  permissions: {
    blockUsers: true,
    createUsers: true,
    createAdmins: true,
  },
  createdAt: 0,
  expiresAt: null,
  isBlocked: false,
};

export const ADMIN_MENU_PASSWORD = 'L-PRIME';

export function getStoredAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredAccounts(accounts: Account[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts', err);
  }
}

export function authenticateUser(usernameInput: string, passwordInput: string): { success: boolean; account?: Account; message?: string } {
  const u = usernameInput.trim();
  const p = passwordInput.trim();

  // Check boss account
  if (u === BOSS_ACCOUNT.username && p === BOSS_ACCOUNT.password) {
    return { success: true, account: BOSS_ACCOUNT };
  }

  // Check created accounts
  const accounts = getStoredAccounts();
  const match = accounts.find(
    (acc) => acc.username.toLowerCase() === u.toLowerCase() && acc.password === p
  );

  if (!match) {
    return { success: false, message: 'Usuario o contraseña incorrectos' };
  }

  if (match.isBlocked) {
    return { success: false, message: 'Esta cuenta ha sido bloqueada' };
  }

  if (match.expiresAt && Date.now() > match.expiresAt) {
    return { success: false, message: 'El tiempo de acceso de esta cuenta ha expirado' };
  }

  return { success: true, account: match };
}

export function createAdminAccount(
  username: string,
  pass: string,
  permissions: AdminPermissions
): Account {
  const accounts = getStoredAccounts();
  const newAccount: Account = {
    id: `admin-${Date.now()}`,
    username: username.trim(),
    password: pass.trim(),
    role: 'admin',
    permissions,
    createdAt: Date.now(),
    expiresAt: null, // Admin accounts don't need boss duration unless specified
    isBlocked: false,
  };

  accounts.push(newAccount);
  saveStoredAccounts(accounts);
  return newAccount;
}

export function createNormalAccount(
  username: string,
  pass: string,
  duration: AccountDuration,
  capacity: AccountCapacity
): Account {
  const accounts = getStoredAccounts();

  let expiresAt: number | null = null;
  const now = Date.now();
  if (duration === '1 hora') {
    expiresAt = now + 60 * 60 * 1000;
  } else if (duration === '1 día') {
    expiresAt = now + 24 * 60 * 60 * 1000;
  } else if (duration === '1 mes') {
    expiresAt = now + 30 * 24 * 60 * 60 * 1000;
  } else {
    expiresAt = null; // Permanente
  }

  const newAccount: Account = {
    id: `user-${Date.now()}`,
    username: username.trim(),
    password: pass.trim(),
    role: 'user',
    duration,
    capacity,
    createdAt: now,
    expiresAt,
    isBlocked: false,
  };

  accounts.push(newAccount);
  saveStoredAccounts(accounts);
  return newAccount;
}

export function toggleBlockAccount(accountId: string): Account[] {
  const accounts = getStoredAccounts();
  const updated = accounts.map((acc) => {
    if (acc.id === accountId) {
      return { ...acc, isBlocked: !acc.isBlocked };
    }
    return acc;
  });
  saveStoredAccounts(updated);
  return updated;
}

export function deleteAccount(accountId: string): Account[] {
  const accounts = getStoredAccounts();
  const updated = accounts.filter((acc) => acc.id !== accountId);
  saveStoredAccounts(updated);
  return updated;
}
