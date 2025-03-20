import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContentPolicy = () => {
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
          Chính sách biên tập nội dung
        </h2>
        <p className="text-gray-700 mt-4">
          Chúng tôi là SeoulSpa.Vn, nội dung trên website mà chúng tôi cung cấp
          đến khách hàng chủ yếu là về các chủ đề làm đẹp như chăm sóc da, tắm
          trắng, triệt lông, giảm béo, phun xăm.
        </p>
        <p className="text-gray-700 mt-2">
          Vì thế, nội dung mà chúng tôi cung cấp hầu hết đều liên quan đến các
          chuyên mục làm đẹp để mang đến những thông tin bổ ích, thú vị và cần
          thiết cho hành trình làm đẹp của mình.
        </p>

        <h3 className="text-xl font-bold text-red-600 mt-6">
          Quy trình biên tập nội dung
        </h3>
        <p className="text-gray-700 mt-2">
          Quy trình làm việc và biên tập nội dung của đội ngũ biên tập viên đều
          dựa theo quy trình, quy chuẩn riêng trong lĩnh vực làm đẹp.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">Lên kế hoạch</h4>
        <p className="text-gray-700 mt-2">
          Đầu tiên, biên tập viên sẽ xác định mục tiêu nội dung và thực hiện lên
          kế hoạch sản xuất nội dung phù hợp.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Lên dàn bài và viết bài
        </h4>
        <p className="text-gray-700 mt-2">
          Sau khi đã có kế hoạch triển khai nội dung, biên tập viên sẽ thực hiện
          lên bố cục dàn ý và triển khai viết bài.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Tiến hành biên tập nội dung
        </h4>
        <p className="text-gray-700 mt-2">
          Sau khi hoàn thành bài viết, chuyên viên sẽ tiến hành biên tập nội
          dung để đảm bảo tính logic hoàn chỉnh.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Gửi duyệt, chỉnh sửa và xuất bản
        </h4>
        <p className="text-gray-700 mt-2">
          Sau quá trình biên tập nội dung, bài viết sẽ được kiểm duyệt lại bởi
          đội ngũ chuyên môn trước khi xuất bản.
        </p>

        <h3 className="text-xl font-bold text-red-600 mt-6">
          Nguyên tắc cốt lõi khi biên tập nội dung
        </h3>
        <p className="text-gray-700 mt-2">
          Với chính sách biên tập nội dung tại SeoulSpa.Vn, nội dung cung cấp
          đến độc giả sẽ được dựa trên nguyên tắc cốt lõi để đảm bảo chất lượng
          tốt nhất.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Đảm bảo thông tin chính xác, minh bạch
        </h4>
        <ul className="text-gray-700 mt-2 list-disc pl-5">
          <li>
            Nội dung phải được kiểm tra kỹ lưỡng để đảm bảo tính chính xác về
            mặt thông tin, các dữ liệu
          </li>
          <li>
            Đảm bảo thông tin nguồn tin uy tín và đáng tin cậy để tham khảo và
            trích dẫn
          </li>
          <li>Không đưa thông tin sai lệch gây tiêu cực đến người đọc</li>
        </ul>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Câu từ rõ ràng, dễ hiểu
        </h4>
        <ul className="text-gray-700 mt-2 list-disc pl-5">
          <li>
            Ngôn từ sử dụng đơn giản, súc tích, dễ hiểu giúp đảm bảo phù hợp với
            mọi tệp khách hàng
          </li>
          <li>
            Nội dung đảm bảo logic, bố cục rõ ràng để đem đến mạch lạc, trôi
            chảy cho người đọc
          </li>
          <li>
            SeoulSpa.Vn hạn chế sử dụng các từ ngữ chuyên ngành hoặc cấu trúc
            câu quá phức tạp khi trình bày thông tin
          </li>
        </ul>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Đảm bảo thông tin hữu ích
        </h4>
        <ul className="text-gray-700 mt-2 list-disc pl-5">
          <li>
            Nội dung được SeoulSpa.Vn lựa chọn dựa trên sự quan tâm và nhu cầu
            tìm hiểu của người đọc
          </li>
          <li>
            Đảm bảo đem đến thông tin có giá trị liên quan đến các chủ đề thẩm
            mỹ, làm đẹp
          </li>
          <li>
            Nội dung được biên tập theo chủ đề có liên quan, không lan man, dài
            dòng
          </li>
        </ul>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Tính mới mẻ, sáng tạo
        </h4>
        <ul className="text-gray-700 mt-2 list-disc pl-5">
          <li>
            Nội dung được cập nhật thường xuyên để cung cấp những thông tin mới
            nhất cho người đọc
          </li>
          <li>
            Các chủ đề bài viết đảm bảo tính xu hướng trong thời điểm hiện tại
          </li>
          <li>
            Không sao chép, copy các nội dung đã có sẵn. Mọi thông tin tham khảo
            đều được trích nguồn rõ ràng
          </li>
        </ul>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Tiêu chuẩn văn hóa, đạo đức
        </h4>
        <ul className="text-gray-700 mt-2 list-disc pl-5">
          <li>
            Mọi nội dung biên tập tại SeoulSpa.Vn đều tuân thủ các quy định về
            bản quyền
          </li>
          <li>
            Mọi ngôn ngữ từ ngữ phải phù hợp với những nguyên tắc về đạo đức và
            chuẩn mực xã hội
          </li>
          <li>Luôn tôn trọng mọi ý kiến và quan điểm từ độc giả</li>
        </ul>
        <h3 className="text-xl font-bold text-red-600 mt-6">
          Đội ngũ biên tập viên
        </h3>
        <p className="text-gray-700 mt-2">
          Đội ngũ biên tập viên tại SeoulSpa.Vn đều đáp ứng các tiêu chí về
          trình độ chuyên môn, học vấn và có kiến thức trong lĩnh vực thẩm mỹ &
          làm đẹp. Họ sẽ là người trực tiếp chọn lọc thông tin đủ điều kiện,
          chính xác và trích dẫn từ các nguồn đáng tin cậy trước khi cung cấp
          thông tin đến độc giả.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Đội ngũ biên tập có kiến thức chuyên môn
        </h4>
        <p className="text-gray-700 mt-2">
          Đội ngũ biên tập viên tại SeoulSpa.Vn phải đảm bảo kiến thức chuyên
          môn trong lĩnh vực thẩm mỹ, làm đẹp. Đây là yếu tố quan trọng để đem
          đến độc giả các nguồn thông tin chất lượng, chính xác và đáng tin cậy.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Có kỹ năng chuyên môn
        </h4>
        <ul className="text-gray-700 mt-2 list-disc pl-5">
          <li>
            <strong>Kỹ năng biên tập:</strong> Biên tập viên tại SeoulSpa.Vn đảm
            bảo có kỹ năng chuyên môn về biên tập ngôn ngữ thành thạo bao gồm:
            chính tả, ngữ pháp, cách hành văn và kỹ năng biên soạn nội dung.
          </li>
          <li>
            <strong>Kỹ năng sử dụng công cụ:</strong> Biên tập viên đều đảm bảo
            kinh nghiệm và khả năng sử dụng thành thạo các công cụ hỗ trợ trong
            quá trình làm việc để kiểm tra độ văn, chính tả, ngữ pháp và các
            công cụ thiết yếu khác phục vụ cho nội dung bài viết.
          </li>
          <li>
            <strong>Kỹ năng nghiên cứu:</strong> Nhân viên biên tập sẽ có khả
            năng nghiên cứu, thu thập thông tin từ các nguồn khác nhau, từ đó
            chọn lọc, đánh giá, đo lường và đem đến độc giả những thông tin phù
            hợp với nhu cầu và sự quan tâm của khách hàng.
          </li>
        </ul>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Có kinh nghiệm làm việc
        </h4>
        <p className="text-gray-700 mt-2">
          Ngoài các yếu tố về kỹ năng, đội ngũ biên tập viên tại SeoulSpa.Vn cần
          đáp ứng các yếu tố liên quan đến thời gian công tác và kinh nghiệm làm
          việc. Chúng tôi sẽ tuyển chọn nhân viên dựa trên các yếu tố về trình
          độ, kinh nghiệm làm việc và các yếu tố liên quan đến kinh nghiệm làm
          việc nhóm, tinh thần kỷ luật, trách nhiệm,…
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Đội ngũ chuyên gia của chúng tôi
        </h4>
        <p className="text-gray-700 mt-2">
          Đội ngũ chuyên gia có kiến thức và chuyên môn sẽ là người kiểm duyệt
          toàn bộ nội dung bài viết trước khi xuất bản. Ngoài ra, trong quá
          trình biên tập nội dung, đội ngũ chuyên gia sẽ tham gia trực tiếp vào
          quá trình phản biện, truyền đạt kinh nghiệm và các kiến thức liên quan
          đến lĩnh vực thẩm mỹ làm đẹp. Vì thế, các nội dung được chúng tôi cung
          cấp sẽ đảm bảo tính chính xác và hữu ích khi phân phối nội dung bài
          viết đến khách hàng.
        </p>

        <h4 className="text-lg font-bold text-red-600 mt-4">
          Tuyên bố miễn trừ trách nhiệm
        </h4>
        <p className="text-gray-700 mt-2">
          Mọi nội dung, thông tin và bài viết mà SeoulSpa.Vn cung cấp đều chỉ
          mang tính chất tham khảo. Chúng tôi không đại diện cho các bác sĩ,
          chuyên gia để đem đến thông tin cho khách hàng. Vì thế, đối với các
          trường hợp liên quan đến sức khỏe, sắc đẹp và làm đẹp, chúng tôi đều
          khuyến khích khách hàng nên tìm trực tiếp các bác sĩ chuyên khoa để
          được tư vấn và hỗ trợ. Chúng tôi sẽ không chịu trách nhiệm với bất kỳ
          trường hợp nào tham khảo thông tin từ website mà không có sự ý kiến và
          lời khuyên của bác sĩ.
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

export default ContentPolicy;
