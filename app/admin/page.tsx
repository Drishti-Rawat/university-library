import React from 'react'
import { BookOpen, Users, BookOpenCheck, Section } from 'lucide-react'

import { eq, ne, and, count, desc} from 'drizzle-orm'
import { db } from '@/database/drizzle';
import { books, borrowRecords, users } from '@/database/schema';
import { auth } from '@/auth';
import BorrowRequest from '@/components/admin/BorrowRequest';
import AccountRequest from '@/components/admin/AccountRequest';
import RecentAddedBooks from '@/components/admin/RecentAddedBooks';

const AdminDashboardpage = async () => {
  const session = await auth();
  
  // Fetch both stats and actual data in parallel
  const [
    userStats, 
    bookStats, 
    borrowStats,
    recentUsers,
    recentBooks,
    recentBorrows
  ] = await Promise.all([
    // Stats queries
    db.select({ count: count() })
      .from(users)
      .where(
        and(
          ne(users.id, session?.user?.id!),
        
        )
      ),
    
    db.select({ count: count() })
      .from(books),
    
    db.select({ count: count() })
      .from(borrowRecords),
     

    // Full data queries (recent 6-7 records)
    db.select()
      .from(users)
      .where(
        and(
          ne(users.id, session?.user?.id!),
          eq(users.status, "PENDING")
        )
      )
      .orderBy(desc(users.createdAt))
      .limit(6),

    db.select()
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(6),

    db.select()
      .from(borrowRecords)
     .innerJoin(users, eq(borrowRecords.userId, users.id))
.innerJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(desc(borrowRecords.borrowDate))
      .limit(3)
  ]);

  const Stat = [
    {
      label: "Total Books",
      count: bookStats[0]?.count || 0,
      icon: BookOpen,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      label: "Total Users", 
      count: userStats[0]?.count || 0,
      icon: Users,
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      label: "Borrowed Books",
      count: borrowStats[0]?.count || 0,
      icon: BookOpenCheck,
      gradient: "from-purple-500 to-purple-600"
    }
  ]

  console.log(recentBorrows);

  return (
    <>
      {/* Stats section */}
      <div className='w-full flex flex-wrap justify-evenly gap-4 mb-8'>
        {
          Stat.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className='bg-white rounded-xl p-5 space-y-5 flex-1 shadow-sm  hover:shadow-lg transition-all duration-300'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col gap-3'>
                    <p className='text-sm text-gray-600'>{stat.label}</p>
                    <p className='text-4xl font-bold text-gray-900 leading-none'>
                      {stat.count.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-md`}>
                    <IconComponent size={24} className='text-white' strokeWidth={2} />
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>

      {/* Data Tables Section */}
      <div className='flex flex-col lg:flex-row gap-5'>
        <div className='flex-[1.5]'>
          <section className='flex flex-col gap-4'>
            <BorrowRequest  borrowRecords={recentBorrows}/>

            <AccountRequest accountRequestsData={recentUsers} />

          </section>


        </div>

        <div className='flex-[1.5]'>
<RecentAddedBooks books={recentBooks} />

        </div>
        

      </div>
    </>
  )
}

export default AdminDashboardpage