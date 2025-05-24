
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Question = {
  id: number
  title: string
  asked_by: string
  hidden: boolean
}

export default function AdminPage() {
  const [allowSubmission, setAllowSubmission] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [search, setSearch] = useState("")

  const fetchSettings = async () => {
    const { data } = await supabase.from("settings").select("*")
    const submissionSetting = data?.find((s) => s.key === "allow_submission")
    if (submissionSetting) setAllowSubmission(submissionSetting.value)
  }

  const fetchQuestions = async () => {
    const { data } = await supabase.from("questions").select("*").order("id", { ascending: false })
    if (data) setQuestions(data)
  }

  const toggleSubmission = async () => {
    const newValue = !allowSubmission
    await supabase.from("settings").update({ value: newValue }).eq("key", "allow_submission")
    setAllowSubmission(newValue)
  }

  const toggleQuestionHidden = async (id: number, currentHidden: boolean) => {
    await supabase.from("questions").update({ hidden: !currentHidden }).eq("id", id)
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, hidden: !currentHidden } : q))
    )
  }

  useEffect(() => {
    fetchSettings()
    fetchQuestions()
  }, [])

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Admin Control Panel</h1>

      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={allowSubmission}
            onChange={toggleSubmission}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-lg">Allow Question Submissions</span>
        </label>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full max-w-md p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-start">
            <div>
              <p className="text-xl font-semibold">{q.title}</p>
              <p className="text-sm text-gray-400 mt-1">From: {q.asked_by || "Anonymous"}</p>
            </div>
            <button
              onClick={() => toggleQuestionHidden(q.id, q.hidden)}
              className={`text-sm rounded px-3 py-1 ${
                q.hidden
                  ? "bg-green-700 hover:bg-green-600"
                  : "bg-yellow-700 hover:bg-yellow-600"
              }`}
            >
              {q.hidden ? "Show" : "Hide"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
