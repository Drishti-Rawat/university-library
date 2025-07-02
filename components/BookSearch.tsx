'use client'
import { Search } from 'lucide-react';
import React from 'react'

interface BookSearchProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

const BookSearch: React.FC<BookSearchProps> = ({ onSearchChange, searchQuery }) => {
  return (
    <div className=" flex flex-col items-center justify-center px-6 lg:px-62  lg:mx-10 py-6">
      <div className="text-center max-w-7xl">
        <p className="text-glight-100 text-sm lg:text-lg uppercase tracking-wider mb-3">
          DISCOVER YOUR NEXT GREAT READ:
        </p>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Explore and Search for<br />
          <span className="text-primary">Any Book </span> In Our Library
        </h1>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="flex items-center bg-dark-300 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3">
            <Search className="text-primary mr-3" size={20} />
            <input
              type="text"
              placeholder="Search for books, authors, genres..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookSearch;