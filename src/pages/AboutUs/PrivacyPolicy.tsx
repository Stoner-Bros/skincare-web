import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="w-full min-h-screen bg-gray-200">
      <header className="flex justify-between items-center my-4 mx-72">
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-bold text-red-600">
            <span className="text-xl text-red-600">Thẩm Mỹ Viện</span> Luxspa.vn
          </Link>
        </div>
        <div className="flex flex-col items-end space-y-3 ">
          <div className="flex justify-between items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Button className="text-xl ">Hotline: 1800 3333</Button>
            </div>
            <div className="flex space-x-4 ">
              <input
                type="text"
                placeholder="Tìm kiếm ..."
                className="px-4 py-2 border rounded-lg text-gray-600 "
              />
            </div>
          </div>

          <nav className="flex justify-center space-x-8 w-full">
            <Link
              to="/about"
              className="text-red-600 font-bold hover:text-gray-800"
            >
              VỀ CHÚNG TÔI
            </Link>
            <Link
              to="/services"
              className="text-red-600 font-bold hover:text-gray-800"
            >
              DỊCH VỤ LÀM ĐẸP
            </Link>
            <Link
              to="/phun-xam"
              className="text-red-600 font-bold hover:text-gray-800"
            >
              PHUN XĂM THẨM MỸ
            </Link>
            <Link
              to="/doctor"
              className="text-red-600 font-bold hover:text-gray-800"
            >
              BÁC SĨ
            </Link>
            <Link
              to="/tips"
              className="text-red-600 font-bold hover:text-gray-800"
            >
              TIPS LÀM ĐẸP
            </Link>
            <Link
              to="/franchise"
              className="text-red-600 font-bold hover:text-gray-800"
            >
              NHƯỢNG QUYỀN
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-72 my-12 p-6 bg-[#F8F8F8] rounded-lg">
        <h2 className="text-2xl font-bold text-red-600">
          Chính sách bảo mật thông tin
        </h2>
        <p className="text-gray-700 mt-4">
          Chúng tôi biết rằng sự riêng tư và bảo mật thông tin cá nhân rất quan
          trọng đối với người dùng, vì vậy chúng tôi cam kết nỗ lực tối đa bảo
          vệ sự riêng tư của bạn.
        </p>
        <p className="text-gray-700 mt-2">
          Chính sách bảo mật mô tả cách thức chúng tôi thu thập và xử lý các
          thông tin cá nhân khi bạn sử dụng dịch vụ của SeoulSpa.Vn. Bạn đồng ý
          sử dụng dịch vụ của SeoulSpa.Vn, có nghĩa là bạn hoàn toàn đồng ý với
          các nội dung chúng tôi nêu trong chính sách bảo mật này. Chúng tôi có
          thể sửa đổi nội dung của chính sách bằng cách đăng một bản sửa đổi mới
          lên SeoulSpa.Vn, phiên bản sửa đổi có hiệu lực kể từ thời điểm đăng
          tải.
        </p>
        <p className="text-gray-700 mt-2">
          Chính sách bảo mật thông tin này thường được áp dụng cho trang web và
          các ứng dụng mà chúng tôi sở hữu, vận hành hay nói chung là “dịch vụ”
          là chúng tôi cung cấp cho khách hàng. Chính sách này thường dành cho
          các dữ liệu cá nhân thuộc quyền sở hữu và kiểm soát của chúng tôi thu
          nhập, chia sẻ và cung cấp đến người người.
        </p>
        <p className="text-gray-700 mt-2">
          Nếu bạn xác nhận rằng đã đọc và hiểu với các chính sách bảo mật thông
          tin mà chúng tôi cung cấp, đây sẽ trở thành điều khoản sử dụng hợp
          đồng giữa bạn và chúng tôi. Với điều khoản này, bạn cũng sẽ xác nhận
          cho phép chúng tôi thu thập, sử dụng và xử lý dữ liệu cá nhân theo
          chính sách này.
        </p>

        <h3 className="text-xl font-bold text-red-600 mt-6">
          Thông tin chúng tôi thu thập
        </h3>
        <p className="text-gray-700 mt-2">
          Chúng tôi sẽ thu thập thông tin dựa trên dữ liệu mà người dùng cung
          cấp và thu thập tự động dựa trên địa chỉ IP thiết bị truy cập. Cụ thể
          gồm:
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Thông tin thu thập tự động
        </h4>
        <p className="text-gray-700 mt-2">
          Chúng tôi sẽ thu thập thông tin tự động thông qua địa chỉ IP (Internet
          Protocol). Đây được biết đến là trình duyệt web, tốc độ đường truyền,
          thời gian bạn ở lại trang và các thông tin liên quan đến địa chỉ mà
          Browser truy xuất đến.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Thông tin người dùng cung cấp
        </h4>
        <p className="text-gray-700 mt-2">
          Để khách hàng thể sử dụng các dịch vụ tiện ích mà SeoulSpa.Vn cung
          cấp, người dùng sẽ kê khai thông tin để đăng ký thành viên. Đây là
          cách bạn cung cấp thông tin cá nhân cho chúng tôi và chúng tôi sẽ trực
          tiếp thu thập thông tin từ dữ liệu mà bạn cung cấp. Cụ thể gồm:
        </p>
        <ul className="text-gray-700 list-disc ml-6">
          <li>Họ tên, ngày tháng năm sinh, địa chỉ cư trú</li>
          <li>Tên công ty, đơn vị kinh doanh</li>
          <li>Email, số điện thoại...</li>
        </ul>

        <h3 className="text-xl font-bold text-red-600 mt-6">
          Cách chúng tôi thu thập thông tin
        </h3>
        <p className="text-gray-700 mt-2">
          Chúng tôi sẽ không thu thập được dữ liệu cá nhân của bạn trừ khi bạn
          tự nguyện cung cấp cho chúng tôi, hoặc thông qua bên thứ 3 được ủy
          quyền để chia sẻ dữ liệu cá nhân của bạn đến với chúng tôi. Cụ thể
          gồm:
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Với thông tin thu thập tự động
        </h4>
        <p className="text-gray-700 mt-2">
          Với nguồn dữ liệu thu thập tự động, đây là thông tin thiết bị mà chúng
          tôi sẽ thu thập từ người dùng thông qua trình duyệt web, các cookies
          của từng tệp dữ liệu. Cụ thể gồm:
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Thông tin thiết bị & Dịch vụ
        </h4>
        <p className="text-gray-700 mt-2">
          Khi bạn truy cập vào nền tảng website và sử dụng dịch vụ, chúng tôi sẽ
          thu thập thông tin đăng nhập từ trình duyệt web, thiết bị di động
          thông qua địa chỉ IP. Địa chỉ IP là địa chỉ nhận dạng duy nhất cho một
          thiết bị tại một thời điểm, bao gồm URL và các tùy chọn về cài đặt của
          bạn. Thông tin chúng tôi thu thập sẽ bao gồm những nội dung mà bạn đã
          xem, tương tác, theo dõi, tìm kiếm và số lần nhấp chuột theo thời gian
          tương ứng. Bạn cũng có thể vô hiệu hóa tự thu thập thông tin trong
          phần cài đặt của thiết bị.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">Cookies</h4>
        <p className="text-gray-700 mt-2">
          "Cookies" là những tệp dữ liệu nhỏ trên trình duyệt web khi bạn truy
          cập vào trang web của chúng tôi. Cookies sẽ có khả năng nhận diện
          trình duyệt, thu thập và tiến hành lưu trữ thông tin khi bạn truy cập
          và sử dụng trên trang web của chúng tôi. Các tệp này bao gồm thông tin
          về hoạt động trực tuyến của bạn, chẳng hạn như:
        </p>
        <ul className="text-gray-700 list-disc ml-6">
          <li>Các trang web bạn đã truy cập.</li>
          <li>Các đường link liên kết mà bạn đã nhấp vào.</li>
          <li>Những khu vực bạn đang tìm kiếm.</li>
          <li>Mật khẩu và thông tin đăng nhập trên thiết bị.</li>
          <li>Các sản phẩm bạn đã xem và thêm vào giỏ hàng.</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Cookies có thể được sử dụng để thu thập thông tin từ nhiều thiết bị
          khác nhau mà bạn sử dụng để truy cập cùng một trang web. Điều này có
          nghĩa là ngay cả khi bạn xóa cookies khỏi một thiết bị, nó vẫn có thể
          tồn tại trên các thiết bị khác.
        </p>
        <h3 className="text-xl font-bold text-red-600 mt-6">
          Chúng tôi có chia sẻ thông tin của bạn với ai khác?
        </h3>
        <p className="text-gray-700 mt-2">
          Chúng tôi cam kết không cung cấp thông tin cá nhân của bạn cho bất kỳ
          bên thứ ba nào. Tuy nhiên, chúng tôi có thể tiết lộ thông tin cá nhân
          của bạn trong một số trường hợp dưới đây:
        </p>
        <ul className="text-gray-700 list-disc ml-6">
          <li>Chúng tôi được bạn đồng ý tiết lộ những thông tin này.</li>
          <li>
            Bên thứ ba mà bạn ủy quyền hoặc cho phép có yêu cầu chúng tôi cung
            cấp thông tin cá nhân của bạn.
          </li>
          <li>
            Theo yêu cầu pháp lý hay từ một cơ quan chính phủ hoặc nếu chúng tôi
            tin rằng hành động đó là cần thiết nhằm tuân theo các điều luật pháp
            lý hoặc chiếu theo luật pháp.
          </li>
          <li>Bảo vệ quyền, lợi ích, tài sản, an toàn của một ai khác.</li>
          <li>
            Bắt kẻ tình nghi có thể nào phép chúng tôi tiết lộ dữ liệu cá nhân
            khi bạn yêu cầu.
          </li>
          <li>
            Các bên thứ ba mà bạn chọn kết nối trên trang web của chúng tôi.
          </li>
          <li>
            Các công ty con, công ty thành viên hoặc công ty liên kết của chúng
            tôi.
          </li>
        </ul>
        <p className="text-gray-700 mt-2">
          Ngoài những trường hợp nêu trên nhưng không giới hạn, chúng tôi sẽ
          không công bố thông tin cá nhân của bạn cho bên thứ ba nào khác trừ
          khi chúng tôi hoàn toàn tin rằng, công bố nó là cần thiết nhằm ngăn
          chặn thiệt hại vật chất hoặc tài chính do các yếu tố cố đấu hiệu phạm
          pháp có thể gây ra.
        </p>

        <h3 className="text-xl font-bold text-red-600 mt-6">
          Chúng tôi có thu thập thông tin từ trẻ vị thành niên?
        </h3>
        <p className="text-gray-700 mt-2">
          Chúng tôi không có ý hay có mục đích thu thập thông tin hay dữ liệu từ
          trẻ vị thành niên dưới 18 tuổi. Với một số trường hợp sử dụng dịch vụ,
          khách hàng cần xác nhận đã đủ 18 tuổi. Với một số trường hợp khi chúng
          tôi biết rằng thông tin trẻ vị thành niên dưới 18 tuổi đã được thu
          thập, chúng tôi sẽ nhanh chóng rà soát và xóa toàn bộ các dữ liệu liên
          quan.
        </p>

        <h3 className="text-xl font-bold text-red-600 mt-6">
          Liên kết các website hoặc ứng dụng khác
        </h3>
        <p className="text-gray-700 mt-2">
          Trên trang web của chúng tôi, nếu bạn thực hiện truy cập vào liên kết
          dẫn đến website bên thứ 3, bao gồm cả các trang quảng cáo thì người
          dùng sẽ nhanh chóng rời khỏi trang SeoulSpa.Vn và chuyển hướng đến
          website mà bạn truy cập.
        </p>
        <p className="text-gray-700 mt-2">
          Với vấn đề chuyển hướng này, chúng tôi sẽ không thể kiểm soát mọi hoạt
          động từ các bên thứ 3 và không chịu bất kỳ trách nhiệm an toàn nào từ
          nội dung mà website đó cung cấp.
        </p>

        <h3 className="text-xl font-bold text-red-600 mt-6">
          Hiệu lực và sự thay đổi chính sách bảo mật
        </h3>
        <p className="text-gray-700 mt-2">
          Chính sách bảo mật thông tin tại SeoulSpa.Vn áp dụng với tất cả khách
          hàng, điều khoản hợp đồng nào được áp dụng liên quan đến việc chúng
          tôi tiến hành thu thập thông tin từ dữ liệu cá nhân của bạn. Chúng tôi
          có thể thay đổi chính sách bảo mật này theo thời gian khi chúng tôi
          thấy cần thay đổi và bất kỳ chính sách nào trước đó.
        </p>
        <p className="text-gray-700 mt-2">
          Việc bạn tiếp tục sử dụng các dịch vụ từ trang web của chúng tôi sẽ
          đồng nghĩa với những thay đổi về chính sách bảo mật trên.
        </p>
      </section>

      <footer className="bg-[#F8F8F8] text-gray-900 py-12 mt-12">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between">
          <div className="flex flex-col mb-8 lg:mb-0 w-full lg:w-1/3">
            <div className="flex items-center mb-4">
              <img
                src="/mun.jpg"
                alt="LuxSpa Logo"
                className="w-12 h-12 mr-4"
              />
              <p className="font-bold text-xl text-[#F1588D]">
                TÁI ĐỊNH VỊ THƯƠNG HIỆU
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Thẩm mỹ viện LuxSpa.Vn với nhiều chi nhánh trải dài trên toàn
              quốc, tự hào sở hữu đội ngũ bác sĩ chuyên môn cao, tiên phong công
              nghệ tiên tiến để đem đến giải pháp làm đẹp tối ưu.
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

          <div className="flex flex-col w-full lg:w-1/3 mb-8 lg:mb-0">
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

            <p className="font-bold text-xl text-[#F1588D] mt-8 mb-4">
              CHÍNH SÁCH
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>
                <a href="#" className="hover:text-[#F1588D]">
                  Chính sách bảo mật thông tin
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#F1588D]">
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

          <div className="flex flex-col w-full lg:w-1/3 text-center">
            <p className="font-bold text-xl text-[#F1588D] mb-4">
              TẢI ỨNG DỤNG
            </p>
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
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
