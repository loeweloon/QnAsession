"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// This would typically come from a database in a real application
type Question = {
  id: number
  title: string
  category: string
  answers: number
  votes: number
  askedBy: string
  timeAgo: string
}

export default function Home() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    router.push("/display")
  }, [router])

  // In a real app, this would fetch from an API or database
  useEffect(() => {
    try {
      // For demo purposes, we're checking localStorage to simulate persistence
      const savedQuestions = localStorage.getItem("questions")
      if (savedQuestions) {
        setQuestions(JSON.parse(savedQuestions))
      }
    } catch (error) {
      console.error("Error loading questions:", error)
      // In a real app, you would show an error message to the user
    }
  }, [])

  // Function to handle upvoting a question
  const handleUpvote = (id: number) => {
    try {
      const updatedQuestions = questions.map((question) =>
        question.id === id ? { ...question, votes: question.votes + 1 } : question,
      )

      setQuestions(updatedQuestions)
      localStorage.setItem("questions", JSON.stringify(updatedQuestions))
    } catch (error) {
      console.error("Error upvoting question:", error)
    }
  }

  // Function to handle deleting a question
  const handleDelete = (id: number) => {
    try {
      const updatedQuestions = questions.filter((question) => question.id !== id)
      setQuestions(updatedQuestions)
      localStorage.setItem("questions", JSON.stringify(updatedQuestions))
    } catch (error) {
      console.error("Error deleting question:", error)
    }
  }

  return null
}
