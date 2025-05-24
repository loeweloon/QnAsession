"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode.react"

type Question = {
  id: number
  title: string
  asked_by: string
  timestamp: string
}

export default function DisplayPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions")
      const data = await res.json()
      setQuestions(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Failed to fetch questions", err)
    }
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

    fetchQuestions()
    const interval = setInterval(fetchQuestions, 10000)
    return () => clearInterval(interval)
  }, [])

  const deleteQuestion = async (id: number) => {
    await fetch("/api/questions/" + id, { method: "DELETE" })
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-900 text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-5xl font-bold text-white">J Satine Purchasers Q&A Session</h1>
          <p className="text-xl text-gray-400 mt-2">Questions from the audience</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-lg text-gray-400">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span>• {questions.length} question{questions.length !== 1 && "s"}</span>
            <span>• <span className="text-green-500">●</span> Online</span>
          </div>
        </div>
        <div className="mt-8 md:mt-0">
          <div className="bg-gray-800 rounded-lg shadow p-6 text-center animate-fade-in">
            <div className="w-[45vw] max-w-xl mx-auto">
              <QRCode
                value="https://qn-asession.vercel.app/audience"
                size={800}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <p className="text-lg mt-4 text-gray-200 font-medium">Scan to ask questions</p>
            <p className="text-md text-gray-400 mt-1">https://qn-asession.vercel.app/audience</p>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {questions.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <h2 className="text-2xl font-semibold text-gray-300">No questions yet</h2>
            <p className="text-lg text-gray-500">Waiting for audience questions…</p>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-semibold text-white">{q.title}</p>
                  <p className="text-md text-gray-400 mt-2">From: {q.asked_by || "Anonymous"}</p>
                </div>
                {isAdmin && (
                  <button
                    className="text-red-400 hover:text-red-300 text-sm mt-1"
                    onClick={() => deleteQuestion(q.id)}
                  >
                    ✕ Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fade-in 1s ease-in-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
