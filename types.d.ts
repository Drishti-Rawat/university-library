interface Book {
    id: string;
    title: string;
    author : string;
    genre: string;
    rating: number;
    totalCopies: number;
    availableCopies: number; 
    description: string;
    coverColor: string;
    coverUrl: string;
    videoUrl?: string;
    summary?: string;
    donwloadUrl?: string
    createdAt: Date | null
}

interface AuthCredentails {
   id?: string;
    fullName: string;
    universityId: number;
    universityCard: string;
    email: string;
    password?: string;
    status?: 'APPROVED' | 'PENDING' | 'REJECTED';
    profileImage?: string | null
    role?: 'ADMIN' | 'USER';
    createdAt: Date | null;


}

interface BookParams {
   
    title : string;
    author : string;
    genre : string;
    rating : number;
    totalCopies : number;
    
    description : string;
    coverColor : string;
    coverUrl : string;
    videoUrl : string;
    summary : string;
    downloadUrl? : string | null;
    
}

interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  dueDate: string;
  returnDate: string | null;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  createdAt: Date | null;
}


interface BorrowBookParams {
    bookId: string;
    userId: string;
}

