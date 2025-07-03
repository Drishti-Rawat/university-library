import { auth } from '@/auth'
import BookManagement from '@/components/admin/BookManagement'
import { Button } from '@/components/ui/button'
import { db } from '@/database/drizzle'
import { books } from '@/database/schema'
import { deleteBook } from '@/lib/admin/actions/book'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import React from 'react'

const BooksPage = async() => {
  const session = await auth()

  const booksData = await db.select().from(books).orderBy(desc(books.createdAt) )
  console.log("booksData", booksData);
  return (
    <div className='w-full rounded-2xl bg-white p-7 text-dark-500 '>
    <BookManagement books={booksData} handleDelete={deleteBook} />
    </div>
  )
}

export default BooksPage
