import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("API Route: POST /api/problems called")

    const body = await request.json()
    console.log("Request body:", body)

    const { problem_no, title, description, solution } = body

    // Validate required fields
    if (!problem_no || !title || !description || !solution) {
      console.log("Validation failed: Missing required fields")
      return NextResponse.json({ error: "All fields are required." }, { status: 400 })
    }

    console.log("Checking for duplicate problem number:", problem_no)

    // Check if problem number already exists
    const problemsRef = collection(db, "problems")
    const q = query(problemsRef, where("problem_no", "==", Number(problem_no)))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      console.log("Duplicate problem number found")
      return NextResponse.json({ error: "Problem number already exists." }, { status: 409 })
    }

    // Create new problem document
    const newProblem = {
      problem_no: Number(problem_no),
      title: title.trim(),
      description: description.trim(),
      solution: solution.trim(),
      created_at: new Date().toISOString(),
    }

    console.log("Creating new problem:", newProblem)

    const docRef = await addDoc(collection(db, "problems"), newProblem)

    console.log("Problem created successfully with ID:", docRef.id)

    return NextResponse.json(
      {
        message: "Problem added successfully",
        id: docRef.id,
        problem: newProblem,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Firebase Error:", error)
    if (typeof error === "object" && error !== null && "code" in error) {
      
      console.error("Error code:", error.code)
      
      if ("message" in error && typeof error.message === "string") {
        console.error("Error message:", error.message)
      }
    }

    // Handle specific Firebase errors
    if (typeof error === "object" && error !== null && "code" in error) {
      
      if (error.code === "permission-denied") {
        return NextResponse.json({ error: "Permission denied. Check Firebase security rules." }, { status: 403 })
      }
      
      if (error.code === "unavailable") {
        return NextResponse.json({ error: "Firebase service is temporarily unavailable." }, { status: 503 })
      }
    }

    return NextResponse.json(
      {
        error: "Failed to save problem",
        details:
          process.env.NODE_ENV === "development" && typeof error === "object" && error !== null && "message" in error
            
            ? error.message
            : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkProblemNo = searchParams.get("check")

    if (checkProblemNo) {
      console.log("Checking if problem number exists:", checkProblemNo)
      const problemsRef = collection(db, "problems")
      const q = query(problemsRef, where("problem_no", "==", Number(checkProblemNo)))
      const querySnapshot = await getDocs(q)

      return NextResponse.json({ exists: !querySnapshot.empty }, { status: 200 })
    }

    // Fetch all problems
    console.log("Fetching all problems")
    const problemsRef = collection(db, "problems")
    const querySnapshot = await getDocs(problemsRef)

    interface Problem {
      id: string
      problem_no: number
      title: string
      description: string
      solution: string
      created_at: string
    }
    const problems: Problem[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      problems.push({
        id: doc.id,
        problem_no: data.problem_no,
        title: data.title,
        description: data.description,
        solution: data.solution,
        created_at: data.created_at,
      })
    })

    // Sort by problem number
    problems.sort((a, b) => a.problem_no - b.problem_no)
    console.log("Found problems:", problems.length)

    return NextResponse.json({ problems }, { status: 200 })
  } catch (error) {
    console.error("Firebase Error:", error)
    return NextResponse.json({ error: "Failed to fetch problems" }, { status: 500 })
  }
}
