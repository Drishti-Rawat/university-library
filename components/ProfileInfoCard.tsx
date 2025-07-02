'use client'

import React from 'react'
import { Calendar, Clock, AlertCircle, CheckCircle, User, Badge, BadgeCheck, Shield } from 'lucide-react'
import config from '@/lib/config'
import { IKImage } from 'imagekitio-next'
import Image from 'next/image'

const ProfileInfoCard = ({user}:{user:AuthCredentails}) => {
  return (
    <div className="gradient-blue border-slate-700 rounded-3xl p-6 relative">
      
      {/* Header Section with Profile Image and Info */}
      <div className='flex flex-row items-center gap-4 mb-6'>
        {/* Profile Image */}
        <div className='relative w-24 h-24 rounded-full shadow-xl overflow-hidden border-4 ring-4 ring-dark-300 border-dark-300'>
          <IKImage
            path={user.universityCard}
            urlEndpoint={config.env.imagekit.urlEndpoint}
            alt="Profile Image"
            fill
            className="rounded-full object-cover"
            loading="lazy"
            lqip={{ active: true }}
          />
        </div>
        
        {/* Profile Info */}
        <div className='flex-1 space-y-1'>
          {/* Verification Badge */}
          <div className='flex items-center gap-1'>
            <BadgeCheck className='w-4 h-4 text-primary'/>
            <span className='text-light-100 text-xs'>
              {user?.status === "APPROVED" ? "Verified Student" : "Waiting for Verification"}
            </span>
          </div>
          
          {/* Name */}
          <h2 className='text-white text-xl font-medium'>{user.fullName}</h2>
          
          {/* Email */}
          <p className='text-light-100 text-sm'>{user.email}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className='flex flex-col gap-5'>
        {/* University Info */}
        <div className='flex flex-col gap-4'>
          <div>
            <h3 className="text-light-100 text-sm mb-1">University</h3>
            <p className="text-white font-semibold text-lg">Radium University</p>
          </div>
          <div>
            <h3 className="text-light-100 text-sm mb-1">University ID</h3>
            <p className="text-white font-semibold text-lg">{user?.universityId || user?.fullName}</p>
          </div>
        </div>

        {/* University Card Section */}
        <div>
          <div className='relative w-full rounded-lg shadow-xl overflow-hidden bg-dark-400'>
            <IKImage
              path={user.universityCard}
              urlEndpoint={config.env.imagekit.urlEndpoint}
              alt="University Card"
              width={600}
              height={400}
              className="rounded-lg object-contain w-full h-auto max-h-80"
              loading="lazy"
              lqip={{ active: true }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInfoCard