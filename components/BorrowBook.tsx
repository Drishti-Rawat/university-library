'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { borrowBook } from '@/lib/actions/book';

interface Props {
    userId: string;
    bookId: string;
    borrowingEligibility:{
        isEligible: boolean;
        message: string
    };
}

const BorrowBook = ({userId, bookId,borrowingEligibility:{isEligible, message}}:Props) => {
    const router = useRouter();
    const [borrowing,setBorrowing] = useState(false)
    const handleBorrow = async () =>{
        if(!isEligible) {
            toast.error(message)
            return
        }
        setBorrowing(true)
        try {
            const result = await borrowBook({userId, bookId});
           if(result.success){
            toast.success("Book borrowed successfully!");
            router.push('/my-profile');
           }
           else{
            toast.error(result.error || "An error occurred. Please try again.");
           }

        } catch (error) {
            console.log(error);
            toast.error("An error occurred. Please try again.");
        }
        finally{
            setBorrowing(false)
        }
    }
  return (
    <Button className='mt-4 min-h-14 w-fit bg-primary text-dark-100 hover:bg-primary/90 max-md:w-full' onClick={handleBorrow} disabled={borrowing}>
                <Image
                    src="/icons/book.svg"
                    alt="Book Icon"
                    width={20}
                    height={20}
                />
               <p className='font-bebas-neue text-xl text-dark-100'>{borrowing ? "Borrowing..." : "Borrow Book"}</p>
                </Button>
  )
}

export default BorrowBook
