import { auth } from '@/auth'
import BookOverview from '@/components/BookOverview'
import BookVideo from '@/components/BookVideo'
import { db } from '@/database/drizzle'
import { books } from '@/database/schema'
import { eq } from 'drizzle-orm'
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
      <BookOverview {...bookDetails[0]} userId={session?.user?.id as string} />

      <div className='lg:mt-36 mt-16 mb-20 flex flex-col gap-16 lg:flex-row'>
        <div className='flex-[1.5] '>
            <section className='flex flex-col gap-7'>
                <h3 className='text-xl font-semibold text-primary'>Video</h3>
                <BookVideo videoUrl={bookDetails[0].videoUrl} />
            </section>
            <section className='mt-10 flex flex-col gap-7'>
                <h3 className='text-xl font-semibold text-primary'>summmary</h3>
                <div className='space-y-5 text-xl text-light-100'>
                    {bookDetails[0].summary.split('\n').map((line, index) => <p key={index}>{line}</p>)}
                </div>

            </section>

        </div>
        <div>
            description summary
        </div>
      </div>
    </>
  )
}

export default page
