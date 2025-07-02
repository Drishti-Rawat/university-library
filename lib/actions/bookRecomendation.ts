'use server'

import { db } from "@/database/drizzle"
import { books } from "@/database/schema"
import { and, desc, eq, ne, sql } from "drizzle-orm"


export interface BookRecommendationParams {
  currentBookId: string
  currentGenre?: string
  currentRating?: number
  limit?: number
}
export async function getBookRecommendations({
  currentBookId,
  currentGenre,
  currentRating,
  limit = 6
}: BookRecommendationParams) {
  try {
    // Strategy 1: Same genre, high rating first
    const sameGenreBooks = currentGenre ? await db
      .select()
      .from(books)
      .where(
        and(
          eq(books.genre, currentGenre),
          ne(books.id, currentBookId)
        )
      )
      .orderBy(desc(books.rating))
      .limit(limit) : []

    // Strategy 2: High-rated books from different genres
    const highRatedBooks = await db
      .select()
      .from(books)
      .where(
        and(
          ne(books.id, currentBookId),
          sql`${books.rating} >= 4`
        )
      )
      .orderBy(desc(books.rating))
      .limit(limit)

    // Strategy 3: Popular books (high availability suggests popularity)
    const popularBooks = await db
      .select()
      .from(books)
      .where(ne(books.id, currentBookId))
      .orderBy(desc(books.totalCopies))
      .limit(limit)

    // Combine and deduplicate recommendations
    const allRecommendations = [
      ...sameGenreBooks,
      ...highRatedBooks,
      ...popularBooks
    ]

    // Remove duplicates by id
    const uniqueRecommendations = allRecommendations.filter(
      (book, index, self) => 
        index === self.findIndex(b => b.id === book.id)
    )

    // Prioritize recommendations based on multiple factors
    const scoredRecommendations = uniqueRecommendations.map(book => ({
      ...book,
      score: calculateRecommendationScore(book, currentGenre, currentRating)
    }))

    // Sort by score and return top recommendations
    return scoredRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...book }) => book) // Remove score from final result

  } catch (error) {
    console.error('Error fetching book recommendations:', error)
    return []
  }
}

function calculateRecommendationScore(
  book: any, 
  currentGenre?: string, 
  currentRating?: number
): number {
  let score = 0

  // Genre match bonus
  if (currentGenre && book.genre === currentGenre) {
    score += 3
  }

  // Rating bonus
  score += book.rating || 0

  // Similar rating bonus
  if (currentRating && book.rating) {
    const ratingDiff = Math.abs(book.rating - currentRating)
    score += Math.max(0, 2 - ratingDiff) // Bonus decreases with rating difference
  }

  // Availability bonus (suggests popularity)
  const availabilityRatio = book.availableCopies / book.totalCopies
  if (availabilityRatio > 0.5) {
    score += 1
  }

  return score
}