export interface User {
  id: string;
  fullName: string;
  email: string;
  name?: string; // Kept for backwards compatibility
  avatar?: string | null;
  role: 'admin' | 'member' | 'viewer';
}
