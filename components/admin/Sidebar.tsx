'use client'
import { adminSideBarLinks } from '@/constants'
import { cn, getInitials } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Session } from 'next-auth'

const Sidebar = ({session }:{session: Session}) => {
    const PathName  = usePathname();
  return (
    <div className='sticky left-0 top-0 flex h-dvh flex-col justify-between bg-white px-5 pb-5 pt-10'>
        <div>
            <div className='flex flex-row items-center gap-2 border-b border-dashed border-primary-admin/20 pb-10 max-md:justify-center'>
            <Image
                src="/icons/admin/logo.svg"
                alt="Logo"
                width={37}
                height={37}
                />
                <h1 className='text-2xl font-semibold text-primary-admin max-md:hidden'>BookShelf</h1>
            </div>

            <div className='mt-10 flex flex-col gap-5'>
                {
                   adminSideBarLinks.map((link, index) => {
                    const isSelected = (link.route !== '/admin' && PathName?.includes(link.route) && link.route.length>1) ||  PathName === link.route;

   return(
    <Link href={link.route} key={index} className={cn(
        'flex flex-row items-center w-full gap-2 rounded-lg px-5 py-3.5 max-md:justify-center hover:bg-light-300/60',
        isSelected && 'shadow-sm bg-primary-admin hover:bg-primary-admin/90'
    )}>
        <div className='relative size-5'>
 <Image
            src={link.img}
            alt={link.text}
            fill
            className={`${isSelected? 'brightness-0 invert' : ""} object-contain} `}
            />
        </div>
       
        <p className={cn( "text-base font-medium max-md:hidden" ,isSelected? 'text-white' : 'text-dark-500')}>{link.text}</p>
    </Link>
    )}
   )
                   }
              
            </div>
        </div>


     <div className='my-8 flex w-full flex-row gap-2 rounded-full border border-light-400 px-6 py-2 shadow-sm max-md:px-2'>
       
                  <Avatar>
  {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
  <AvatarFallback className='bg-gradient-to-br from-amber-300 via-orange-400 to-red-500'>{getInitials(session.user?.name!)}</AvatarFallback>
</Avatar>

                  <div className='flex flex-col max-md:hidden'>
                      <p className='font-semibold text-dark-400'>{session.user?.name}</p>
                      <p className='text-xs text-light-500'>{session.user?.email}</p>
                  </div>
               

     </div>
    </div>
  )
}

export default Sidebar
