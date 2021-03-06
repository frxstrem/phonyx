export interface User {
  username: string;
  email?: string;

  passwordHash?: string;

  isAdmin?: boolean;
}