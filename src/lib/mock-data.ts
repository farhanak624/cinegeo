import type { Movie, Screening, Theater, Seat } from "./types";

// ── Mock Movies ──────────────────────────────────────────
export const mockMovies: Movie[] = [
  {
    id: "1",
    title_en: "Karuppu",
    title_ka: "კარუფუ",
    synopsis_en: "An intense action thriller where a common man rises against the city's underbelly to protect his neighborhood. Blood, vengeance, and a fight for survival.",
    synopsis_ka: "ინტენსიური სამოქმედო თრილერი, სადაც ჩვეულებრივი ადამიანი უპირისპირდება ქალაქის კრიმინალურ სამყაროს.",
    poster_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU93aS80MCawbBb7MyN0-7lBNoftX6vhEv6DPnb1LyBV23JuZ3k6NUKKQds3qrzkhIOUDtaw&s=10",
    trailer_url: "https://youtu.be/JpVl_-1YgIo?si=4qdA5Ss0a0Pz4PNe",
    genre: ["Action", "Thriller"],
    director: "RJ Balaji",
    cast: ["Suriya","RJ Balaji", "Trisha"],
    duration_min: 150,
    rating: 8.5,
    season: "Summer 2026",
    status: "booking_open",
    enquiry_count: 120,
    enquiry_threshold: 1000,
    featured: true,
    created_at: "2026-04-10",
    updated_at: "2026-04-10",
  },
  {
    id: "2",
    title_en: "Athiradi",
    title_ka: "ათირადი",
    synopsis_en: "A fast-paced Malayalam cop story tracing a legendary police officer's hunt for a dangerous syndicate hidden within Kerala's backwaters.",
    synopsis_ka: "სწრაფად განვითარებადი პოლიციური ისტორია, რომელიც მოგვითხრობს ლეგენდარული ოფიცრის ნადირობას კერალაში.",
    poster_url: "https://cdn.district.in/movies-assets/images/cinema/Athiradi_Gallery-371cf200-36f4-11f1-ad5d-df8c1aec5c9a.jpg",
    trailer_url: 'https://youtu.be/NFZmwmAZqXE?si=1FoQftU7zzr7xa6a',
    genre: ["Action", "Crime"],
    director: "Amal Neerad",
    cast: ["Basil Joseph", "Delulu", "Tovino Thomas"],
    duration_min: 145,
    rating: 7.8,
    season: "Autumn 2026",
    status: "enquiry",
    enquiry_count: 450,
    enquiry_threshold: 800,
    featured: false,
    created_at: "2026-04-12",
    updated_at: "2026-04-12",
  },
  {
    id: "3",  
    title_en: "Drishyam 3",
    title_ka: "დრიშიამ 3",
    synopsis_en: "The highly anticipated final chapter of Georgekutty's saga. As the authorities close in with new evidence, he must execute his most brilliant deception yet to protect his family.",
    synopsis_ka: "ჯორჯკუტის საგის ფინალური თავი. პოლიცია ახალი მტკიცებულებებით უახლოვდება.",
    poster_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTkqXOZY6BFLlUGZCX6odDSgcBA7JDptJIF52whYmX1vZR3bMISLCR4uLrTAP6D2GMAxS2&s",
    trailer_url: "https://youtu.be/YKGiD1mUsgY?si=Lve66kyDikjhMm0B",
    genre: ["Thriller", "Mystery"],
    director: "Jeethu Joseph",
    cast: ["Mohanlal", "Meena", "Ansiba Hassan", "Esther Anil"],
    duration_min: 160,
    rating: 8.9,
    season: "Winter 2026",
    status: "enquiry",
    enquiry_count: 1250,
    enquiry_threshold: 1500,
    featured: true,
    created_at: "2026-04-15",
    updated_at: "2026-04-15",
  },
  {
    id: "4",
    title_en: "Kattalan",
    title_ka: "კატალან",
    synopsis_en: "Set deep within untouched forests, an indigenous tribe's fierce warrior mounts a brutal defense of his ancestral land against ruthless corporate exploitation.",
    synopsis_ka: "ღრმა ტყეებში მცხოვრები ძირძველი ტომის მეომარი იცავს თავის მიწას კორპორატიული ექსპლუატაციისგან.",
    poster_url: "https://upload.wikimedia.org/wikipedia/en/0/0b/Kattalan_First_Look_Poster.png",
    trailer_url: "https://youtu.be/_IDEdwiKVFI?si=I3aXmOJnDmSzHOgj",
    genre: ["Action", "Drama"],
    director: "Lijo Jose Pellissery",
    cast: ["Prithviraj Sukumaran", "Chemban Vinod Jose"],
    duration_min: 138,
    rating: 8.2,
    season: "Summer 2026",
    status: "draft",
    enquiry_count: 0,
    enquiry_threshold: 800,
    featured: false,
    created_at: "2026-04-18",
    updated_at: "2026-04-18",
  },
  {
    id: "5",
    title_en: "Kanguva",
    title_ka: "კანგუვა",
    synopsis_en: "A fantasy action epic that spans across time, connecting a ferocious tribal warrior from the distant past to a modern-day conflict.",
    synopsis_ka: "ფანტასტიკური საგა, რომელიც ვრცელდება დროში და აკავშირებს წარსულის სასტიკ ტომის მეომარს თანამედროვე კონფლიქტთან.",
    poster_url: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Kanguva_poster.jpg/250px-Kanguva_poster.jpg",
    trailer_url: "https://youtu.be/ajnCMSC4VPo?si=XMNPV1AY2M3BhMMs",
    genre: ["Fantasy", "Action"],
    director: "Siva",
    cast: ["Suriya", "Bobby Deol", "Disha Patani"],
    duration_min: 155,
    rating: 8.0,
    season: "Spring 2026",
    status: "booking_open",
    enquiry_count: 340,
    enquiry_threshold: 1000,
    featured: true,
    created_at: "2026-04-20",
    updated_at: "2026-04-20",
  },
  {
    id: "12",
    title_en: "L2: Empuraan",
    title_ka: "ემპურაანი",
    synopsis_en: "The highly anticipated sequel expanding the cinematic universe of Stephen Nedumpally. A global political thriller where power, cartel wars, and politics collide.",
    synopsis_ka: "დიდად მოლოდინში მყოფი გაგრძელება, რომელიც აფართოებს სტივენ ნედუმპალის კინემატოგრაფიულ სამყაროს.",
    poster_url: "https://m.media-amazon.com/images/M/MV5BYWRiNmUxMjMtZjhiZC00MGZjLThiNDYtYzlhYWQ3MmMwOTY0XkEyXkFqcGc@._V1_.jpg",
    trailer_url: "https://youtu.be/PGqltBCo6cU?si=fJ4E4IBix5ydc9Xo",
    genre: ["Action", "Political Thriller"],
    director: "Prithviraj Sukumaran",
    cast: ["Mohanlal", "Prithviraj Sukumaran", "Manju Warrier", "Tovino Thomas"],
    duration_min: 165,
    rating: 9.1,
    season: "Winter 2026",
    status: "enquiry",
    enquiry_count: 1450,
    enquiry_threshold: 2000,
    featured: true,
    created_at: "2026-04-22",
    updated_at: "2026-04-22",
  }
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
