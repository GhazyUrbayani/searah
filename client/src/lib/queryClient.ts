import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { MOCK_TRIPS, MOCK_USERS, MOCK_BOOKINGS, MOCK_INCIDENTS, MOCK_STATS } from "./mockData";

const API_BASE = "__PORT_5000__".startsWith("__") ? "" : "__PORT_5000__";
const IS_STATIC = API_BASE === "";

// Mock data resolver — used when deployed as static site
function getMockData(url: string): any {
  if (url.startsWith("/api/trips") && !url.includes("drivers")) {
    const match = url.match(/\/api\/trips\/(\d+)/);
    if (match) {
      const trip = MOCK_TRIPS.find(t => t.id === Number(match[1]));
      return trip ? { ...trip, bookings: MOCK_BOOKINGS.filter(b => b.tripId === trip.id) } : null;
    }
    return MOCK_TRIPS;
  }
  if (url.startsWith("/api/users") && !url.includes("ratings")) {
    const match = url.match(/\/api\/users\/(\d+)/);
    if (match) return MOCK_USERS.find(u => u.id === Number(match[1])) ?? null;
    return MOCK_USERS;
  }
  if (url.startsWith("/api/bookings")) return MOCK_BOOKINGS;
  if (url.match(/\/api\/passengers\/\d+\/bookings/)) return MOCK_BOOKINGS;
  if (url.startsWith("/api/incidents")) return MOCK_INCIDENTS;
  if (url.startsWith("/api/admin/stats")) return MOCK_STATS;
  return null;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (IS_STATIC) {
    // Intercept requests on static deployments
    if (method === "POST" && url === "/api/auth/login") {
      const body = data as { phone: string };
      const user = MOCK_USERS.find(u => u.phone === body.phone) ??
        { id: 99, name: "Pengguna Demo", phone: body.phone, role: "passenger", category: "regular", ktpVerified: false, simVerified: false, trustScore: 5.0, totalTrips: 0, gender: "unspecified", isActive: true, isSuspended: false, email: null, createdAt: new Date().toISOString() };
      return new Response(JSON.stringify({ user }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    if (method === "POST" && url === "/api/bookings") {
      const mockBooking = { id: Date.now(), ...(data as object), status: "confirmed", paymentStatus: "paid", createdAt: new Date().toISOString() };
      return new Response(JSON.stringify(mockBooking), { status: 201, headers: { "Content-Type": "application/json" } });
    }
    if (method === "POST" && url === "/api/trips") {
      const mockTrip = { id: Date.now(), ...(data as object), bookedSeats: 0, status: "open", createdAt: new Date().toISOString() };
      return new Response(JSON.stringify(mockTrip), { status: 201, headers: { "Content-Type": "application/json" } });
    }
    if (method === "POST" && url === "/api/incidents") {
      const mockInc = { id: Date.now(), ...(data as object), createdAt: new Date().toISOString() };
      return new Response(JSON.stringify(mockInc), { status: 201, headers: { "Content-Type": "application/json" } });
    }
    // For PATCH, status updates, etc.
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  const res = await fetch(`${API_BASE}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/");
    
    if (IS_STATIC) {
      const mockResult = getMockData(url);
      if (mockResult !== null) return mockResult as T;
    }

    const res = await fetch(`${API_BASE}${url}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
