import { useEffect, useState } from "react";
import SkinTestService from "@/services/skin-test";
import SkinTestAnswerService, {
  SkinTestAnswer,
} from "@/services/skin-test-answer";
import skinTestResultService from "@/services/skin-test-result";
import skinTestQuestionService from "@/services/skin-test-question";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface SkinTest {
  skinTestId: number;
  testName: string;
  description: string;
  createdAt: string;
}

export default function QuizPage() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [tests, setTests] = useState<SkinTest[]>([]);
  const [quizHistory, setQuizHistory] = useState<SkinTestAnswer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const { toast } = useToast();

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [resultDetail, setResultDetail] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingResult, setLoadingResult] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;

  useEffect(() => {
    fetchSkinTests();
    if (isLoggedIn && user) {
      fetchQuizHistory();
    } else {
      setLoadingHistory(false);
    }
  }, [isLoggedIn, user]);

  // Fetch result details when dialog opens
  useEffect(() => {
    if (isDialogOpen && selectedAnswerId) {
      fetchResultDetail(selectedAnswerId);
    } else {
      // Reset data when dialog closes
      setResultDetail(null);
      setQuestions([]);
      setTestResult(null);
    }
  }, [isDialogOpen, selectedAnswerId]);

  const fetchSkinTests = async () => {
    setLoading(true);
    try {
      const data = await SkinTestService.getSkinTests();
      setTests(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi khi tải danh sách bài kiểm tra da",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizHistory = async () => {
    setLoadingHistory(true);
    try {
      if (!user) {
        console.log("Người dùng chưa đăng nhập");
        setLoadingHistory(false);
        return;
      }

      // Lấy accountId từ thông tin user
      let accountId: number | undefined;

      // Kiểm tra nhiều kiểu cấu trúc user khác nhau để tìm accountId
      if (user.accountId) {
        accountId = user.accountId;
      } else if (user.accountInfo?.accountId) {
        accountId = user.accountInfo.accountId;
      } else if (user.account?.id) {
        accountId = user.account.id;
      } else if (user.id) {
        accountId = user.id;
      }

      if (!accountId) {
        console.log(
          "Không tìm thấy accountId trong thông tin người dùng:",
          user
        );
        setLoadingHistory(false);
        return;
      }

      console.log("Đã tìm thấy accountId:", accountId);

      // Sử dụng accountId thay cho customerId khi gọi API
      const historyData =
        await SkinTestAnswerService.getSkinTestAnswerHistoryByCustomerId(
          accountId
        );
      console.log("Lịch sử làm bài của người dùng:", historyData);

      // Sắp xếp lịch sử làm bài với ID mới nhất lên đầu
      const sortedHistoryData = [...historyData].sort(
        (a, b) => b.answerId - a.answerId
      );
      console.log(
        "Lịch sử làm bài đã sắp xếp (mới nhất lên đầu):",
        sortedHistoryData
      );

      setQuizHistory(sortedHistoryData);
      // Reset về trang đầu tiên khi có dữ liệu mới
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử làm bài:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch sử làm bài kiểm tra",
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchResultDetail = async (answerId: number) => {
    setLoadingResult(true);
    try {
      // Lấy thông tin bài làm từ API
      const resultData = await SkinTestAnswerService.getSkinTestAnswerById(
        answerId
      );
      console.log(
        `Đã nhận dữ liệu bài làm chi tiết với answerId: ${answerId}`,
        resultData
      );
      setResultDetail(resultData);

      // Lấy kết quả khuyến nghị từ API
      try {
        console.log(`Đang lấy kết quả khuyến nghị cho answerId: ${answerId}`);
        // SkinTestAnswerID của result sẽ so với AnswerID của SkinTestAnswer
        const resultResponse =
          await skinTestResultService.getSkinTestResultById(answerId);

        if (resultResponse) {
          console.log("Đã nhận kết quả khuyến nghị:", resultResponse);
          setTestResult(resultResponse);
        } else {
          console.warn(
            `Không tìm thấy kết quả khuyến nghị cho answerId: ${answerId}`
          );
          toast({
            title: "Thông báo",
            description: "Bài kiểm tra này chưa có khuyến nghị từ chuyên gia",
            variant: "default",
          });
          setTestResult(null);
        }
      } catch (error: any) {
        console.error("Lỗi khi lấy kết quả khuyến nghị:", error);
        if (
          error.response?.status === 404 ||
          error.message?.includes("Không tìm thấy kết quả")
        ) {
          // Nếu lỗi 404 Not Found hoặc không tìm thấy kết quả
          console.warn(
            `Không tìm thấy dữ liệu kết quả khuyến nghị cho answerId: ${answerId}`
          );
          toast({
            title: "Thông báo",
            description: "Bài kiểm tra này chưa có khuyến nghị từ chuyên gia",
            variant: "default",
          });
        } else {
          // Các lỗi khác
          toast({
            title: "Lỗi",
            description: "Không thể tải kết quả khuyến nghị",
            variant: "destructive",
          });
        }
        setTestResult(null);
      }

      // Nếu có skinTestId, lấy danh sách câu hỏi
      if (resultData.skinTestId) {
        try {
          const questionsData =
            await skinTestQuestionService.getSkinTestQuestionsBySkinTestId(
              resultData.skinTestId
            );
          setQuestions(questionsData);
        } catch (err) {
          console.error("Lỗi khi lấy câu hỏi từ API:", err);
          setQuestions([]);
          toast({
            title: "Lỗi",
            description: "Không thể lấy danh sách câu hỏi từ API",
            variant: "destructive",
          });
        }
      } else {
        console.warn("Không có skinTestId trong kết quả");
        setQuestions([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết kết quả:", error);
      setResultDetail(null);
      setQuestions([]);
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description:
          "Không thể tải chi tiết kết quả bài kiểm tra. Vui lòng thử lại sau.",
      });
    } finally {
      setLoadingResult(false);
    }
  };

  const handleStartQuiz = (id: number) => {
    // Chuyển hướng đến trang câu hỏi với ID bài kiểm tra tương ứng
    navigate(`/quiz/${id}/questions`);
  };

  const handleViewResult = (answerId: number) => {
    if (!answerId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID của bài làm",
        variant: "destructive",
      });
      return;
    }
    setSelectedAnswerId(answerId);
    setIsDialogOpen(true);
  };

  // Hàm kết hợp câu hỏi và câu trả lời
  const getQuestionWithAnswer = () => {
    if (
      !resultDetail ||
      !questions.length ||
      !Array.isArray(resultDetail.answers)
    ) {
      return [];
    }

    return questions.map((question, index) => {
      const answer =
        index < resultDetail.answers.length
          ? resultDetail.answers[index]
          : "Không có câu trả lời";
      return {
        question,
        answer,
      };
    });
  };

  // Tính toán các trang và mục hiển thị trong trang hiện tại
  const totalPages = Math.ceil(quizHistory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = quizHistory.slice(indexOfFirstItem, indexOfLastItem);

  // Phân trang cho danh sách bài kiểm tra
  const [quizPage, setQuizPage] = useState<number>(1);
  const quizPerPage = 4;
  const totalQuizPages = Math.ceil(tests.length / quizPerPage);
  const indexOfLastQuiz = quizPage * quizPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizPerPage;
  const currentQuizItems = tests.slice(indexOfFirstQuiz, indexOfLastQuiz);

  // Xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // Xử lý chuyển trang cho quiz
  const handleQuizPageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalQuizPages) page = totalQuizPages;
    setQuizPage(page);
  };

  // Tạo danh sách các trang
  const renderPaginationItems = () => {
    const items = [];

    // Thêm nút trang trước
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // Hiển thị tối đa 5 trang
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Thêm dấu ... nếu không bắt đầu từ trang 1
    if (startPage > 1) {
      items.push(
        <PaginationItem key="start">
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Thêm các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Thêm dấu ... nếu không kết thúc ở trang cuối
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key="end">
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Thêm nút trang sau
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          className={
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    );

    return items;
  };

  // Tạo danh sách trang cho phần quiz
  const renderQuizPaginationItems = () => {
    const items = [];

    // Thêm nút trang trước
    items.push(
      <PaginationItem key="quiz-prev">
        <PaginationPrevious
          onClick={() => handleQuizPageChange(quizPage - 1)}
          className={quizPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // Hiển thị tối đa 5 trang
    const maxPagesToShow = 5;
    let startPage = Math.max(1, quizPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalQuizPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Thêm dấu ... nếu không bắt đầu từ trang 1
    if (startPage > 1) {
      items.push(
        <PaginationItem key="quiz-start">
          <PaginationLink onClick={() => handleQuizPageChange(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (startPage > 2) {
        items.push(
          <PaginationItem key="quiz-ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Thêm các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`quiz-${i}`}>
          <PaginationLink
            isActive={quizPage === i}
            onClick={() => handleQuizPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Thêm dấu ... nếu không kết thúc ở trang cuối
    if (endPage < totalQuizPages) {
      if (endPage < totalQuizPages - 1) {
        items.push(
          <PaginationItem key="quiz-ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key="quiz-end">
          <PaginationLink onClick={() => handleQuizPageChange(totalQuizPages)}>
            {totalQuizPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Thêm nút trang sau
    items.push(
      <PaginationItem key="quiz-next">
        <PaginationNext
          onClick={() => handleQuizPageChange(quizPage + 1)}
          className={
            quizPage === totalQuizPages ? "pointer-events-none opacity-50" : ""
          }
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-b from-pink-50 to-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-3 text-pink-600">
            Kiểm tra da của bạn
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Làm bài kiểm tra để hiểu rõ hơn về tình trạng da và nhận khuyến nghị
            chăm sóc phù hợp
          </p>
        </div>
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-7/12">
            <h3 className="text-2xl font-bold mb-6 text-pink-600 border-b border-pink-200 pb-2">
              Bài kiểm tra da
            </h3>
            {loading ? (
              <div className="flex justify-center items-center h-60 bg-white rounded-xl shadow-md">
                <div className="text-center text-gray-500">
                  <svg
                    className="animate-spin h-8 w-8 mx-auto mb-2 text-pink-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tải bài kiểm tra...
                </div>
              </div>
            ) : (
              <>
                {currentQuizItems.map((test) => (
                  <div
                    key={test.skinTestId}
                    className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-pink-100 hover:shadow-lg transition duration-300"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img
                          src="/tesst.webp"
                          alt={test.testName}
                          className="h-48 md:h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <h3 className="text-xl font-bold text-pink-600 mb-2">
                          {test.testName}
                        </h3>
                        <p className="text-gray-600 mb-4">{test.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Ngày tạo:{" "}
                            {new Date(test.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                          <button
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg shadow hover:from-pink-600 hover:to-pink-700 transition duration-300"
                            onClick={() => handleStartQuiz(test.skinTestId)}
                          >
                            Bắt đầu kiểm tra
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Phân trang cho bài kiểm tra */}
                {totalQuizPages > 1 && (
                  <Pagination className="mt-4 mb-8">
                    <PaginationContent>
                      {renderQuizPaginationItems()}
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}

            {!loading && tests.length === 0 && (
              <div className="text-center bg-white rounded-xl shadow-md p-8">
                <svg
                  className="h-16 w-16 mx-auto text-pink-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600">Không có bài kiểm tra da nào.</p>
              </div>
            )}
          </div>
          <div className="w-full lg:w-5/12">
            <h3 className="text-2xl font-bold mb-6 text-pink-600 border-b border-pink-200 pb-2">
              Lịch sử kiểm tra
            </h3>
            <div className="bg-white rounded-xl shadow-md p-6 border border-pink-100">
              {!isLoggedIn ? (
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-yellow-700 flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Vui lòng đăng nhập để xem lịch sử làm bài
                  </p>
                </div>
              ) : loadingHistory ? (
                <div className="flex justify-center items-center h-40">
                  <div className="text-center text-gray-500">
                    <svg
                      className="animate-spin h-8 w-8 mx-auto mb-2 text-pink-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang tải lịch sử làm bài...
                  </div>
                </div>
              ) : quizHistory && quizHistory.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {currentItems.map((item) => (
                    <div
                      key={item.answerId}
                      className="bg-white p-4 rounded-lg border border-pink-100 hover:border-pink-300 transition-colors shadow-sm hover:shadow"
                    >
                      <h4 className="font-bold text-pink-600 text-lg">
                        {item.skinTest.testName}
                      </h4>
                      <p className="text-gray-600 mb-2 text-sm">
                        {item.skinTest.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm mb-3">
                        <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded-full flex items-center">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {new Date(item.skinTest.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full flex items-center">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                          ID: {item.answerId}
                        </span>
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Đã làm
                        </span>
                      </div>
                      <button
                        className="w-full mt-2 py-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-lg shadow hover:from-pink-500 hover:to-pink-600 transition duration-300 flex justify-center items-center"
                        onClick={() => handleViewResult(item.answerId)}
                      >
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Xem kết quả
                      </button>
                    </div>
                  ))}

                  {/* Phân trang */}
                  {totalPages > 1 && (
                    <Pagination className="mt-4">
                      <PaginationContent>
                        {renderPaginationItems()}
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <svg
                    className="h-16 w-16 mx-auto text-pink-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-600">Không có lịch sử làm khảo sát</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog hiển thị kết quả */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-pink-600">
              Chi tiết bài kiểm tra da
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <span className="sr-only">Đóng</span>
            </DialogClose>
          </DialogHeader>

          {loadingResult ? (
            <div className="space-y-4 p-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <div className="space-y-6 p-4 max-h-[80vh] overflow-y-auto">
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-bold text-xl text-pink-600 mb-1">
                  {resultDetail?.skinTest?.testName || "Bài kiểm tra da"}
                </h3>
                <p className="text-gray-600">
                  {resultDetail?.skinTest?.description ||
                    "Kết quả và câu trả lời bài kiểm tra da của khách hàng"}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-lg text-pink-600 border-b border-pink-100 pb-2">
                  Câu hỏi và câu trả lời của bạn:
                </h4>

                {getQuestionWithAnswer().length > 0 ? (
                  getQuestionWithAnswer().map((item, index) => (
                    <div
                      key={index}
                      className="border border-pink-100 rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="font-medium mb-3 text-gray-800 flex items-start">
                        <span className="bg-pink-100 text-pink-600 rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{item.question.questionText}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                        <div className="bg-gray-50 p-2 rounded text-sm border border-gray-100">
                          A: {item.question.optionA}
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-sm border border-gray-100">
                          B: {item.question.optionB}
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-sm border border-gray-100">
                          C: {item.question.optionC}
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-sm border border-gray-100">
                          D: {item.question.optionD}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <span className="font-medium text-green-700">
                          Câu trả lời của bạn:{" "}
                        </span>
                        <span className="text-gray-800">{item.answer}</span>
                      </div>
                    </div>
                  ))
                ) : resultDetail?.answers && resultDetail.answers.length > 0 ? (
                  resultDetail.answers.map((answer: string, index: number) => (
                    <div
                      key={index}
                      className="border border-pink-100 rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="font-medium mb-3 text-gray-800 flex items-center">
                        <span className="bg-pink-100 text-pink-600 rounded-full h-6 w-6 flex items-center justify-center mr-2">
                          {index + 1}
                        </span>
                        <span>Câu hỏi {index + 1}</span>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <span className="font-medium text-green-700">
                          Câu trả lời của bạn:{" "}
                        </span>
                        <span className="text-gray-800">{answer}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-red-200 rounded-lg p-6 bg-red-50 text-center">
                    <svg
                      className="h-12 w-12 mx-auto text-red-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-800 font-medium">
                      Không tìm thấy dữ liệu
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Không có dữ liệu câu hỏi và câu trả lời
                    </p>
                  </div>
                )}
              </div>

              {/* Hiển thị kết quả từ API nếu có */}
              {testResult && (
                <div className="space-y-4 border-t border-pink-100 pt-6 mt-6">
                  <h4 className="font-bold text-lg text-pink-600 mb-2">
                    Khuyến nghị từ chuyên gia:
                  </h4>
                  {typeof testResult.result === "string" ? (
                    (() => {
                      try {
                        // Log đối tượng kết quả để debug
                        console.log("Phân tích dữ liệu kết quả:", testResult);

                        // Kiểm tra xem result có phải là chuỗi JSON hợp lệ không
                        let parsedResult = null;
                        try {
                          parsedResult = JSON.parse(testResult.result);
                          console.log(
                            "Đã parse thành công kết quả:",
                            parsedResult
                          );
                        } catch (err) {
                          console.warn(
                            "Không thể parse kết quả dưới dạng JSON:",
                            testResult.result
                          );
                          return (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <p className="font-medium text-gray-800 mb-2">
                                Nội dung khuyến nghị:
                              </p>
                              <p className="text-gray-700">
                                {testResult.result}
                              </p>
                            </div>
                          );
                        }

                        if (!parsedResult) {
                          console.warn("JSON parse trả về null hoặc undefined");
                          return (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                              <p className="text-gray-700">
                                Không thể hiển thị chi tiết kết quả
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            {parsedResult.treatmentName && (
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="font-medium text-blue-700 mb-1">
                                  Liệu trình đề xuất:
                                </p>
                                <p className="text-gray-800">
                                  {parsedResult.treatmentName}
                                </p>
                              </div>
                            )}
                            {parsedResult.description && (
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="font-medium text-gray-700 mb-1">
                                  Mô tả liệu trình:
                                </p>
                                <p className="text-gray-800">
                                  {parsedResult.description}
                                </p>
                              </div>
                            )}
                            {parsedResult.message && (
                              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                <p className="font-medium text-yellow-700 mb-1">
                                  Lời nhắn:
                                </p>
                                <p className="text-gray-800">
                                  {parsedResult.message}
                                </p>
                              </div>
                            )}
                            {/* Hiển thị tất cả dữ liệu trong đối tượng đã parse nếu không có trường nào trên */}
                            {!parsedResult.treatmentName &&
                              !parsedResult.description &&
                              !parsedResult.message && (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                  <p className="font-medium text-gray-700 mb-1">
                                    Thông tin kết quả:
                                  </p>
                                  <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-40 bg-gray-100 p-3 rounded">
                                    {JSON.stringify(parsedResult, null, 2)}
                                  </pre>
                                </div>
                              )}
                          </div>
                        );
                      } catch (e) {
                        console.error("Lỗi khi xử lý dữ liệu kết quả:", e);
                        return (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="font-medium text-gray-700 mb-1">
                              Dữ liệu gốc:
                            </p>
                            <p className="text-gray-800">{testResult.result}</p>
                          </div>
                        );
                      }
                    })()
                  ) : testResult.result ? (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-700 mb-1">
                        Thông tin kết quả (không phải chuỗi):
                      </p>
                      <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-40 bg-gray-100 p-3 rounded">
                        {JSON.stringify(testResult.result, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-700 mb-1">
                        Thông tin kết quả:
                      </p>
                      <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-40 bg-gray-100 p-3 rounded">
                        {JSON.stringify(testResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
