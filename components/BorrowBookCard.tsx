import React from 'react'
import BookCover from './BookCover';
import { AlertCircle, Calendar, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BorrowBookCardProps {
  book: {
    borrow_records: BorrowRecord;
    books: BookParams | null;
  };
}

const BorrowBookCard = ({ book }: BorrowBookCardProps) => {
  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const calculateDaysLeft = () => {
    if (book?.borrow_records?.returnDate) return null;
        
    const today = new Date();
    const dueDate = new Date(book?.borrow_records?.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
    return diffDays;
  };
  
  const getStatusInfo = () => {
    const record = book?.borrow_records;
    if (!record) return null;

    if (record.returnDate) {
      return {
        type: 'returned',
        icon: '/icons/tick.svg',
        text: `Returned on ${formatDate(record.returnDate)}`,
        className: 'text-light-100'
      };
    }

    const daysLeft = calculateDaysLeft();
    if (daysLeft === null) return null;

    if (daysLeft < 0) {
      return {
        type: 'overdue',
        icon: '/icons/warning.svg',
        text: 'Overdue Return',
        className: 'text-red-400'
      };
    }

    return {
      type: 'borrowed',
      icon: '/icons/calendar.svg',
      text: `${daysLeft.toString().padStart(2, '0')} days left to due`,
      className: 'text-light-100'
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
     <Link
      href={`/books/${book?.books?.id}`}
      
    >
    <div  className='flex flex-col gradient-vertical rounded-xl overflow-hidden shadow-xl w-full  md:max-w-[280px] p-3 sm:p-4'>
      {/* Book Cover Section */}
      <div 
        className="px-8 sm:px-12 py-4 sm:py-6 flex justify-center items-center bg-opacity-50 rounded-lg"
        style={{
          backgroundColor: `${book?.books?.coverColor || '#F8D347'}80`
        }}
      >
                
        <BookCover 
            variant="medium"
            coverImage={book?.books?.coverUrl!}
            coverColor={book?.books?.coverColor!}
          />
              
      </div>
            
      {/* Book Info Section */}
      <div className="mt-3 text-white flex-1 min-h-0">
        <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-3 leading-tight">{book?.books?.title}</h3>
        <p className="text-gray-300 mb-1 text-sm sm:text-base truncate">By {book?.books?.author}</p>
        <p className="text-gray-400 text-xs sm:text-sm mb-4 truncate">{book?.books?.genre}</p>
                
        {/* Borrow info */}
        <div className="space-y-2">
          {/* Borrowed Date */}
          <div className="flex items-center gap-2 text-gray-300">
            <Image src="/icons/book-2.svg" alt="calendar" width={14} height={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">
              Borrowed on {formatDate(book?.borrow_records?.borrowDate)}
            </span>
          </div>
                    
          {/* Status Info */}
          {statusInfo && (
            <div className={`flex items-center gap-2 ${statusInfo.className}`}>
             <Image 
  src={statusInfo.icon}
  alt="status icon"
  width={14}
  height={14}
  className="sm:w-4 sm:h-4 flex-shrink-0"
  onError={(e) => console.log('Image failed to load:', statusInfo.icon)} />
              <span className="text-xs sm:text-sm font-medium">
                {statusInfo.text}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
    </Link>
  )
}

export default BorrowBookCard