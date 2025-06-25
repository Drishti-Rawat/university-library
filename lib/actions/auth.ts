'use server';

import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";

export const signInwithCredentials = async (params: Pick<AuthCredentails, 'email' | 'password'>)  => {
    const { email, password } = params;
     const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1" ;
    const {success} = await ratelimit.limit(ip);

    if( !success) {
        redirect('/too-fast');
        return {
            success: false,
            error: 'Too many requests. Please try again later.',
        };
    }
    
    if (!email || !password) {
        return {
            success: false,
            error: 'Email and password are required.',
        };
    }
  try {
    const result = await  signIn('credentials', {
        email,
        password,
        redirect: false,
    });

    if (result?.error) {
        return {
            success: false,
            error: result.error,
        };
    }
   
        return {
            success: true,
        };
    
    
  } catch (error) {
    console.error('signInwithCredentials', error);
    return {
        success: false,
        error: 'Failed to sign in. Please try again.',
    };
    
  }
}

export const signUp = async (params:AuthCredentails) => {

    const { fullName, universityId, universityCard, email, password } = params;

    const ip = (await headers()).get('x-forwarded-for') || "127.0.0.1" ;
    const {success} = await ratelimit.limit(ip);

    if( !success) {
        redirect('/too-fast');
        return {
            success: false,
            error: 'Too many requests. Please try again later.',
        };
    }
        const existingUser = await db.select().from(users)
        .where(eq(users.email, email))
        .limit(1)

        if (existingUser.length > 0) {
            return {
                success: false,
                error: 'Email already exists. Please use a different email.',
            };
        }

        const hashedPassword = await hash(password, 10);
        try {
            await db.insert(users).values({
                fullName,
                universityId,
                universityCard,
                email,
                password: hashedPassword,
            });

            await signInwithCredentials({email, password});
            return {
                success: true,
                
            };
        } catch (error) {
            console.error('signUp', error);
            return {
                success: false,
                error: 'Failed to sign up. Please try again.',
            };
            
        }
       
    }
   
