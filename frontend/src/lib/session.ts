import { SessionOptions } from 'iron-session';

export interface SessionData {
  userId: string;
  cooperativeId: string;
  role: 'admin' | 'rh' | 'dp' | 'viewer';
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  userId: '',
  cooperativeId: '',
  role: 'viewer',
  name: '',
  email: '',
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? (() => { throw new Error('SESSION_SECRET env var is required'); })(),
  cookieName: 'coopelos-session',
  cookieOptions: {
    // secure: true should be used in production (HTTPS) but can be false in local development
    secure: process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL?.startsWith('http://localhost'),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
