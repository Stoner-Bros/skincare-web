export default function MyProfile() {
  return (
    <div className="flex flex-col items-center justify-center py-10 bg-pink-50">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-2xl font-medium text-center mb-6"> My Profile</h2>

        <div className="flex justify-center mb-5">
          <div className="bg-gray-200 text-black w-20 h-20 flex items-center justify-center rounded-full text-2xl">
            BD
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              defaultValue="Bùi Đức Hoàng"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              defaultValue="khoiminhpham1@gmail.com"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
            <input
              type="Address"
              defaultValue="Nhà Văn Hóa Sinh Viên"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
            <input
              type="tel"
              defaultValue="0892342342"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
