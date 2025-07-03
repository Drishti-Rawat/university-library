import React from 'react'
import BookCover from '../BookCover'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'
import BookVideo from '../BookVideo'

interface props extends Book {
    userId: string
}

const BookOverview = ({
    title,
    author,
    genre,
    rating,
    totalCopies,
    availableCopies,
    coverColor,
    coverUrl,
    createdAt,
    id,
    videoUrl,
    summary,
    userId
}: props) => {
    return (
        <div className='flex flex-col gap-6 rounded-xl   '>
            <div className='flex flex-col md:flex-row gap-6'>
                {/* Book Cover Section */}
                <div
                    className="px-8 sm:px-16 py-6 sm:py-8 flex justify-center items-center bg-opacity-10 rounded-xl min-w-fit"
                    style={{
                        backgroundColor: `${coverColor || '#F8D347'}20`
                    }}
                >
                    <BookCover
                        variant="medium"
                        coverImage={coverUrl!}
                        coverColor={coverColor!}
                    />
                </div>

                {/* Book Details Section */}
                <div className='flex flex-col gap-4 flex-1'>
                    {/* Book Title */}
                    <h1 className='text-3xl text-gray-900 font-bold leading-tight'>
                        {title}
                    </h1>

                    {/* Author */}
                    <h2 className='text-xl text-gray-600 font-medium'>
                        by {author}
                    </h2>

                    {/* Genre Tags */}
                   
                         <div className='flex flex-wrap gap-2'>
                        {genre?.split(',').map((g, index) => (
                            <span 
                                key={index}
                                className='px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200'
                            >
                                {g.trim()}
                            </span>
                        ))}
                    </div>
                    

                    {/* Book Stats */}
                    <div className='flex flex-wrap gap-6 text-sm'>
                        {rating && (
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-500'>Rating:</span>
                                <div className='flex items-center gap-1'>
                                    <span className='text-yellow-500'>★</span>
                                    <span className='font-medium text-gray-900'>{rating}</span>
                                </div>
                            </div>
                        )}
                        {totalCopies && (
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-500'>Total Copies:</span>
                                <span className='font-medium text-gray-900'>{totalCopies}</span>
                            </div>
                        )}
                        {availableCopies !== undefined && (
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-500'>Available:</span>
                                <span className={`font-medium ${availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {availableCopies}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Created At */}
                    <div className='flex items-center gap-2 text-sm text-gray-500'>
                        <Image 
                            src="/icons/admin/calendar.svg" 
                            alt="calendar" 
                            width={16} 
                            height={16} 
                            className='object-contain opacity-70' 
                        />
                        <span>Created {createdAt!.toLocaleString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        })}</span>
                    </div>

                    {/* Action Button */}
                    <div className='mt-auto pt-4'>
                        <Button 
                            className='w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors' 
                            asChild
                        >
                            <Link href={`/admin/books/edit/${id}`} className='flex items-center gap-2'>
                                <Image 
                                    src="/icons/admin/edit.svg" 
                                    alt="edit" 
                                    width={16} 
                                    height={16} 
                                    className='object-contain' 
                                />
                                Edit Book
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

         
        <div className='flex flex-col md:flex-row gap-6 '>
            
            <section className=' flex flex-col gap-4'>
                <h3 className='text-xl font-semibold text-dark-400'>summmary</h3>
                <div className='space-y-5 text-sm text-gray-500'>
                    {summary!.split('\n').map((line, index) => <p key={index}>{line}</p>)}
                </div>

            </section>

            <section className='flex flex-col gap-4'>
                <h3 className='text-xl font-semibold text-dark-400'>Video</h3>
                <BookVideo videoUrl={videoUrl!} />
            </section>

        
      </div>
        </div>
    )
}

export default BookOverview