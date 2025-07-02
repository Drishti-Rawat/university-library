'use client'

import BookSearch from "@/components/BookSearch";
import SearchBooks from "@/components/SearchBooks";
import { searchBooks } from "@/lib/actions/book";

import { useCallback, useEffect, useState, useTransition } from "react";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setError(null);
      
      startTransition(async () => {
        try {
          const results = await searchBooks(debouncedQuery);
          setSearchResults(results);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred while searching');
          setSearchResults([]);
        }
      });
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  }, []);
  console.log("Search Results:", searchResults);

  return (
    <div className="">
      <BookSearch 
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
      
      <SearchBooks
        searchResults={searchResults}
        isLoading={isPending}
        error={error}
        searchQuery={debouncedQuery}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
};

export default Page;