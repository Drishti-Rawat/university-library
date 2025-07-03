'use client'
import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '../ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { getInitials } from '@/lib/utils'
import { IKImage } from 'imagekitio-next'
import config from '@/lib/config'
import Image from 'next/image'
import { ExternalLink, ExternalLinkIcon, Filter, Check, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ConfirmationDialog from './ConfirmationDialog'

interface UserManagementData extends AuthCredentails {
  borrowedBooksCount: number;
}

interface props {
  userData: UserManagementData[]
  onRoleEdit: (params: {userId: string, newRole: "ADMIN" | "USER"}) => void
  onDeleteUser: (userId: string) => void
}

interface ConfirmationState {
  isOpen: boolean
  type: 'delete' | 'roleChange' | null
  userId: string | null
  userName: string | null
  currentRole?: string
  newRole?: "ADMIN" | "USER"
}

type SortOrder = 'asc' | 'desc' | 'none'

const UserManagement = ({userData, onRoleEdit, onDeleteUser}: props) => {
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('none')
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    type: null,
    userId: null,
    userName: null
  })

  // Memoized sorted data
  const sortedUserData = useMemo(() => {
    if (sortOrder === 'none') return userData
    
    return [...userData].sort((a, b) => {
      const nameA = a.fullName?.toLowerCase() || ''
      const nameB = b.fullName?.toLowerCase() || ''
      
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB)
      } else {
        return nameB.localeCompare(nameA)
      }
    })
  }, [userData, sortOrder])

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

  const openDeleteConfirmation = (userId: string, userName: string) => {
    setConfirmation({
      isOpen: true,
      type: 'delete',
      userId,
      userName
    })
  }

  const openRoleChangeConfirmation = (userId: string, userName: string, currentRole: string, newRole: "ADMIN" | "USER") => {
    setConfirmation({
      isOpen: true,
      type: 'roleChange',
      userId,
      userName,
      currentRole,
      newRole
    })
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
      if (confirmation.type === 'delete') {
        await onDeleteUser(confirmation.userId)
      } else if (confirmation.type === 'roleChange' && confirmation.newRole) {
        await onRoleEdit({
          userId: confirmation.userId,
          newRole: confirmation.newRole as "ADMIN" | "USER"
        })
        setEditingRole(null)
      }
      closeConfirmation()
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = (userId: string, userName: string, currentRole: string, newRole: "ADMIN" | "USER") => {
    if (currentRole.toLowerCase() !== newRole.toLowerCase()) {
      openRoleChangeConfirmation(userId, userName, currentRole, newRole)
    }
    setEditingRole(null)
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-green-600 bg-green-50 hover:bg-green-100'
      case 'user':
        return 'text-pink-600 bg-pink-50 hover:bg-pink-100'
      default:
        return 'text-gray-600 bg-gray-50 hover:bg-gray-100'
    }
  }

  const getConfirmationProps = () => {
    switch (confirmation.type) {
      case 'delete':
        return {
          title: 'Delete User Account',
          description: `Are you sure you want to delete ${confirmation.userName}'s account? This action cannot be undone and will permanently remove all user data including borrowed books history.`,
          confirmText: 'Delete User',
          variant: 'destructive' as const,
          icon: 'delete' as const
        }
      case 'roleChange':
        return {
          title: 'Change User Role',
          description: `Are you sure you want to change ${confirmation.userName}'s role from ${confirmation.currentRole} to ${confirmation.newRole}? This will affect their access permissions immediately.`,
          confirmText: 'Change Role',
          variant: 'default' as const,
          icon: 'role' as const
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
              <TableHead className='font-semibold text-dark-700 py-4'>User</TableHead>
              <TableHead className='font-semibold text-dark-700'>Date Joined</TableHead>
              <TableHead className='font-semibold text-dark-700'>Role</TableHead>
              <TableHead className='font-semibold text-dark-700'>Books Borrowed</TableHead>
              <TableHead className='font-semibold text-dark-700'>University ID</TableHead>
              <TableHead className='font-semibold text-dark-700'>ID Card</TableHead>
              <TableHead className='font-semibold text-dark-700'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUserData.map((user, i) => (
              <TableRow key={i} className='bg-white hover:bg-light-300/40 transition-colors border-b-2 border-light-300'>
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
                
                <TableCell>
                  <DropdownMenu 
                    open={editingRole === user.id} 
                    onOpenChange={(open) => setEditingRole(open ? user.id! : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role?.toLowerCase()!)} flex items-center gap-2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                      >
                        {user.role}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-32 bg-white">
                      <DropdownMenuItem 
                        onClick={() => handleRoleChange(user.id!, user.fullName!, user.role!, 'USER')}
                        className="flex items-center justify-between"
                      >
                        <span className='text-pink-600 bg-pink-50 px-3 py-1 rounded-full'>User</span>
                        {user.role!.toLowerCase() === 'user' && <Check className='w-4 h-4 text-blue-600' />}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleRoleChange(user.id!, user.fullName!, user.role!, 'ADMIN')}
                        className="flex items-center justify-between"
                      >
                        <span className='text-green-600 bg-green-50 px-3 py-1 rounded-full'>Admin</span>
                        {user.role!.toLowerCase() === 'admin' && <Check className='w-4 h-4 text-green-600' />}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                
                <TableCell className='text-dark-200 font-medium'>
                  <span className='bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm font-medium'>
                    {user.borrowedBooksCount}
                  </span>
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
                
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openDeleteConfirmation(user.id!, user.fullName!)}
                    className='hover:bg-red-50 hover:text-red-600 p-2 rounded-lg transition-colors'
                  >
                    <Image src='/icons/admin/trash.svg' alt='delete' width={18} height={18} />
                  </Button>
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

export default UserManagement