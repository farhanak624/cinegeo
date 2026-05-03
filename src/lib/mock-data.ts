import type { Movie, Screening, Theater, Seat } from "./types";

// ── Mock Movies ──────────────────────────────────────────
export const mockMovies: Movie[] = [
  {
    id: "1",
    title_en: "The Last Vineyard",
    title_ka: "უკანასკნელი ვენახი",
    synopsis_en: "A Georgian winemaker's ancient vineyard faces destruction as modern development encroaches on the Kakheti region. One family's fight to preserve centuries of tradition becomes a battle for the soul of Georgia itself.",
    synopsis_ka: "ქართველი მეღვინის უძველესი ვენახი განადგურების საფრთხის წინაშე დგას, რადგან თანამედროვე განვითარება კახეთის რეგიონს ემუქრება.",
    poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=900&fit=crop",
    trailer_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    genre: ["Drama", "Historical"],
    director: "Giorgi Ovashvili",
    cast: ["Merab Ninidze", "Ia Sukhitashvili", "Dato Bakhtadze"],
    duration_min: 142,
    rating: 8.4,
    season: "Spring 2026",
    status: "booking_open",
    enquiry_count: 0,
    enquiry_threshold: 800,
    featured: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "2",
    title_en: "Echoes of Tbilisi",
    title_ka: "თბილისის ექო",
    synopsis_en: "A jazz musician returns to Tbilisi after decades abroad, confronting a city transformed beyond recognition. Through music, he reconnects with memories and discovers that some melodies never fade.",
    synopsis_ka: "ჯაზის მუსიკოსი ათწლეულების შემდეგ ბრუნდება თბილისში.",
    poster_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop",
    trailer_url: null,
    genre: ["Drama", "Music"],
    director: "Nana Ekvtimishvili",
    cast: ["Giga Agladze", "Nino Kasradze"],
    duration_min: 118,
    rating: 7.9,
    season: "Spring 2026",
    status: "enquiry",
    enquiry_count: 623,
    enquiry_threshold: 800,
    featured: false,
    created_at: "2026-01-15",
    updated_at: "2026-01-15",
  },
  {
    id: "3",
    title_en: "Mountain's Shadow",
    title_ka: "მთის ჩრდილი",
    synopsis_en: "High in the Caucasus mountains, a shepherd discovers an ancient artifact that draws the attention of treasure hunters and historians alike. A thrilling adventure across Georgia's most remote landscapes.",
    synopsis_ka: "კავკასიის მთებში მწყემსი აღმოაჩენს უძველეს არტეფაქტს.",
    poster_url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=900&fit=crop",
    trailer_url: null,
    genre: ["Adventure", "Thriller"],
    director: "Dito Tsintsadze",
    cast: ["Alexandre Koberidze", "Salome Demuria"],
    duration_min: 131,
    rating: 8.1,
    season: "Summer 2026",
    status: "enquiry",
    enquiry_count: 891,
    enquiry_threshold: 1000,
    featured: false,
    created_at: "2026-02-01",
    updated_at: "2026-02-01",
  },
  {
    id: "4",
    title_en: "Digital Ghosts",
    title_ka: "ციფრული მოჩვენებები",
    synopsis_en: "In near-future Tbilisi, a hacker uncovers a conspiracy that blurs the line between the digital and physical worlds. A cyberpunk thriller set against Georgia's unique blend of ancient and modern.",
    synopsis_ka: "უახლოეს მომავლის თბილისში ჰაკერი აღმოაჩენს შეთქმულებას.",
    poster_url: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&h=900&fit=crop",
    trailer_url: null,
    genre: ["Sci-Fi", "Thriller"],
    director: "Levan Akin",
    cast: ["Levan Gelbakhiani", "Ana Javakishvili"],
    duration_min: 109,
    rating: 7.6,
    season: "Summer 2026",
    status: "booking_open",
    enquiry_count: 0,
    enquiry_threshold: 800,
    featured: false,
    created_at: "2026-02-15",
    updated_at: "2026-02-15",
  },
  {
    id: "5",
    title_en: "The Feast",
    title_ka: "სუფრა",
    synopsis_en: "A sprawling family drama set during a traditional Georgian supra that spans three generations of love, conflict, and reconciliation around one extraordinary table.",
    synopsis_ka: "სამი თაობის სიყვარული, კონფლიქტი და შერიგება ერთ საოცარ სუფრასთან.",
    poster_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=900&fit=crop",
    trailer_url: null,
    genre: ["Drama", "Comedy"],
    director: "Zaza Urushadze",
    cast: ["Nika Tavadze", "Mzia Arabuli", "Kakhi Kavsadze"],
    duration_min: 135,
    rating: 8.7,
    season: "Spring 2026",
    status: "enquiry",
    enquiry_count: 445,
    enquiry_threshold: 800,
    featured: false,
    created_at: "2026-03-01",
    updated_at: "2026-03-01",
  },
  {
    id: "6",
    title_en: "Midnight Run",
    title_ka: "შუაღამის გარბენი",
    synopsis_en: "A former athlete turned taxi driver gets caught in a night of escalating chaos across Tbilisi's neon-lit streets.",
    synopsis_ka: "ყოფილი სპორტსმენი ტაქსის მძღოლი თბილისის ნეონური ქუჩების ქაოსში ხვდება.",
    poster_url: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=900&fit=crop",
    trailer_url: null,
    genre: ["Action", "Thriller"],
    director: "Vakho Chachkhiani",
    cast: ["Giorgi Tabidze", "Nino Ninidze"],
    duration_min: 98,
    rating: 7.3,
    season: "Summer 2026",
    status: "draft",
    enquiry_count: 0,
    enquiry_threshold: 800,
    featured: false,
    created_at: "2026-03-15",
    updated_at: "2026-03-15",
  },
];

