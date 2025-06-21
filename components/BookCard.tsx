import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const BookCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isLoanedBook = false,
}: Book) => (
  <li className={cn(
    "transition-all duration-300",
    isLoanedBook  
      ? "w-52  " 
      : " hover:scale-105"
  )}>
    <Link
      href={`/books/${id}`}
      className={cn(
        " group",
        isLoanedBook && "w-full flex flex-col items-center"
      )}
    >
      <div className={cn(
        "relative transition-all duration-300",
        isLoanedBook && "group-hover:transform group-hover:scale-[1.02]"
      )}>
        {/* Book Cover Section */}
        <div className={cn(
          "flex justify-center",
          isLoanedBook && "mb-4"
        )}>
          <BookCover 
            coverColor={coverColor} 
            coverImage={coverUrl}
            className={cn(
              isLoanedBook && "shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
            )}
          />
        </div>

        {/* Book Info Section */}
        <div className={cn(
          "mt-4",
          isLoanedBook 
            ? "text-center space-y-1" 
            : "xs:max-w-40 max-w-28"
        )}>
          <h3 className={cn(
            "font-semibold text-white transition-colors duration-300",
            isLoanedBook 
              ? "text-lg sm:text-xl line-clamp-1" 
              : "mt-2 line-clamp-1 text-base xs:text-xl"
          )}>
            {title}
          </h3>
          <p className={cn(
            "italic text-light-100 transition-colors duration-300",
            isLoanedBook 
              ? "text-sm line-clamp-1" 
              : "mt-1 line-clamp-1 text-sm xs:text-base"
          )}>
            {genre}
          </p>
        </div>

        {/* Loaned Book Specific Content */}
        {isLoanedBook && (
          <div className="mt-4 space-y-3">
            {/* Due Date Section - Minimalist Design */}
            <div className="flex items-center justify-center gap-2 py-2">
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={16}
                height={16}
                className="object-contain opacity-60"
              />
              <p className="text-light-100 text-sm font-medium">
                11 days left to return
              </p>
            </div>

            {/* Download Receipt Button - Clean Design */}
            <Button 
              className={cn(
                "w-full min-h-12 font-bebas-neue text-base",
                "bg-dark-600 hover:bg-dark-500",
                "border border-dark-400/30 hover:border-primary/50",
                "text-primary hover:text-white",
                "transition-all duration-200 ease-in-out",
                "shadow-sm hover:shadow-md"
              )}
              
            >
              Download Receipt
            </Button>
          </div>
        )}

        {/* Loaned Book Badge */}
        {isLoanedBook && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-dark-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
            11 days left
          </div>
        )}
      </div>
    </Link>
  </li>
);

export default BookCard;