import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { seatIds, screeningId, guestName, guestEmail, markAsPaid } =
      await request.json();

    if (!seatIds?.length || !screeningId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get seat info
    const { data: seats, error: seatError } = await supabase
      .from("seats")
      .select("*")
      .in("id", seatIds);

    if (seatError || !seats?.length) {
      return NextResponse.json(
        { error: "Seats not found" },
        { status: 404 }
      );
    }

    // Check all are available or held
    const unavailable = seats.filter(
      (s) => s.status === "booked" || s.status === "blocked"
    );
    if (unavailable.length > 0) {
      return NextResponse.json(
        { error: "Some seats are not available" },
        { status: 409 }
      );
    }

    const qrCode = crypto.randomUUID();
    const seatData = seats.map((s) => ({
      seat_id: s.id,
      row: s.row,
      number: s.number,
      type: s.type,
      price: s.price,
    }));
    const total = seats.reduce((sum, s) => sum + Number(s.price), 0);

    // Update seats to booked
    const { error: updateError } = await supabase
      .from("seats")
      .update({ status: "booked" })
      .in("id", seatIds);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update seats" },
        { status: 500 }
      );
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        screening_id: screeningId,
        seats: seatData,
        total_amount: total,
        payment_status: markAsPaid ? "confirmed" : "pending",
        qr_code: qrCode,
        booked_by: "admin",
        guest_name: guestName || null,
        guest_email: guestEmail || null,
      })
      .select()
      .single();

    if (bookingError) {
      // Rollback seats
      await supabase
        .from("seats")
        .update({ status: "available" })
        .in("id", seatIds);

      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // TODO: Send email to guest if guestEmail provided
    // if (guestEmail) await sendAdminPrebook(guestEmail, { ... });

    return NextResponse.json({ success: true, booking });
  } catch (err) {
    console.error("Admin prebook error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
