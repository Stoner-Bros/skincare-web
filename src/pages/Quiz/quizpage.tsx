import { useEffect, useState } from "react";
import SkinTestService from "@/services/skin-test";
import SkinTestAnswerService, { SkinTestAnswer } from "@/services/skin-test-answer";
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
                console.log("Không tìm thấy accountId trong thông tin người dùng:", user);
                setLoadingHistory(false);
                return;
            }
            
            console.log("Đã tìm thấy accountId:", accountId);
            
            // Sử dụng accountId thay cho customerId khi gọi API
            const historyData = await SkinTestAnswerService.getSkinTestAnswerHistoryByCustomerId(accountId);
            console.log("Lịch sử làm bài của người dùng:", historyData);
            
            // Sắp xếp lịch sử làm bài với ID mới nhất lên đầu
            const sortedHistoryData = [...historyData].sort((a, b) => b.answerId - a.answerId);
            console.log("Lịch sử làm bài đã sắp xếp (mới nhất lên đầu):", sortedHistoryData);
            
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
            const resultData = await SkinTestAnswerService.getSkinTestAnswerById(answerId);
            console.log(`Đã nhận dữ liệu bài làm chi tiết với answerId: ${answerId}`, resultData);
            setResultDetail(resultData);
            
            // Lấy kết quả khuyến nghị từ API
            try {
                console.log(`Đang lấy kết quả khuyến nghị cho answerId: ${answerId}`);
                // SkinTestAnswerID của result sẽ so với AnswerID của SkinTestAnswer
                const resultResponse = await skinTestResultService.getSkinTestResultById(answerId);
                
                if (resultResponse) {
                    console.log("Đã nhận kết quả khuyến nghị:", resultResponse);
                    setTestResult(resultResponse);
                } else {
                    console.warn(`Không tìm thấy kết quả khuyến nghị cho answerId: ${answerId}`);
                    toast({
                        title: "Thông báo",
                        description: "Bài kiểm tra này chưa có khuyến nghị từ chuyên gia",
                        variant: "default",
                    });
                    setTestResult(null);
                }
            } catch (error: any) {
                console.error("Lỗi khi lấy kết quả khuyến nghị:", error);
                if (error.response?.status === 404 || error.message?.includes("Không tìm thấy kết quả")) {
                    // Nếu lỗi 404 Not Found hoặc không tìm thấy kết quả
                    console.warn(`Không tìm thấy dữ liệu kết quả khuyến nghị cho answerId: ${answerId}`);
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
                    const questionsData = await skinTestQuestionService.getSkinTestQuestionsBySkinTestId(
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
                description: "Không thể tải chi tiết kết quả bài kiểm tra. Vui lòng thử lại sau.",
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
        if (!resultDetail || !questions.length || !Array.isArray(resultDetail.answers)) {
            return [];
        }

        return questions.map((question, index) => {
            const answer = index < resultDetail.answers.length 
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
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} 
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
                    <PaginationLink onClick={() => handleQuizPageChange(1)}>1</PaginationLink>
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
                    className={quizPage === totalQuizPages ? "pointer-events-none opacity-50" : ""} 
                />
            </PaginationItem>
        );
        
        return items;
    };

    return (
        <>
            <div className='w-full min-h-screen bg-white'>
                <div className='text-center'>
                    <h2 className='text-3xl font-bold mb-2'>
                        Tham gia các bài kiểm tra về da của chúng tôi
                    </h2>
                    <h2 className='text-lg'>
                        Để hiểu hơn về da của bạn đang cần được chăm sóc như thế nào
                    </h2>
                </div>
                <div className='w-full bg-white flex'>
                    <div className='w-7/12 p-4 flex flex-col items-end'>
                        {loading ? (
                            <div className="text-center w-full">Đang tải bài kiểm tra...</div>
                        ) : (
                            <>
                                {currentQuizItems.map((test) => (
                                    <div key={test.skinTestId} className="w-[950px] h-[200px] bg-white rounded-2xl shadow-lg flex items-center border border-pink-300 mb-5">
                                        <img src="/tesst.webp" alt={test.testName} className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                                        <div className="h-[200px] px-4 py-2 flex flex-col grow">
                                            <h3 className="text-pink-500 font-semibold text-lg mb-2">{test.testName}</h3>
                                            <p className="text-gray-600 text-base tracking-widest">{test.description}</p>
                                            <button 
                                                className="border border-green-500 text-white bg-green-500 px-3 py-1 rounded-md text-sm shadow-md hover:bg-green-600 w-fit mt-3"
                                                onClick={() => handleStartQuiz(test.skinTestId)}
                                            >
                                                Start Quiz
                                            </button>
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
                            <div className="text-center w-full">
                                <p>Không có bài kiểm tra da nào.</p>
                            </div>
                        )}
                    </div>
                    <div className='w-5/12 p-4 sticky'>
                        <div className='w-[650px] h-[600px] bg-white p-4 rounded-2xl shadow-lg border border-green-300 overflow-auto'>
                            <h3 className='text-xl font-bold mb-2'>Quiz History</h3>
                            {!isLoggedIn ? (
                                <div className='bg-white p-2 mb-2 rounded-2xl shadow-lg border border-yellow-300 border-l-8'>
                                    <p className='text-center'>Vui lòng đăng nhập để xem lịch sử làm bài</p>
                                </div>
                            ) : loadingHistory ? (
                                <div className="text-center w-full p-4">
                                    <p>Đang tải lịch sử làm bài...</p>
                                </div>
                            ) : (
                                quizHistory && quizHistory.length > 0 ? (
                                    <>
                                        {currentItems.map((item) => (
                                            <div key={item.answerId} className='bg-white p-2 mb-2 rounded-2xl shadow-lg border border-green-300 border-l-8'>
                                                <h4 className='font-bold'>{item.skinTest.testName}</h4>
                                                <h4 className='font-semibold'>{item.skinTest.description}</h4>
                                                <p>Ngày làm bài: <span className='text-blue-500'>{new Date(item.skinTest.createdAt).toLocaleDateString('vi-VN')}</span></p>
                                                <p>ID bài làm: <span className='text-purple-500'>{item.answerId}</span></p>
                                                <p>Trạng thái: <span className='text-green-500'>Đã làm</span></p>
                                                <button 
                                                    className="mt-2 border border-blue-500 text-white bg-blue-500 px-3 py-1 rounded-md text-sm shadow-md hover:bg-blue-600 w-fit"
                                                    onClick={() => handleViewResult(item.answerId)}
                                                >
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
                                    </>
                                ) : (
                                    <div className='bg-white p-2 mb-2 rounded-2xl shadow-lg border border-green-300 border-l-8'>
                                        <p className='text-center'>Không có lịch sử làm khảo sát</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Dialog hiển thị kết quả */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết bài kiểm tra da</DialogTitle>
                        <DialogClose className="absolute right-4 top-4">
                            <span className="sr-only">Đóng</span>
                        </DialogClose>
                    </DialogHeader>

                    {loadingResult ? (
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-lg">
                                    {resultDetail?.skinTest?.testName || "Bài kiểm tra da"}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {resultDetail?.skinTest?.description ||
                                    "Kết quả và câu trả lời bài kiểm tra da của khách hàng"}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium">Danh sách câu hỏi và câu trả lời:</h4>

                                {getQuestionWithAnswer().length > 0 ? (
                                    getQuestionWithAnswer().map((item, index) => (
                                    <div key={index} className="border rounded-md p-4">
                                        <div className="font-medium mb-2">
                                            Câu hỏi {index + 1}: {item.question.questionText}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            <div className="bg-gray-100 p-2 rounded text-sm">
                                                A: {item.question.optionA}
                                            </div>
                                            <div className="bg-gray-100 p-2 rounded text-sm">
                                                B: {item.question.optionB}
                                            </div>
                                            <div className="bg-gray-100 p-2 rounded text-sm">
                                                C: {item.question.optionC}
                                            </div>
                                            <div className="bg-gray-100 p-2 rounded text-sm">
                                                D: {item.question.optionD}
                                            </div>
                                        </div>
                                        <div className="bg-green-100 p-2 rounded">
                                            <span className="font-medium">Câu trả lời: </span>
                                            {item.answer}
                                        </div>
                                    </div>
                                    ))
                                ) : resultDetail?.answers && resultDetail.answers.length > 0 ? (
                                    // Nếu không có câu hỏi nhưng có câu trả lời, hiển thị dạng đơn giản
                                    resultDetail.answers.map((answer: string, index: number) => (
                                    <div key={index} className="border rounded-md p-4">
                                        <div className="font-medium mb-2">Câu hỏi {index + 1}</div>
                                        <div className="bg-green-100 p-2 rounded">
                                            <span className="font-medium">Câu trả lời: </span>
                                            {answer}
                                        </div>
                                    </div>
                                    ))
                                ) : (
                                    <div className="border border-red-200 rounded-md p-4 bg-red-50">
                                        <p className="text-gray-800 font-medium">
                                            Không tìm thấy dữ liệu
                                        </p>
                                        <p className="text-gray-500">
                                            Không có dữ liệu câu hỏi và câu trả lời
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Hiển thị kết quả từ API nếu có */}
                            {testResult && (
                                <div className="space-y-2 border-t pt-4 mt-4">
                                    <h4 className="font-medium">Khuyến nghị từ chuyên gia:</h4>
                                    {typeof testResult.result === 'string' ? (
                                        (() => {
                                            try {
                                                // Log đối tượng kết quả để debug
                                                console.log("Phân tích dữ liệu kết quả:", testResult);
                                                
                                                // Kiểm tra xem result có phải là chuỗi JSON hợp lệ không
                                                let parsedResult = null;
                                                try {
                                                    parsedResult = JSON.parse(testResult.result);
                                                    console.log("Đã parse thành công kết quả:", parsedResult);
                                                } catch (err) {
                                                    console.warn("Không thể parse kết quả dưới dạng JSON:", testResult.result);
                                                    return (
                                                        <div className="bg-gray-50 p-3 rounded-md">
                                                            <p className="font-medium">Nội dung khuyến nghị:</p>
                                                            <p>{testResult.result}</p>
                                                        </div>
                                                    );
                                                }
                                                
                                                if (!parsedResult) {
                                                    console.warn("JSON parse trả về null hoặc undefined");
                                                    return (
                                                        <div className="bg-gray-50 p-3 rounded-md">
                                                            <p>Không thể hiển thị chi tiết kết quả</p>
                                                        </div>
                                                    );
                                                }
                                                
                                                return (
                                                    <div className="space-y-2">
                                                        {parsedResult.treatmentName && (
                                                            <div className="bg-blue-50 p-3 rounded-md">
                                                                <p className="font-medium">Liệu trình đề xuất:</p>
                                                                <p>{parsedResult.treatmentName}</p>
                                                            </div>
                                                        )}
                                                        {parsedResult.description && (
                                                            <div className="bg-gray-50 p-3 rounded-md">
                                                                <p className="font-medium">Mô tả liệu trình:</p>
                                                                <p>{parsedResult.description}</p>
                                                            </div>
                                                        )}
                                                        {parsedResult.message && (
                                                            <div className="bg-yellow-50 p-3 rounded-md">
                                                                <p className="font-medium">Lời nhắn:</p>
                                                                <p>{parsedResult.message}</p>
                                                            </div>
                                                        )}
                                                        {/* Hiển thị tất cả dữ liệu trong đối tượng đã parse nếu không có trường nào trên */}
                                                        {!parsedResult.treatmentName && !parsedResult.description && !parsedResult.message && (
                                                            <div className="bg-gray-50 p-3 rounded-md">
                                                                <p className="font-medium">Thông tin kết quả:</p>
                                                                <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-40">
                                                                    {JSON.stringify(parsedResult, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            } catch (e) {
                                                console.error("Lỗi khi xử lý dữ liệu kết quả:", e);
                                                return (
                                                    <div className="bg-gray-50 p-3 rounded-md">
                                                        <p className="font-medium">Dữ liệu gốc:</p>
                                                        <p>{testResult.result}</p>
                                                    </div>
                                                );
                                            }
                                        })()
                                    ) : testResult.result ? (
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <p className="font-medium">Thông tin kết quả (không phải chuỗi):</p>
                                            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-40">
                                                {JSON.stringify(testResult.result, null, 2)}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <p className="font-medium">Thông tin kết quả:</p>
                                            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-40">
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
    )
}
