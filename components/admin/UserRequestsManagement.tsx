'use client'
import React, { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle, Cross, CrossIcon, ExternalLinkIcon, XCircle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { IKImage } from 'imagekitio-next'
import config from '@/lib/config'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import ConfirmationDialog from './ConfirmationDialog'
interface props{
    userRequests: AuthCredentails[],
    onApprove: (userId: string) => void
    onReject: (userId: string) => void
}

type SortOrder = 'asc' | 'desc' | 'none'
interface ConfirmationState {
  isOpen: boolean
  type: 'reject' | 'approve' | null
  userId: string | null
  userName: string | null
 
}


const UserRequestsManagement = ({userRequests , onApprove , onReject}:props) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>('none')
    const [confirmation, setConfirmation] = useState<ConfirmationState>({
        isOpen: false,
        type: null,
        userId: null,
        userName: null
      })
      const [isLoading, setIsLoading] = useState(false)


     const openRejectConfirmation = (userId: string, userName: string) => {
    setConfirmation({
      isOpen: true,
      type: 'reject',
      userId,
      userName
    })
  }


  const openApproveConfirmation = (userId: string, userName: string) => {
    setConfirmation({
      isOpen: true,
      type: 'approve',
      userId,
      userName
    })
  }
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

    const sortedUserData = useMemo(() => {
      if (sortOrder === 'none') return  userRequests
      
      return [...userRequests].sort((a, b) => {
        const nameA = a.fullName?.toLowerCase() || ''
        const nameB = b.fullName?.toLowerCase() || ''
        
        if (sortOrder === 'asc') {
          return nameA.localeCompare(nameB)
        } else {
          return nameB.localeCompare(nameA)
        }
      })
    }, [userRequests, sortOrder])

     const getConfirmationProps = () => {
    switch (confirmation.type) {
      case 'reject':
        return {
          title: 'Deny Account Request',
          description: `Denying this request will notify the user that they are not eligible due to unsuccessful ID Card verification.`,
          confirmText: 'Deny Request',
          variant: 'warning' as const,
          icon: 'warning' as const
        }
     case 'approve':
        return {
          title: 'Approve Account Request',
          description: `Approving this request will notify the user that their request has been approved.`,
          confirmText: 'Approve Request',
          variant: 'approve' as const,
          icon: 'custom' as const,
          customIcon: <CheckCircle className="w-8 h-8 text-white" /> // Use customIcon prop instead
        }
      default:
        return {
          title: '',
          description: '',
          confirmText: 'Confirm',
          variant: 'default' as const,
          icon: 'warning' as const
        }
    }
  }
 const closeConfirmation = () => {
    setConfirmation({
      isOpen: false,
      type: null,
      userId: null,
      userName: null
    })
  }

  const handleConfirmAction = async () => {
    if (!confirmation.userId || !confirmation.type) return

    setIsLoading(true)
    
    try {
      if (confirmation.type === 'reject') {
        await onReject(confirmation.userId)
      } else if (confirmation.type === 'approve' ) {
        await onApprove( confirmation.userId)
       
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
          <div className='flex flex-row justify-between items-center'>
        <div>
          <h2 className='text-lg font-bold text-dark-500'>User Management</h2>
          
        </div>
        
        {/* Alphabetical Filter Button */}
        <Button 
          onClick={handleSortToggle}
          className='bg-light-300 hover:bg-light-100/30 text-primary-admin px-4 py-2 font-semibold rounded-lg  cursor-pointer  flex items-center gap-2 transition-all'
        >
          {getSortText()}
          {getSortIcon()}
        </Button>
      </div>

       <div className='overflow-hidden'>
        <Table>
          <TableHeader>
            <TableRow className='bg-light-300 rounded-lg'>
              <TableHead className='font-semibold text-dark-700 py-4'>Name</TableHead>
              <TableHead className='font-semibold text-dark-700'>Date Joined</TableHead>
              <TableHead className='font-semibold text-dark-700'>University ID</TableHead>
              <TableHead className='font-semibold text-dark-700'>ID Card</TableHead>
              <TableHead className='font-semibold text-dark-700'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUserData.map((user, i) => (
              <TableRow key={i} className='bg-white hover:bg-light-300/40 transition-colors border-b-2 border-light-300 '>
                <TableCell className="py-4">
                  <div className="flex flex-row gap-3 items-center">
                    {user.profileImage ? (
                      <div className='h-12 w-12 relative'>
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
                    ) : (
                      <Avatar className='h-12 w-12'>
                        <AvatarFallback className='bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 text-lg font-semibold text-white'>
                          {getInitials(user.fullName!)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className='flex flex-col gap-0.5'>
                      <h3 className='text-dark-200 text-sm font-semibold'>{user.fullName}</h3>
                      <p className='text-gray-500 text-sm'>{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className='text-dark-200 font-medium'>
                  {user.createdAt?.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </TableCell>
                
                
                
        
                
                <TableCell className='text-dark-200 font-medium text-sm'>
                  {user.universityId}
                </TableCell>
                
                <TableCell>
                  <Link 
                    href={`${config.env.imagekit.urlEndpoint}/${user.universityCard}`} 
                    target='_blank' 
                    className='text-blue-600 hover:text-blue-800 flex flex-row gap-1 items-center font-medium transition-colors'
                  >
                    View Card
                    <ExternalLinkIcon className='w-4 h-4' />
                  </Link>
                </TableCell>
                
                <TableCell className=''>
                  <div className='flex flex-row gap-3 items-start justify-start'>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openApproveConfirmation(user.id!, user.fullName!)}
                      className='bg-green-100 hover:bg-green-100/80 text-green-800 font-bold px-4 py-3 rounded-md text-sm  transition-colors whitespace-nowrap'
                    >
                      Approve Account
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openRejectConfirmation(user.id!, user.fullName!)}
                      className=' bg-red-100  hover:bg-red-100/80 text-red-600 hover:text-red-700 '
                    >
                      <XCircle className='w-18 h-18' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedUserData.length === 0 && (
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
        {...getConfirmationProps()}
      />
      
    </div>
  )
}

export default UserRequestsManagement
