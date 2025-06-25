import NextAuth, { User } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import { db } from "./database/drizzle";
import { users } from "./database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

 
export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",
    },
  providers: [
   CredentialProvider({
    async authorize(credentials) { 
        if(!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
            return null;
        }

        const user = await db
        .select() 
        .from(users)
        .where(eq(users.email, credentials.email.toString()))
        .limit(1)

        if(user.length === 0) {
            throw new Error("User not found");
            return null;
        }

        const isPasswordValid = await compare(credentials.password.toString(), user[0].password);
        if(!isPasswordValid) {
            throw new Error("Invalid password");
            return null;
        }

        return {
            id: user[0].id,
            name: user[0].fullName,
            email: user[0].email,
           
        } as User;
    }  
   })
  ],

  pages: {
    signIn: "/sign-in",
   
  },

  callbacks: {
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
        }
        return token;
        },
        async session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as string;
            session.user.name = token.name as string;
            session.user.email = token.email as string;
        }
        return session;
        }
    }

})