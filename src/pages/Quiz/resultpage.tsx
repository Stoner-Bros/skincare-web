import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SkinTestAnswerService from "@/services/skin-test-answer";
import skinTestQuestionService from "@/services/skin-test-question";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import AccountService from "@/services/account.services";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(false);
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
          setLoading(true);

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
      } finally {
        setLoading(false);
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
    <div className="flex justify-center bg-pink-50 py-10 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-12 w-[1200px] flex flex-col items-center border border-green-300">
        <h1 className="text-3xl font-bold mb-8 text-green-700">
          Kết quả bài kiểm tra da
        </h1>

        {error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
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
            <h2 className="text-2xl font-semibold mb-2">
              Cảm ơn bạn đã hoàn thành bài kiểm tra!
            </h2>
            <p className="mb-6 text-gray-600">
              Câu trả lời của bạn đã được ghi lại thành công.
            </p>
            <button
              onClick={handleBackToQuiz}
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              Quay lại trang bài kiểm tra
            </button>
          </div>
        ) : (
          <>
            <div className="w-full bg-green-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Tóm tắt câu trả lời của bạn
              </h2>
              <ul className="space-y-4">
                {answers.map((answer: any, index: number) => (
                  <li
                    key={index}
                    className="p-4 border border-green-200 rounded-lg bg-white"
                  >
                    <div className="mb-2">
                      <span className="font-bold text-green-700">
                        Câu hỏi {index + 1}:
                      </span>
                      <p className="text-gray-800 mt-1">
                        {answer.questionText ||
                          getQuestionTextById(answer.questionId)}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-green-700">
                        Câu trả lời:
                      </span>
                      <p className="text-gray-800 mt-1">{answer.answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleBackToQuiz}
                className="px-6 py-3 bg-gray-200 rounded-full hover:bg-gray-300 transition"
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleSubmitAnswers}
                disabled={
                  submitting || !userDetails.fullName || !userDetails.phone
                }
                className={`px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition ${
                  submitting || !userDetails.fullName || !userDetails.phone
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {submitting ? "Đang gửi..." : "Gửi câu trả lời"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
