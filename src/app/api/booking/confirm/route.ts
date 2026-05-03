import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { screening_id, user_id, seats } = paymentIntent.metadata;

    try {
      const seatData = JSON.parse(seats);
      const seatIds = seatData.map((s: { seat_id: string }) => s.seat_id);
      const qrCode = crypto.randomUUID();

      // Update seats to booked
      const { error: seatError } = await supabase
        .from("seats")
        .update({ status: "booked", held_by: user_id })
        .in("id", seatIds);

      if (seatError) {
        console.error("Error updating seats:", seatError);
        return NextResponse.json(
          { error: "Failed to update seats" },
          { status: 500 }
        );
      }

      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id,
          screening_id,
          seats: seatData,
          total_amount: paymentIntent.amount / 100,
          payment_status: "confirmed",
          payment_intent_id: paymentIntent.id,
          qr_code: qrCode,
          booked_by: "user",
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Error creating booking:", bookingError);
        return NextResponse.json(
          { error: "Failed to create booking" },
          { status: 500 }
        );
      }

      // TODO: Send confirmation email via Resend
      // await sendBookingConfirmation(userEmail, { ... });

      console.log("Booking confirmed:", booking.id);
    } catch (err) {
      console.error("Error processing payment:", err);
      return NextResponse.json(
        { error: "Processing error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
