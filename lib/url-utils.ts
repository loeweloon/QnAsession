import type { Question } from "@/types/question"

// Safe base64 encoding that works in all environments
function safeBase64Encode(str: string): string {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    try {
      return btoa(str)
    } catch (e) {
      console.error("btoa encoding error:", e)
    }
  }

  // Fallback for non-browser environments or if btoa fails
  // This is a simple base64 encoding that works in all environments
  return Buffer.from(str).toString("base64")
}

// Safe base64 decoding that works in all environments
function safeBase64Decode(str: string): string {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    try {
      return atob(str)
    } catch (e) {
      console.error("atob decoding error:", e)
    }
  }

  // Fallback for non-browser environments or if atob fails
  try {
    return Buffer.from(str, "base64").toString()
  } catch (e) {
    console.error("Buffer decoding error:", e)
    return ""
  }
}

// Compress and encode questions for URL
export function encodeQuestionsToUrl(questions: Question[]): string {
  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      return ""
    }

    // Simplify the questions to reduce URL size
    const simplifiedQuestions = questions.map((q) => ({
      id: q.id || Date.now(),
      title: q.title || "",
      votes: q.votes || 0,
      askedBy: q.askedBy || "anonymous",
      timeAgo: q.timeAgo || "just now",
    }))

    // Convert to JSON string
    const jsonString = JSON.stringify(simplifiedQuestions)

    // Encode to base64 to make it URL-safe
    const base64Encoded = safeBase64Encode(jsonString)

    return encodeURIComponent(base64Encoded)
  } catch (error) {
    console.error("Error encoding questions:", error)
    return ""
  }
}

// Decode questions from URL
export function decodeQuestionsFromUrl(encodedString: string): Question[] {
  try {
    if (!encodedString) {
      return []
    }

    // Decode from URL
    const decodedString = decodeURIComponent(encodedString)

    // Decode from base64
    const jsonString = safeBase64Decode(decodedString)

    if (!jsonString) {
      return []
    }

    // Parse JSON
    const parsedQuestions = JSON.parse(jsonString)

    // Ensure it's an array and add any missing properties
    if (Array.isArray(parsedQuestions)) {
      return parsedQuestions.map((q) => ({
        id: q.id || Date.now(),
        title: q.title || "",
        category: q.category || "General",
        answers: q.answers || 0,
        votes: q.votes || 0,
        askedBy: q.askedBy || "anonymous",
        timeAgo: q.timeAgo || "unknown time",
      }))
    }

    return []
  } catch (error) {
    console.error("Error decoding questions:", error)
    return []
  }
}
