import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ContentPolicy = () => {
  return (
    <div className="w-full min-h-screen bg-gray-200">

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
    </div>
  );
};

export default ContentPolicy;
