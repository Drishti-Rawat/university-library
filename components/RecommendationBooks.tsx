import React from 'react'
import BookCover from './BookCover'
import Link from 'next/link'

interface props {
    books: Book[]
}
const RecommendationBooks = ({books}:props) => {
  return (
    <div className='mt-5 w-full'>
        
        <ul className='flex flex-wrap gap-4'>
            {
                books.map((book,i) => (
                    <li key={i}>
                        <Link href={`/books/${book.id}`} >
                        <BookCover coverColor={book.coverColor} coverImage={book.coverUrl} />
                        </Link>
                    </li>
                ))
            }
        </ul>
      
    </div>
  )
}

export default RecommendationBooks
