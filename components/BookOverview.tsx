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
   
    <section className='book-overview'>
        <div className='flex flex-1 flex-col gap-5'>
            <h1>{title}</h1>
            <div className='book-info'>
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

            <div className='book-copies'>
                <p >Total Copies: <span>{totalCopies}</span> </p>
                <p >Available Copies: <span>{availableCopies}</span> </p>
              
            </div>

           <p className='book-description'>
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
