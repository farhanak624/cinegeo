import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This endpoint is called by Vercel Cron every 60 seconds
// Configure in vercel.json: { "crons": [{ "path": "/api/seats/release", "schedule": "* * * * *" }] }
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("seats")
      .update({ status: "available", held_by: null, held_until: null })
      .eq("status", "held")
      .lt("held_until", new Date().toISOString())
      .select("id");

    if (error) {
      console.error("Release expired holds error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      released: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Release expired holds error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
