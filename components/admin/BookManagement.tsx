'use client'
import React, { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { IKImage } from 'imagekitio-next'
import { ArrowDown, ArrowUp, ArrowUpDown, Eye } from 'lucide-react'
import BookCover from '../BookCover'
import Image from 'next/image'
import ConfirmationDialog from './ConfirmationDialog'

interface props{
    books:Book[],
    handleDelete:(id:string) => void
}

interface ConfirmationState {
  isOpen: boolean
  type: 'delete' 
  bookId: string | null
  title: string | null
 
  
}

type SortOrder = 'asc' | 'desc' | 'none'
const BookManagement = ({books, handleDelete}:props) => {
      const [isLoading, setIsLoading] = useState(false)
      const [sortOrder, setSortOrder] = useState<SortOrder>('none')
      const [confirmation, setConfirmation] = useState<ConfirmationState>({
        isOpen: false,
        type: 'delete',
        bookId: null,
        title: null
      })

    const sortedBooksData = useMemo(() => {
    if (sortOrder === 'none') return books
    
    return [...books].sort((a, b) => {
      const nameA = a.title?.toLowerCase() || ''
      const nameB = b.title?.toLowerCase() || ''
      
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB)
      } else {
        return nameB.localeCompare(nameA)
      }
    })
  }, [books, sortOrder])

  const handleSortToggle = () => {
    setSortOrder(prev => {
      switch (prev) {
        case 'none':
          return 'asc'
        case 'asc':
          return 'desc'
        case 'desc':
          return 'none'
        default:
          return 'asc'
      }
    })
  }

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'asc':
        return <ArrowUp className='w-4 h-4' />
      case 'desc':
        return <ArrowDown className='w-4 h-4' />
      default:
        return <ArrowUpDown className='w-4 h-4' />
    }
  }

  const getSortText = () => {
    switch (sortOrder) {
      case 'asc':
        return 'A-Z'
      case 'desc':
        return 'Z-A'
      default:
        return 'A-Z'
    }
  }
  const openDeleteConfirmation = (bookId: string, title: string) => {
    setConfirmation({
      isOpen: true,
      type: 'delete',
      bookId,
      title
    })
  }

  const closeConfirmation = () => {
    setConfirmation({
      isOpen: false,
      type: 'delete',
      bookId: null,
      title: null
    })
  }

  const handleConfirmAction = async () => {
    if (!confirmation.bookId || !confirmation.type) return

    setIsLoading(true)
    
    try {
      if (confirmation.type === 'delete') {
        await handleDelete(confirmation.bookId)
      } 
      closeConfirmation()
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className='w-full space-y-6'>
     <div className='flex flex-wrap justify-between items-center gap-2'>
        <h2 className='text-xl font-semibold'>All books</h2>
        <div className='flex flex-row gap-2'>
              <Button 
                      onClick={handleSortToggle}
                      className='bg-light-300 hover:bg-light-100/30 text-primary-admin px-4 py-2 font-semibold rounded-lg  cursor-pointer  flex items-center gap-2 transition-all'
                    >
                      {getSortText()}
                      {getSortIcon()}
                    </Button>
      <Button className='bg-primary-admin hover:bg-primary-admin/90 text-white' asChild> 
        <Link href="/admin/books/new">+ Create a New Book
        </Link>
        </Button>
        </div>
      
        
      </div>
     <div className='overflow-hidden'>                  
    <Table className="table-fixed">                      
        <TableHeader>                          
            <TableRow className='bg-light-300 rounded-lg border-b-2 border-light-300'>                              
                <TableHead className='font-semibold text-dark-700 w-1/3 px-4'>Book Title</TableHead>                              
                <TableHead className='font-semibold text-dark-700 w-1/4 px-4'>Author</TableHead>                              
                <TableHead className='font-semibold text-dark-700 w-1/6 px-4'>Genre</TableHead>                              
                <TableHead className='font-semibold text-dark-700 w-1/6 px-4'>Date Created</TableHead>                              
                <TableHead className='font-semibold text-dark-700 w-1/12 px-4'>Action</TableHead>                                               
            </TableRow>                      
        </TableHeader>                      
        <TableBody>                          
            {sortedBooksData.map((book, i) => (                              
                <TableRow key={i} className='bg-white hover:bg-light-300/40 transition-colors border-b-2 border-light-300'>                                  
                    <TableCell className="py-4 w-1/3 px-4 align-middle">                                      
                        <div className="flex flex-row gap-3 items-center">                                                                      
                            <BookCover coverImage={book.coverUrl!} coverColor={book.coverColor!} variant='extraSmall' />                                                                     
                            <h3 className='text-dark-500 text-sm text-bold whitespace-normal break-words leading-5 max-h-10 overflow-hidden'>{book.title}</h3>                                      
                        </div>                                  
                    </TableCell>                                                         
                    <TableCell className='text-dark-200 font-medium w-1/4 px-4 align-middle'>                                      
                        <div className="whitespace-normal break-words leading-5 max-h-10 overflow-hidden">{book.author}</div>                                  
                    </TableCell>                                  
                    <TableCell className='text-dark-200 font-medium w-1/6 px-4 align-middle'>                                      
                        <div className="whitespace-normal break-words leading-5 max-h-10 overflow-hidden">{book.genre}</div>                                  
                    </TableCell>                                  
                    <TableCell className='text-dark-200 font-medium w-1/6 px-4 align-middle'>                                      
                        <div className="whitespace-normal break-words leading-5 max-h-10 overflow-hidden">
                            {book.createdAt?.toLocaleDateString("en-US", {                                          
                                day: "numeric",                                          
                                month: "long",                                          
                                year: "numeric",                                      
                            })}
                        </div>                                  
                    </TableCell>                                  
                    <TableCell className='text-dark-200 font-medium w-1/12 px-4 align-middle'>                                      
                        <div className='flex flex-row gap-2 items-center'>                                            
                            <Link href={`/admin/books/${book.id}`}>                                                  
                               <Eye className='w-5 h-5 text-blue-100 cursor-pointer hover:text-blue-400' />                                    
                            </Link>                                            
                            <div  onClick={() => openDeleteConfirmation(book.id, book.title)} className='w-5 h-5 relative'>                                                  
                                <Image src="/icons/admin/trash.svg" alt="Delete" fill className='object-cover rounded-full' />                                             
                            </div>                                       
                        </div>                                  
                    </TableCell>                                                                                                                        
                </TableRow>                          
            ))}                      
        </TableBody>                  
    </Table>              
</div>

             {sortedBooksData .length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          <p className='text-lg font-medium'>No users found</p>
          <p className='text-sm mt-1'>Users will appear here once they register</p>
        </div>
      )}

       <ConfirmationDialog 
  isOpen={confirmation.isOpen}
  onClose={closeConfirmation}
  onConfirm={handleConfirmAction}
  isLoading={isLoading}
  title="Delete Book"
  description={`Are you sure you want to delete "${confirmation.title}" book? This action cannot be undone and will permanently remove all book data.`}
  confirmText="Delete Book"
  variant="destructive"
  icon="delete"
/>
      </div>
  )
}

export default BookManagement
