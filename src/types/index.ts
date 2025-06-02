
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'supervisor' | 'technical' | 'driver' | 'press';
  shift: string;
  createdAt: Date;
  active: boolean;
  requiresPassword?: boolean;
  prensaId?: string; // Link to the press this user represents
}

export interface Alert {
  id: string;
  type: string; // Changed from specific types to string to allow custom button names
  prensaId?: string;
  prensaName?: string;
  userId: string;
  username: string;
  timestamp: Date;
  status: 'active' | 'working' | 'cancelled' | 'resolved';
  shift: string;
}

export interface Prensa {
  id: string;
  name: string;
  assignedToDriver?: string;
  assignedToDriverName?: string;
  status: 'active' | 'inactive';
  shift: string;
  userId?: string; // Link to the user account for this press
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

export const ROLES = ['admin', 'supervisor', 'technical', 'driver', 'press'] as const;
export const SHIFTS = ['1 shift', '2 shift', '3 shift', '4 shift'] as const;
export const ALERT_TYPES = ['Driver', 'Technical', 'Supervisor', 'Cancel'] as const;
