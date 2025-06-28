import { Session } from 'next-auth'
import React from 'react'

const Header = ({session }:{session: Session}) => {
  return (
    <div className='flex lg:items-end items-start justify-between lg:flex-row flex-col gap-5 sm:mb-10 mb-5'>
        <div>
            <h2 className='text-dark-400 font-semibold capitalize  text-2xl'>{session?.user?.name}</h2>
            <p className='text-slate-500 text-base'>Monitor all of your books and users</p>
        </div>

        {/* <p>Search</p> */}
      
    </div>
  )
}

export default Header
