import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBooking } from "@/context/BookingContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect } from "react";

export default function AllOrders() {
  const { bookings, loading, pageInfo, fetchBookings } = useBooking();
  const { toast } = useToast();

  const loadBookings = useCallback(() => {
    try {
      fetchBookings(1, 10);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    }
  }, [fetchBookings, toast]);

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    try {
      fetchBookings(page, pageInfo.pageSize);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change page",
        variant: "destructive",
      });
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(new Date(dateTimeStr), "PPP");
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

  const getStatusBadge = (status: string) => {
    let badgeClass = "";

    switch (status) {
      case "Pending":
        badgeClass = "bg-yellow-500";
        break;
      case "Paid":
        badgeClass = "bg-blue-500";
        break;
      case "Confirmed":
        badgeClass = "bg-green-500";
        break;
      case "Cancelled":
        badgeClass = "bg-red-500";
        break;
      default:
        badgeClass = "bg-gray-500";
    }

    return <Badge className={badgeClass}>{status}</Badge>;
  };

  const getCheckInStatus = (booking: any) => {
    if (booking.checkinAt && booking.checkoutAt) {
      return "Completed";
    } else if (booking.checkinAt) {
      return "Checked In";
    } else {
      return "Not Checked In";
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
        <h1 className="text-2xl font-semibold">All Bookings</h1>
        <p className="text-muted-foreground">View all bookings in the system</p>
      </div>

      <div className="bg-white rounded-md shadow">
        {!bookings || bookings.length === 0 ? (
          <p className="text-center py-8">No bookings found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Skin Therapist</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check-In Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
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
                      <TableCell>{formatDateTime(booking.bookingAt)}</TableCell>
                      <TableCell>
                        {booking.timeSlots.map((slot: any) => (
                          <div key={slot.timeSlotId}>
                            {formatTimeSlot(slot.startTime)} -{" "}
                            {formatTimeSlot(slot.endTime)}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {booking.totalPrice.toLocaleString()} VND
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{getCheckInStatus(booking)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pageInfo && pageInfo.totalPages > 1 && (
              <div className="py-4 flex justify-center border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {pageInfo.pageNumber > 1 ? (
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(pageInfo.pageNumber - 1)
                          }
                        />
                      ) : (
                        <PaginationPrevious className="cursor-not-allowed opacity-50" />
                      )}
                    </PaginationItem>

                    {[...Array(pageInfo.totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                          isActive={pageInfo.pageNumber === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      {pageInfo.pageNumber < pageInfo.totalPages ? (
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(pageInfo.pageNumber + 1)
                          }
                        />
                      ) : (
                        <PaginationNext className="cursor-not-allowed opacity-50" />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
