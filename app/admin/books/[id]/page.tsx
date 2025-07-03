import { auth } from '@/auth'
import BookOverview from '@/components/admin/BookOverview'

import { Button } from '@/components/ui/button'
import { db } from '@/database/drizzle'
import { books } from '@/database/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async ({params}:{params:Promise<{id:string}>}) => {
  const id = (await params).id
  const session = await auth()

  const bookDetails = await db.select().from(books).where(eq(books.id, id)).limit(1)

  if(!bookDetails) redirect('/404')

    console.log(bookDetails)

  return (
    <>
   <Button className='mb-10 w-fit border border-light-300 bg-white text-sm font-medium text-dark-200 hover:bg-light-30' asChild>
        <Link href="/admin/books"> Go Back </Link></Button>

       <BookOverview {...bookDetails[0]} userId={session?.user?.id as string} />
    </>
  )
}

export default page