// ── Mock Theaters ────────────────────────────────────────
export const mockTheaters: Theater[] = [
  { id: "t1", name: "CineGeo Rustaveli", location: "Rustaveli Ave, Tbilisi", capacity: 180, type: "standard", created_at: "2026-01-01" },
  { id: "t2", name: "CineGeo Vake", location: "Vake, Tbilisi", capacity: 120, type: "premium", created_at: "2026-01-01" },
  { id: "t3", name: "CineGeo Batumi", location: "Batumi Boulevard", capacity: 150, type: "standard", created_at: "2026-01-01" },
];

// ── Mock Screenings ──────────────────────────────────────
export const mockScreenings: Screening[] = [
  {
    id: "s1", movie_id: "1", theater_id: "t1",
    starts_at: "2026-05-10T19:00:00Z",
    booking_opens_at: "2026-05-01T00:00:00Z",
    booking_closes_at: "2026-05-10T18:00:00Z",
    seat_layout_id: null, status: "active", created_at: "2026-04-01",
    movie: mockMovies[0], theater: mockTheaters[0],
  },
  {
    id: "s2", movie_id: "1", theater_id: "t1",
    starts_at: "2026-05-10T21:30:00Z",
    booking_opens_at: "2026-05-01T00:00:00Z",
    booking_closes_at: "2026-05-10T20:30:00Z",
    seat_layout_id: null, status: "active", created_at: "2026-04-01",
    movie: mockMovies[0], theater: mockTheaters[0],
  },
  {
    id: "s3", movie_id: "4", theater_id: "t2",
    starts_at: "2026-05-11T20:00:00Z",
    booking_opens_at: "2026-05-02T00:00:00Z",
    booking_closes_at: "2026-05-11T19:00:00Z",
    seat_layout_id: null, status: "active", created_at: "2026-04-01",
    movie: mockMovies[3], theater: mockTheaters[1],
  },
];

// ── Mock Seats ───────────────────────────────────────────
export function generateMockSeats(screeningId: string): Seat[] {
  const rows = "ABCDEFGHIJ".split("");
  const seatsPerRow = 14;
  const seats: Seat[] = [];

  rows.forEach((row) => {
    for (let n = 1; n <= seatsPerRow; n++) {
      const isVip = row === "E" || row === "F";
      const isEmpty = (n === 1 && (row === "A" || row === "J")) || (n === seatsPerRow && (row === "A" || row === "J"));
      const isBooked = Math.random() < 0.15;
      const isHeld = !isBooked && Math.random() < 0.05;

      seats.push({
        id: `${screeningId}-${row}${n}`,
        screening_id: screeningId,
        row,
        number: n,
        type: isEmpty ? "empty" : isVip ? "vip" : "standard",
        status: isEmpty ? "available" : isBooked ? "booked" : isHeld ? "held" : "available",
        price: isVip ? 25 : 15,
        held_by: null,
        held_until: null,
        created_at: "2026-04-01",
      });
    }
  });

  return seats;
}
