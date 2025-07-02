'use client'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { IKImage } from 'imagekitio-next'
import config from '@/lib/config'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { getInitials } from '@/lib/utils'
import Image from 'next/image'

const AccountRequest = ({accountRequestsData}:{accountRequestsData:AuthCredentails[]}) => {
  return (
    <div className='flex flex-col gap-4 w-full bg-white rounded-xl p-5'>
        <div className='flex justify-between gap-4'>
            <h3 className='text-lg text-dark-500 font-semibold'>Account Requests</h3>

            <Button className='bg-light-300 hover:bg-light-300/90 text-primary-admin p-3 font-semibold' asChild>
            <Link href="/admin/account_requests">View All</Link>
            </Button>

        </div>

{
    accountRequestsData.length === 0 ? (
                     <div className='flex flex-col gap-2  items-center justify-center p-3'>
                                    <div className='h-40 w-40 relative'>
                                        <Image src="/icons/admin/illustrationReq.svg" alt="No Data" fill className='object-contain ' />
                    
                                    </div>
                    
                                    <div className='text-center space-y-1 mb-3'>
                                        <h2 className='text-dark-500 font-semibold text-base'>No Panding Book Requests</h2>
                                        <p className='text-gray-500 text-sm'> There are no borrow book requests awaiting your review at this time</p>
                                    </div>
                    
                                </div>
                ):
                (
                      <div className='flex flex-wrap  gap-2'>
            {
                
                accountRequestsData.map((user,i) => (
                    <div className='flex flex-col items-center justify-center gap-3 p-4 bg-light-300 hover:bg-light-100/30   rounded-lg     transition-all duration-200 cursor-pointer' key={i}  >
                      
                      {
                        user.profileImage ?(
                            <div className='h-14 w-14 relative'>
                            <IKImage
                                path={user.profileImage!}
                                urlEndpoint={config.env.imagekit.urlEndpoint}
                                alt="Profile Image"
                                fill
                                className="rounded-full object-cover"
                                loading="lazy"
                                lqip={{ active: true }}
                            />

                        </div>
                        ):(
                            <Avatar className='h-14 w-14'>
                             <AvatarFallback className='bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 text-lg font-semibold text-white'>
       
                                {getInitials(user.fullName!)}
                            </AvatarFallback>
                        </Avatar>
                        )
                      }  
                        <div className='space-y-1 text-center'>
                            <h1 className='font-semibold text-sm text-dark-500 truncate'>{user.fullName}</h1>
                            <p className='text-gray-500 text-sm truncate'>{user.email}</p>
                        </div>

                       
                        
                            

                        </div>
                ))

                      
            }

        </div>
                )
}
      

    
      
    </div>
  )
}

export default AccountRequest
