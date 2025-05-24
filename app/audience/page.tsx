// File: app/audience/page.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AudiencePage() {
  const [isClosed, setIsClosed] = useState(false)
  const [question, setQuestion] = useState("")
  const [name, setName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const checkSetting = async () => {
      const { data } = await supabase.from("settings").select("key, value").eq("key", "allow_submission").single()
      if (data?.value === false || data?.value === "false") {
        setIsClosed(true)
      }
    }
    checkSetting()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!question) return
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: question, asked_by: name || "Anonymous" })
    })
    setSubmitted(true)
  }

  if (isClosed) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Q&A Session Closed</h1>
          <p className="text-lg text-gray-400">This Q&A session is no longer accepting new questions. Thank you for participating!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
      {submitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">✅ Question submitted!</h2>
          <p className="text-gray-400 mt-2">Thank you for your question. It will appear on the screen soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <h1 className="text-3xl font-bold mb-4">Submit your question</h1>
          <textarea
            placeholder="Type your question..."
            className="w-full p-3 rounded bg-gray-800 text-white"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your name (optional)"
            className="w-full p-3 rounded bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  )
}
