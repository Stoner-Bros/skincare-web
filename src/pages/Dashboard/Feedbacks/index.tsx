import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import feedbackReplyService from "@/services/feedback-reply.services";
import feedbackService from "@/services/feedback.services";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

// Interface cho dữ liệu feedback
interface Feedback {
  feedbackId: number;
  bookingId: number;
  feedbackBy?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  feedbackReplies: any[]; // Array of feedback replies
}

interface FeedbackResponse {
  status: number;
  message: string;
  data: {
    items: Feedback[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export default function Feedbacks() {
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(6); // Cố định pageSize là 6
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [replyDialogOpen, setReplyDialogOpen] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchFeedbacks();
    
    // Log thông tin useAuth
    console.log("useAuth - Thông tin người dùng:", user);
    console.log("useAuth - Trạng thái đăng nhập:", isLoggedIn);
  }, [pageNumber, user, isLoggedIn]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response: FeedbackResponse = await feedbackService.getFeedbacks(
        pageNumber,
        pageSize
      );
      console.log("Dữ liệu feedback API response:", response);

      if (response && response.status === 200 && response.data) {
        setFeedbacks(response.data.items || []);
        setTotalPages(response.data.totalPages || 1);
        console.log("Đã lưu danh sách feedback:", response.data.items);
      } else {
        console.error("Lỗi khi lấy dữ liệu feedback:", response);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) {
      try {
        await feedbackService.deleteFeedback(id);
        fetchFeedbacks(); // Tải lại dữ liệu sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa feedback:", error);
      }
    }
  };

  const handleOpenReplyDialog = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    
    // Log thông tin người dùng khi mở dialog
    console.log("Mở dialog phản hồi - Thông tin user:", user);
    console.log("Mở dialog phản hồi - Tên người dùng:", user?.accountInfo?.fullName);
    
    // Nếu đã có reply, hiển thị reply cũ
    if (feedback.feedbackReplies && feedback.feedbackReplies.length > 0) {
      setReplyText(feedback.feedbackReplies[0].reply || "");
    } else {
      setReplyText("");
    }
    
    setReplyDialogOpen(true);
  };

  const handleSubmitReply = async () => {
    // Log thông tin người dùng trước khi gửi phản hồi
    console.log("Gửi phản hồi - Thông tin user:", user);
    console.log("Gửi phản hồi - Tên người dùng:", user?.accountInfo?.fullName);
    
    if (!selectedFeedback || !replyText.trim()) return;
    
    try {
      setSubmitting(true);
      
      // Chuẩn bị dữ liệu gửi lên API
      const replyData = {
        reply: replyText,
        staffName: user?.accountInfo?.fullName || "Admin" // Sử dụng fullName từ accountInfo
      };
      
      console.log("Dữ liệu gửi lên API:", replyData);
      
      // Kiểm tra xem đã có phản hồi chưa
      if (selectedFeedback.feedbackReplies && selectedFeedback.feedbackReplies.length > 0) {
        // Nếu có rồi thì update
        const replyId = selectedFeedback.feedbackReplies[0].feedbackReplyId;
        await feedbackReplyService.updateFeedbackReply(replyId, replyData);
      } else {
        // Chưa có thì tạo mới
        await feedbackReplyService.createFeedbackReply(
          selectedFeedback.feedbackId, 
          replyData
        );
      }
      
      toast({
        title: "Thành công",
        description: "Đã lưu phản hồi thành công",
        duration: 3000,
      });
      
      setReplyDialogOpen(false);
      fetchFeedbacks(); // Tải lại dữ liệu
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu phản hồi. Vui lòng thử lại sau.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };


  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-pink-600">
              Quản lý Feedback
            </CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Tìm kiếm feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">FeedbackID</TableHead>
                      <TableHead className="w-[100px]">BookingID</TableHead>
                      <TableHead className="w-[150px]">Đánh giá</TableHead>
                      <TableHead>Bình luận</TableHead>
                      <TableHead className="w-[150px]">Trạng thái</TableHead>
                      <TableHead className="w-[180px] text-center">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.length > 0 ? (
                      filteredFeedbacks.map((feedback) => (
                        <TableRow key={feedback.feedbackId}>
                          <TableCell className="font-medium">
                            {feedback.feedbackId}
                          </TableCell>
                          <TableCell>{feedback.bookingId}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <span
                                  key={index}
                                  className={`text-xl ${
                                    index < feedback.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="ml-2 text-sm">
                                ({feedback.rating}/5)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {feedback.comment}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                feedback.feedbackReplies &&
                                feedback.feedbackReplies.length > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {feedback.feedbackReplies &&
                              feedback.feedbackReplies.length > 0
                                ? "Đã phản hồi"
                                : "Chưa phản hồi"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-green-600 border-green-600 hover:bg-green-50"
                                onClick={() => handleOpenReplyDialog(feedback)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Phản hồi
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() =>
                                  handleDelete(feedback.feedbackId)
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Xóa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Không tìm thấy dữ liệu feedback nào.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                    className="flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Trước
                  </Button>

                  {totalPages > 0 &&
                    Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page =
                        pageNumber > 3
                          ? // Nếu trang hiện tại > 3, bắt đầu từ trang hiện tại - 2
                            pageNumber + i - Math.min(2, pageNumber - 1)
                          : // Ngược lại bắt đầu từ trang 1
                            i + 1;

                      // Dừng nếu đã vượt quá tổng số trang
                      if (page > totalPages) return null;

                      return (
                        <Button
                          key={page}
                          variant={pageNumber === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className="w-9 h-9 p-0"
                        >
                          {page}
                        </Button>
                      );
                    }).filter(Boolean)}

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(pageNumber + 1)}
                    disabled={pageNumber >= totalPages}
                    className="flex items-center"
                  >
                    Sau
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog Phản hồi Feedback */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Phản hồi Feedback</DialogTitle>
            <DialogDescription>
              {selectedFeedback && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                  <p className="font-medium text-sm">FeedbackID: {selectedFeedback.feedbackId}</p>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          className={`text-lg ${
                            index < (selectedFeedback?.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      ({selectedFeedback?.rating}/5)
                    </span>
                  </div>
                  <p className="mt-2 text-sm italic">{selectedFeedback.comment}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-2">
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Nhân viên phản hồi:</span> {user?.accountInfo?.fullName || "Admin"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Nội dung phản hồi:</label>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" disabled={submitting}>Hủy</Button>
            </DialogClose>
            <Button 
              onClick={handleSubmitReply} 
              disabled={submitting || !replyText.trim()}
            >
              {submitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Đang xử lý
                </>
              ) : (
                'Lưu phản hồi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
