// components/SearchBooks.tsx
'use client'

import { AlertTriangle, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BookCover from "./BookCover";
import BookList from "./BookList";

interface SearchBooksProps {
  searchResults: Book[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  onClearSearch?: () => void;
}

// Skeleton component for loading state
const BookSkeleton = () => (
  <div className="bg-dark-100 border border-dark-200 rounded-lg p-4 space-y-3 animate-pulse">
    <div className="flex space-x-4">
      <div className="w-16 h-20 bg-dark-200 rounded"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-dark-300 rounded w-3/4"></div>
        <div className="h-3 bg-dark-300 rounded w-1/2"></div>
        <div className="h-3 bg-dark-300 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

const SearchBooks = ({
  searchResults,
  isLoading,
  error,
  searchQuery,
  onClearSearch
}: SearchBooksProps) => {
  // Don't show anything if there's no search query
  if (!searchQuery.trim()) {
    return null;
  }

  // Loading state with skeleton cards
  if (isLoading) {
    return (
      <div className="w-full space-y-6 p--4">
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-primary">Searching...</h3>
          <p className="text-light-100">
            Finding books that match <span className="font-medium text-blue-600">"{searchQuery}"</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <BookSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state with better visual treatment
  if (error) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">Search Error</h3>
            <p className="text-gray-600 leading-relaxed">{error}</p>
          </div>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // No results found with better empty state and your SVG icon
  if (searchResults.length === 0) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center ">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="relative ">
            <div className="w-36 h-36 rounded-2xl flex items-center justify-center">
              <Image
                src="/icons/Mask group.svg"
                alt="No books found"
                
                fill
                className="opacity-60"
              />
            </div>
            
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-light-100">No Results Found</h3>
            <p className="text-light-100 leading-relaxed">
              We couldn't find any books matching{' '}
              <span className="font-semibold text-primary">"{searchQuery}"</span>
            </p>
            <div className="text-sm text-light-100 space-y-1">
              <p>Try using different keywords or check for typos.</p>
              <p>You can also browse our featured collections below.</p>
            </div>
          </div>
          
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Search
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show search results with improved header and styling
  return (
    <div className="w-full space-y-6">
      <BookList title={`Search Results (${searchResults.length})`} books={searchResults} />
    </div>
  );
};

export default SearchBooks;