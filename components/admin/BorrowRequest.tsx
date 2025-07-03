'use client'
import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import BookCover from '../BookCover';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';
import { IKImage } from 'imagekitio-next';
import config from '@/lib/config';

interface books extends BookParams {
    id: string
}
interface BorrowedBooksData {
  borrow_records: BorrowRecord;
  books:  books   ; // null because of leftJoin
  users: AuthCredentails ;
}

interface BorrowRequestProps {
  borrowRecords: BorrowedBooksData[];
}
const BorrowRequest = ({borrowRecords}:BorrowRequestProps) => {
    console.log(borrowRecords);
  return (
    <div className='flex flex-col gap-4 w-full bg-white rounded-xl p-5'>
        <div className='flex justify-between gap-4'>
            <h3 className='text-lg text-dark-500 font-semibold'>Borrow Requests</h3>

            <Button className='bg-light-300 hover:bg-light-300/90 text-primary-admin p-3 font-semibold' asChild>
            <Link href="/admin/borrow_requests">View All</Link>
            </Button>

        </div>

    <div className='flex flex-col gap-3'>
    {
        borrowRecords.length === 0 ? (
            <div className='flex flex-col gap-2  items-center justify-center p-3'>
                <div className='h-40 w-40 relative'>
                    <Image src="/icons/admin/Illustration.svg" alt="No Data" fill className='object-contain ' />

                </div>

                <div className='text-center space-y-1 mb-3'>
                    <h2 className='text-dark-500 font-semibold text-base'>No Panding Book Requests</h2>
                    <p className='text-gray-500 text-sm'> There are no borrow book requests awaiting your review at this time</p>
                </div>

            </div>
        ) :
        borrowRecords.map((book) => (
            <Link 
                href={`/books/${book.books.id}`} 
                key={book.borrow_records.id}
                className='flex flex-row gap-4 p-4 bg-light-300 hover:bg-light-100/30   rounded-lg     transition-all duration-200 cursor-pointer'
            >
                <BookCover 
                    coverImage={book.books.coverUrl} 
                    coverColor={book.books.coverColor} 
                    variant='small' 
                />
                <div className='flex flex-col gap-1 flex-1 min-w-0'>
                    <h1 className='font-semibold text-base text-gray-900 truncate'>{book.books.title}</h1>
                    <p className='text-gray-500 text-sm truncate'>By {book.books.author} • {book.books.genre}</p>
                    <div className='flex flex-row gap-4 items-center mt-1'>
                        <div className='flex flex-row gap-2 items-center'>
                           <div className='h-5 w-5 relative '>
                             <IKImage
            path={book.users.profileImage!}
            urlEndpoint={config.env.imagekit.urlEndpoint}
            alt="Profile Image"
            fill
            className="rounded-full object-cover"
            loading="lazy"
            lqip={{ active: true }}
          />

                           </div>
                            <p className='text-gray-700 text-sm'>{book.users.fullName}</p>
                        </div>
                        <div className='flex flex-row gap-2 items-center justify-center'>
                            <Image src="/icons/admin/calendar.svg" alt="calendar" width={16} height={16} />
                            <p className='text-gray-700 text-sm'>{book?.borrow_records?.borrowDate.toLocaleDateString()!}</p>
                        </div>
                    </div>
                </div>
            </Link>
        ))
    }
</div>
      
    </div>
  )
}

export default BorrowRequest
