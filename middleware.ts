

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Option 1: Export as 'middleware' function
export function middleware(request: NextRequest) {
  // // Your middleware logic here
  // console.log('Middleware running for:', request.url)
  
  // // Example: Add custom headers
  // const response = NextResponse.next()
  // response.headers.set('x-custom-header', 'middleware-processed')
  
  // return response
}