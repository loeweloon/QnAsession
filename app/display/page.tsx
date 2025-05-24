"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode.react"
import { Button } from "@/components/ui/button"

type Question = {
  id: number
  title: string
  asked_by: string
  timestamp: string
}

export default function DisplayPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

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
    fetchQuestions()
    const interval = setInterval(fetchQuestions, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 text-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Q&A Session</h1>
          <p className="text-sm text-gray-500">Questions from the audience</p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span>• {questions.length} question{questions.length !== 1 && "s"}</span>
            <span>• <span className="text-green-600">●</span> Online</span>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="w-[40vw] max-w-sm mx-auto">
              <QRCode
                value="https://qn-asession-m8ft.vercel.app/audience"
                size={600}
                style={{ width: "100%", height: "auto" }}
              />
            </div>

            <p className="text-sm mt-2 text-gray-700">Scan to ask questions</p>
            <p className="text-xs text-gray-500">Use your phone camera</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {questions.length === 0 ? (
          <div className="text-center mt-20 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <h2 className="text-xl font-semibold">No questions yet</h2>
            <p className="text-sm">Waiting for audience questions…</p>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="bg-white rounded-lg shadow p-4">
              <p className="text-lg font-medium">{q.title}</p>
              <p className="text-sm text-gray-500 mt-1">From: {q.asked_by || "Anonymous"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
