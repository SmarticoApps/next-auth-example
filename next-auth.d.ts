import "next-auth/jwt"
import "next-auth"

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    userRole?: "admin"
  }
}

declare module "next-auth" {
  interface User {
    id: string;
    apikey?: string | null;
  }

  interface Session {
    user: {
      apikey?: string | null;
      name?: string;
      email?: string;
    }
  }
}