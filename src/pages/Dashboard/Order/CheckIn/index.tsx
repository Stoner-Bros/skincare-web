import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBooking } from "@/context/BookingContext";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function CheckInPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { bookings, loading, fetchBookings, updateBooking } = useBooking();
  const [confirmedBookings, setConfirmedBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter bookings whenever the bookings list changes
  useEffect(() => {
    if (bookings) {
      const filtered = bookings.filter(
        (booking: any) => booking.status === "Confirmed"
      );
      setConfirmedBookings(filtered);
    }
  }, [bookings]);

  const handleCheckIn = async (bookingId: number) => {
    try {
      const currentTime = new Date().toISOString();
      await updateBooking(bookingId, {
        status: "Confirmed",
        staffId: user.accountId,
        checkinAt: currentTime,
      });

      toast({
        title: "Success",
        description: "Customer checked in successfully",
      });

      // Refresh the list
      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check in customer",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async (bookingId: number, checkinAt: string) => {
    try {
      await updateBooking(bookingId, {
        staffId: user.accountId,
        status: "Confirmed",
        checkinAt: checkinAt,
        checkoutAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Customer checked out successfully",
      });

      // Refresh the list
      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check out customer",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "Not set";
    try {
      return format(new Date(dateTimeStr), "PPP p");
    } catch (error) {
      return dateTimeStr;
    }
  };

  const formatTimeSlot = (timeStr: string) => {
    try {
      return format(new Date(`2000-01-01T${timeStr}`), "HH:mm");
    } catch (error) {
      return timeStr;
    }
  };

  const getCheckInStatus = (booking: any) => {
    if (booking.checkinAt && booking.checkoutAt) {
      return "Completed";
    } else if (booking.checkinAt) {
      return "Checked In";
    } else {
      return "Waiting";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "Checked In":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Check-In Management</h1>
        <p className="text-muted-foreground">
          Manage customer check-ins and check-outs for confirmed bookings
        </p>
      </div>

      <div className="bg-white rounded-md shadow">
        {confirmedBookings.length === 0 ? (
          <p className="text-center py-8">
            No confirmed bookings available for check-in
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Skin Therapist</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Check-In Status</TableHead>
                  <TableHead>Check-In Time</TableHead>
                  <TableHead>Check-Out Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {confirmedBookings.map((booking) => {
                  const checkInStatus = getCheckInStatus(booking);
                  return (
                    <TableRow key={booking.bookingId}>
                      <TableCell>{booking.bookingId}</TableCell>
                      <TableCell>
                        {booking.customer
                          ? booking.customer.fullName
                          : booking.guest
                          ? booking.guest.fullName
                          : "N/A"}
                      </TableCell>
                      <TableCell>{booking.treatment.treatmentName}</TableCell>
                      <TableCell>
                        {booking.skinTherapist
                          ? booking.skinTherapist.fullName
                          : "Not assigned"}
                      </TableCell>
                      <TableCell>
                        {booking.timeSlots.map((slot: any) => (
                          <div key={slot.timeSlotId}>
                            {formatTimeSlot(slot.startTime)} -{" "}
                            {formatTimeSlot(slot.endTime)}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(checkInStatus)}>
                          {checkInStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(booking.checkinAt)}</TableCell>
                      <TableCell>
                        {formatDateTime(booking.checkoutAt)}
                      </TableCell>
                      <TableCell>
                        {!booking.checkinAt && (
                          <Button
                            onClick={() => handleCheckIn(booking.bookingId)}
                            className="mr-2"
                          >
                            Check In
                          </Button>
                        )}

                        {booking.checkinAt && !booking.checkoutAt && (
                          <Button
                            onClick={() =>
                              handleCheckOut(
                                booking.bookingId,
                                booking.checkinAt
                              )
                            }
                            variant="outline"
                          >
                            Check Out
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
