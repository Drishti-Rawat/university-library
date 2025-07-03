'use server'

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type BaseBookParams = Omit<BookParams, 'id'>;
export const createBook = async (params:BaseBookParams) => {
    try {
        const newBook = await db.insert(books).values({
            ...params,
            availableCopies : params.totalCopies
        }).returning();

        return {success: true, data: JSON.parse(JSON.stringify(newBook[0]))};
        
    } catch (error) {
        console.log(error);
        return{success: false, error: "An error occurred. Please try again."}
    }
   
}

export const updateBook = async (id:string, params:BookParams) => {
    try {
        const updatedBook = await db.update(books).set({...params}).where(eq(books.id, id)).returning();
        return {success: true, data: JSON.parse(JSON.stringify(updatedBook[0]))};
    } catch (error) {
        console.log(error);
        return{success: false, error: "An error occurred. Please try again."}
    }
}

export const getBookById = async (id:string) => {
    try {
        const book = await db.select().from(books).where(eq(books.id, id)).limit(1);
        return {success: true, data: JSON.parse(JSON.stringify(book[0]))};
    } catch (error) {
        console.log(error);
        return{success: false, error: "An error occurred. Please try again."}
    }
}
export const deleteBook = async (id:string) => {
    try {
        await db.delete(books).where(eq(books.id, id));
         revalidatePath('/admin/books')
        return {success: true}
    } catch (error) {
        console.log(error);
        return{success: false, error: "An error occurred. Please try again."}
    }
}