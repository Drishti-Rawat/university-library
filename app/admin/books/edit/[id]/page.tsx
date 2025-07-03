import BookForm from '@/components/admin/forms/BookForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const CreateBookpage =async ({params}:{params:Promise<{id:string}>}) => {
  const id = (await params).id
  return (
    <>
        <Button className='mb-10 w-fit border border-light-300 bg-white text-sm font-medium text-dark-200 hover:bg-light-30' asChild>
        <Link href="/admin/books"> Go Back </Link></Button>

        <section className='w-full max-w-2xl'>
           
            <BookForm type='update' bookId={id}/>

        </section>
      
    </>
  )
}

export default CreateBookpage
