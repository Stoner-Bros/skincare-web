import React, { useState } from 'react';
import consultationService from '@/services/consultation.services';
import { toast } from "@/hooks/use-toast";

export default function AdviceService({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await consultationService.createConsultingForm({
        fullName: formData.fullName,
        phone: formData.phone,
        email: `khachhang_${Date.now()}@example.com`, // Tự động tạo email
        message: `Yêu cầu tư vấn từ khách hàng ${formData.fullName}`, // Tự động tạo message
      });
      
      toast({
        title: "Thành công",
        description: "Chúng tôi đã nhận được thông tin của bạn. Chúng tôi sẽ liên hệ với bạn sớm.",
        variant: "default",
      });
      
      // Reset form sau khi gửi thành công
      setFormData({
        fullName: '',
        phone: '',
      });
      
      // Đóng popup sau 3 giây
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.",
        variant: "default",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96 relative border border-pink-300">
        <button
          className="absolute top-2 right-2 text-red-500 text-2xl"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M15.4905 15.4905C15.3294 15.652 15.1379 15.7802 14.9272 15.8676C14.7165 15.955 14.4905 16 14.2624 16C14.0342 16 13.8083 15.955 13.5976 15.8676C13.3868 15.7802 13.1954 15.652 13.0342 15.4905L7.99963 10.456L2.96504 15.4905C2.63931 15.8163 2.19753 15.9993 1.73688 15.9993C1.27623 15.9993 0.834449 15.8163 0.508721 15.4905C0.182992 15.1648 0 14.723 0 14.2624C0 14.0343 0.0449253 13.8084 0.132212 13.5977C0.219498 13.387 0.347436 13.1955 0.508721 13.0342L5.54331 7.99963L0.508721 2.96504C0.182992 2.63931 0 2.19753 0 1.73688C0 1.27623 0.182992 0.834449 0.508721 0.508721C0.834449 0.182992 1.27623 0 1.73688 0C2.19753 0 2.63931 0.182992 2.96504 0.508721L7.99963 5.54331L13.0342 0.508721C13.1955 0.347436 13.387 0.219498 13.5977 0.132212C13.8084 0.0449253 14.0343 0 14.2624 0C14.4905 0 14.7163 0.0449253 14.9271 0.132212C15.1378 0.219498 15.3293 0.347436 15.4905 0.508721C15.6518 0.670005 15.7798 0.861477 15.8671 1.07221C15.9543 1.28293 15.9993 1.50879 15.9993 1.73688C15.9993 1.96497 15.9543 2.19083 15.8671 2.40156C15.7798 2.61229 15.6518 2.80376 15.4905 2.96504L10.456 7.99963L15.4905 13.0342C16.1525 13.6962 16.1525 14.8111 15.4905 15.4905Z"
              fill="#CF2144"
            ></path>
          </svg>
        </button>

        <div className="text-center mb-4">
          <img src="/logo.svg" alt="Slide 1" className="w-full object-cover" />
          <h2 className="text-red-600 font-bold text-lg mt-2">
            TƯ VẤN CÙNG CHUYÊN GIA
            <br />
            THẨM MỸ VIỆN SEOULSPA
          </h2>
        </div>

        {message && (
          <div className={`p-2 rounded mb-4 text-center ${message.includes('thành công') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-red-400">
              Họ và tên: <span className="text-pink-300">❤</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Họ và tên"
              required
              className="w-full p-2 border rounded border-red-500"
            />
          </div>
          <div>
            <label className="block text-red-400">
              Số điện thoại: <span className="text-pink-300">❤</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Số Điện Thoại"
              required
              className="w-full p-2 border rounded border-red-500"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-white text-red-500 border border-red-500 font-medium py-2 px-10 rounded-3xl hover:bg-pink-50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Đang gửi...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
