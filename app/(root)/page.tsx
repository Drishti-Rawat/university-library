

import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { sampleBooks } from "@/constants";

export default function Home() {
  return (
    <>
      <BookOverview   {...sampleBooks[0]} />
      <BookList 
      title ="Latest Books"
     
      books={sampleBooks}
      containerClassName="mt-28" 
      />
     
    </>
  );
}