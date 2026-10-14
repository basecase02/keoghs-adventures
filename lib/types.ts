export type TravelStyle = "ride" | "tag";

export interface Settings {
  businessName: string; legalName: string; owner: string; phone: string; email: string; location: string; abn: string;
  announcement: string; announcementOn: boolean; heroTitle: string; heroSub: string; tagline: string;
  depositPercent: number; balanceDueDays: number; maxGroup: number; currency: string; brandColor: string;
  facebook: string; instagram: string;
  notifyNewBooking: boolean; notifyBalanceDue: boolean; notifyEnquiry: boolean; notifyLowSeats: boolean;
  reminderDays: number; stripeMode: string; stripeConnected: boolean;
}

export interface Departure { id: string; date: string; seats: number; booked: number; status: "open" | "full" | "cancelled"; note: string }
export interface ItineraryDay { day: number; title: string; text: string }

export interface Tour {
  id: string; code: string; name: string; short: string; region: string; types: TravelStyle[];
  days: number; nights: number; price: { tag: number | null; ride: number | null };
  distanceKm: number; fuelRangeKm: number; difficulty: string; startEnd: string; activities: string[];
  cover: string; images: string[]; published: boolean; featured: boolean;
  summary: string; description: string; highlights: string[]; itinerary: ItineraryDay[];
  inclusions: string[]; exclusions: string[]; requirements: string[]; departures: Departure[];
}

export interface Region { id: string; blurb: string; img: string }
export interface Customer { id: string; name: string; email: string; phone: string; city: string; vehicle: string; trips: number; since: string; notes: string }
export interface Payment { id: string; date: string; amount: number; method: string; status: "succeeded" | "failed" | "refunded"; stripe: string; error?: string | null }
export type BookingStatus = "deposit" | "paid" | "failed" | "cancelled";

/** What the guest agreed to at checkout (Privacy Act 1988 / APP 3 & 5, Spam Act 2003). */
export interface Consent { privacy: string; marketing: boolean; terms: string }

export interface Booking {
  id: string; tourId: string; depId: string; customerId: string; style: TravelStyle; guests: number; vehicles: number;
  created: string; status: BookingStatus; total: number; payments: Payment[];
  docs: { terms: boolean; medical: boolean; vehicle: boolean | null }; consent: Consent; notes: string;
}
export interface Post { id: string; title: string; date: string; cover: string; excerpt: string; body: string }
export interface Review { id: string; name: string; where: string; stars: number; trip: string; text: string }
export interface Faq { q: string; a: string }

export interface SeedData {
  settings: Settings; tours: Tour[]; regions: Region[]; customers: Customer[]; bookings: Booking[];
  posts: Post[]; reviews: Review[]; faqs: Faq[];
}
