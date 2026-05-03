-- ═══════════════════════════════════════════════════════════
-- CineGeo — Full Database Schema
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enums ────────────────────────────────────────────────
CREATE TYPE movie_status AS ENUM ('draft', 'enquiry', 'booking_open', 'archived');
CREATE TYPE seat_type AS ENUM ('standard', 'vip', 'blocked', 'empty');
CREATE TYPE seat_status AS ENUM ('available', 'held', 'booked', 'blocked');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'refunded', 'cancelled');
CREATE TYPE booked_by_type AS ENUM ('user', 'admin');

-- ── Theaters ─────────────────────────────────────────────
CREATE TABLE theaters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT,
  capacity INT NOT NULL DEFAULT 0,
  type TEXT DEFAULT 'standard',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Movies ───────────────────────────────────────────────
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_en TEXT NOT NULL,
  title_ka TEXT,
  synopsis_en TEXT,
  synopsis_ka TEXT,
  poster_url TEXT,
  trailer_url TEXT,
  genre TEXT[] DEFAULT '{}',
  director TEXT,
  "cast" TEXT[] DEFAULT '{}',
  duration_min INT DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 0,
  season TEXT,
  status movie_status DEFAULT 'draft',
  enquiry_count INT DEFAULT 0,
  enquiry_threshold INT DEFAULT 800,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Seat Layouts (templates) ─────────────────────────────
CREATE TABLE seat_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rows INT NOT NULL,
  cols INT NOT NULL,
  layout JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Screenings ───────────────────────────────────────────
CREATE TABLE screenings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  theater_id UUID NOT NULL REFERENCES theaters(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  booking_opens_at TIMESTAMPTZ,
  booking_closes_at TIMESTAMPTZ,
  seat_layout_id UUID REFERENCES seat_layouts(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Seats ────────────────────────────────────────────────
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  screening_id UUID NOT NULL REFERENCES screenings(id) ON DELETE CASCADE,
  "row" CHAR(2) NOT NULL,
  number INT NOT NULL,
  type seat_type DEFAULT 'standard',
  status seat_status DEFAULT 'available',
  price NUMERIC(10,2) DEFAULT 0,
  held_by UUID REFERENCES auth.users(id),
  held_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(screening_id, "row", number)
);

-- Index for fast seat map queries
CREATE INDEX idx_seats_screening ON seats(screening_id);
CREATE INDEX idx_seats_status ON seats(screening_id, status);
CREATE INDEX idx_seats_held ON seats(status, held_until) WHERE status = 'held';

-- ── Bookings ─────────────────────────────────────────────
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  screening_id UUID NOT NULL REFERENCES screenings(id) ON DELETE CASCADE,
  seats JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_status payment_status DEFAULT 'pending',
  payment_intent_id TEXT,
  qr_code TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  booked_by booked_by_type DEFAULT 'user',
  guest_name TEXT,
  guest_email TEXT,
  checked_in BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_screening ON bookings(screening_id);

-- ── Enquiries ────────────────────────────────────────────
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, movie_id)
);

CREATE INDEX idx_enquiries_movie ON enquiries(movie_id);

-- ── Admin Users ──────────────────────────────────────────
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- ═══════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════

ALTER TABLE theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_layouts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read theaters" ON theaters FOR SELECT USING (true);
CREATE POLICY "Public read movies" ON movies FOR SELECT USING (true);
CREATE POLICY "Public read screenings" ON screenings FOR SELECT USING (true);
CREATE POLICY "Public read seats" ON seats FOR SELECT USING (true);
CREATE POLICY "Public read seat_layouts" ON seat_layouts FOR SELECT USING (true);

-- Bookings: users see their own
CREATE POLICY "Users read own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Enquiries: users see their own
CREATE POLICY "Users read own enquiries" ON enquiries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own enquiries" ON enquiries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin full access (using admin_users check)
CREATE POLICY "Admin full theaters" ON theaters FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admin full movies" ON movies FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admin full screenings" ON screenings FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admin full seats" ON seats FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admin full bookings" ON bookings FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admin full enquiries" ON enquiries FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admin full admin_users" ON admin_users FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admin full seat_layouts" ON seat_layouts FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- ═══════════════════════════════════════════════════════════
-- Enable Realtime
-- ═══════════════════════════════════════════════════════════

ALTER PUBLICATION supabase_realtime ADD TABLE seats;
ALTER PUBLICATION supabase_realtime ADD TABLE movies;

-- ═══════════════════════════════════════════════════════════
-- Trigger: auto-update updated_at on movies
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER movies_updated_at
  BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
