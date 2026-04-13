import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTripSchema, insertBookingSchema, insertRatingSchema, insertIncidentSchema } from "@shared/schema";

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  // ─── Auth / Users ──────────────────────────────────────────────────────────
  app.post("/api/auth/login", (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });
    let user = storage.getUserByPhone(phone);
    if (!user) {
      // Auto-register for demo
      user = storage.createUser({ name: "Pengguna Baru", phone, role: "passenger", category: "regular" });
    }
    if (user.isSuspended) return res.status(403).json({ error: "Akun disuspend" });
    res.json({ user });
  });

  app.get("/api/users", (_req, res) => {
    res.json(storage.getUsers());
  });

  app.get("/api/users/:id", (req, res) => {
    const user = storage.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.post("/api/users", (req, res) => {
    const parsed = insertUserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const user = storage.createUser(parsed.data);
    res.status(201).json(user);
  });

  app.patch("/api/users/:id", (req, res) => {
    const user = storage.updateUser(Number(req.params.id), req.body);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.post("/api/users/:id/suspend", (req, res) => {
    storage.suspendUser(Number(req.params.id));
    res.json({ success: true });
  });

  // ─── Trips ────────────────────────────────────────────────────────────────
  app.get("/api/trips", (req, res) => {
    const { status, corridor, priceMode } = req.query as Record<string, string>;
    const trips = storage.getTrips({ status, corridor, priceMode });
    // Attach driver info
    const enriched = trips.map(trip => {
      const driver = storage.getUserById(trip.driverId);
      return { ...trip, driver };
    });
    res.json(enriched);
  });

  app.get("/api/trips/:id", (req, res) => {
    const trip = storage.getTripById(Number(req.params.id));
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    const driver = storage.getUserById(trip.driverId);
    const bookingsList = storage.getBookingsByTrip(trip.id);
    res.json({ ...trip, driver, bookings: bookingsList });
  });

  app.post("/api/trips", (req, res) => {
    const parsed = insertTripSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const trip = storage.createTrip(parsed.data);
    res.status(201).json(trip);
  });

  app.patch("/api/trips/:id/status", (req, res) => {
    const { status } = req.body;
    storage.updateTripStatus(Number(req.params.id), status);
    res.json({ success: true });
  });

  app.get("/api/drivers/:driverId/trips", (req, res) => {
    const trips = storage.getTripsByDriver(Number(req.params.driverId));
    res.json(trips);
  });

  // ─── Bookings ──────────────────────────────────────────────────────────────
  app.get("/api/bookings", (_req, res) => {
    const bookings = storage.getBookings();
    const enriched = bookings.map(b => {
      const trip = storage.getTripById(b.tripId);
      const passenger = storage.getUserById(b.passengerId);
      return { ...b, trip, passenger };
    });
    res.json(enriched);
  });

  app.post("/api/bookings", (req, res) => {
    const parsed = insertBookingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    
    const trip = storage.getTripById(parsed.data.tripId);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    if (trip.status === "full" || trip.status === "cancelled") {
      return res.status(400).json({ error: "Trip tidak tersedia" });
    }
    const remaining = trip.availableSeats - (trip.bookedSeats ?? 0);
    if ((parsed.data.seatsBooked ?? 1) > remaining) {
      return res.status(400).json({ error: "Kursi tidak cukup" });
    }

    const booking = storage.createBooking(parsed.data);
    
    // Check if full
    const updatedTrip = storage.getTripById(parsed.data.tripId);
    if (updatedTrip && (updatedTrip.bookedSeats ?? 0) >= updatedTrip.availableSeats) {
      storage.updateTripStatus(parsed.data.tripId, "full");
    }
    
    res.status(201).json(booking);
  });

  app.patch("/api/bookings/:id/status", (req, res) => {
    const { status } = req.body;
    storage.updateBookingStatus(Number(req.params.id), status);
    res.json({ success: true });
  });

  app.get("/api/passengers/:passengerId/bookings", (req, res) => {
    const bookings = storage.getBookingsByPassenger(Number(req.params.passengerId));
    const enriched = bookings.map(b => {
      const trip = storage.getTripById(b.tripId);
      const driver = trip ? storage.getUserById(trip.driverId) : null;
      return { ...b, trip, driver };
    });
    res.json(enriched);
  });

  // ─── Ratings ──────────────────────────────────────────────────────────────
  app.post("/api/ratings", (req, res) => {
    const parsed = insertRatingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const rating = storage.createRating(parsed.data);
    res.status(201).json(rating);
  });

  app.get("/api/users/:id/ratings", (req, res) => {
    const ratings = storage.getRatingsByUser(Number(req.params.id));
    res.json(ratings);
  });

  // ─── Incidents ────────────────────────────────────────────────────────────
  app.get("/api/incidents", (_req, res) => {
    const incidents = storage.getIncidents();
    const enriched = incidents.map(inc => {
      const reporter = storage.getUserById(inc.reporterId);
      return { ...inc, reporter };
    });
    res.json(enriched);
  });

  app.post("/api/incidents", (req, res) => {
    const parsed = insertIncidentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const incident = storage.createIncident(parsed.data);
    res.status(201).json(incident);
  });

  app.patch("/api/incidents/:id/status", (req, res) => {
    const { status } = req.body;
    storage.updateIncidentStatus(Number(req.params.id), status);
    res.json({ success: true });
  });

  // ─── Admin Stats ──────────────────────────────────────────────────────────
  app.get("/api/admin/stats", (_req, res) => {
    res.json(storage.getStats());
  });

  return httpServer;
}
