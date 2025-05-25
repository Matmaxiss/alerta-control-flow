
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'supervisor' | 'technical' | 'driver' | 'prensas';
  shift: string;
  createdAt: Date;
  active: boolean;
  requiresPassword?: boolean;
}

export interface Alert {
  id: string;
  type: 'Driver' | 'Technical' | 'Supervisor' | 'Cancel';
  prensaId?: string;
  prensaName?: string;
  userId: string;
  username: string;
  timestamp: Date;
  status: 'active' | 'cancelled';
  shift: string;
}

export interface Prensa {
  id: string;
  name: string;
  assignedToDriver?: string;
  assignedToDriverName?: string;
  status: 'active' | 'inactive';
  shift: string;
}

export interface PrensaBlock {
  id: string;
  name: string;
  prensaIds: string[];
  assignedToDriver?: string;
  assignedToDriverName?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  requiresPassword: boolean;
}

export const ROLES = ['admin', 'supervisor', 'technical', 'driver', 'prensas'] as const;
export const SHIFTS = ['1 shift', '2 shift', '3 shift', '4 shift'] as const;
export const ALERT_TYPES = ['Driver', 'Technical', 'Supervisor', 'Cancel'] as const;
