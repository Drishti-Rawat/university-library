'use client'
import { Check, ArrowUpDown } from 'lucide-react';
import React, { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { IKImage } from 'imagekitio-next';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getInitials } from '@/lib/utils';
import config from '@/lib/config';
import BookCover from '../BookCover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import ConfirmationDialog from './ConfirmationDialog';
import Image from 'next/image';

interface books extends BookParams {
    id: string
}
interface BorrowedBooksData {
  borrow_records: BorrowRecord;
  books:  books   ; // null because of leftJoin
  users: AuthCredentails ;
}

interface BorrowRequestProps {
  borrowRecords: BorrowedBooksData[];
  onStatusChnage: (id: string, status: "BORROWED" | "RETURNED") => void
}

interface ConfirmationState {
  isOpen: boolean
  type: 'statusChange' | null
  recordId: string | null
  bookTitle: string | null
  userName: string | null
  currentStatus?: string
  newStatus?: "BORROWED" | "RETURNED"
}

const BorrowBookManagement = ({borrowRecords , onStatusChnage}:BorrowRequestProps) => {

  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<'oldest' | 'newest'>('oldest');
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    type: null,
    recordId: null,
    bookTitle: null,
    userName: null
  });

  // Sort the borrow records based on sortOrder
  const sortedBorrowRecords = useMemo(() => {
    return [...borrowRecords].sort((a, b) => {
      const dateA = new Date(a.borrow_records.borrowDate).getTime();
      const dateB = new Date(b.borrow_records.borrowDate).getTime();
      
      return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });
  }, [borrowRecords, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'oldest' ? 'newest' : 'oldest');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'borrowed':
        return 'text-purple-600 bg-purple-50 hover:bg-purple-100'
      case 'overdue':
        return 'text-red-600 bg-red-50 hover:bg-red-100'
      case 'returned':
        return 'text-green-600 bg-green-50 hover:bg-green-100'
      case 'late return':
        return 'text-orange-600 bg-orange-50 hover:bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-50 hover:bg-gray-100'
    }
  }
     
  const getBookStatus = (record: BorrowedBooksData) => {
    const currentDate = new Date();
    const dueDate = new Date(record.borrow_records.dueDate);
    
    // If book is returned
    if (record.borrow_records.returnDate) {
      const returnDate = new Date(record.borrow_records.returnDate);
      
      // Check if returned after due date (late return)
      if (returnDate > dueDate) {
        return 'LATE RETURN';
      }
      
      // Returned on time
      return 'RETURNED';
    }
    
    // Book not returned yet - check if overdue
    if (currentDate > dueDate) {
      return 'OVERDUE';
    }
    
    // Book is still borrowed and not overdue
    return 'BORROWED';
  }

  const openStatusChangeConfirmation = (
    recordId: string, 
    bookTitle: string, 
    userName: string, 
    currentStatus: string, 
    newStatus: "BORROWED" | "RETURNED"
  ) => {
    setConfirmation({
      isOpen: true,
      type: 'statusChange',
      recordId,
      bookTitle,
      userName,
      currentStatus,
      newStatus
    });
  };

  const closeConfirmation = () => {
    setConfirmation({
      isOpen: false,
      type: null,
      recordId: null,
      bookTitle: null,
      userName: null
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmation.recordId || !confirmation.newStatus) return;

    setIsLoading(true);
    
    try {
      await onStatusChnage(confirmation.recordId, confirmation.newStatus);
      setEditingStatus(null);
      closeConfirmation();
    } catch (error) {
      console.error('Status change failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (
    recordId: string, 
    bookTitle: string, 
    userName: string, 
    currentStatus: string, 
    newStatus: "BORROWED" | "RETURNED"
  ) => {
    if (currentStatus.toLowerCase() !== newStatus.toLowerCase()) {
      openStatusChangeConfirmation(recordId, bookTitle, userName, currentStatus, newStatus);
    }
    setEditingStatus(null);
  };

  const getConfirmationProps = () => {
    if (confirmation.type === 'statusChange') {
      const isReturning = confirmation.newStatus === 'RETURNED';
      const isOverdue = confirmation.currentStatus === 'OVERDUE';
      
      return {
        title: isReturning ? 'Mark Book as Returned' : 'Update Borrow Status',
        description: isReturning 
          ? `Are you sure you want to mark "${confirmation.bookTitle}" as returned by ${confirmation.userName}? ${isOverdue ? 'This book was overdue.' : 'This will complete the borrowing record.'}`
          : `Are you sure you want to change the status of "${confirmation.bookTitle}" borrowed by ${confirmation.userName} from ${confirmation.currentStatus} to ${confirmation.newStatus}?`,
        confirmText: isReturning ? 'Mark as Returned' : 'Update Status',
        variant: 'default' as const,
        icon: 'warning' as const
      };
    }
    
    return {
      title: '',
      description: '',
      confirmText: 'Confirm',
      variant: 'default' as const,
      icon: 'warning' as const
    };
  };

  return (
     <div className='w-full space-y-6'>
      <div className='flex flex-row justify-between items-center'>
        <div>
          <h2 className='text-lg font-bold text-dark-500'>Book Borrow Management</h2>
        </div>
        
        {/* Filter Button */}
        <Button 
          onClick={toggleSortOrder}
          variant="outline"
          className="flex items-center gap-2 bg-white hover:bg-light-300/50 border-light-300 text-dark-500 font-medium"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === 'oldest' ? 'Oldest to Newest' : 'Newest to Oldest'}
        </Button>
      </div>

      <div className='overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='bg-light-300 rounded-lg border border-light-300'>
              <TableHead className='font-semibold text-dark-700 py-4'>Book</TableHead>
              <TableHead className='font-semibold text-dark-700'>User Requested</TableHead>
              <TableHead className='font-semibold text-dark-700'>Status</TableHead>
              <TableHead className='font-semibold text-dark-700'>Borrow Date</TableHead>
              <TableHead className='font-semibold text-dark-700'>Return Date</TableHead>
              <TableHead className='font-semibold text-dark-700'>Due Date</TableHead>
              <TableHead className='font-semibold text-dark-700'>Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBorrowRecords.map((record, i) => (
              <TableRow key={i} className='bg-white hover:bg-light-300/40 transition-colors border-b-2 border-light-300'>
                <TableCell className="py-4 w-1/3 px-4 align-middle">                                      
                  <div className="flex flex-row gap-3 items-center">                                                                      
                    <BookCover coverImage={record.books?.coverUrl!} coverColor={record.books.coverColor!} variant='extraSmall' />                                                                     
                    <h3 className='text-dark-500 text-sm text-bold whitespace-normal break-words leading-5 max-h-10 overflow-hidden'>{record.books?.title}</h3>                                      
                  </div>                                  
                </TableCell> 
                <TableCell className="py-4">
                  <div className="flex flex-row gap-3 items-center">
                    {record.users.profileImage ? (
                      <div className='h-12 w-12 relative'>
                        <IKImage
                          path={record.users.profileImage!}
                          urlEndpoint={config.env.imagekit.urlEndpoint}
                          alt="Profile Image"
                          fill
                          className="rounded-full object-cover"
                          loading="lazy"
                          lqip={{ active: true }}
                        />
                      </div>
                    ) : (
                      <Avatar className='h-10 w-10'>
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 text-lg font-semibold text-white'>
                          {getInitials(record.users.fullName!)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className='flex flex-col gap-0.5'>
                      <h3 className='text-dark-200 text-sm font-semibold'>{record.users.fullName}</h3>
                      <p className='text-gray-500 text-sm'>{record.users.email}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu 
                    open={editingStatus === record.borrow_records.id} 
                    onOpenChange={(open) => setEditingStatus(open ? record.borrow_records.id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getBookStatus(record))} flex items-center gap-2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                      >
                        {getBookStatus(record)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-32 bg-white">
                      {/* Show dropdown options only for active borrows (BORROWED or OVERDUE) */}
                      {(getBookStatus(record) === 'BORROWED' || getBookStatus(record) === 'OVERDUE') && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(
                              record.borrow_records.id, 
                              record.books?.title!, 
                              record.users.fullName!, 
                              getBookStatus(record), 
                              'BORROWED'
                            )}
                            className="flex items-center justify-between"
                            disabled={getBookStatus(record) === 'BORROWED'}
                          >
                            <span className='text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-xs'>Borrowed</span>
                            {getBookStatus(record) === 'BORROWED' && <Check className='w-4 h-4 text-purple-600' />}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(
                              record.borrow_records.id, 
                              record.books?.title!, 
                              record.users.fullName!, 
                              getBookStatus(record), 
                              'RETURNED'
                            )}
                            className="flex items-center justify-between"
                          >
                            <span className='text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs'>Returned</span>
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {/* For returned books, show status only (no actions) */}
                      {(getBookStatus(record) === 'RETURNED' || getBookStatus(record) === 'LATE RETURN') && (
                        <DropdownMenuItem disabled className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            getBookStatus(record) === 'RETURNED' 
                              ? 'text-green-600 bg-green-50' 
                              : 'text-orange-600 bg-orange-50'
                          }`}>
                            {getBookStatus(record) === 'RETURNED' ? 'Returned' : 'Late Return'}
                          </span>
                          <Check className={`w-4 h-4 ${
                            getBookStatus(record) === 'RETURNED' ? 'text-green-600' : 'text-orange-600'
                          }`} />
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell className='text-dark-200 font-medium'>
                  {record.borrow_records.borrowDate?.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </TableCell>
                <TableCell className='text-dark-200 font-medium'>
                  {record.borrow_records.returnDate ? record.borrow_records.returnDate : '-'} 
                </TableCell>
                <TableCell className='text-dark-200 font-medium'>
                  {record.borrow_records.dueDate } 
                </TableCell>
                
                <TableCell className='text-dark-200 font-medium'>
                 <Button 
                  variant='ghost'
                  disabled={record.borrow_records.status === 'RETURNED'}
                  className='bg-light-300 hover:bg-light-300/90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-primary-admin p-3 font-semibold flex flex-row items-center gap-2'

                >
                    <Image src="/icons/admin/receipt.svg" alt="View" width={18} height={18} />
                    Generate
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedBorrowRecords.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          <p className='text-lg font-medium'>No borrow records found</p>
          <p className='text-sm mt-1'>Borrow records will appear here once users borrow books</p>
        </div>
      )}

      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmAction}
        isLoading={isLoading}
        {...getConfirmationProps()}
      />
    </div>
  )
}

export default BorrowBookManagement