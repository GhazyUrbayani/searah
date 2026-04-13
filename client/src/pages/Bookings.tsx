import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "../components/AuthContext";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Car, Clock, MapPin, Star } from "lucide-react";
import type { Booking, Trip, User } from "@shared/schema";

type EnrichedBooking = Booking & { trip?: Trip; driver?: User };

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "in-progress": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  "in-progress": "Berlangsung",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function BookingsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  if (!user) { navigate("/login"); return null; }

  const { data: bookings, isLoading } = useQuery<EnrichedBooking[]>({
    queryKey: ["/api/passengers", user.id, "bookings"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/passengers/${user.id}/bookings`);
      return res.json();
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status: "cancelled" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/passengers", user.id, "bookings"] });
      toast({ title: "Pemesanan dibatalkan" });
    },
    onError: () => toast({ title: "Gagal", description: "Tidak dapat membatalkan", variant: "destructive" }),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Pesananku</h1>
          <p className="text-muted-foreground text-sm">Riwayat dan status pemesananmu</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-36 rounded-xl" />)}
          </div>
        ) : !bookings?.length ? (
          <div className="text-center py-16 text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Belum ada pemesanan</p>
            <p className="text-sm mt-1">Temukan tumpangan di halaman Cari Tumpangan</p>
            <Button className="mt-4" onClick={() => navigate("/trips")}>Cari Tumpangan</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <Card key={booking.id} data-testid={`card-booking-${booking.id}`}>
                <CardContent className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Car className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        {booking.trip ? (
                          <>
                            <p className="font-bold truncate">
                              {booking.trip.originName} → {booking.trip.destinationName}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(booking.trip.departureTime).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })} •{" "}
                                {new Date(booking.trip.departureTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Jemput: {booking.pickupName}
                              </span>
                            </div>
                          </>
                        ) : (
                          <p className="font-medium text-muted-foreground">Trip #{booking.tripId}</p>
                        )}
                        {booking.driver && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                              {booking.driver.name.slice(0, 1)}
                            </div>
                            <span>Driver: {booking.driver.name}</span>
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              {booking.driver.trustScore?.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge className={STATUS_COLORS[booking.status] ?? ''}>
                        {STATUS_LABEL[booking.status] ?? booking.status}
                      </Badge>
                      <p className="font-bold text-primary">
                        {booking.totalPrice === 0 ? "Gratis" : `Rp${(booking.totalPrice ?? 0).toLocaleString('id-ID')}`}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.paymentStatus}</p>
                      {(booking.status === "pending" || booking.status === "confirmed") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground text-xs"
                          onClick={() => cancelMutation.mutate(booking.id)}
                          disabled={cancelMutation.isPending}
                          data-testid={`button-cancel-${booking.id}`}
                        >
                          Batalkan
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
