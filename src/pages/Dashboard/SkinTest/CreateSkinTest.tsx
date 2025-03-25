import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import SkinTestService from "@/services/skin-test";

interface SkinTestFormData {
  testName: string;
  description: string;
}

const CreateSkinTest: React.FC = () => {
  const [formData, setFormData] = useState<SkinTestFormData>({
    testName: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    testName?: string;
    description?: string;
  }>({});
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      testName?: string;
      description?: string;
    } = {};
    
    if (!formData.testName.trim()) {
      newErrors.testName = "Vui lòng nhập tên bài kiểm tra!";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả bài kiểm tra!";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      await SkinTestService.createSkinTest(formData);
      alert("Bài kiểm tra da đã được tạo thành công!");
      navigate("/quiz/manage");
    } catch (error) {
      console.error("Lỗi khi tạo bài kiểm tra da:", error);
      alert("Có lỗi xảy ra khi tạo bài kiểm tra da. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/quiz/manage");
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
          onClick={handleCancel}
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-bold">Thêm Mới Bài Kiểm Tra Da</h1>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="testName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên Bài Kiểm Tra
            </label>
            <input
              type="text"
              id="testName"
              name="testName"
              value={formData.testName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.testName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên bài kiểm tra"
            />
            {errors.testName && (
              <p className="mt-1 text-sm text-red-500">{errors.testName}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Mô Tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mô tả chi tiết về bài kiểm tra da này"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button 
              type="button"
              onClick={handleCancel}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSkinTest; 