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
import { useEffect, useReducer } from "react";

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

// Define action types
type Action =
  | { type: "SET_PAID_BOOKINGS"; payload: Booking[] }
  | {
      type: "UPDATE_THERAPISTS_MAP";
      payload: { bookingId: number; therapists: Therapist[] };
    }
  | {
      type: "SET_SELECTED_THERAPIST";
      payload: { bookingId: number; therapistId: number };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_BOOKING"; payload: number };

// Define state type
interface State {
  paidBookings: Booking[];
  therapistsMap: { [key: number]: Therapist[] };
  selectedTherapists: { [key: number]: number };
  loading: boolean;
}

// Initial state
const initialState: State = {
  paidBookings: [],
  therapistsMap: {},
  selectedTherapists: {},
  loading: false,
};

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PAID_BOOKINGS":
      return {
        ...state,
        paidBookings: action.payload,
      };
    case "UPDATE_THERAPISTS_MAP":
      return {
        ...state,
        therapistsMap: {
          ...state.therapistsMap,
          [action.payload.bookingId]: action.payload.therapists,
        },
      };
    case "SET_SELECTED_THERAPIST":
      return {
        ...state,
        selectedTherapists: {
          ...state.selectedTherapists,
          [action.payload.bookingId]: action.payload.therapistId,
        },
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "UPDATE_BOOKING":
      return {
        ...state,
        paidBookings: state.paidBookings.filter(
          (booking) => booking.bookingId !== action.payload
        ),
      };
    default:
      return state;
  }
}

export default function WaitingBookings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { bookings, fetchBookings, updateBooking } = useBooking();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTherapists = async (booking: Booking) => {
    try {
      const response = await SkinTherapistService.getFreeSkinTherapistSlots(
        booking.slotDate,
        booking.timeSlots.map((slot) => slot.timeSlotId).join(",")
      );
      dispatch({
        type: "UPDATE_THERAPISTS_MAP",
        payload: {
          bookingId: booking.bookingId,
          therapists: response.data.items,
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch skin therapists",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    fetchBookings().finally(() => {
      dispatch({ type: "SET_LOADING", payload: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter bookings whenever the bookings list changes
  useEffect(() => {
    if (bookings) {
      const filtered = bookings.filter(
        (booking) => booking.status === "Paid"
      ) as Booking[];
      dispatch({ type: "SET_PAID_BOOKINGS", payload: filtered });
      // Fetch therapists for all paid bookings
      filtered.forEach((booking) => {
        fetchTherapists(booking);
      });
    }
  }, [bookings]);

  const handleSelectTherapist = (bookingId: number, therapistId: number) => {
    dispatch({
      type: "SET_SELECTED_THERAPIST",
      payload: { bookingId, therapistId },
    });
  };

  const handleConfirmBooking = async (bookingId: number) => {
    if (!state.selectedTherapists[bookingId]) {
      toast({
        title: "Error",
        description: "Please select a skin therapist first",
        variant: "destructive",
      });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await updateBooking(bookingId, {
        skinTherapistId: state.selectedTherapists[bookingId],
        staffId: user.accountId,
        status: "Confirmed",
      });

      dispatch({ type: "UPDATE_BOOKING", payload: bookingId });
      toast({
        title: "Success",
        description: "Booking confirmed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm booking",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
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

  if (state.loading || Object.keys(state.therapistsMap).length === 0) {
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
        {state.paidBookings.length === 0 ? (
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
                {state.paidBookings.map((booking) => (
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
                        value={state.selectedTherapists[
                          booking.bookingId
                        ]?.toString()}
                        onValueChange={(value) =>
                          handleSelectTherapist(
                            booking.bookingId,
                            parseInt(value)
                          )
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select therapist" />
                        </SelectTrigger>
                        <SelectContent>
                          {!state.therapistsMap[booking.bookingId] ||
                          state.therapistsMap[booking.bookingId].length ===
                            0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              Không có therapist nào khả dụng cho khung giờ này
                            </div>
                          ) : (
                            state.therapistsMap[booking.bookingId].map(
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
