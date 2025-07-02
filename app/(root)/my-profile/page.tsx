import { auth } from '@/auth'
import BookList from '@/components/BookList'
import { Button } from '@/components/ui/button'
import { sampleBooks } from '@/constants'
import { db } from '@/database/drizzle'
import { books, borrowRecords, users } from '@/database/schema'
import { eq } from 'drizzle-orm'
import React from 'react'
import Image from 'next/image'
import ProfileInfoCard from '@/components/ProfileInfoCard'
import BorrowBookList from '@/components/BorrowBookList'

const ProfilePage = async () => {
  const session = await auth()
  
  const MyBorrowedBooks = await db.select()
    .from(borrowRecords)
    .leftJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, session?.user?.id!))
    .limit(10);
    
  const userData = await db.select().from(users).where(eq(users.id, session?.user?.id!)).limit(1);
  const user = userData[0];

  

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-20">
      {/* Profile Section - Takes about 1/3 width */}
     <div className=" lg:w-2/5">
        <ProfileInfoCard user={user} />
      </div>

      {/* Borrowed Books Section - Takes about 60% width */}
      <div className="flex-1 lg:w-3/5">
        <BorrowBookList borrowedBooks={MyBorrowedBooks} />
      </div>
    </div>
  )
}

export default ProfilePage