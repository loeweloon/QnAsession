
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
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [search, setSearch] = useState("")

  const fetchQuestions = async () => {
    const { data } = await supabase.from("questions").select("*").order("id", { ascending: false })
    if (data) setQuestions(data)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const updateVisibility = async (hide: boolean) => {
    await supabase.from("questions").update({ hidden: hide }).in("id", selectedIds)
    setQuestions((prev) =>
      prev.map((q) => selectedIds.includes(q.id) ? { ...q, hidden: hide } : q)
    )
    setSelectedIds([]) // Clear selection
  }

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Admin Control Panel</h1>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full max-w-md p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <div className="mb-4 flex gap-4">
        <button
          disabled={selectedIds.length === 0}
          onClick={() => updateVisibility(false)}
          className="bg-green-700 hover:bg-green-600 text-sm px-4 py-2 rounded disabled:opacity-40"
        >
          Show Selected ({selectedIds.length})
        </button>
        <button
          disabled={selectedIds.length === 0}
          onClick={() => updateVisibility(true)}
          className="bg-yellow-700 hover:bg-yellow-600 text-sm px-4 py-2 rounded disabled:opacity-40"
        >
          Hide Selected ({selectedIds.length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-gray-800 p-4 rounded shadow flex justify-between items-start"
          >
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(q.id)}
                  onChange={() => toggleSelect(q.id)}
                />
                <div>
                  <p className="text-xl font-semibold">{q.title}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    From: {q.asked_by || "Anonymous"}{" "}
                    {q.hidden && <span className="text-yellow-400">(Hidden)</span>}
                  </p>
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
