
"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode.react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Question = {
  id: number
  title: string
  asked_by: string
  timestamp: string
}

export default function DisplayPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [showQuestions, setShowQuestions] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchSettings = async () => {
    const { data } = await supabase.from("settings").select("key,value")
    if (!data) return
    const settings = Object.fromEntries(data.map((s) => [s.key, s.value]))
    setShowQuestions(settings.show_questions === true || settings.show_questions === "true")
  }

  const fetchQuestions = async () => {
    const res = await fetch("/api/questions")
    const data = await res.json()
    setQuestions(data)
    setLastUpdated(new Date())
  }

  useEffect(() => {
    const stored = localStorage.getItem("admin")
    if (stored === "1") {
      setIsAdmin(true)
    } else {
      const unlock = window.prompt("Enter admin pass (leave blank if not admin):")
      if (unlock === "jsat") {
        localStorage.setItem("admin", "1")
        setIsAdmin(true)
      } else {
        localStorage.setItem("admin", "0")
      }
    }
    fetchSettings()
    fetchQuestions()
    const interval = setInterval(() => {
      fetchSettings()
      fetchQuestions()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const deleteQuestion = async (id: number) => {
    await fetch("/api/questions/" + id, { method: "DELETE" })
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100">
      <div className="w-full md:w-[70%] p-6">
        <h1 className="text-5xl font-bold text-white">J Satine Q&A Session</h1>
        <p className="text-xl text-gray-400 mt-2">Live audience questions</p>
        <div className="text-md text-gray-500 mt-3 mb-6">
          Last updated: {lastUpdated.toLocaleTimeString()} • {questions.length} question{questions.length !== 1 && "s"}
        </div>

        {!showQuestions ? (
          <p className="text-gray-400">Questions are loading... Please be patient</p>
        ) : (
          <div className="space-y-6">
            {questions.length === 0 ? (
              <div className="text-gray-400 text-lg">No questions yet. Waiting for submissions…</div>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="bg-gray-800 rounded-lg p-4 shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-2xl font-semibold text-white">{q.title}</p>
                      <p className="text-sm text-gray-400 mt-1">From: {q.asked_by || "Anonymous"}</p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ✕ Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-[30%] p-6 flex flex-col items-center justify-start">
        <div className="bg-gray-800 p-6 rounded-xl shadow text-center w-full">
          <div className="w-full">
            <QRCode
              value="https://qn-asession.vercel.app/audience"
              size={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <p className="text-lg mt-4 font-medium text-white">Scan to ask questions</p>
          <p className="text-sm text-gray-400">https://qn-asession.vercel.app/audience</p>
        </div>
      </div>
    </div>
  )
}
