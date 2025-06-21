import React from 'react';
import BookCard from './BookCard';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  return (
    <section className={cn("space-y-8", containerClassName)}>
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <h2 className="font-bebas-neue text-4xl xs:text-5xl text-white font-bold tracking-wide">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
      </div>

      {/* Books Grid - Consistent Layout */}
      {books.length > 0 ? (
        <ul className="book-list">
          {books.map((book) => (
            <BookCard key={`${book.id}-${book.title}`} {...book} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-dark-600/50 to-dark-700/30 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/5">
            <svg
              className="w-12 h-12 text-light-100/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <p className="text-light-100/60 text-lg text-center font-medium">
            No books available in this section
          </p>
          <p className="text-light-100/40 text-sm text-center mt-2 max-w-md">
            Check back later or explore other sections to discover new books
          </p>
        </div>
      )}
    </section>
  );
};

export default BookList;