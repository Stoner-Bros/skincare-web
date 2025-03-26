import { useEffect, useState } from "react";
import SkinTestService from "@/services/skin-test";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SkinTest {
  skinTestId: number;
  testName: string;
  description: string;
  createdAt: string;
}

export default function QuizPage() {
    const navigate = useNavigate();
    const [tests, setTests] = useState<SkinTest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { toast } = useToast();
    
    useEffect(() => {
        fetchSkinTests();
    }, []);

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
    
    const handleStartQuiz = (id: number) => {
        // Chuyển hướng đến trang câu hỏi với ID bài kiểm tra tương ứng
        navigate(`/quiz/${id}/questions`);
    };

    return (

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
                        tests.map((test) => (
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
                        ))
                    )}

                    {!loading && tests.length === 0 && (
                        <div className="text-center w-full">
                            <p>Không có bài kiểm tra da nào.</p>
                        </div>
                    )}
                </div>
                <div className='w-5/12 p-4 sticky'>
                    <div className='w-[650px] h-[600px] bg-white p-4 rounded-2xl shadow-lg border border-green-300'>
                        <h3 className='text-xl font-bold mb-2'>Quiz History</h3>
                        {tests.slice(0, 3).map((test) => (
                            <div key={test.skinTestId} className='bg-white p-2 mb-2 rounded-2xl shadow-lg border border-green-300 border-l-8'>
                                <h4 className='font-bold'> {test.testName}</h4>
                                <h4 className='font-semibold'> {test.description}</h4>
                                <p>Trạng thái: <span className='text-green-500'>Đã làm</span></p>
                            </div>
                        ))}
                        {tests.length === 0 && (
                            <div className='bg-white p-2 mb-2 rounded-2xl shadow-lg border border-green-300 border-l-8'>
                                <p className='text-center'>Không có lịch làm khảo sát</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    )
}
