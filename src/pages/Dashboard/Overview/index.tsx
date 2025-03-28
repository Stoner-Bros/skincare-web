import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import overviewServices from "@/services/overview.services";
import { format } from "date-fns";
import { Calendar, DollarSign, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Overview() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalBlogs: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  ); // Mặc định là 2 ngày sau
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    // Tải dữ liệu tổng quan
    const fetchOverview = async () => {
      if (!shouldFetch) return;

      try {
        setLoading(true);

        // Định dạng ngày thành chuỗi YYYY-MM-DD
        const formattedStartDate = format(startDate, "yyyy-MM-dd");
        const formattedEndDate = format(endDate, "yyyy-MM-dd");

        // Giả lập gọi API với startDate và endDate

        const response = await overviewServices.getOverview(
          formattedStartDate,
          formattedEndDate
        );

        console.log("Đang tải dữ liệu với:", {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });

        setData(response.data);
        setShouldFetch(false);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải tổng quan:", error);
        setShouldFetch(false);
        setLoading(false);
      }
    };

    fetchOverview();
  }, [shouldFetch]); // Chỉ gọi API khi shouldFetch thay đổi

  // Hàm định dạng số tiền theo VND
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Hàm xử lý khi chọn ngày bắt đầu
  const handleStartDateChange = (date: any) => {
    setStartDate(date);
    // Nếu ngày bắt đầu lớn hơn ngày kết thúc, cập nhật ngày kết thúc
    if (date > endDate) {
      setEndDate(date);
    }
  };

  // Hàm xử lý khi chọn ngày kết thúc
  const handleEndDateChange = (date: any) => {
    setEndDate(date);
  };

  // Hàm xử lý khi nhấn nút áp dụng
  const handleApply = () => {
    setShouldFetch(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Tổng quan</h1>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Từ ngày</label>
            <input
              type="date"
              className="rounded-md border border-gray-300 p-2"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) => handleStartDateChange(new Date(e.target.value))}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1">Đến ngày</label>
            <input
              type="date"
              className="rounded-md border border-gray-300 p-2"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) => handleEndDateChange(new Date(e.target.value))}
              min={format(startDate, "yyyy-MM-dd")}
            />
          </div>

          <div className="flex items-end">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              onClick={handleApply}
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card Tổng số người dùng */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tổng số người dùng
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalUsers}</div>
              <p className="text-xs text-gray-500 mt-1">
                Người dùng đã đăng ký
              </p>
            </CardContent>
          </Card>

          {/* Card Tổng số đặt chỗ */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tổng số đặt chỗ
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalBookings}</div>
              <p className="text-xs text-gray-500 mt-1">Lượt đặt chỗ</p>
            </CardContent>
          </Card>

          {/* Card Tổng số bài viết */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tổng số bài viết
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalBlogs}</div>
              <p className="text-xs text-gray-500 mt-1">Bài viết blog</p>
            </CardContent>
          </Card>

          {/* Card Tổng doanh thu */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Tổng doanh thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.totalRevenue)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Doanh thu</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
