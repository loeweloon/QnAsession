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
    <div clas
