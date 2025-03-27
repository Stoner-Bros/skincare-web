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
import { useCallback, useEffect, useReducer } from "react";

// Define action types
type Action =
  | { type: "SET_BOOKINGS"; payload: any[] }
  | { type: "SET_PAGE_INFO"; payload: any }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Define state type
interface State {
  bookings: any[];
  pageInfo: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: State = {
  bookings: [],
  pageInfo: {
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
  },
  loading: false,
  error: null,
};

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_BOOKINGS":
      return {
        ...state,
        bookings: action.payload,
      };
    case "SET_PAGE_INFO":
      return {
        ...state,
        pageInfo: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

export default function AllOrders() {
  const { bookings, pageInfo, error, fetchBookings } = useBooking();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadBookings = useCallback(
    async (page: number = 1, pageSize: number = 7) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        await fetchBookings(page, pageSize);
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: "Không thể tải danh sách đặt lịch",
        });
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách đặt lịch",
          variant: "destructive",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [fetchBookings, toast]
  );

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update state when context data changes
  useEffect(() => {
    if (bookings) {
      dispatch({ type: "SET_BOOKINGS", payload: bookings });
    }
    if (pageInfo) {
      dispatch({ type: "SET_PAGE_INFO", payload: pageInfo });
    }
    if (error) {
      dispatch({ type: "SET_ERROR", payload: error });
    }
  }, [bookings, pageInfo, error]);

  const handlePageChange = (page: number) => {
    loadBookings(page, state.pageInfo.pageSize);
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
    let statusText = status;

    switch (status) {
      case "Pending":
        badgeClass = "bg-yellow-500";
        statusText = "Đang chờ";
        break;
      case "Paid":
        badgeClass = "bg-blue-500";
        statusText = "Đã thanh toán";
        break;
      case "Confirmed":
        badgeClass = "bg-green-500";
        statusText = "Đã xác nhận";
        break;
      case "Cancelled":
        badgeClass = "bg-red-500";
        statusText = "Đã hủy";
        break;
      default:
        badgeClass = "bg-gray-500";
    }

    return <Badge className={badgeClass}>{statusText}</Badge>;
  };

  const getCheckInStatus = (booking: any) => {
    if (booking.checkinAt && booking.checkoutAt) {
      return "Đã hoàn thành";
    } else if (booking.checkinAt) {
      return "Đã check-in";
    } else {
      return "Chưa check-in";
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
        <h1 className="text-2xl font-semibold">Tất Cả Đặt Lịch</h1>
        <p className="text-muted-foreground">
          Xem tất cả đặt lịch trong hệ thống
        </p>
      </div>

      <div className="bg-white rounded-md shadow">
        {!state.bookings || state.bookings.length === 0 ? (
          <p className="text-center py-8">Không tìm thấy đặt lịch nào</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Khách Hàng</TableHead>
                    <TableHead>Liệu Trình</TableHead>
                    <TableHead>Chuyên Viên Da</TableHead>
                    <TableHead>Ngày Đặt</TableHead>
                    <TableHead>Khung Giờ</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Trạng Thái Check-in</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.bookings.map((booking) => (
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

            {state.pageInfo && state.pageInfo.totalPages > 1 && (
              <div className="py-4 flex justify-center border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {state.pageInfo.pageNumber > 1 ? (
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(state.pageInfo.pageNumber - 1)
                          }
                        />
                      ) : (
                        <PaginationPrevious className="cursor-not-allowed opacity-50" />
                      )}
                    </PaginationItem>

                    {[...Array(state.pageInfo.totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                          isActive={state.pageInfo.pageNumber === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      {state.pageInfo.pageNumber < state.pageInfo.totalPages ? (
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(state.pageInfo.pageNumber + 1)
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
