"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Database } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Contact page error:", error)
  }, [error])

  const getErrorMessage = (error: Error) => {
    if (error.message.includes("Failed to fetch")) {
      return "Unable to connect to the server. Please check your internet connection."
    }
    if (error.message.includes("403")) {
      return "Access denied. Please check Firebase security rules."
    }
    if (error.message.includes("503")) {
      return "Firebase service is temporarily unavailable. Please try again later."
    }
    return error.message
  }

  const getErrorIcon = (error: Error) => {
    if (error.message.includes("Firebase") || error.message.includes("database")) {
      return <Database className="w-6 h-6 text-destructive" />
    }
    return <AlertCircle className="w-6 h-6 text-destructive" />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              {getErrorIcon(error)}
            </div>
            <CardTitle className="text-xl">Something went wrong!</CardTitle>
            <CardDescription>We encountered an error while loading the problems data.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">{getErrorMessage(error)}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
