import { redirect } from 'next/navigation'

// This file handles requests to /page and redirects them to the homepage.
// It overrides any problematic page.tsx file at this path, fixing the build error.
export async function GET(request: Request) {
  redirect('/')
}
