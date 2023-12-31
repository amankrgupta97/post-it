import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import nextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {nanoid} from "nanoid"

export const authOptions: NextAuthOptions = {
  adapter:PrismaAdapter(db),
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 6000,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
],
callbacks:{
  async session({token,session}){
    if(token){
      session.user.id=token.id
      session.user.name=token.name
      session.user.email=token.email
      session.user.image=token.picture
      session.user.username=token.username
    }
    return session;
  },

  async jwt({token,user}){
    const dbUser=await db.user.findFirst({
      where:{
        email:token.email,
      }
    })
    if(!dbUser){
      token.id=user!.id
      return token
    }

    if(!dbUser.username){
      await db.user.update({
        where:{
          id:dbUser.id,
        },
        data:{
          username:nanoid(10),
        }
      })
    }
    return {
      id:dbUser.id,
      name:dbUser.name,
      email:dbUser.email,
      picture:dbUser.image,
      username:dbUser.username
    }
  },
  redirect(){
    return '/'
  }
}
}

export const getAuthSession=()=>getServerSession(authOptions)

const handler = nextAuth(authOptions);
export { handler as GET, handler as POST };