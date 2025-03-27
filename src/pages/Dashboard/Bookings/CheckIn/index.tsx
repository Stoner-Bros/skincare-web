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
import { useEffect, useReducer } from "react";

// Define action types
type Action =
  | { type: "SET_CONFIRMED_BOOKINGS"; payload: any[] }
  | { type: "UPDATE_BOOKING"; payload: any }
  | { type: "SET_LOADING"; payload: boolean };

// Define state type
interface State {
  confirmedBookings: any[];
  loading: boolean;
}

// Initial state
const initialState: State = {
  confirmedBookings: [],
  loading: false,
};

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CONFIRMED_BOOKINGS":
      return {
        ...state,
        confirmedBookings: action.payload,
      };
    case "UPDATE_BOOKING":
      return {
        ...state,
        confirmedBookings: state.confirmedBookings.map((booking) =>
          booking.bookingId === action.payload.bookingId
            ? action.payload
            : booking
        ),
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

export default function CheckInPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { bookings, fetchBookings, updateBooking } = useBooking();
  const [state, dispatch] = useReducer(reducer, initialState);

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
        (booking: any) => booking.status === "Confirmed"
      );
      dispatch({ type: "SET_CONFIRMED_BOOKINGS", payload: filtered });
    }
  }, [bookings]);

  const handleCheckIn = async (bookingId: number, skinTherapistId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const currentTime = new Date().toISOString();
      const updatedBooking = await updateBooking(bookingId, {
        status: "Confirmed",
        staffId: user.accountId,
        checkinAt: currentTime,
        skinTherapistId: skinTherapistId,
      });

      dispatch({ type: "UPDATE_BOOKING", payload: updatedBooking });
      toast({
        title: "Thành công",
        description: "Đã check-in khách hàng thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể check-in khách hàng",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleCheckOut = async (
    bookingId: number,
    checkinAt: string,
    skinTherapistId: number
  ) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedBooking = await updateBooking(bookingId, {
        staffId: user.accountId,
        status: "Confirmed",
        checkinAt: checkinAt,
        checkoutAt: new Date().toISOString(),
        skinTherapistId: skinTherapistId,
      });

      dispatch({ type: "UPDATE_BOOKING", payload: updatedBooking });
      toast({
        title: "Thành công",
        description: "Đã check-out khách hàng thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể check-out khách hàng",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const formatDateTime = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "Chưa thiết lập";
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
      return "Hoàn thành";
    } else if (booking.checkinAt) {
      return "Đã Check-in";
    } else {
      return "Đang chờ";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-500";
      case "Đã Check-in":
        return "bg-blue-500";
      default:
        return "bg-yellow-500";
    }
  };

  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Quản Lý Check-in</h1>
        <p className="text-muted-foreground">
          Quản lý check-in và check-out khách hàng cho các đặt lịch đã xác nhận
        </p>
      </div>

      <div className="bg-white rounded-md shadow">
        {state.confirmedBookings.length === 0 ? (
          <p className="text-center py-8">
            Không có đặt lịch nào được xác nhận để check-in
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Đặt Lịch</TableHead>
                  <TableHead>Khách Hàng</TableHead>
                  <TableHead>Liệu Trình</TableHead>
                  <TableHead>Chuyên Viên Da</TableHead>
                  <TableHead>Khung Giờ</TableHead>
                  <TableHead>Trạng Thái Check-in</TableHead>
                  <TableHead>Thời Gian Check-in</TableHead>
                  <TableHead>Thời Gian Check-out</TableHead>
                  <TableHead>Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.confirmedBookings.map((booking) => {
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
                          : "Chưa phân công"}
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
                            onClick={() =>
                              handleCheckIn(
                                booking.bookingId,
                                booking.skinTherapist.accountId
                              )
                            }
                            className="mr-2"
                          >
                            Check-in
                          </Button>
                        )}

                        {booking.checkinAt && !booking.checkoutAt && (
                          <Button
                            onClick={() =>
                              handleCheckOut(
                                booking.bookingId,
                                booking.checkinAt,
                                booking.skinTherapist.accountId
                              )
                            }
                            variant="outline"
                          >
                            Check-out
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
