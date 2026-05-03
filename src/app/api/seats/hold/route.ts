import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { seatId, userId } = await request.json();

    if (!seatId || !userId) {
      return NextResponse.json(
        { error: "Missing seatId or userId" },
        { status: 400 }
      );
    }

    // Use RPC for atomic transaction with row-level locking
    const { data, error } = await supabase.rpc("hold_seat", {
      p_seat_id: seatId,
      p_user_id: userId,
      p_hold_minutes: 10,
    });

    if (error) {
      console.error("Hold seat error:", error);
      return NextResponse.json(
        { error: "Failed to hold seat", details: error.message },
        { status: 409 }
      );
    }

    if (!data?.success) {
      return NextResponse.json(
        { error: data?.message || "Seat unavailable" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      held_until: data.held_until,
    });
  } catch (err) {
    console.error("Hold seat error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/*
-- Supabase RPC function to create:

CREATE OR REPLACE FUNCTION hold_seat(
  p_seat_id UUID,
  p_user_id UUID,
  p_hold_minutes INT DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seat RECORD;
  v_held_until TIMESTAMPTZ;
BEGIN
  -- Lock the seat row
  SELECT * INTO v_seat FROM seats WHERE id = p_seat_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Seat not found');
  END IF;

  IF v_seat.status != 'available' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Seat not available');
  END IF;

  v_held_until := now() + (p_hold_minutes || ' minutes')::INTERVAL;

  UPDATE seats
  SET status = 'held',
      held_by = p_user_id,
      held_until = v_held_until
  WHERE id = p_seat_id;

  RETURN jsonb_build_object(
    'success', true,
    'held_until', v_held_until
  );
END;
$$;
*/
