'use client'
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import BookCoverSvg from './BookCoverSvg';
import config from '@/lib/config';
import { IKImage } from "imagekitio-next";


type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall : "book-cover_extra_small",
  small : "book-cover_small",
  medium : "book-cover_medium",
  regular : "book-cover_regular",
  wide : "book-cover_wide",
}


interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverImage: string;
  coverColor: string;
}

const BookCover = ({className,variant = "regular",coverImage ,coverColor = "#012B48"}:Props) => {
  return (
    <div className={cn('relative transition-all duration-300 ease-in-out', variantStyles[variant], className)}>
<BookCoverSvg coverColor={coverColor}  />

     <div className='absolute z-10' style={{left:'12%',width:'87.5%', height:'88%'}}>
<IKImage
          path={coverImage}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt="Book cover"
          fill
          className="rounded-sm object-fill"
          loading="lazy"
          lqip={{ active: true }}
        />
     </div>
    </div>
  )
}

export default BookCover
