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
    fullName: string;
    universityId: number;
    universityCard: string;
    email: string;
    password: string;
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
    downloadUrl? : string;
    
}


interface BorrowBookParams {
    bookId: string;
    userId: string;
}