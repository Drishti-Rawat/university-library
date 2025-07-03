'use server';

import { signIn, signOut } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { redirect } from "next/navigation";

import { revalidatePath } from "next/cache";

export async function handleEditRole(params: {
    userId: string,
    newRole: "ADMIN" | "USER" // Specify the exact allowed values
}) {
    const {userId, newRole} = params;

    try {
        await db.update(users).set({role: newRole}).where(eq(users.id, userId));
         revalidatePath('/admin/users') // Replace with your actual path
        return {
            success: true,
        };
        
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to edit role. Please try again.'
        }
    }
}

export async function handleDeleteUser(userId:string){
    try {
        await db.delete(users).where(eq(users.id, userId));
        revalidatePath('/admin/users') // Replace with your actual path
        return {
            success: true,
        };
        
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to delete user. Please try again.'
        }
    }
    
}

export async function handleApproveAccount(userId: string) {
    try {
        await db.update(users).set({ status: "APPROVED" }).where(eq(users.id, userId));
        revalidatePath('/admin/account-requests') // Replace with your actual path
        return {
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to approve user. Please try again.'
        }
    }
}

export async function handleRejectAccount(userId: string) {
    try {
        await db.update(users).set({ status: "REJECTED" }).where(eq(users.id, userId));
        revalidatePath('/admin/account-requests') // Replace with your actual path
        return {
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: 'Failed to reject user. Please try again.'
        }
    }
}