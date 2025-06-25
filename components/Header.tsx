'use client'
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from 'next-auth';

const Header = ({session }:{session: Session}) => {
    const pathname = usePathname();
console.log('Session:', session);
  return (
    <header className="mt-10 flex  justify-between gap-5">
      <Link
        href="/"
       
        >
      <Image
        src="/icons/logo.svg"
        alt="Logo"
        width={40}
        height={40}
        
        />
        </Link>

        <ul className='flex flex-row gap-8 items-center'>
            <li>    
                <Link
                    href="/library"
                    className={cn('text-base cursor pointer capitalize' ,pathname === '/library' ?'text-light-200': 'text-light-100') }
                >
                  Library
                </Link>
            </li>

            <li>
                <Link
                    href="/search"
                    className={cn('text-base cursor pointer capitalize' ,pathname === '/search' ?'text-light-200': 'text-light-100') }
                >
                  Search
                </Link>
            </li>

            <li>
                <Link
                    href="/my-profile"
                    className={cn('text-base cursor pointer capitalize' ,pathname === '/profile' ?'text-light-200': 'text-light-100') }
                >
                  <Avatar>
  {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
  <AvatarFallback className='bg-gradient-to-br from-amber-300 via-orange-400 to-red-500'>{getInitials(session.user?.name!)}</AvatarFallback>
</Avatar>
                </Link>
            </li>

        </ul>
    </header>
  )
}

export default Header
