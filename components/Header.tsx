'use client'
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Session } from 'next-auth';
import { Button } from './ui/button';
import { handleSignOut } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react'; // Import logout icon

const Header = ({session }:{session: Session}) => {
    const pathname = usePathname();
    console.log('Session:', session);

    return (
        <header className="mt-10 flex justify-between gap-5">
            <Link href="/">
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
                        href="/"
                        className={cn('text-base cursor-pointer capitalize', pathname === '/' ? 'text-light-200': 'text-light-100')}
                    >
                       Home
                    </Link>
                </li>

                <li>
                    <Link
                        href="/search"
                        className={cn('text-base cursor-pointer capitalize', pathname === '/search' ? 'text-light-200': 'text-light-100')}
                    >
                        Search
                    </Link>
                </li>

                <li className='flex items-center gap-3'>
                    {/* Profile Avatar */}
                    <Link
                        href="/my-profile"
                        className={cn('text-base cursor-pointer capitalize', pathname === '/my-profile' ? 'text-light-200': 'text-light-100')}
                    >
                        <Avatar>
                            <AvatarFallback className='bg-gradient-to-br from-amber-300 via-orange-400 to-red-500'>
                                {getInitials(session.user?.name!)}
                            </AvatarFallback>
                        </Avatar>
                    </Link>

                    {/* Logout Button */}
                    <form action={handleSignOut}>
                        <Button 
                            type="submit" 
                            variant="ghost" 
                            size="sm"
                            className="p-2 hover:bg-light-100/10 text-red-800 hover:text-red-200"
                        >
                            <LogOut size={18} />
                        </Button>
                    </form>
                </li>
            </ul>
        </header>
    )
}

export default Header