import BorrowBookManagement from '@/components/admin/BorrowBookManagement'
import { db } from '@/database/drizzle'
import { books, borrowRecords, users } from '@/database/schema'
import { handleBorrowBookStatusChange } from '@/lib/admin/actions/borrowBook'
import { desc, eq } from 'drizzle-orm'
import React from 'react'

const BorrowRecordspage = async () => {

    const borrowBooksRecords = await db.select()
          .from(borrowRecords)
         .innerJoin(users, eq(borrowRecords.userId, users.id))
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
          .orderBy(desc(borrowRecords.borrowDate))
          
     console.log(borrowBooksRecords);

  return (
     <div className='w-full rounded-2xl bg-white p-7 text-dark-500 '>
        <BorrowBookManagement borrowRecords={borrowBooksRecords}  onStatusChnage={handleBorrowBookStatusChange} />
      
    </div>
  )
}

export default BorrowRecordspage
