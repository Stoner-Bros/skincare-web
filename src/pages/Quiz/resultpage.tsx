import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AccountService from "@/services/account.services";
import SkinTestAnswerService from "@/services/skin-test-answer";
import skinTestQuestionService from "@/services/skin-test-question";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<{
    fullName: string;
    phone: string;
    email: string;
  }>({ fullName: "", phone: "", email: "" });

  // Lấy danh sách câu trả lời từ location state
  const answers = location.state?.answers || [];

  // Chuyển đổi định dạng câu trả lời để phù hợp với API
  const formattedAnswers = answers.map((answer: any) => answer.answer);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        if (id) {
          const questionData =
            await skinTestQuestionService.getSkinTestQuestionsBySkinTestId(
              Number(id)
            );
          if (questionData && Array.isArray(questionData)) {
            setQuestions(questionData);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu câu hỏi:", err);
      }
    };

    fetchQuestions();
  }, [id]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (isLoggedIn && user) {
          // Lấy thông tin từ đối tượng user trước
          let userInfo = {
            fullName: "",
            phone: "",
            email: user.email || "",
          };

          // Xác định ID tài khoản để lấy thông tin chi tiết
          let accountId = null;

          if (user.accountInfo?.accountId) {
            accountId = user.accountInfo.accountId;
            userInfo.fullName = user.accountInfo.fullName || "";
            userInfo.phone = user.accountInfo.phone || "";
          } else if (user.accountId) {
            accountId = user.accountId;
          } else if (user.account && user.account.id) {
            accountId = user.account.id;
          } else if (user.id) {
            accountId = user.id;
          }

          // Nếu có ID tài khoản và chưa có thông tin đầy đủ, gọi API để lấy thông tin chi tiết
          if (accountId && (!userInfo.fullName || !userInfo.phone)) {
            try {
              const accountDetails = await AccountService.getAccountById(
                accountId
              );
              console.log("Thông tin chi tiết tài khoản:", accountDetails);

              // Cập nhật thông tin từ API nếu có
              userInfo.fullName = accountDetails.fullName || userInfo.fullName;
              userInfo.phone = accountDetails.phone || userInfo.phone;
            } catch (apiErr) {
              console.error("Lỗi khi lấy thông tin tài khoản từ API:", apiErr);
            }
          }

          // Cập nhật state
          setUserDetails(userInfo);
          console.log("Đã lấy thông tin người dùng:", userInfo);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    fetchUserDetails();
  }, [isLoggedIn, user]);

  // Hàm lấy nội dung câu hỏi theo ID
  const getQuestionTextById = (questionId: number) => {
    const question = questions.find((q) => q.id === questionId);
    return question ? question.questionText : `Câu hỏi số ${questionId}`;
  };

  const handleSubmitAnswers = async () => {
    if (formattedAnswers.length === 0) {
      setError("Không có câu trả lời để gửi");
      return;
    }

    // Kiểm tra thông tin người dùng
    if (!userDetails.fullName.trim()) {
      setError(
        "Không tìm thấy thông tin họ tên. Vui lòng cập nhật thông tin cá nhân trước khi tiếp tục."
      );
      return;
    }

    if (!userDetails.phone.trim()) {
      setError(
        "Không tìm thấy thông tin số điện thoại. Vui lòng cập nhật thông tin cá nhân trước khi tiếp tục."
      );
      return;
    }

    try {
      setSubmitting(true);

      // In ra thông tin user để kiểm tra
      console.log("Thông tin user:", user);
      console.log("Đã đăng nhập:", isLoggedIn);
      console.log("Thông tin chi tiết người dùng:", userDetails);

      // Tạo đối tượng dữ liệu để gửi đến API
      const answerData = {
        skinTestId: Number(id),
        answers: formattedAnswers,
        fullName: userDetails.fullName,
        phone: userDetails.phone,
        email: userDetails.email || undefined,
      };

      console.log("Dữ liệu gửi đi:", JSON.stringify(answerData, null, 2));

      // Gửi dữ liệu đến API
      const result = await SkinTestAnswerService.createSkinTestAnswer(
        answerData
      );
      console.log("Kết quả từ API:", result);

      setSuccess(true);
      toast({
        title: "Thành công",
        description: "Câu trả lời của bạn đã được gửi thành công",
        variant: "default",
      });
    } catch (err: any) {
      console.error("Chi tiết lỗi:", err);

      // Log chi tiết nếu có response data
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }

      setError(err.message || "Đã xảy ra lỗi khi gửi câu trả lời");
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi gửi câu trả lời",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-pink-100">
        <div className="p-8 md:p-10">
          <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
            Kết quả bài kiểm tra da
          </h1>

          {error && (
            <div className="w-full bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
              <div className="flex">
                <svg
                  className="h-6 w-6 text-red-500 mr-3"
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
                <p>{error}</p>
              </div>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-16 h-16 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                Cảm ơn bạn đã hoàn thành bài kiểm tra!
              </h2>
              <p className="mb-8 text-gray-600 max-w-md mx-auto">
                Câu trả lời của bạn đã được ghi lại thành công. Chúng tôi sẽ
                phân tích và đưa ra khuyến nghị phù hợp cho làn da của bạn.
              </p>
              <button
                onClick={handleBackToQuiz}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:from-pink-600 hover:to-pink-700 transition shadow-md"
              >
                Quay lại trang bài kiểm tra
              </button>
            </div>
          ) : (
            <>
              <div className="bg-pink-50 p-6 rounded-xl mb-8 border border-pink-100">
                <h2 className="text-xl font-bold mb-4 text-pink-600 border-b border-pink-100 pb-2">
                  Tóm tắt câu trả lời của bạn
                </h2>
                <ul className="space-y-4">
                  {answers.map((answer: any, index: number) => (
                    <li
                      key={index}
                      className="p-5 border border-pink-100 rounded-lg bg-white shadow-sm"
                    >
                      <div className="mb-3">
                        <span className="font-bold text-pink-600 flex items-center">
                          <span className="bg-pink-100 text-pink-600 rounded-full h-6 w-6 flex items-center justify-center mr-2">
                            {index + 1}
                          </span>
                          Câu hỏi:
                        </span>
                        <p className="text-gray-800 mt-1 pl-8">
                          {answer.questionText ||
                            getQuestionTextById(answer.questionId)}
                        </p>
                      </div>
                      <div>
                        <span className="font-bold text-green-600 flex items-center">
                          <span className="bg-green-100 text-green-600 rounded-full h-6 w-6 flex items-center justify-center mr-2">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                          Câu trả lời:
                        </span>
                        <p className="text-gray-800 mt-1 pl-8">
                          {answer.answer}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleBackToQuiz}
                  className="px-6 py-3 bg-gray-200 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                >
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
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Huỷ bỏ
                </button>
                <button
                  onClick={handleSubmitAnswers}
                  disabled={
                    submitting || !userDetails.fullName || !userDetails.phone
                  }
                  className={`px-6 py-3 rounded-full flex items-center justify-center text-white shadow-md ${
                    submitting || !userDetails.fullName || !userDetails.phone
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                      Đang gửi...
                    </>
                  ) : (
                    <>
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Gửi câu trả lời
                    </>
                  )}
                </button>
              </div>

              {(!userDetails.fullName || !userDetails.phone) && (
                <div className="mt-4 text-center text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <svg
                    className="h-5 w-5 inline-block mr-1"
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
                  Vui lòng cập nhật thông tin cá nhân trước khi gửi câu trả lời
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
