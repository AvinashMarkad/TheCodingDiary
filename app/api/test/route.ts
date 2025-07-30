import { NextResponse } from "next/server"

// Simple test endpoint to verify API routes are working
export async function GET() {
  return NextResponse.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
  })
}
