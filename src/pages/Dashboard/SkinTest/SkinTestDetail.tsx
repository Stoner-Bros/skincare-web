import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import SkinTestService from "@/services/skin-test";

interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface SkinTest {
  id: number;
  testName: string;
  description: string;
  questions: Question[];
}

const SkinTestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [skinTest, setSkinTest] = useState<SkinTest | null>(null);

  useEffect(() => {
    const fetchSkinTest = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await SkinTestService.getSkinTestById(parseInt(id));
        setSkinTest(response);
      } catch (error) {
        console.error("Lỗi khi tải thông tin bài kiểm tra:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkinTest();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            onClick={handleBack}
          >
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold">Chi Tiết Bài Kiểm Tra</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!skinTest) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            onClick={handleBack}
          >
            <ArrowLeftIcon size={20} />
          </button>
          <h1 className="text-2xl font-bold">Chi Tiết Bài Kiểm Tra</h1>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <p className="text-red-500">Không tìm thấy bài kiểm tra này.</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          onClick={handleBack}
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-bold">Chi Tiết Bài Kiểm Tra</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">{skinTest.testName}</h2>
          <p className="text-gray-600">{skinTest.description}</p>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">ID:</p>
              <p>{skinTest.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Số câu hỏi:</p>
              <p>{skinTest.questions?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Danh sách câu hỏi</h3>

        {!skinTest.questions || skinTest.questions.length === 0 ? (
          <p className="text-gray-500">Chưa có câu hỏi nào cho bài kiểm tra này.</p>
        ) : (
          <div className="space-y-6">
            {skinTest.questions.map((question, index) => (
              <div key={question.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Câu hỏi {index + 1}: {question.questionText}</h4>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center p-2 border rounded">
                    <span className="font-medium mr-2">A:</span>
                    <span>{question.optionA}</span>
                  </div>
                  <div className="flex items-center p-2 border rounded">
                    <span className="font-medium mr-2">B:</span>
                    <span>{question.optionB}</span>
                  </div>
                  <div className="flex items-center p-2 border rounded">
                    <span className="font-medium mr-2">C:</span>
                    <span>{question.optionC}</span>
                  </div>
                  <div className="flex items-center p-2 border rounded">
                    <span className="font-medium mr-2">D:</span>
                    <span>{question.optionD}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinTestDetail; 