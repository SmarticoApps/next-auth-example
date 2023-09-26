import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { nanoid } from 'nanoid'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'OpenAi',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        apikey: { label: "OpenAi API Key", type: "text" }
      },
      async authorize(credentials, req) {
        console.log("authorize()", credentials);

        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials?.apikey}`,
          }
        });
        //console.log("https://api.openai.com response", response);
        console.log("https://api.openai.com response.statusText", response.statusText);
        console.log("https://api.openai.com response.status", response.status);
      
        if (response.status === 200) {
          // API key is valid, proceed with login
          console.log("OpenAI API key is valid");
          const user = { 
            id: nanoid(), 
            apikey: credentials?.apikey || null
          }
          return user;
        } else {
          // API key is invalid, handle error
          console.log("Invalid OpenAI API Key");
          return null
        }
      }
    })
  ],
  theme: {
    colorScheme: "light",
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({token, user}) {
      console.log("callback jwt token", token);
      console.log("callback jwt user", user);
      if (user) {
        token.apikey = user.apikey as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        apikey: token.apikey ? token.apikey as string : null,
      };
      session.user.apikey = session.user.apikey || null; 
      session.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Set the expiry date to 7 days from now
      return session;
    },
  },
}

export default NextAuth(authOptions)
