
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(_: Request, context: any) {
  const id = parseInt(context.params.id)
  const { error } = await supabase.from("questions").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
