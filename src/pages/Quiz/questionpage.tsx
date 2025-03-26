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
    const [answers, setAnswers] = useState<{questionId: number, questionText: string, answer: string}[]>([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                if (!id) {
                    throw new Error("Không tìm thấy ID của bài kiểm tra");
                }

                const response = await skinTestQuestionService.getSkinTestQuestionsBySkinTestId(Number(id));
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
            setAnswers([...answers, {
                questionId: currentQuestion.id,
                questionText: currentQuestion.questionText,
                answer: selectedOption
            }]);
            
            // Chuyển sang câu hỏi tiếp theo hoặc hoàn thành bài kiểm tra
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
            } else {
                // Chuyển hướng đến trang kết quả với danh sách câu trả lời
                console.log("Hoàn thành bài kiểm tra, kết quả:", answers);
                navigate(`/quiz/${id}/result`, { state: { answers: [...answers, {
                    questionId: currentQuestion.id,
                    questionText: currentQuestion.questionText,
                    answer: selectedOption
                }] } });
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
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="flex justify-center bg-pink-50 py-10">
            <div className="bg-white shadow-lg rounded-2xl p-12 w-[1200px] h-[700px] flex flex-col justify-center border border-green-300">
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                        <div 
                            className="bg-green-400 h-2.5 rounded-full" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-center font-semibold">{currentQuestionIndex + 1}/{questions.length}</p>
                </div>
                <h2 className="text-lg font-semibold mb-2">{currentQuestion.questionText}</h2>
                <div className="space-y-3">
                    {[
                        { key: "A", text: currentQuestion.optionA },
                        { key: "B", text: currentQuestion.optionB },
                        { key: "C", text: currentQuestion.optionC },
                        { key: "D", text: currentQuestion.optionD }
                    ].map((option) => (
                        <button
                            key={option.key}
                            onClick={() => handleOptionClick(option.text)}
                            className={`w-full p-4 border rounded-lg hover:bg-green-100 transition ${
                                selectedOption === option.text ? "bg-green-200" : ""
                            } border-green-300`}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleNextQuestion}
                    className="mt-4 w-[200px] p-3 rounded-full bg-green-200 text-green-700 font-semibold mx-auto block shadow-md hover:bg-green-300 transition"
                    disabled={!selectedOption}
                >
                    {currentQuestionIndex < questions.length - 1 ? "Tiếp theo" : "Hoàn thành"}
                </button>
            </div>
        </div>
    );
}
