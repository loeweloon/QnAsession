"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AskQuestion() {
  const router = useRouter()
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      return // Don't submit if title is empty
    }

    try {
      // In a real app, this would save to a database
      // For demo purposes, we'll use localStorage to simulate persistence
      const newQuestion = {
        id: Date.now(),
        title,
        category: "General",
        answers: 0,
        votes: 0,
        askedBy: "anonymous",
        timeAgo: "just now",
      }

      // Get existing questions or initialize empty array
      let existingQuestions = []
      const storedQuestions = localStorage.getItem("questions")

      if (storedQuestions) {
        existingQuestions = JSON.parse(storedQuestions)
      }

      // Add new question and save back to localStorage
      const updatedQuestions = [newQuestion, ...existingQuestions]
      localStorage.setItem("questions", JSON.stringify(updatedQuestions))

      // Redirect to home page after submission
      router.push("/")
    } catch (error) {
      console.error("Error saving question:", error)
      // In a real app, you would show an error message to the user
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>Provide details about your programming question to get the best answers</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Question Title</Label>
              <Input
                id="title"
                placeholder="e.g. How do I center a div with Flexbox?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Submit Question</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
