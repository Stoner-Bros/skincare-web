import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import bookingService from "@/services/booking.services";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  timeSlotId: number;
  startTime: string;
  endTime: string;
}

interface Treatment {
  treatmentId: number;
  treatmentName: string;
  belongToService: {
    serviceId: number;
    serviceName: string;
  };
}

interface Account {
  accountId: number;
  fullName: string;
}

interface BookingHistory {
  bookingId: number;
  bookingAt: string;
  status: string;
  checkinAt: string | null;
  checkoutAt: string | null;
  totalPrice: number;
  notes: string;
  treatment: Treatment;
  skinTherapist: Account;
  staff: Account | null;
  customer: Account;
  guest: Account | null;
  timeSlots: TimeSlot[];
  slotDate: string;
}

const BookingHistory: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  // Lấy query params từ URL
  const location = useLocation();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 6; // Số lượng booking mỗi trang

  useEffect(() => {
    // Lấy email từ query params nếu có
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get("email");
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setEmail(null); // Reset email khi không có trong query params
    }
  }, [location.search]);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        setLoading(true);
        setError(null); // Reset lỗi trước khi fetch mới
        let response;
        
        // Kiểm tra xem có email từ query params không
        if (email) {
          // Nếu có email, sử dụng API lấy lịch sử theo email
          response = await bookingService.getBookingHistoryByEmail(email);
        } else if (!authLoading && user?.accountId) {
          // Nếu không có email nhưng đã đăng nhập, lấy lịch sử theo accountId
          response = await bookingService.getBookingHistory(user.accountId);
        } else if (!authLoading && !user?.accountId && !email) {
          // Nếu không có email và không đăng nhập, hiển thị lỗi
          setError("Vui lòng đăng nhập hoặc nhập email để xem lịch sử đặt lịch");
          setLoading(false);
          return;
        } else {
          // Đang loading auth, chờ
          return;
        }
        
        if (response && response.data && response.data.items) {
          const allBookings = response.data.items || [];
          
          // Tính tổng số trang
          const calculatedTotalPages = Math.max(1, Math.ceil(allBookings.length / itemsPerPage));
          setTotalPages(calculatedTotalPages);
          
          // Đảm bảo currentPage không lớn hơn tổng số trang
          if (currentPage > calculatedTotalPages) {
            setCurrentPage(1);
          }
          
          // Phân trang theo BookingID
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          
          // Lấy các booking cho trang hiện tại
          const paginatedBookings = allBookings.slice(start, end);
          setBookings(paginatedBookings);
          
          if (paginatedBookings.length > 0) {
            setSelectedBooking(paginatedBookings[0]);
          } else {
            // Nếu không có booking nào trong dữ liệu trả về
            const emailMsg = email ? ` cho email ${email}` : "";
            setError(`Không tìm thấy lịch sử đặt lịch nào${emailMsg}`);
            setSelectedBooking(null);
          }
        } else {
          // Nếu không có dữ liệu hợp lệ từ response
          const emailMsg = email ? ` cho email ${email}` : "";
          setError(`Không có dữ liệu lịch sử đặt lịch${emailMsg}`);
          setBookings([]);
          setSelectedBooking(null);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử đặt lịch:", err);
        const emailMsg = email ? ` cho email ${email}` : "";
        setError(`Đã xảy ra lỗi khi tải lịch sử đặt lịch${emailMsg}`);
        setBookings([]);
        setSelectedBooking(null);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [user?.accountId, authLoading, email, currentPage, itemsPerPage]);

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge variant="success">Đã thanh toán</Badge>;
      case "pending":
        return <Badge variant="warning">Chờ thanh toán</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleViewDetail = (booking: BookingHistory) => {
    setSelectedBooking(booking);
  };

  // Thêm hàm chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 bg-pink-50">
        <div className="animate-pulse">
          <div className="h-8 bg-pink-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-pink-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 bg-pink-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-red-600 text-center mb-4">{error}</p>
          <div className="flex justify-center">
            <Button 
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 bg-pink-50">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card className="bg-white shadow-md">
            <CardHeader className="pb-2 bg-pink-100 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-center text-pink-800">
                {email ? `Lịch sử đặt lịch (${email})` : "Lịch sử đặt lịch"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {bookings.length > 0 ? (
                <>
                  <Table>
                    <TableHeader className="bg-pink-50">
                      <TableRow>
                        <TableHead className="text-left font-bold text-pink-800">Ngày đặt</TableHead>
                        <TableHead className="text-left font-bold text-pink-800">Dịch vụ</TableHead>
                        <TableHead className="text-left font-bold text-pink-800">Trạng thái</TableHead>
                        <TableHead className="text-left font-bold text-pink-800">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.bookingId} className="hover:bg-pink-50 transition-colors">
                          <TableCell>
                            {new Date(booking.slotDate).toLocaleDateString("vi-VN")}
                          </TableCell>
                          <TableCell>{booking.treatment.treatmentName}</TableCell>
                          <TableCell>{renderStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="default" 
                              className="bg-pink-600 hover:bg-pink-700 text-white"
                              onClick={() => handleViewDetail(booking)}
                            >
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Phân trang */}
                  <div className="flex justify-center mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-pink-300 text-pink-800 hover:bg-pink-100"
                    >
                      Trước
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={
                          currentPage === page
                            ? "bg-pink-600 hover:bg-pink-700"
                            : "border-pink-300 text-pink-800 hover:bg-pink-100"
                        }
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-pink-300 text-pink-800 hover:bg-pink-100"
                    >
                      Tiếp
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-pink-800 mb-4">Không có lịch sử đặt lịch nào được tìm thấy</p>
                  <Button 
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={() => window.history.back()}
                  >
                    Quay lại
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chi tiết Booking - chỉ hiển thị khi có selectedBooking */}
        <div className="md:col-span-5">
          {selectedBooking && (
            <Card className="bg-white shadow-md h-full">
              <CardHeader className="pb-2 bg-pink-100 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-center text-pink-800">Chi tiết đặt lịch</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-pink-100">
                      <td className="py-3 font-medium text-pink-800">Ngày đặt</td>
                      <td className="py-3 text-right">
                        {new Date(selectedBooking.slotDate).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                    <tr className="border-b border-pink-100">
                      <td className="py-3 font-medium text-pink-800">Trạng thái</td>
                      <td className="py-3 text-right">{renderStatusBadge(selectedBooking.status)}</td>
                    </tr>
                    <tr className="border-b border-pink-100">
                      <td className="py-3 font-medium text-pink-800">Dịch vụ</td>
                      <td className="py-3 text-right">{selectedBooking.treatment.treatmentName}</td>
                    </tr>
                    <tr className="border-b border-pink-100">
                      <td className="py-3 font-medium text-pink-800">Chuyên viên</td>
                      <td className="py-3 text-right">{selectedBooking.skinTherapist?.fullName}</td>
                    </tr>
                    <tr className="border-b border-pink-100">
                      <td className="py-3 font-medium text-pink-800">Thời gian</td>
                      <td className="py-3 text-right">
                        {selectedBooking.timeSlots[0]?.startTime} - {selectedBooking.timeSlots[0]?.endTime}
                      </td>
                    </tr>
                    <tr className="border-b border-pink-100">
                      <td className="py-3 font-medium text-pink-800">Giá tiền</td>
                      <td className="py-3 text-right">
                        {selectedBooking.totalPrice.toLocaleString("vi-VN")} VNĐ
                      </td>
                    </tr>
                    {selectedBooking.checkinAt && (
                      <tr className="border-b border-pink-100">
                        <td className="py-3 font-medium text-pink-800">Check-in</td>
                        <td className="py-3 text-right">
                          {new Date(selectedBooking.checkinAt).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    )}
                    {selectedBooking.checkoutAt && (
                      <tr className="border-b border-pink-100">
                        <td className="py-3 font-medium text-pink-800">Check-out</td>
                        <td className="py-3 text-right">
                          {new Date(selectedBooking.checkoutAt).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <Button className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 rounded">
                  Viết đánh giá
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistory;
