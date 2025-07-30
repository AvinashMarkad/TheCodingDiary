import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Hash } from "lucide-react";

async function getData() {
  try {
    // Use relative URL for server-side fetching in Next.js
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    console.log("Fetching from:", `${baseUrl}/api/problems`);

    const res = await fetch(`${baseUrl}/api/problems`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const response = await res.json();
    console.log("API Response:", response);

    return response.problems || [];
  } catch (error) {
    console.error("Error fetching problems:", error);

    // Return empty array as fallback instead of throwing
    return [];
  }
}

// Updated type to match your Firebase data structure
type Problem = {
  id: string;
  problem_no: number;
  title: string;
  description: string;
  solution: string;
  created_at: string;
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function ProblemsContent() {
  const problems: Problem[] = await getData();

  if (!problems || problems.length === 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              No problems found in the database.
            </p>
            <p className="text-sm text-muted-foreground">This could mean:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• The Firebase database is empty</li>
              <li>• Theres a connection issue with Firebase</li>
              <li>• Firebase security rules are blocking access</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {problems.map((problem: Problem) => (
        <Card key={problem.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Badge
                variant="outline"
                className="flex items-center gap-1 shrink-0"
              >
                <Hash className="w-3 h-3" />
                {problem.problem_no}
              </Badge>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-tight">
                  {problem.title}
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                  {problem.description}
                </CardDescription>
              </div>
            </div>
            {problem.created_at && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Calendar className="w-3 h-3" />
                {new Date(problem.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Solution:
                </h4>
                <div className="bg-muted/50 rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                    {problem.solution}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Problems Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse coding problems from Firebase
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <ProblemsContent />
        </Suspense>
      </div>
    </div>
  );
}
