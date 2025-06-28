'use client'
import config from '@/lib/config'

import { IKVideo, ImageKitProvider } from 'imagekitio-next'
import React from 'react'

const BookVideo = ({videoUrl}:{videoUrl:string}) => {
     const getRelativePath = (url: string) => {
    if (url.includes(config.env.imagekit.urlEndpoint!)) {
      // Remove the endpoint to get just the path
      return url.replace(config.env.imagekit.urlEndpoint!, '')
    }
    // If it's already a relative path, return as is
    return url.startsWith('/') ? url : `/${url}`
  }
  return (
    <ImageKitProvider publicKey={config.env.imagekit.publicKey!}
     urlEndpoint={config.env.imagekit.urlEndpoint!}
     >
        <IKVideo  path={getRelativePath(videoUrl)}
        controls = {true}
        className='w-full rounded-xl'
        />
        </ImageKitProvider>
  )
}

export default BookVideo
