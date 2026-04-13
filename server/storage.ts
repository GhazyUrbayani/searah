import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and, like, or, desc, sql } from "drizzle-orm";
import { users, trips, bookings, ratings, incidents } from "@shared/schema";
import type {
  User, InsertUser,
  Trip, InsertTrip,
  Booking, InsertBooking,
  Rating, InsertRating,
  Incident, InsertIncident,
} from "@shared/schema";

const sqlite = new Database("searah.db");
export const db = drizzle(sqlite);

// Auto-create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'passenger',
    category TEXT NOT NULL DEFAULT 'regular',
    ktp_verified INTEGER DEFAULT 0,
    sim_verified INTEGER DEFAULT 0,
    trust_score REAL DEFAULT 5.0,
    total_trips INTEGER DEFAULT 0,
    gender TEXT DEFAULT 'unspecified',
    is_active INTEGER DEFAULT 1,
    is_suspended INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    driver_id INTEGER NOT NULL,
    origin_name TEXT NOT NULL,
    origin_lat REAL NOT NULL,
    origin_lng REAL NOT NULL,
    destination_name TEXT NOT NULL,
    destination_lat REAL NOT NULL,
    destination_lng REAL NOT NULL,
    departure_time TEXT NOT NULL,
    available_seats INTEGER NOT NULL,
    booked_seats INTEGER DEFAULT 0,
    price_mode TEXT NOT NULL DEFAULT 'cost-sharing',
    price_per_seat REAL DEFAULT 0,
    max_deviation_km REAL DEFAULT 2,
    gender_preference TEXT DEFAULT 'any',
    status TEXT NOT NULL DEFAULT 'open',
    notes TEXT,
    corridor TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id INTEGER NOT NULL,
    passenger_id INTEGER NOT NULL,
    pickup_name TEXT NOT NULL,
    pickup_lat REAL NOT NULL,
    pickup_lng REAL NOT NULL,
    seats_booked INTEGER DEFAULT 1,
    total_price REAL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT DEFAULT 'unpaid',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    rater_id INTEGER NOT NULL,
    ratee_id INTEGER NOT NULL,
    score REAL NOT NULL,
    comment TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER,
    reporter_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Seed demo data
const userCount = sqlite.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
if (userCount.c === 0) {
  sqlite.exec(`
    INSERT INTO users (name, phone, role, category, ktp_verified, sim_verified, trust_score, total_trips, gender) VALUES
    ('Budi Santoso', '081234567890', 'driver', 'regular', 1, 1, 4.8, 23, 'male'),
    ('Sari Dewi', '081234567891', 'passenger', 'social', 1, 0, 4.9, 15, 'female'),
    ('Ahmad Fauzi', '081234567892', 'driver', 'premium', 1, 1, 5.0, 47, 'male'),
    ('Rina Kusuma', '081234567893', 'passenger', 'regular', 1, 0, 4.7, 8, 'female'),
    ('Admin SeArah', '081234567899', 'admin', 'regular', 1, 0, 5.0, 0, 'unspecified');

    INSERT INTO trips (driver_id, origin_name, origin_lat, origin_lng, destination_name, destination_lat, destination_lng, departure_time, available_seats, booked_seats, price_mode, price_per_seat, corridor, status) VALUES
    (1, 'Kos Jalan Dago Atas', -6.8651, 107.6126, 'Kampus ITB Ganesha', -6.8942, 107.6096, '2026-04-14T07:00:00', 3, 1, 'cost-sharing', 5000, 'kampus', 'open'),
    (3, 'Perumahan Margahayu', -6.9641, 107.5928, 'Kawasan Industri Margaasih', -6.9827, 107.5551, '2026-04-14T06:30:00', 2, 0, 'cost-sharing', 8000, 'industri', 'open'),
    (1, 'Kos Setrasari', -6.8797, 107.5893, 'Stasiun Bandung', -6.9142, 107.6020, '2026-04-14T08:00:00', 2, 2, 'social', 0, 'stasiun', 'full'),
    (3, 'Komplek Antapani', -6.9175, 107.6634, 'Kampus ITB Jatinangor', -6.9313, 107.7697, '2026-04-14T07:30:00', 4, 2, 'cost-sharing', 12000, 'kampus', 'open');

    INSERT INTO bookings (trip_id, passenger_id, pickup_name, pickup_lat, pickup_lng, seats_booked, total_price, status, payment_status) VALUES
    (1, 2, 'Simpang Dago', -6.8700, 107.6130, 1, 5000, 'confirmed', 'paid'),
    (3, 4, 'Kos Setrasari Blok B', -6.8780, 107.5900, 1, 0, 'completed', 'paid'),
    (3, 2, 'Kos Setrasari Blok C', -6.8790, 107.5895, 1, 0, 'completed', 'paid'),
    (4, 4, 'Komplek Antapani Indah', -6.9180, 107.6640, 1, 12000, 'confirmed', 'paid');

    INSERT INTO ratings (booking_id, rater_id, ratee_id, score, comment) VALUES
    (2, 2, 1, 5.0, 'Driver sangat tepat waktu dan sopan!'),
    (2, 1, 2, 5.0, 'Penumpang yang baik, datang tepat waktu'),
    (3, 4, 1, 4.5, 'Perjalanan nyaman, recommended!');

    INSERT INTO incidents (booking_id, reporter_id, type, description, status) VALUES
    (1, 2, 'complaint', 'Driver terlambat 15 menit dari jadwal', 'resolved');
  `);
}

export interface IStorage {
  // Users
  getUsers(): User[];
  getUserById(id: number): User | undefined;
  getUserByPhone(phone: string): User | undefined;
  createUser(data: InsertUser): User;
  updateUser(id: number, data: Partial<InsertUser>): User | undefined;
  suspendUser(id: number): void;

