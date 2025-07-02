import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import BookCover from '../BookCover'
import Image from 'next/image'

const RecentAddedBooks = ({books}:{books:Book[]}) => {
  return (
    <div className='flex flex-col gap-4 w-full bg-white rounded-xl p-5'>
        <div className='flex justify-between gap-4'>
            <h3 className='text-lg text-dark-500 font-semibold'>Recently Added Books</h3>

            <Button className='bg-light-300 hover:bg-light-300/90 text-primary-admin p-3 font-semibold' asChild>
            <Link href="/admin/books">View All</Link>
            </Button>

        </div>

<div className='flex flex-col gap-4'>
  
    <Link href="/admin/books/new" className='bg-light-300 hover:bg-light-100/30  cursor-pointer rounded-lg p-3 flex flex-row items-center gap-4'>
        <div className='p-3 rounded-full bg-white text-center flex justify-center items-center'>
            <Plus className='w-6 h-6 text-primary-admin font-semibold ' />
        </div>

        <h2 className='text-lg font-semibold text-primary-admin'>Add New Books</h2>

    </Link>

    {
        books.map((book) => (
            <Link 
                href={`/books/${book.id}`} 
                key={book.id}
                className='flex flex-row gap-4 p-4 bg-light-300 hover:bg-light-100/30   rounded-lg     transition-all duration-200 cursor-pointer'
            >
                <BookCover 
                    coverImage={book.coverUrl} 
                    coverColor={book.coverColor} 
                    variant='small' 
                />

                <div className='flex flex-col gap-1 flex-1 min-w-0 '>
                    <h1 className='font-semibold text-base text-gray-900 max-w-sm text-ellipsis truncate'>{book.title}</h1>
                    <p className='text-gray-500 text-sm truncate'>By {book.author} • {book.genre}</p>
                    <div className='flex flex-row gap-2 mt-1'>
                                                <Image src="/icons/admin/calendar.svg" alt="calendar" width={16} height={16} />
                                                <p className='text-gray-700 text-sm'>{book?.createdAt!.toLocaleDateString()}</p>
                                            </div>
                </div>
            </Link>
        ))
    }
   

</div>
   
      
    </div>
  )
}

export default RecentAddedBooks
