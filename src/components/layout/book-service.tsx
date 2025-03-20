export default function BookService({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-pink-100 p-6 rounded-2xl shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-red-500 text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-center text-xl font-bold text-pink-600 mb-4">
          Đặt lịch hẹn
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-pink-700">Họ và tên: (*)</label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-pink-700">Số điện thoại: (*)</label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-pink-700">Chọn dịch vụ (*)</label>
            <select required className="w-full p-2 border rounded">
              <option value="">Chọn dịch vụ</option>
              {/* Các tùy chọn dịch vụ */}
            </select>
          </div>
          <div>
            <label className="block text-pink-700">Chọn chi nhánh: (*)</label>
            <select required className="w-full p-2 border rounded">
              <option value="">Chọn chi nhánh</option>
              {/* Các tùy chọn chi nhánh */}
            </select>
          </div>
          <div>
            <label className="block text-pink-700">Chọn thời gian: (*)</label>
            <input
              type="datetime-local"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg shadow hover:bg-pink-600"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
}
