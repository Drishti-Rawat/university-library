import { signOut } from '@/auth'
import BookList from '@/components/BookList'
import { Button } from '@/components/ui/button'
import { sampleBooks } from '@/constants'
import React from 'react'

const profilePage = () => {
  return (
    <div>
      <form action={async () => {
        'use server'
        await signOut()
      }}
      className='mb-10'>
        <Button >LogOut</Button>
      </form>

      <BookList
        title="My Books"
        books={sampleBooks}
        containerClassName="mt-28"
        />
    </div>
  )
}

export default profilePage
