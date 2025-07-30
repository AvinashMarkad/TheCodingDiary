"use client";
import { useState } from "react";
import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function ProblemForm() {
  const [formData, setFormData] = useState({
    problem_no: "",
    title: "",
    description: "",
    solution: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicateChecking, setIsDuplicateChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check for duplicates when problem_no changes
    if (name === "problem_no") {
      const timeoutId = setTimeout(() => checkDuplicate(value), 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const checkDuplicate = async (problemNo: string) => {
    if (!problemNo) {
      setIsDuplicate(false);
      return;
    }

    setIsDuplicateChecking(true);
    try {
      const res = await fetch(`/api/problems?check=${problemNo}`);
      const data = await res.json();
      setIsDuplicate(data.exists);
    } catch (error) {
      console.error("Error checking duplicate:", error);
    } finally {
      setIsDuplicateChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Problem added successfully!");
        setIsSuccess(true);
        setFormData({
          problem_no: "",
          title: "",
          description: "",
          solution: "",
        });
      } else {
        // Handle specific error codes
        if (res.status === 409) {
          setMessage(
            `Problem #${formData.problem_no} already exists. Please use a different problem number.`
          );
        } else if (res.status === 400) {
          setMessage("Please fill in all required fields.");
        } else {
          setMessage(`Error: ${data.error || "Failed to save problem"}`);
        }
        setIsSuccess(false);
      }
    } catch {
      setMessage("Failed to submit. Please check your connection.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Add Problem to Firebase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="problem_no">Problem Number</Label>
                <div className="relative">
                  <Input
                    id="problem_no"
                    type="number"
                    name="problem_no"
                    value={formData.problem_no}
                    onChange={handleChange}
                    placeholder="Enter problem number"
                    required
                    min="1"
                    className={isDuplicate ? "border-red-500" : ""}
                  />
                  {isDuplicateChecking && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-gray-400" />
                  )}
                </div>
                {isDuplicate && (
                  <p className="text-sm text-red-600">
                    Problem #{formData.problem_no} already exists
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter problem title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter problem description"
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution">Solution</Label>
                <Textarea
                  id="solution"
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  placeholder="Enter solution"
                  required
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Problem"
                )}
              </Button>
            </form>

            {message && (
              <Alert
                className={`mt-4 ${
                  isSuccess
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription
                  className={isSuccess ? "text-green-800" : "text-red-800"}
                >
                  {message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
