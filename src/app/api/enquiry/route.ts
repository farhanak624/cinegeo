import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { movieId, userId, email } = await request.json();

    if (!movieId || !email) {
      return NextResponse.json(
        { error: "Missing movieId or email" },
        { status: 400 }
      );
    }

    // Insert enquiry (unique constraint handles duplicates)
    const { error: enquiryError } = await supabase
      .from("enquiries")
      .insert({
        user_id: userId || null,
        movie_id: movieId,
        email,
      });

    if (enquiryError) {
      if (enquiryError.code === "23505") {
        return NextResponse.json(
          { error: "Already enquired", alreadyEnquired: true },
          { status: 409 }
        );
      }
      throw enquiryError;
    }

    // Increment enquiry count
    const { error: updateError } = await supabase.rpc("increment_enquiry_count", {
      p_movie_id: movieId,
    });

    if (updateError) {
      console.error("Increment enquiry error:", updateError);
    }

    // TODO: Send enquiry confirmation email
    // await sendEnquiryConfirmation(email, movieTitle);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Enquiry error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/*
-- Supabase RPC function:

CREATE OR REPLACE FUNCTION increment_enquiry_count(p_movie_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE movies
  SET enquiry_count = enquiry_count + 1
  WHERE id = p_movie_id;
END;
$$;
*/
