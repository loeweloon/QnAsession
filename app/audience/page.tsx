
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from "lucide-react"

export default function AudiencePage() {
  const [title, setTitle] = useState("")
  const [askedBy, setAskedBy] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!title) return
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, askedBy }),
    })
    setSubmitted(true)
    setTitle("")
    setAskedBy("")
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Submit Your Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Your Name (optional)</Label>
          <Input value={askedBy} onChange={(e) => setAskedBy(e.target.value)} className="mb-4" />

          <Label>Your Question</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSubmit} disabled={submitted}>
            {submitted ? "Submitted!" : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
