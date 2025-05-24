// File: app/admin/page.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [allowSubmission, setAllowSubmission] = useState(true)
  const [showQuestions, setShowQuestions] = useState(true)
  const [questions, setQuestions] = useState([])
  const [search, setSearch] = useState("")
  const [visibilityMap, setVisibilityMap] = useState<Record<number, boolean>>({})

  const fetchSettings = async () => {
    const { data } = await supabase.from("settings").select("key,value")
    if (!data) return
    const settings = Object.fromEntries(data.map((s) => [s.key, s.value]))
    setAllowSubmission(settings.allow_submission === true || settings.allow_submission === "true")
    setShowQuestions(settings.show_questions === true || settings.show_questions === "true")
  }

  const updateSetting = async (key: string, value: boolean) => {
    await supabase.from("settings").upsert({ key, value })
    fetchSettings()
  }

  const fetchQuestions = async () => {
    const res = await fetch("/api/questions")
    const data = await res.json()
    setQuestions(data)
    const visibility: Record<number, boolean> = {}
    data.forEach((q: any) => (visibility[q.id] = true))
    setVisibilityMap(visibility)
  }

  useEffect(() => {
    fetchSettings()
    fetchQuestions()
  }, [])

  const toggleQuestionVisibility = (id: number) => {
    setVisibilityMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredQuestions = questions.filter((q: any) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Admin Control Panel</h1>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-gray-800 p-4 rounded">
          <div>
            <p className="text-xl font-semibold">Allow Question Submissions</p>
            <p className="text-sm text-gray-400">Toggle to open/close the audience form</p>
          </div>
          <input
            type="checkbox"
            checked={allowSubmission}
            onChange={(e) => {
              setAllowSubmission(e.target.checked)
              updateSetting("allow_submission", e.target.checked)
            }}
            className="w-6 h-6"
          />
        </div>

        <div className="flex items-center justify-between bg-gray-800 p-4 rounded">
          <div>
            <p className="text-xl font-semibold">Show Questions on Display Page</p>
            <p className="text-sm text-gray-400">Toggle to show/hide questions on the projector</p>
          </div>
          <input
            type="checkbox"
            checked={showQuestions}
            onChange={(e) => {
              setShowQuestions(e.target.checked)
              updateSetting("show_questions", e.target.checked)
            }}
            className="w-6 h-6"
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full p-2 bg-gray-800 text-white rounded"
        />
        <div className="space-y-4">
          {filteredQuestions.map((q: any) => (
            <div key={q.id} className="bg-gray-800 p-4 rounded flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold text-white">{q.title}</p>
                <p className="text-sm text-gray-400">From: {q.asked_by || "Anonymous"}</p>
              </div>
              <button
                className={`text-sm ${visibilityMap[q.id] ? "text-yellow-400" : "text-green-400"}`}
                onClick={() => toggleQuestionVisibility(q.id)}
              >
                {visibilityMap[q.id] ? "Hide" : "Show"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
