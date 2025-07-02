'use client'
import React from 'react'
import BorrowBookCard from './BorrowBookCard';

interface BorrowedBooksData {
  borrow_records: BorrowRecord;
  books: BookParams | null; // null because of leftJoin
}

interface BorrowedBooksProps {
  borrowedBooks: BorrowedBooksData[];
}

const BorrowBookList = ({borrowedBooks}:BorrowedBooksProps) => {

  console.log("borrowweed recprdss",borrowedBooks);
  return (
    <div className='flex flex-col gap-4 w-full'>
      <h2 className='text-light-100 text-2xl text-bold'>Borrowed Books</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6   max-xs:justify-between sm:gap-14'>
        {
          borrowedBooks.map((book,i) => (
            <BorrowBookCard key={i} book ={book} />
          ))
        }

      </div>
      
    </div>
  )
}

export default BorrowBookList
