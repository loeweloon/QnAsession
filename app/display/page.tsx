
"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode.react"
import { supabase } from "@/lib/supabase"

type Question = {
  id: number
  title: string
  asked_by: string
  timestamp: string
  hidden: boolean
}

export default function DisplayPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isAdmin, setIsAdmin] = useState(false)

  const fetchQuestions = async () => {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("hidden", false)
      .order("id", { ascending: false })
    if (data) {
      setQuestions(data)
      setLastUpdated(new Date())
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-100">
      {/* Left: 70% */}
      <div className="w-full md:w-[70%] p-6">
        <h1 className="text-5xl font-bold text-white">J Satine Q&A Session</h1>
        <p className="text-xl text-gray-400 mt-2">Live audience questions</p>
        <div className="text-md text-gray-500 mt-3 mb-6">
          Last updated: {lastUpdated.toLocaleTimeString()} • {questions.length} question{questions.length !== 1 && "s"}
        </div>

        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center mt-20 text-gray-400 text-xl">
              Questions are loading... Please be patient.
            </div>
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
                      className="text-red-400 hover:text-red-300 text-xs"
                      onClick={async () => {
                        await supabase.from("questions").delete().eq("id", q.id)
                        setQuestions((prev) => prev.filter((x) => x.id !== q.id))
                      }}
                    >
                      ✕ Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: 30% */}
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
