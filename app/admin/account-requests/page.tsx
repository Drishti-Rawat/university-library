import { auth } from '@/auth'
import UserManagement from '@/components/admin/UserManagement'
import UserRequestsManagement from '@/components/admin/UserRequestsManagement'
import { Button } from '@/components/ui/button'
import { db } from '@/database/drizzle'
import { books, borrowRecords, users } from '@/database/schema'
import { handleApproveAccount, handleRejectAccount } from '@/lib/admin/actions/users'

import { and, count, desc, eq, ne } from 'drizzle-orm'
import Link from 'next/link'
import React from 'react'

const UserManagementpage = async() => {
  const session = await auth()

  const userRequestsData = await db
    .select()
    .from(users)
    .where(
    and(
      ne(users.id, session?.user?.id!),
      eq(users.status, 'PENDING') // Only fetch approved users
    ))
    .groupBy(users.id) // Group by user ID only
     .orderBy(desc(users.createdAt)) // Order by most recent first
 
  
  console.log("usersData", userRequestsData);

 

  return (
    <div className='w-full rounded-2xl bg-white p-4 '>
      <UserRequestsManagement userRequests={userRequestsData} onApprove={handleApproveAccount} onReject={handleRejectAccount} />
    </div>
  )
}

export default UserManagementpage