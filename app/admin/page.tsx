
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

  useEffect(() => {
    fetchSettings()
  }, [])

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
            onChange={(e) => updateSetting("allow_submission", e.target.checked)}
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
            onChange={(e) => updateSetting("show_questions", e.target.checked)}
            className="w-6 h-6"
          />
        </div>
      </div>
    </div>
  )
}
