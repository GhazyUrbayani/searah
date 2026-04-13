// Mock data for static Vercel deployment (no backend)
export const MOCK_USERS = [
  { id: 1, name: "Budi Santoso", phone: "081234567890", role: "driver", category: "regular", ktpVerified: true, simVerified: true, trustScore: 4.8, totalTrips: 23, gender: "male", isActive: true, isSuspended: false, email: null, createdAt: "2026-01-01T00:00:00Z" },
  { id: 2, name: "Sari Dewi", phone: "081234567891", role: "passenger", category: "social", ktpVerified: true, simVerified: false, trustScore: 4.9, totalTrips: 15, gender: "female", isActive: true, isSuspended: false, email: null, createdAt: "2026-01-01T00:00:00Z" },
  { id: 3, name: "Ahmad Fauzi", phone: "081234567892", role: "driver", category: "premium", ktpVerified: true, simVerified: true, trustScore: 5.0, totalTrips: 47, gender: "male", isActive: true, isSuspended: false, email: null, createdAt: "2026-01-01T00:00:00Z" },
  { id: 4, name: "Rina Kusuma", phone: "081234567893", role: "passenger", category: "regular", ktpVerified: true, simVerified: false, trustScore: 4.7, totalTrips: 8, gender: "female", isActive: true, isSuspended: false, email: null, createdAt: "2026-01-01T00:00:00Z" },
  { id: 5, name: "Admin SeArah", phone: "081234567899", role: "admin", category: "regular", ktpVerified: true, simVerified: false, trustScore: 5.0, totalTrips: 0, gender: "unspecified", isActive: true, isSuspended: false, email: null, createdAt: "2026-01-01T00:00:00Z" },
];

export const MOCK_TRIPS = [
  { id: 1, driverId: 1, originName: "Kos Jalan Dago Atas", originLat: -6.8651, originLng: 107.6126, destinationName: "Kampus ITB Ganesha", destinationLat: -6.8942, destinationLng: 107.6096, departureTime: "2026-04-14T07:00:00", availableSeats: 3, bookedSeats: 1, priceMode: "cost-sharing", pricePerSeat: 5000, maxDeviationKm: 2, genderPreference: "any", status: "open", notes: null, corridor: "kampus", createdAt: "2026-04-13T00:00:00Z", driver: MOCK_USERS[0] },
  { id: 2, driverId: 3, originName: "Perumahan Margahayu", originLat: -6.9641, originLng: 107.5928, destinationName: "Kawasan Industri Margaasih", destinationLat: -6.9827, destinationLng: 107.5551, departureTime: "2026-04-14T06:30:00", availableSeats: 2, bookedSeats: 0, priceMode: "cost-sharing", pricePerSeat: 8000, maxDeviationKm: 2, genderPreference: "any", status: "open", notes: null, corridor: "industri", createdAt: "2026-04-13T00:00:00Z", driver: MOCK_USERS[2] },
  { id: 3, driverId: 1, originName: "Kos Setrasari", originLat: -6.8797, originLng: 107.5893, destinationName: "Stasiun Bandung", destinationLat: -6.9142, destinationLng: 107.6020, departureTime: "2026-04-14T08:00:00", availableSeats: 2, bookedSeats: 2, priceMode: "social", pricePerSeat: 0, maxDeviationKm: 1.5, genderPreference: "any", status: "full", notes: null, corridor: "stasiun", createdAt: "2026-04-13T00:00:00Z", driver: MOCK_USERS[0] },
  { id: 4, driverId: 3, originName: "Komplek Antapani", originLat: -6.9175, originLng: 107.6634, destinationName: "Kampus ITB Jatinangor", destinationLat: -6.9313, destinationLng: 107.7697, departureTime: "2026-04-14T07:30:00", availableSeats: 4, bookedSeats: 2, priceMode: "cost-sharing", pricePerSeat: 12000, maxDeviationKm: 2, genderPreference: "any", status: "open", notes: null, corridor: "kampus", createdAt: "2026-04-13T00:00:00Z", driver: MOCK_USERS[2] },
];

export const MOCK_BOOKINGS = [
  { id: 1, tripId: 1, passengerId: 2, pickupName: "Simpang Dago", pickupLat: -6.8700, pickupLng: 107.6130, seatsBooked: 1, totalPrice: 5000, status: "confirmed", paymentStatus: "paid", createdAt: "2026-04-13T00:00:00Z", trip: MOCK_TRIPS[0], driver: MOCK_USERS[0] },
  { id: 4, tripId: 4, passengerId: 4, pickupName: "Komplek Antapani Indah", pickupLat: -6.9180, pickupLng: 107.6640, seatsBooked: 1, totalPrice: 12000, status: "confirmed", paymentStatus: "paid", createdAt: "2026-04-13T00:00:00Z", trip: MOCK_TRIPS[3], driver: MOCK_USERS[2] },
];

export const MOCK_INCIDENTS = [
  { id: 1, bookingId: 1, reporterId: 2, type: "complaint", description: "Driver terlambat 15 menit dari jadwal", status: "resolved", createdAt: "2026-04-12T00:00:00Z", reporter: MOCK_USERS[1] },
];

export const MOCK_STATS = {
  totalUsers: 4,
  totalDrivers: 2,
  totalTrips: 4,
  totalBookings: 4,
  openIncidents: 0,
};
