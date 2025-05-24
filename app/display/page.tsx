
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Question = {
  id: number
  title: string
  askedBy: string
  votes: number
  timestamp: number
  timeAgo: string
}

export default function DisplayPage() {
  const [questions, setQuestions] = useState<Question[]>([])

  const fetchQuestions = async () => {
    const res = await fetch("/api/questions")
    const data = await res.json()
    setQuestions(data.reverse())
  }

  const deleteQuestion = async (id: number) => {
    await fetch("/api/questions/" + id, { method: "DELETE" })
    fetchQuestions()
  }

  useEffect(() => {
    fetchQuestions()
    const interval = setInterval(fetchQuestions, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      {questions.map((q) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle>{q.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between text-sm text-muted-foreground">
            <div>From: {q.askedBy || "Anonymous"}</div>
            <Button size="sm" variant="destructive" onClick={() => deleteQuestion(q.id)}>
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
