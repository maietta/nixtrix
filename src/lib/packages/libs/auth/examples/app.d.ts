// This is what the merged app.d.ts would look like after adding auth

// NixTrix: Auth types
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

// User's existing types (preserved)
declare global {
  namespace App {
    interface Error {
      message: string;
      code?: string;
    }
  }
}

export {};
