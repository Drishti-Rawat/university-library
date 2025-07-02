import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import BookCover from './BookCover'
import BorrowBook from './BorrowBook'
import { db } from '@/database/drizzle'
import { users } from '@/database/schema'
import { eq } from 'drizzle-orm'

interface props extends Book{
   
    userId : string
}

const BookOverview = async({title,author , genre,rating,totalCopies,availableCopies, description, coverColor, coverUrl , id , userId}:props) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  
  

  const borrowingEligibility = {
  isEligible: availableCopies > 0 && user.status === "APPROVED",
  message: (() => {
    if (availableCopies <= 0) {
      return "Book not available";
    } else if (user.status !== "APPROVED") {
      return "You are not Eligible to borrow this book";
    } else {
      return "You can borrow this book";
    }
  })()
};

  if(!user) return null

  return (
   
    <section className='flex flex-col-reverse items-center gap-12 sm:gap-32 xl:flex-row xl:gap-8'>
        <div className='flex flex-1 flex-col gap-5'>
            <h1 className='text-5xl font-semibold text-white md:text-7xl'>{title}</h1>
            <div className='t-7 flex flex-row flex-wrap gap-4 text-xl text-light-100'>
                <p>
                    By <span className='text-light-200 font-semibold'>{author}</span>
                </p>
                <p>
                    Category <span className='text-light-200 font-semibold'>{genre}</span>
                </p>
                <div className='flex flex-row gap-1'>
                    <Image
                        src="/icons/star.svg"
                        alt="Star Icon"
                        width={22}
                        height={22}
                       
                    />
                    <p>{rating}</p>

                </div>


            </div>

            <div className='flex flex-row flex-wrap gap-4 mt-1'>
                <p className='text-xl text-light-100' >Total Copies: <span className='ml-2 font-semibold text-primary'>{totalCopies}</span> </p>
                <p  className='text-xl text-light-100'>Available Copies: <span className='ml-2 font-semibold text-primary'>{availableCopies}</span> </p>
              
            </div>

           <p className='mt-2 text-justify text-xl text-light-100'>
                {description}
            </p>

           <BorrowBook userId={userId} bookId={id}  borrowingEligibility={borrowingEligibility}/>
           
        </div>

        <div className = "relative flex flex-1 justify-center ">
            <div className='relative'>
                <BookCover 
                variant="wide"
                className="z-10"
                coverColor={coverColor}
                coverImage={coverUrl}
                />

                <div className='absolute left-16 top-10 rotate-12 opacity-20 max-sm:hidden'>  
                    <BookCover 
                    variant="wide"

                    coverColor={coverColor}
                    coverImage={coverUrl}
                    />

                </div>
            </div>
            </div>
      
    </section>
  )
}

export default BookOverview
