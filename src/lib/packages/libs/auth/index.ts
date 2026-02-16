import type { Handle } from '@sveltejs/kit';

export interface Session {
  user: {
    id: string;
    email: string;
  } | null;
}

export const sessionCookieName = 'better-auth_session';

export function getSession(request: Request): Session | null {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;
  
  const match = cookie.match(new RegExp(`${sessionCookieName}=([^;]+)`));
  if (!match) return null;
  
  try {
    return JSON.parse(atob(match[1]));
  } catch {
    return null;
  }
}

export const authHooks: Handle = async ({ event, resolve }) => {
  const session = getSession(event.request);
  
  event.locals.user = session?.user ?? null;
  
  return resolve(event);
};

declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string;
      } | null;
    }
  }
}
