import { auth } from '@/auth'
import UserManagement from '@/components/admin/UserManagement'
import { Button } from '@/components/ui/button'
import { db } from '@/database/drizzle'
import { books, borrowRecords, users } from '@/database/schema'
import { handleDeleteUser, handleEditRole } from '@/lib/admin/actions/users'

import { and, count, desc, eq, ne } from 'drizzle-orm'
import Link from 'next/link'
import React from 'react'

const UserManagementpage = async() => {
  const session = await auth()

  const usersData = await db
    .select({
      id: users.id,
      fullName : users.fullName,
      email: users.email,
      role: users.role,
      status: users.status,
      universityCard: users.universityCard,
      universityId: users.universityId,
      createdAt: users.createdAt,
      profileImage: users.profileImage,
      lastActivityDate: users.lastActivityDate,
      borrowedBooksCount: count(borrowRecords.id)
    })
    .from(users)
    .leftJoin(borrowRecords, eq(users.id, borrowRecords.userId))
    .where(
    and(
      ne(users.id, session?.user?.id!),
      eq(users.status, 'APPROVED') // Only fetch approved users
    ))
    .groupBy(users.id) // Group by user ID only
 .orderBy(desc(users.createdAt)) // Order by most recent first
  
  console.log("usersData", usersData);

 

  return (
    <div className='w-full rounded-2xl bg-white p-4 '>
      <UserManagement userData={usersData} onRoleEdit={handleEditRole} onDeleteUser={handleDeleteUser} />
    </div>
  )
}

export default UserManagementpage