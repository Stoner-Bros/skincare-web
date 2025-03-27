import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import skinTestQuestionService from "@/services/skin-test-question";

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: number; questionText: string; answer: string }[]
  >([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("Không tìm thấy ID của bài kiểm tra");
        }

        const response =
          await skinTestQuestionService.getSkinTestQuestionsBySkinTestId(
            Number(id)
          );
        if (response && Array.isArray(response)) {
          setQuestions(response);
        } else {
          throw new Error("Dữ liệu câu hỏi không hợp lệ");
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải câu hỏi");
        console.error("Lỗi khi tải câu hỏi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption && currentQuestionIndex < questions.length) {
      // Lưu câu trả lời hiện tại
      const currentQuestion = questions[currentQuestionIndex];
      setAnswers([
        ...answers,
        {
          questionId: currentQuestion.id,
          questionText: currentQuestion.questionText,
          answer: selectedOption,
        },
      ]);

      // Chuyển sang câu hỏi tiếp theo hoặc hoàn thành bài kiểm tra
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        // Chuyển hướng đến trang kết quả với danh sách câu trả lời
        console.log("Hoàn thành bài kiểm tra, kết quả:", answers);
        navigate(`/quiz/${id}/result`, {
          state: {
            answers: [
              ...answers,
              {
                questionId: currentQuestion.id,
                questionText: currentQuestion.questionText,
                answer: selectedOption,
              },
            ],
          },
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-pink-50">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Đang tải câu hỏi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-pink-50">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-green-200 rounded-lg"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-pink-50">
        <div className="text-center">
          <p>Không có câu hỏi nào cho bài kiểm tra này</p>
          <button
            className="mt-4 px-4 py-2 bg-green-200 rounded-lg"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage =
    ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-pink-100">
        <div className="relative">
          <div className="h-2 bg-gray-100">
            <div
              className="h-2 bg-gradient-to-r from-pink-400 to-pink-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="absolute top-0 left-0 right-0 flex justify-center -mt-5">
            <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {currentQuestion.questionText}
            </h2>
            <p className="text-gray-500 text-sm">Chọn một lựa chọn bên dưới</p>
          </div>

          <div className="space-y-4">
            {[
              { key: "A", text: currentQuestion.optionA },
              { key: "B", text: currentQuestion.optionB },
              { key: "C", text: currentQuestion.optionC },
              { key: "D", text: currentQuestion.optionD },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleOptionClick(option.text)}
                className={`w-full p-5 rounded-xl border-2 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 flex items-center ${
                  selectedOption === option.text
                    ? "border-pink-500 bg-pink-50 shadow-md"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    selectedOption === option.text
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {option.key}
                </span>
                <span
                  className={`text-left ${
                    selectedOption === option.text
                      ? "font-medium text-gray-800"
                      : "text-gray-600"
                  }`}
                >
                  {option.text}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className={`px-8 py-3 rounded-full font-medium text-white shadow-lg transform transition-all duration-300 ${
                !selectedOption
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 hover:scale-105"
              }`}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                <span className="flex items-center">
                  Tiếp theo
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              ) : (
                <span className="flex items-center">
                  Hoàn thành
                  <svg
                    className="w-5 h-5 ml-2"
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
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Define a CSS animation for the spinner
const style = document.createElement("style");
style.textContent = `
  @keyframes spinner {
    to {transform: rotate(360deg);}
  }
  .spinner:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    margin-top: -20px;
    margin-left: -20px;
    border-radius: 50%;
    border: 3px solid #f3f3f3;
    border-top-color: #e879f9;
    animation: spinner .8s linear infinite;
  }
`;
document.head.appendChild(style);
