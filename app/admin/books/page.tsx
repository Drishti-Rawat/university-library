import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const BooksPage = () => {
  return (
    <div className='w-full rounded-2xl bg-white p-7 text-dark-500 '>
      <div className='flex flex-wrap jusbtify-between items-center gap-2'>
        <h2 className='text-xl font-semibold'>All books</h2>
        <Button className='bg-primary-admin hover:bg-primary-admin/90 text-white' asChild> 
        <Link href="/admin/books/new">+ Create a New Book
        </Link>
        </Button>
        
      </div>
      <div className='mt-5 w-full overflow-hidden'>
        <p>table</p>
      </div>
    </div>
  )
}

export default BooksPage
