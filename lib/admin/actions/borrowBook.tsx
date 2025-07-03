'use server'

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type BaseBookParams = Omit<BookParams, 'id'>;

export async function handleBorrowBookStatusChange(id:string, status:"BORROWED" | "RETURNED" ) {
    try {
        const updatedBook = await db.update(borrowRecords).set({status: status ,
            returnDate: status === "RETURNED" ? new Date().toISOString() : null
        }).where(eq(borrowRecords.id, id)).returning();

        revalidatePath('/admin/borrowed-records')
        return {success: true, data: JSON.parse(JSON.stringify(updatedBook[0]))};
    } catch (error) {
        console.log(error);
        return{success: false, error: "An error occurred. Please try again."}
    }
}