  // Trips
  getTrips(filters?: { status?: string; corridor?: string; priceMode?: string }): Trip[];
  getTripById(id: number): Trip | undefined;
  getTripsByDriver(driverId: number): Trip[];
  createTrip(data: InsertTrip): Trip;
  updateTrip(id: number, data: Partial<InsertTrip>): Trip | undefined;
  updateTripStatus(id: number, status: string): void;

  // Bookings
  getBookings(): Booking[];
  getBookingById(id: number): Booking | undefined;
  getBookingsByTrip(tripId: number): Booking[];
  getBookingsByPassenger(passengerId: number): Booking[];
  createBooking(data: InsertBooking): Booking;
  updateBookingStatus(id: number, status: string): void;

  // Ratings
  createRating(data: InsertRating): Rating;
  getRatingsByUser(userId: number): Rating[];

  // Incidents
  getIncidents(): Incident[];
  createIncident(data: InsertIncident): Incident;
  updateIncidentStatus(id: number, status: string): void;

  // Stats
  getStats(): {
    totalUsers: number;
    totalDrivers: number;
    totalTrips: number;
    totalBookings: number;
    openIncidents: number;
  };
}

export class SqliteStorage implements IStorage {
  getUsers() {
    return db.select().from(users).all();
  }
  getUserById(id: number) {
    return db.select().from(users).where(eq(users.id, id)).get();
  }
  getUserByPhone(phone: string) {
    return db.select().from(users).where(eq(users.phone, phone)).get();
  }
  createUser(data: InsertUser) {
    return db.insert(users).values(data).returning().get();
  }
  updateUser(id: number, data: Partial<InsertUser>) {
    return db.update(users).set(data).where(eq(users.id, id)).returning().get();
  }
  suspendUser(id: number) {
    db.update(users).set({ isSuspended: true }).where(eq(users.id, id)).run();
  }

  getTrips(filters?: { status?: string; corridor?: string; priceMode?: string }) {
    let q = db.select().from(trips);
    const results = q.all();
    return results.filter(t => {
      if (filters?.status && t.status !== filters.status) return false;
      if (filters?.corridor && t.corridor !== filters.corridor) return false;
      if (filters?.priceMode && t.priceMode !== filters.priceMode) return false;
      return true;
    });
  }
  getTripById(id: number) {
    return db.select().from(trips).where(eq(trips.id, id)).get();
  }
  getTripsByDriver(driverId: number) {
    return db.select().from(trips).where(eq(trips.driverId, driverId)).all();
  }
  createTrip(data: InsertTrip) {
    return db.insert(trips).values(data).returning().get();
  }
  updateTrip(id: number, data: Partial<InsertTrip>) {
    return db.update(trips).set(data).where(eq(trips.id, id)).returning().get();
  }
  updateTripStatus(id: number, status: string) {
    db.update(trips).set({ status }).where(eq(trips.id, id)).run();
  }

  getBookings() {
    return db.select().from(bookings).all();
  }
  getBookingById(id: number) {
    return db.select().from(bookings).where(eq(bookings.id, id)).get();
  }
  getBookingsByTrip(tripId: number) {
    return db.select().from(bookings).where(eq(bookings.tripId, tripId)).all();
  }
  getBookingsByPassenger(passengerId: number) {
    return db.select().from(bookings).where(eq(bookings.passengerId, passengerId)).all();
  }
  createBooking(data: InsertBooking) {
    const booking = db.insert(bookings).values(data).returning().get();
    // Update booked seats
    db.update(trips)
      .set({ bookedSeats: sql`booked_seats + ${data.seatsBooked ?? 1}` })
      .where(eq(trips.id, data.tripId))
      .run();
    return booking;
  }
  updateBookingStatus(id: number, status: string) {
    db.update(bookings).set({ status }).where(eq(bookings.id, id)).run();
  }

  createRating(data: InsertRating) {
    const rating = db.insert(ratings).values(data).returning().get();
    // Recalculate trust score
    const allRatings = db.select().from(ratings).where(eq(ratings.rateeId, data.rateeId)).all();
    const avg = allRatings.reduce((s, r) => s + r.score, 0) / allRatings.length;
    db.update(users).set({ trustScore: avg }).where(eq(users.id, data.rateeId)).run();
    return rating;
  }
  getRatingsByUser(userId: number) {
    return db.select().from(ratings).where(eq(ratings.rateeId, userId)).all();
  }

  getIncidents() {
    return db.select().from(incidents).all();
  }
  createIncident(data: InsertIncident) {
    return db.insert(incidents).values(data).returning().get();
  }
  updateIncidentStatus(id: number, status: string) {
    db.update(incidents).set({ status }).where(eq(incidents.id, id)).run();
  }

  getStats() {
    const totalUsers = (sqlite.prepare("SELECT COUNT(*) as c FROM users WHERE role != 'admin'").get() as { c: number }).c;
    const totalDrivers = (sqlite.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'driver'").get() as { c: number }).c;
    const totalTrips = (sqlite.prepare("SELECT COUNT(*) as c FROM trips").get() as { c: number }).c;
    const totalBookings = (sqlite.prepare("SELECT COUNT(*) as c FROM bookings").get() as { c: number }).c;
    const openIncidents = (sqlite.prepare("SELECT COUNT(*) as c FROM incidents WHERE status = 'open'").get() as { c: number }).c;
    return { totalUsers, totalDrivers, totalTrips, totalBookings, openIncidents };
  }
}

export const storage = new SqliteStorage();
