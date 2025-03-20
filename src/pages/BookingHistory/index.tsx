import React, { useState } from 'react';
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

// Định nghĩa kiểu dữ liệu cho booking
interface Booking {
  id: string;
  date: string;
  serviceName: string;
  status: "Checked Out" | "Confirmed" | "Pending";
  therapistName?: string;
  duration?: string;
  startTime?: string;
  endTime?: string;
  price?: string;
  // paymentStatus?: string;
}

const BookingHistory: React.FC = () => {
  
  const bookings: Booking[] = [
    {
      id: "1",
      date: "12-03-2025",
      serviceName: "Acne Control Treatment",
      status: "Checked Out",
      therapistName: "khoiThe",
      duration: "30 Mins",
      startTime: "08:30:00",
      endTime: "09:00:00",
      price: "1320000 VND",
      // paymentStatus: "Pending",
    },
    {
      id: "2",
      date: "12-03-2025",
      serviceName: "Chemical Peel Treatment",
      status: "Checked Out",
      therapistName: "ThaoNguyen",
      duration: "45 Mins",
      startTime: "10:00:00",
      endTime: "10:45:00",
      price: "1500000 VND",
      // paymentStatus: "Paid",
    },
    {
      id: "3", 
      date: "22-03-2025",
      serviceName: "Advanced Hydration Therapy",
      status: "Confirmed",
      therapistName: "MinhHa",
      duration: "60 Mins",
      startTime: "14:00:00",
      endTime: "15:00:00",
      price: "2100000 VND",
      // paymentStatus: "Pending",
    },
    {
      id: "4", 
      date: "22-03-2025",
      serviceName: "Advanced Hydration Therapy",
      status: "Confirmed",
      therapistName: "MinhHa",
      duration: "60 Mins",
      startTime: "14:00:00",
      endTime: "15:00:00",
      price: "2100000 VND",
      // paymentStatus: "Pending",
    },
    {
      id: "5", 
      date: "22-03-2025",
      serviceName: "Advanced Hydration Therapy",
      status: "Confirmed",
      therapistName: "MinhHa",
      duration: "60 Mins",
      startTime: "14:00:00",
      endTime: "15:00:00",
      price: "2100000 VND",
      // paymentStatus: "Pending",
    },
    {
      id: "6", 
      date: "22-03-2025",
      serviceName: "Advanced Hydration Therapy",
      status: "Confirmed",
      therapistName: "MinhHa",
      duration: "60 Mins",
      startTime: "14:00:00",
      endTime: "15:00:00",
      price: "2100000 VND",
      // paymentStatus: "Pending",
    },
  ];

  // State cho booking đang được xem chi tiết
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(bookings[0]);

  // Function để render badge dựa vào trạng thái
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Checked Out":
        return <Badge variant="checked">Checked Out</Badge>;
      case "Confirmed":
        return <Badge variant="confirmed">Confirmed</Badge>;
      case "Pending":
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function để render payment status badge
  // const renderPaymentStatusBadge = (status: string) => {
  //   switch (status) {
  //     case "Pending":
  //       return <Badge variant="warning">Pending</Badge>;
  //     case "Paid":
  //       return <Badge variant="success">Paid</Badge>;
  //     default:
  //       return <Badge>{status}</Badge>;
  //   }
  // };

  // Xử lý khi nhấn vào View Detail
  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  return (
    <div className="container mx-auto py-10 bg-pink-">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7">
          <Card className="bg-pink-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-center">Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left font-bold">Booking Date</TableHead>
                    <TableHead className="text-left font-bold">Service Name</TableHead>
                    <TableHead className="text-left font-bold">Status</TableHead>
                    <TableHead className="text-left font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>{booking.serviceName}</TableCell>
                      <TableCell>{renderStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="default" 
                          className="bg-lime-500 hover:bg-lime-600"
                          onClick={() => handleViewDetail(booking)}
                        >
                          View Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="rounded-full w-8 h-8 p-0 bg-white">1</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Detail Card */}
        <div className="md:col-span-5">
          {selectedBooking && (
            <Card className="bg-white h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">Booking Detail</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Booking Date</td>
                      <td className="py-3 text-right">2025-03-12</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Status</td>
                      <td className="py-3 text-right">{renderStatusBadge(selectedBooking.status)}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Service Name</td>
                      <td className="py-3 text-right">{selectedBooking.serviceName}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Therapist Name</td>
                      <td className="py-3 text-right">{selectedBooking.therapistName || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Duration</td>
                      <td className="py-3 text-right">{selectedBooking.duration || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Start Time</td>
                      <td className="py-3 text-right">{selectedBooking.startTime || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">End Time</td>
                      <td className="py-3 text-right">{selectedBooking.endTime || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Service Price</td>
                      <td className="py-3 text-right">{selectedBooking.price || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 font-medium text-gray-700">Payment Status</td>
                      {/* <td className="py-3 text-right">
                        {selectedBooking.paymentStatus ? renderPaymentStatusBadge(selectedBooking.paymentStatus) : "N/A"}
                      </td> */}
                    </tr>
                  </tbody>
                </table>
                  <Button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded">
                    Write Blog
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
