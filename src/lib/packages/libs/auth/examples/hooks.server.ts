// This is what the merged hooks.server.ts would look like after adding auth

import { authHooks } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

// User's existing handle (preserved)
export const handle: Handle[] = [
  authHooks,
  
  // User's custom hooks (if they had any before)
  async ({ event, resolve }) => {
    // Custom logic here
    return resolve(event);
  }
];
