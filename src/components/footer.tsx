export default function Footer() {
  return (
    <footer className="bg-[#F8F8F8] text-gray-900 py-12">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between">
        <div className="flex flex-col mb-8 lg:mb-0 w-full lg:w-1/3">
          <div className="flex items-center mb-4">
            <img src="/logo.gif" alt="Slide 1" className="w-full object-cover" />
          </div>
          <p className="text-sm text-gray-600 mb-4 w-[400px]">
            Thẩm mỹ viện LuxSpa.Vn với nhiều chi nhánh trải dài trên toàn quốc,
            tự hào sở hữu đội ngũ bác sĩ chuyên môn cao, tiên phong công nghệ
            tiên tiến để đem đến giải pháp làm đẹp tối ưu.
          </p>
          <div className="space-y-2">
            <p className="text-lg font-semibold">THÔNG TIN LIÊN HỆ</p>
            <p className="text-sm text-gray-600">
              120 Ni Sư Huỳnh Liên, Phường 10, Tân Bình, TP.HCM
            </p>
            <p className="text-sm text-gray-600">1800 3333 (CSKH)</p>
            <p className="text-sm text-gray-600">
              0911 025 477 (Tư Vấn Nhượng Quyền)
            </p>
            <p className="text-sm text-gray-600">cskh@luxspa.vn</p>
            <p className="text-sm text-gray-600">
              Thời gian làm việc: Từ 8:45 đến 19:30 hàng ngày
            </p>
            <p className="text-sm text-gray-600">-----------------</p>
            <p className="text-sm text-gray-600">Theo dõi chúng tôi tại</p>
            <div className="flex space-x-1">
              <img
                src="/facebook.png"
                alt="facebook"
                className="w-[35px] h-[35px] object-cover rounded-lg"
              />
              <img
                src="/instagram.png"
                alt="Instagram"
                className="w-[35px] h-[35px] object-cover rounded-lg"
              />
              <img
                src="/youtube.png"
                alt="Youtube"
                className="w-[35px] h-[35px] object-cover rounded-lg"
              />
              <img
                src="/gmail.png"
                alt="gmail"
                className="w-[35px] h-[35px] object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full lg:w-1/3 mb-8 lg:mb-0 gap-20">
          <div>
            <p className="font-bold text-xl text-[#F1588D] mb-4">
              BÀI VIẾT NỔI BẬT
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <a href="#" className="hover:text-[#F1588D]">
                  Bảng giá dịch vụ spa
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F1588D]">
                  Điều khác chân mày giá bao nhiêu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F1588D]">
                  Tắm trắng bao nhiêu tiền
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F1588D]">
                  Triệt lông vĩnh viễn giá bao nhiêu
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-xl text-[#F1588D] mb-4">CHÍNH SÁCH</p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <a href="/privacy-policy" className="hover:text-[#F1588D]">
                  Chính sách bảo mật thông tin
                </a>
              </li>
              <li>
                <a href="/content-policy" className="hover:text-[#F1588D]">
                  Chính sách biên tập nội dung
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F1588D]">
                  Chính sách đổi trả hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F1588D]">
                  Chính sách vận chuyển và thanh toán
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/3 text-center">
          <p className="font-bold text-xl text-[#F1588D] mb-4">TẢI ỨNG DỤNG</p>
          <div className="flex justify-center space-x-4 mb-6">
            <a href="#" className="text-white">
              <img src="/Googleplay.png" alt="Google Play" className="w-32" />
            </a>
            <a href="#" className="text-white">
              <img src="/Appstore.png" alt="App Store" className="w-32" />
            </a>
          </div>

          <div className="flex justify-center space-x-4">
            <a href="#" className="text-white text-xl hover:text-[#F1588D]">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-white text-xl hover:text-[#F1588D]">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="text-white text-xl hover:text-[#F1588D]">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <p className="text-sm text-gray-600">
          Copyright © 2024 LuxSpa.vn. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
