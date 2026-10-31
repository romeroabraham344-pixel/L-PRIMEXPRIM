export type UserRole = 'boss' | 'admin' | 'user';

export interface AdminPermissions {
  blockUsers: boolean;
  createUsers: boolean;
  createAdmins: boolean;
}

export type AccountDuration = '1 hora' | '1 día' | '1 mes' | 'Permanente';
export type AccountCapacity = '1 persona' | '2 personas' | '3 personas' | 'Infinitas';

export interface Account {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  permissions?: AdminPermissions;
  duration?: AccountDuration;
  capacity?: AccountCapacity;
  createdAt: number;
  expiresAt: number | null; // timestamp in ms, null if permanente
  isBlocked: boolean;
}

export type SensiType = 'Alta' | 'Media' | 'Baja';
export type DpiOption = 'Sin dpi' | 'Con dpi';
export type ButtonOption = 'Sin botón' | 'Con botón';
export type SensiMode = 'Modo de deku' | 'Modo nagie' | 'Modo L-PRIME';

export interface SensiQuestionnaire {
  phoneModel: string;
  sensiType: SensiType;
  dpiOption: DpiOption;
  buttonOption: ButtonOption;
  mode: SensiMode;
}

export interface SensiConfig {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniper: number;
  cam360: number;
  dpi: string;
  fireButton?: string | null;
  pointerSpeed: string;
  phoneModel: string;
  sensiType: SensiType;
  dpiOption: DpiOption;
  buttonOption: ButtonOption;
  mode: SensiMode;
}
