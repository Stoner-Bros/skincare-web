import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import SkinTherapistService from "@/services/skin-therapist.services";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface TimeSlot {
  timeSlotId: number;
  startTime: string;
  endTime: string;
}

interface Customer {
  accountId: number;
  fullName: string;
}

interface Booking {
  bookingId: number;
  slotDate: string;
  timeSlots: TimeSlot[];
  customer: Customer | null;
  guest: Customer | null;
  treatment: {
    treatmentName: string;
    belongToService: {
      serviceName: string;
    };
  };
  bookingAt: string;
  totalPrice: number;
  status: string;
}

interface AccountInfo {
  accountId: number;
  fullName: string;
  avatar: string | null;
  phone: string | null;
  address: string | null;
  dob: string | null;
  otherInfo: string | null;
}

interface Account {
  accountId: number;
  email: string;
  createdAt: string;
  updateAt: string;
  role: string;
  isDeleted: boolean;
  accountInfo: AccountInfo;
}

interface Therapist {
  accountId: number;
  specialization: string;
  experience: string;
  introduction: string;
  bio: string;
  rating: number;
  isAvailable: boolean;
  account: Account;
}

export default function WaitingBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { bookings, loading, fetchBookings, updateBooking } = useBooking();
  const [paidBookings, setPaidBookings] = useState<Booking[]>([]);
  const [therapistsMap, setTherapistsMap] = useState<{
    [key: number]: Therapist[];
  }>({});
  const [selectedTherapists, setSelectedTherapists] = useState<{
    [key: number]: number;
  }>({});

  const fetchTherapists = async (booking: Booking) => {
    try {
      const response = await SkinTherapistService.getFreeSkinTherapistSlots(
        booking.slotDate,
        booking.timeSlots.map((slot) => slot.timeSlotId).join(",")
      );
      setTherapistsMap((prev) => ({
        ...prev,
        [booking.bookingId]: response.data.items,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skin therapists",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter bookings whenever the bookings list changes
  useEffect(() => {
    if (bookings) {
      const filtered = bookings.filter(
        (booking) => booking.status === "Paid"
      ) as Booking[];
      setPaidBookings(filtered);
      // Fetch therapists for all paid bookings
      filtered.forEach((booking) => {
        fetchTherapists(booking);
      });
    }
  }, [bookings]);

  const handleSelectTherapist = (bookingId: number, therapistId: number) => {
    setSelectedTherapists({
      ...selectedTherapists,
      [bookingId]: therapistId,
    });
  };

  const handleConfirmBooking = async (bookingId: number) => {
    if (!selectedTherapists[bookingId]) {
      toast({
        title: "Error",
        description: "Please select a skin therapist first",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateBooking(bookingId, {
        skinTherapistId: selectedTherapists[bookingId],
        staffId: user.accountId,
        status: "Confirmed",
      });

      toast({
        title: "Success",
        description: "Booking confirmed successfully",
      });

      // Refresh the list
      fetchBookings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm booking",
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

  if (loading || Object.keys(therapistsMap).length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Waiting Bookings</h1>
        <p className="text-muted-foreground">
          Assign skin therapists and confirm bookings
        </p>
      </div>

      <div className="bg-white rounded-md shadow">
        {paidBookings.length === 0 ? (
          <p className="text-center py-8">
            No paid bookings waiting for confirmation
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Treatment</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Assign Therapist</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidBookings.map((booking) => (
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
                      {booking.treatment.belongToService.serviceName}
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
                    <TableCell>
                      <Select
                        onValueChange={(value) =>
                          handleSelectTherapist(
                            booking.bookingId,
                            parseInt(value)
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select therapist" />
                        </SelectTrigger>
                        <SelectContent>
                          {!therapistsMap[booking.bookingId] ||
                          therapistsMap[booking.bookingId].length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              Không có therapist nào khả dụng cho khung giờ này
                            </div>
                          ) : (
                            therapistsMap[booking.bookingId].map(
                              (therapist) => (
                                <SelectItem
                                  key={therapist.accountId}
                                  value={therapist.accountId.toString()}
                                >
                                  {therapist.account.accountInfo.fullName}
                                </SelectItem>
                              )
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleConfirmBooking(booking.bookingId)}
                        disabled={!selectedTherapists[booking.bookingId]}
                      >
                        Confirm
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
