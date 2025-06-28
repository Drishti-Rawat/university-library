import BookForm from '@/components/admin/forms/BookForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const CreateBookpage = () => {
  return (
    <>
        <Button className='mb-10 w-fit border border-light-300 bg-white text-sm font-medium text-dark-200 hover:bg-light-30' asChild>
        <Link href="/admin/books"> Go Back </Link></Button>

        <section className='w-full max-w-2xl'>
            <p>Book Form</p>
            <BookForm type='create'/>

        </section>
      
    </>
  )
}

export default CreateBookpage
