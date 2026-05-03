import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "CineGeo <noreply@cinegeo.ge>";

export async function sendEnquiryConfirmation(email: string, movieTitle: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `We'll notify you when ${movieTitle} opens for booking`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #F2F0EB; padding: 40px; text-align: center;">
        <h1 style="color: #E8212B; font-size: 32px; margin-bottom: 16px;">🎬 CineGeo</h1>
        <p style="font-size: 18px; margin-bottom: 8px;">Thank you for your interest in</p>
        <h2 style="font-size: 28px; color: #F2F0EB;">${movieTitle}</h2>
        <p style="color: #9A9890; margin-top: 16px;">We'll send you a notification as soon as booking opens. Stay tuned!</p>
      </div>
    `,
  });
}

export async function sendBookingOpened(
  emails: string[],
  movieTitle: string,
  screeningDate: string,
  bookingUrl: string
) {
  return resend.batch.send(
    emails.map((email) => ({
      from: FROM_EMAIL,
      to: email,
      subject: `🎬 ${movieTitle} — Booking is now open!`,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #F2F0EB; padding: 40px; text-align: center;">
          <h1 style="color: #E8212B; font-size: 32px;">🎬 CineGeo</h1>
          <h2 style="font-size: 24px; margin: 16px 0;">${movieTitle}</h2>
          <p style="font-size: 16px; color: #9A9890;">Screening on ${screeningDate}</p>
          <a href="${bookingUrl}" style="display: inline-block; margin-top: 24px; background: #E8212B; color: white; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; font-size: 13px;">Book Now</a>
        </div>
      `,
    }))
  );
}

export async function sendBookingConfirmation(
  email: string,
  bookingDetails: {
    movieTitle: string;
    date: string;
    time: string;
    theater: string;
    seats: string;
    total: string;
    qrCode: string;
    ticketUrl: string;
  }
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your CineGeo ticket — ${bookingDetails.movieTitle}`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #F2F0EB; padding: 40px; text-align: center;">
        <h1 style="color: #E8212B; font-size: 32px;">🎬 Booking Confirmed!</h1>
        <div style="background: #111111; border-radius: 16px; padding: 32px; margin: 24px auto; max-width: 400px; text-align: left;">
          <h2 style="font-size: 22px; margin-bottom: 16px;">${bookingDetails.movieTitle}</h2>
          <p style="color: #9A9890; margin: 8px 0;">📅 ${bookingDetails.date}</p>
          <p style="color: #9A9890; margin: 8px 0;">🕐 ${bookingDetails.time}</p>
          <p style="color: #9A9890; margin: 8px 0;">🎭 ${bookingDetails.theater}</p>
          <p style="color: #9A9890; margin: 8px 0;">💺 ${bookingDetails.seats}</p>
          <p style="font-size: 20px; font-weight: 700; margin-top: 16px; color: #E8212B;">${bookingDetails.total}</p>
        </div>
        <a href="${bookingDetails.ticketUrl}" style="display: inline-block; margin-top: 16px; background: #E8212B; color: white; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; font-size: 13px;">View Ticket</a>
      </div>
    `,
  });
}

export async function sendHoldExpired(email: string, movieTitle: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your seats for ${movieTitle} were released`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #F2F0EB; padding: 40px; text-align: center;">
        <h1 style="color: #E8212B; font-size: 32px;">⏰ Hold Expired</h1>
        <p style="font-size: 16px; margin: 16px 0;">Your seat hold for <strong>${movieTitle}</strong> has expired and the seats have been released.</p>
        <p style="color: #9A9890;">Don't worry — you can try booking again!</p>
      </div>
    `,
  });
}

export async function sendBookingCancelled(
  email: string,
  movieTitle: string,
  refundAmount: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Booking cancelled — ${movieTitle}`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #F2F0EB; padding: 40px; text-align: center;">
        <h1 style="color: #E8212B; font-size: 32px;">Booking Cancelled</h1>
        <p style="font-size: 16px; margin: 16px 0;">Your booking for <strong>${movieTitle}</strong> has been cancelled.</p>
        <p style="color: #9A9890;">A refund of <strong>${refundAmount}</strong> will be processed shortly.</p>
      </div>
    `,
  });
}

export async function sendAdminPrebook(
  email: string,
  details: { movieTitle: string; date: string; time: string; seats: string; ticketUrl: string }
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your seat has been reserved — ${details.movieTitle}`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #F2F0EB; padding: 40px; text-align: center;">
        <h1 style="color: #C9A84C; font-size: 32px;">🌟 Seat Reserved</h1>
        <div style="background: #111111; border-radius: 16px; padding: 32px; margin: 24px auto; max-width: 400px; text-align: left;">
          <h2 style="font-size: 22px; margin-bottom: 16px;">${details.movieTitle}</h2>
          <p style="color: #9A9890;">📅 ${details.date} · 🕐 ${details.time}</p>
          <p style="color: #9A9890;">💺 ${details.seats}</p>
        </div>
        <a href="${details.ticketUrl}" style="display: inline-block; margin-top: 16px; background: #C9A84C; color: #0a0a0a; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600;">View Your Ticket</a>
      </div>
    `,
  });
}
