"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUp, ArrowDown } from "lucide-react"

export default function QuestionDetail({ params }: { params: { id: string } }) {
  const [newAnswer, setNewAnswer] = useState("")

  // This would typically come from a database based on the ID
  const question = {
    id: Number.parseInt(params.id),
    title: "How do I create a React component?",
    description:
      "I'm new to React and trying to understand the basics of component creation. I've read the documentation but I'm still confused about the difference between functional and class components. Can someone explain with examples?",
    category: "React",
    votes: 12,
    askedBy: "user123",
    askedByAvatar: "U",
    timeAgo: "2 hours ago",
  }

  // This would typically come from a database
  const answers = [
    {
      id: 1,
      content:
        "Functional components are the modern way to write React components. Here's an example:\n\n```jsx\nfunction MyComponent(props) {\n  return <div>Hello {props.name}</div>;\n}\n```\n\nClass components are the older way:\n\n```jsx\nclass MyComponent extends React.Component {\n  render() {\n    return <div>Hello {this.props.name}</div>;\n  }\n}\n```\n\nFunctional components are preferred in modern React, especially with hooks.",
      votes: 8,
      answeredBy: "reactexpert",
      answeredByAvatar: "R",
      timeAgo: "1 hour ago",
    },
    {
      id: 2,
      content:
        "To add to the above answer, here are some key differences:\n\n1. Functional components are simpler and more concise\n2. Class components have lifecycle methods\n3. Functional components use hooks for state and side effects\n4. Class components use this.state and this.setState()\n\nIf you're just starting, I recommend learning functional components with hooks.",
      votes: 5,
      answeredBy: "devguru",
      answeredByAvatar: "D",
      timeAgo: "45 minutes ago",
    },
  ]

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to a database
    console.log({ questionId: question.id, content: newAnswer })
    setNewAnswer("")
  }

  return (
    <main className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            ← Back to Questions
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{question.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <span>Asked by {question.askedBy}</span>
                <span>•</span>
                <span>{question.timeAgo}</span>
              </CardDescription>
            </div>
            <Badge variant="outline">{question.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowUp className="h-4 w-4" />
              </Button>
              <span className="font-medium">{question.votes}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            <div className="prose max-w-none">
              <p>{question.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{answers.length} Answers</h2>

        {answers.map((answer) => (
          <Card key={answer.id} className="mb-4">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">{answer.votes}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{answer.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{answer.answeredByAvatar}</AvatarFallback>
                    </Avatar>
                    <span>{answer.answeredBy}</span>
                    <span>•</span>
                    <span>{answer.timeAgo}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Answer</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmitAnswer}>
          <CardContent>
            <Textarea
              placeholder="Write your answer here..."
              className="min-h-[150px]"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              required
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Post Your Answer</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
