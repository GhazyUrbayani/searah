import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthContext";

// Pages
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import TripsPage from "./pages/Trips";
import TripDetailPage from "./pages/TripDetail";
import CreateTripPage from "./pages/CreateTrip";
import BookingsPage from "./pages/Bookings";
import ProfilePage from "./pages/Profile";
import AdminPage from "./pages/Admin";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router hook={useHashLocation}>
            <Switch>
              <Route path="/" component={LandingPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/trips" component={TripsPage} />
              <Route path="/trips/new" component={CreateTripPage} />
              <Route path="/trips/:id" component={TripDetailPage} />
              <Route path="/bookings" component={BookingsPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/admin" component={AdminPage} />
              <Route component={NotFound} />
            </Switch>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
