import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  role: text("role").notNull().default("passenger"), // driver | passenger | admin
  category: text("category").notNull().default("regular"), // social | regular | premium
  ktpVerified: integer("ktp_verified", { mode: "boolean" }).default(false),
  simVerified: integer("sim_verified", { mode: "boolean" }).default(false),
  trustScore: real("trust_score").default(5.0),
  totalTrips: integer("total_trips").default(0),
  gender: text("gender").default("unspecified"), // male | female | unspecified
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isSuspended: integer("is_suspended", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ─── Trips ───────────────────────────────────────────────────────────────────
export const trips = sqliteTable("trips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  driverId: integer("driver_id").notNull(),
  originName: text("origin_name").notNull(),
  originLat: real("origin_lat").notNull(),
  originLng: real("origin_lng").notNull(),
  destinationName: text("destination_name").notNull(),
  destinationLat: real("destination_lat").notNull(),
  destinationLng: real("destination_lng").notNull(),
  departureTime: text("departure_time").notNull(),
  availableSeats: integer("available_seats").notNull(),
  bookedSeats: integer("booked_seats").default(0),
  priceMode: text("price_mode").notNull().default("cost-sharing"), // social | cost-sharing | premium
  pricePerSeat: real("price_per_seat").default(0),
  maxDeviationKm: real("max_deviation_km").default(2),
  genderPreference: text("gender_preference").default("any"), // any | male | female
  status: text("status").notNull().default("open"), // open | full | in-progress | completed | cancelled
  notes: text("notes"),
  corridor: text("corridor"), // kampus | industri | stasiun | event
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertTripSchema = createInsertSchema(trips).omit({ id: true, createdAt: true, bookedSeats: true });
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tripId: integer("trip_id").notNull(),
  passengerId: integer("passenger_id").notNull(),
  pickupName: text("pickup_name").notNull(),
  pickupLat: real("pickup_lat").notNull(),
  pickupLng: real("pickup_lng").notNull(),
  seatsBooked: integer("seats_booked").default(1),
  totalPrice: real("total_price").default(0),
  status: text("status").notNull().default("pending"), // pending | confirmed | in-progress | completed | cancelled
  paymentStatus: text("payment_status").default("unpaid"), // unpaid | paid | refunded
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// ─── Ratings ──────────────────────────────────────────────────────────────────
export const ratings = sqliteTable("ratings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id").notNull(),
  raterId: integer("rater_id").notNull(),
  rateeId: integer("ratee_id").notNull(),
  score: real("score").notNull(), // 1.0 - 5.0
  comment: text("comment"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertRatingSchema = createInsertSchema(ratings).omit({ id: true, createdAt: true });
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

// ─── Incidents ────────────────────────────────────────────────────────────────
export const incidents = sqliteTable("incidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookingId: integer("booking_id"),
  reporterId: integer("reporter_id").notNull(),
  type: text("type").notNull(), // panic | complaint | suspicious | accident
  description: text("description").notNull(),
  status: text("status").default("open"), // open | investigating | resolved
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({ id: true, createdAt: true });
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;
