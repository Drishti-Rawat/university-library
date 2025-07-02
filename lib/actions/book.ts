'use server'

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, like, or, sql } from "drizzle-orm";
import dayjs from "dayjs";


export const borrowBook = async (params : BorrowBookParams) => {
    const {userId, bookId} = params;
    try {

        const book = await db.select({availableCopies: books.availableCopies})
        .from(books).where(eq(books.id, bookId)).limit(1);

        if(!book.length || book[0].availableCopies <= 0){
             return {success: false, error: "Book is not available."}
        }
        // using dayjs

        const dueDate = dayjs().add(14, "day").toDate().toDateString();
        const record = await db.insert(borrowRecords)
        .values({
            userId,
            bookId,
            dueDate,
            status: "BORROWED"
        }).returning();

        await db.update(books).set({
            availableCopies: book[0].availableCopies - 1
        }).where(eq(books.id, bookId));

        return {success: true, data: JSON.parse(JSON.stringify(record))};
    } catch (error) {
        console.log(error);
        return{success: false, error: "An error occurred. Please try again."}
    }
}

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    // Method 1: Using SQL LOWER() function for case-insensitive search
    const results = await db.select()
      .from(books)
      .where(
        or(
          sql`LOWER(${books.title}) LIKE LOWER(${`%${query}%`})`,
          sql`LOWER(${books.author}) LIKE LOWER(${`%${query}%`})`,
          sql`LOWER(${books.genre}) LIKE LOWER(${`%${query}%`})`,
          // Add more searchable fields as needed
        )
      )
      .limit(20);

    return results;
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books');
  }
}
