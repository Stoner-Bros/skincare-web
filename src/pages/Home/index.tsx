import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import AddService from "../Services/add-service";
import serviceService from "@/services/service.services";
import { Service } from "@/types/service.types";
import AddBlog from "../Blogs/add-blog";


export default function Home() {
  const [index, setIndex] = useState(0);
  const [isAddServiceOpen, setAddServiceOpen] = useState(false);
  const [isAddBlogOpen, setAddBlogOpen] = useState(false);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bacSi = [
    {
      name: "Nguyễn Kim Khoa",
      description: "Nguyễn Kim Khoa là bác sĩ giàu kinh nghiệm trong lĩnh vực da liễu và tạo hình thẩm mỹ, được biết đến với chuyên môn sâu rộng và uy tín vững chắc. Ông được xem là một trong những bậc thầy gạo cội, đã dành cả cuộc đời mình để cống hiến cho ngành làm đẹp, để lại dấu ấn sâu đậm với vô số thành tựu. Hơn 30 năm miệt mài trong ngành da liễu và thẩm mỹ tạo hình, bác sĩ Khoa đã gặt hái được những thành tựu đáng ngưỡng mộ. Sở hữu thế mạnh vượt trội về chăm sóc da liễu chuyên sâu, phẫu thuật tạo hình thẩm mỹ mắt – mũi – môi, kết hợp với kinh nghiệm giảng dạy chuyên ngành thẩm mỹ, ông đã xây dựng nên một sự nghiệp lừng lẫy, ghi dấu ấn vang dội. Hành trình cống hiến của bác sĩ Khoa không chỉ dừng lại ở những con số, mà còn là giá trị nhân văn sâu sắc khi mang đến cái đẹp và sự tự tin cho đời. Minh chứng rõ ràng nhất là danh hiệu \"Thầy Thuốc Ưu Tú\" cao quý mà ông vinh dự được trao tặng lần thứ 13 và 14 vào năm 2020 và 2022. Hơn thế nữa, ông đã thay đổi ngoạn mục nhan sắc cho hơn 15.000 khách hàng, mang đến cho họ một diện mạo mới, mở ra cánh cửa đến cuộc sống tích cực và hạnh phúc hơn.",
      image: "/nguyenkimkhoa.webp"
    },
    {
      name: "Võ Thành Hướng",
      description: "Bác sĩ Võ Thành Hướng là chuyên gia da liễu uy tín với bề dày kinh nghiệm và chuyên môn sâu rộng. Sau hơn 6 năm chinh chiến tại các bệnh viện lớn như Bệnh viện Đa Khoa Xuyên Á và Bệnh Viện Đa Khoa Bình Dương, Bác sĩ Hướng đã khẳng định tên tuổi qua hàng nghìn ca chăm sóc da và làm đẹp thành công trên khắp cả nước. Không chỉ dừng lại ở tấm bằng Bác sĩ Đa Khoa, Bác sĩ Võ Thành Hướng còn sở hữu kho tàng kiến thức uyên bác với các chứng chỉ chuyên ngành Nội tổng quát, chuyên khoa Da liễu, và khám chữa bệnh Đa khoa. Hơn thế nữa, Bác sĩ còn liên tục trau dồi chuyên môn qua các khóa đào tạo chuyên sâu về ứng dụng Laser và ánh sáng trong Da liễu cũng như phẫu thuật cơ bản và tiểu phẫu da. Chính sự am hiểu sâu rộng cùng bàn tay tài hoa đã giúp Bác sĩ Võ Thành Hướng xây dựng uy tín vững chắc và trở thành lựa chọn hàng đầu cho những ai mong muốn sở hữu làn da khỏe đẹp. Đến với Bác sĩ Hướng, khách hàng hoàn toàn an tâm về chất lượng dịch vụ và kết quả mỹ mãn.",
      image: "/vothanhhuong.webp"
    },
    {
      name: "Mai Hữu Nghĩa",
      description: "Bác sĩ Mai Hữu Nghĩa là một bậc thầy ưu tú, ghi dấu ấn bởi chuyên môn sâu rộng, tâm huyết và tài năng vượt trội. Sở hữu nhiều chứng chỉ danh giá và nền tảng học vấn vững chắc từ Đại học Y Dược TP.HCM và Đại học Y khoa Phạm Ngọc Thạch, Bác sĩ Mai Hữu Nghĩa khẳng định vị thế trong cả thẩm mỹ nội khoa và ngoại khoa tại Thẩm mỹ viện LuxSpa.Vn.Điểm sáng trong sự nghiệp của Bác sĩ chính là sự đa dạng chuyên môn hiếm có. Tinh thông thẩm mỹ khuôn mặt, trẻ hóa da, điều trị sẹo lồi, cùng nhiều chứng chỉ chuyên môn khác, Bác sĩ tự tin đáp ứng mọi nhu cầu thẩm mỹ của khách hàng. Hơn 10 năm cống hiến, Bác sĩ Mai Hữu Nghĩa đã tạo nên kỳ tích trong ngành làm đẹp Việt Nam. Bàn tay tài hoa của Bác sĩ đã mang đến thành công vang dội, kiến tạo nhan sắc cho hàng nghìn người. Thành tựu của Bác sĩ còn được vinh danh bởi giải thưởng cao quý. Ngoài hoạt động chuyên môn, Bác sĩ còn là giảng viên thẩm mỹ uy tín, truyền lửa đam mê cho thế hệ trẻ. Bác sĩ Mai Hữu Nghĩa đề cao triết lý làm đẹp an toàn, tự nhiên và thấu hiểu mong muốn của khách hàng. Bác sĩ tư vấn tận tâm, đưa ra giải pháp tối ưu cho từng cá nhân, tạo nên những tuyệt tác thẩm mỹ hài hòa, tôn vinh nét đẹp riêng biệt. Sự tận tâm và y đức của Bác sĩ hiện hữu trong từng ca phẫu thuật, từng lời tư vấn. Điều này tạo nên sự khác biệt, xây dựng niềm tin tuyệt đối nơi khách hàng. ",
      image: "/maihuunghia.webp"
    },
    {
      name: "Trương Linh",
      description: "Hơn 30 năm trong nghề, bác sĩ Trương Linh không chỉ là chuyên gia Da liễu giàu kinh nghiệm, mà còn là người đồng hành đáng tin cậy của hàng ngàn khách hàng trên hành trình tìm kiếm làn da khỏe đẹp. Tốt nghiệp bác sĩ y khoa và sở hữu chứng chỉ chuyên sâu Khoa Da liễu, bác sĩ Linh luôn nỗ lực trau dồi kiến thức, cập nhật những phương pháp điều trị tiên tiến nhất. Bằng chứng là hàng ngàn ca điều trị thành công, giúp khách hàng giải quyết các vấn đề về da, từ mụn, nám, tàn nhang đến lão hóa. Bác sĩ Linh luôn tận tâm với mỗi bệnh nhân, thấu hiểu những mặc cảm, tự ti mà họ phải chịu đựng. Chính vì vậy, bác sĩ không chỉ điều trị da, mà còn truyền cảm hứng, giúp họ tự tin hơn trong cuộc sống.",
      image: "/truonglinh.webp"
    },
    {
      name: "Đào Thị Tường Vy",
      description: "Bác sĩ Đào Thị Tường Vy là một chuyên gia xuất sắc trong lĩnh vực thẩm mỹ, được biết đến với chuyên môn sâu rộng, tay nghề khéo léo và tâm huyết không ngừng. Sở hữu nền tảng học vấn vững chắc từ Đại học Y Dược TP.HCM cùng nhiều chứng chỉ danh giá trong và ngoài nước, Bác sĩ Đào Thị Tường Vy khẳng định vị thế hàng đầu trong cả thẩm mỹ nội khoa và ngoại khoa tại Thẩm mỹ viện LuxSpa.Vn. Điểm nổi bật trong sự nghiệp của Bác sĩ Vy chính là sự am hiểu đa dạng về các kỹ thuật thẩm mỹ hiện đại. Từ tạo hình khuôn mặt, trẻ hóa da, điều trị sẹo lồi đến các phương pháp thẩm mỹ tiên tiến khác, Bác sĩ luôn mang đến giải pháp tối ưu, an toàn và phù hợp nhất cho từng khách hàng. Với hơn 10 năm kinh nghiệm, Bác sĩ đã giúp hàng nghìn khách hàng lấy lại sự tự tin, kiến tạo vẻ đẹp hài hòa và tự nhiên. Bên cạnh chuyên môn vững chắc, Bác sĩ Đào Thị Tường Vy còn là một giảng viên uy tín, luôn tận tâm truyền đạt kiến thức và kinh nghiệm cho thế hệ trẻ, góp phần phát triển ngành thẩm mỹ tại Việt Nam. Triết lý làm đẹp của Bác sĩ Vy hướng đến sự an toàn, tinh tế và tôn trọng vẻ đẹp riêng biệt của mỗi người. Sự tận tụy, tài năng và y đức của Bác sĩ thể hiện qua từng ca thẩm mỹ, từng lời tư vấn chân thành. Điều này không chỉ giúp Bác sĩ Vy tạo dựng uy tín vững chắc mà còn trở thành người bạn đồng hành đáng tin cậy trên hành trình làm đẹp của khách hàng.",
      image: "/bacsinu1.jpg"
    }
  ];
  const awards = [
    {
      title: "Quầy lễ tân",
      image: "letan.webp",
    },
    {
      title: "Phòng thăm khám soi da",
      image: "phongkham.webp",
    },
    {
      title: "Phòng điều trị",
      image: "phongdieutri.webp",
    },
    {
      title: "Phòng tư vấn",
      image: "phongtuvan.webp",
    },
    {
      title: "Sảnh chờ",
      image: "sanhcho.webp",
    },
  ];
  const relive = [
    {
      title: "LuxSpa.Vn quả là lựa chọn đúng đắn! Làn da mình đã thay đổi hoàn toàn",
      image: "da1.jpg",
    },
    {
      title: "Mình rất hài lòng với dịch vụ trị mụn tại LuxSpa.Vn, các vết mụn đã biến mất",
      image: "da2.jpg",
    },
    {
      title: "Không ngờ chỉ sau 1 liệu trình tại LuxSpa.Vn, làn da mình đã láng mịn",
      image: "da3.jpg",
    },
    {
      title: "Thật tuyệt vời! LuxSpa.Vn đã giúp mình xóa tan nỗi lo về làn da sạm khô",
      image: "da4.jpg",
    },
    {
      title: "LuxSpa.Vn thật sự là 'Cứu tinh' cho làn da của mình ",
      image: "da5.jpg",
    },
    {
      title: "Mình đã từng rất tự ti vì làn da nhiều khuyết điểm. Nhưng giờ đây dẫ đỡ hơn nhiều.",
      image: "da6.jpg",
    },
  ];

  const handleAddServiceClick = () => {
    setAddServiceOpen(true);
  };

  const handleCloseModal = () => {
    setAddServiceOpen(false);
  };

  const handleAddBlogClick = () => {
    setAddBlogOpen(true);
  };

  const handleCloseModalBlog = () => {
    setAddBlogOpen(false);
  };

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      setIsLoading(true);
      try {
        const serviceIds = [14, 12, 15, 16];
        const servicesPromises = serviceIds.map(async id => {
          try {
            const service = await serviceService.getServiceById(id);
            if (service && service.serviceThumbnailUrl) {
              try {
                const imageUrl = await serviceService.getServiceImage(`/api/upload/${service.serviceThumbnailUrl}`);
                service.serviceThumbnailUrl = imageUrl;
              } catch (imageError) {
                console.error(`Lỗi khi lấy hình ảnh cho dịch vụ ${id}:`, imageError);
              }
            }
            return service.data;
          } catch (error) {
            console.error(`Không tìm thấy dịch vụ có ID ${id}:`, error);
            return null;
          }
        });
        
        const results = await Promise.all(servicesPromises);
        console.log(results);
        const validServices = results.filter(service => service !== null) as Service[];
        setFeaturedServices(validServices);
      } catch (error) {
        console.error("Lỗi khi lấy dịch vụ nổi bật:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedServices();
    
  }, []);

  return (
    <div className="w-full min-h-screen bg-white">

    
      <section className="swiper-container">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={50}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          navigation
          className="select-none"
          style={{
            height: '700px',
          }}
        >
          <SwiperSlide>
            <img src="/test.webp" alt="Slide 1" className="w-full object-cover" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/test.webp" alt="Slide 2" className="w-full object-cover" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/test.webp" alt="Slide 3" className="w-full object-cover" />
          </SwiperSlide>
        </Swiper>
      </section>



      <section className="bg-pink-50 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-rose-600 mb-8">DỊCH VỤ NỔI BẬT</h2>
          <div className="grid grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-3 text-center py-8">Đang tải dịch vụ...</div>
            ) : featuredServices.length > 0 ? (
              featuredServices.map((service) => (
                <div key={service.serviceId} className=" border rounded-lg p-4 border-red-500">
                  <img
                    src={`https://skincare-api.azurewebsites.net/api/upload/${service.serviceThumbnailUrl}`}
                    alt={service.serviceName}
                    className="w-full h-64 object-cover rounded-t-lg"
                    // onError={(e) => {
                    //   (e.target as HTMLImageElement).src = "/mun.jpg";
                    // }}
                  />
                  <h3 className="text-xl font-semibold text-red-600 mt-4">{service.serviceName}</h3>
                  <p className="text-gray-600 mt-2 line-clamp-3">{service.serviceDescription}</p>
                  <div className="flex mt-4 items-center justify-center">
                    <Link to={`/services/${service.serviceId}`}>
                      <Button className="bg-red-600 text-white">Xem chi tiết</Button>
                    </Link>
                    <Button className="bg-gray-300 text-gray-800 ml-2">Nhận tư vấn</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p>Không tìm thấy dịch vụ nào.</p>
                <Button 
                  className="bg-red-600 text-white mt-4" 
                  onClick={handleAddServiceClick}
                >
                  Thêm dịch vụ mới
                </Button>
              </div>
            )}
          </div>
          <div className="mt-8">
            <Button className="bg-red-600 text-white" onClick={handleAddServiceClick}>Thêm dịch vụ</Button>
          </div>
        </div>
      </section>

      <section className="swiper2-container relative w-full py-10">
        <h2 className="text-center text-2xl font-bold text-pink-500 mb-6">CÔNG NGHỆ ĐỘC QUYỀN</h2>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          autoplay={{ delay: 3000 }}
          navigation
          className="w-3/5 mx-auto select-none"
        >
          <div className="grid grid-cols-2 gap-4">
            <SwiperSlide>
              <div className="bg-white rounded-2xl shadow-lg flex items-center border border-pink-300"  >
                <img src="/tesst.webp" alt="MD-CODE" className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                <div className="h-[200px] px-4 py-2 flex flex-col grow">
                  <h3 className="text-pink-500 font-semibold text-lg mb-2">MD-CODE</h3>
                  <p className="text-gray-600 text-sm tracking-widest">Công nghệ MD-DYNAMIC CODE tái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất có thể cho bạn để làm việc nhanh nhất. Công nghệ MD-DYNAMIC CODE cái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-white rounded-2xl shadow-lg flex items-center border border-pink-300"  >
                <img src="/tesst.webp" alt="MD-CODE" className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                <div className="h-[200px] px-4 py-2 flex flex-col grow">
                  <h3 className="text-pink-500 font-semibold text-lg mb-2">MD-CODE</h3>
                  <p className="text-gray-600 text-sm tracking-widest">Công nghệ MD-DYNAMIC CODE tái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất có thể cho bạn để làm việc nhanh nhất. Công nghệ MD-DYNAMIC CODE cái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </div>
        </Swiper>
      </section>

      <section className="py-12 bg-pink-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">
            CƠ SỞ VẬT CHẤT HIỆN ĐẠI
          </h2>
          <h2 className="text-sm text-center text-black mb-2">
            Hệ thống thẩm mỹ viện SeoulSpa.Vn sở hữu không gian hiện đại, sang trọng với trang thiết bị nhập khẩu từ
          </h2>
          <h2 className="text-sm text-center text-black mb-8">
            Hàn Quốc, Nhật Bản, Mỹ,… mang đến trải nghiệm làm đẹp thư giãn, an toàn và hiệu quả.
          </h2>
          <div className="px-4 md:px-16">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              loop={true}
              // autoplay={{ delay: 3000 }}
              navigation
              className="w-full"
            >
              {awards.map((award, index) => (
                <SwiperSlide key={index} className="flex flex-col items-center">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="h-[250px] w-full object-cover"
                  />
                  <p className="mt-4 text-xl text-pink-600 font-medium text-center">
                    {award.title}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="w-[80%] mx-auto py-10">
        <div className="w-full grid grid-cols-12 gap-4">
          <div className="col-span-4 flex justify-end">
            <img src={bacSi[index].image} alt="MD-CODE" className="aspect-[9/16] h-[600px] object-cover rounded-xl" />
          </div>
          <div className="col-span-8">
            <div className="w-full text-center text-4xl font-semibold mb-8 uppercase">Đội ngũ chuyên gia</div>
            <div className="w-80% h-[260px] mx-16 rounded-2xl relative border-2 border-red-500 px-8">
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-5 bg-white px-8 text-red-500 text-2xl font-semibold">
                {bacSi[index].name}
              </div>
              <div className="my-8 h-[200px] overflow-y-scroll pr-2">
                {bacSi[index].description}
              </div>
            </div>
            <div className="mt-8 px-16">
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                loop={true}
                // autoplay={{ delay: 3000 }}
                navigation
                className="w-full h-[200px] grid grid-cols-5 gap-4 select-none"
                onSlideChange={(e) => {
                  setIndex((index + 1) % bacSi.length)
                }}
              // className="w-80%"
              >
                <SwiperSlide>
                  <img src="/bacsikhoa1.png" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/vothanhhuong1.png" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/maihuunghia1.png" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/truonglinh1.png" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/bacsinu1.jpg" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
              </Swiper>
              <div className="mt-4 text-start">
                <Link to="/therapist" className="text-red-600 px-4 py-2 font-bold ">
                  Xem thêm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-pink-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-4">
            Hình ảnh thực tế
          </h2>
          <h2 className="text-lg text-center text-black mb-6">
            Hơn hàng ngàn khách hàng đã tin tưởng và lựa chọn sử dụng dịch vụ làm đẹp tại Thẩm mỹ viện SeoulSpa.Vn. Sau đây là những cảm nhận thực tế từ khách hàng
          </h2>
          <div className="px-4 md:px-16">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              loop={true}
              // autoplay={{ delay: 3000 }}
              navigation
              className="w-full"
            >
              {relive.map((relive, index) => (
                <SwiperSlide key={index} className="flex flex-col items-center">
                  <img
                    src={relive.image}
                    alt={relive.title}
                    className="h-[250px] w-full object-cover"
                  />
                  <p className="mt-4 text-lg text-black font-medium text-center">
                    {relive.title}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">

          <h2 className="text-3xl font-bold text-rose-600">THÔNG TIN LUXSPA</h2>

          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Thẩm mỹ viện LuxSpa.Vn liên tục mang đến những sự kiện hấp dẫn cho khách hàng.
            Cùng với đó là các ưu đãi "cực hot" khi sử dụng dịch vụ làm đẹp tại tất cả chi nhánh trên toàn quốc.
          </p>


          <div className="flex justify-between mt-6 space-x-4">
            <Button className="bg-red-600 text-white px-4 py-2 font-bold rounded-lg">
              THÔNG TIN SỰ KIỆN
            </Button>
            <Button className="bg-rose-400 text-white px-4 py-2 font-bold rounded-lg">
              BÀI VIẾT MỚI NHẤT
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8 w-full">
            <div className="flex flex-col w-full h-full">
              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-full h-[386px] object-cover rounded-lg" />
              <div className="flex flex-col w-full text-left flex-grow justify-end">
                <h3 className="text-lg font-bold text-red-600 mt-4 leading-snug">
                  Nhượng quyền LuxSpa.Vn với vốn đầu tư hợp lý, lợi nhuận hấp dẫn
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Bạn đang có một số vốn và có ý định hợp tác kinh doanh với mong muốn giảm thiểu rủi ro và đạt được tiềm năng lớn...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>
            <div className="flex flex-col w-full h-full">
              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-full h-[386px] object-cover rounded-lg" />
              <div className="flex flex-col w-full text-left flex-grow justify-end">
                <h3 className="text-lg font-bold text-red-600 mt-4 leading-snug">
                  Nhượng quyền LuxSpa.Vn với vốn đầu tư hợp lý, lợi nhuận hấp dẫn
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Bạn đang có một số vốn và có ý định hợp tác kinh doanh với mong muốn giảm thiểu rủi ro và đạt được tiềm năng lớn...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 mt-8">
            <div className="flex w-full h-[145px]">

              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-[200px] h-full object-cover rounded-lg" />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>



            <div className="flex w-full h-[145px]">

              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-[200px] h-full object-cover rounded-lg" />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>


            <div className="flex w-[598px] h-[145px]">

              <img src="/mun.jpg"
                alt="Nhượng quyền LuxSpa.Vn"
                className="w-[200px] h-full object-cover rounded-lg" />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>


            <div className="flex w-[598px] h-[145px]">

              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-[200px] h-full object-cover rounded-lg" />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>
            <div className="mt-8">
            <Button className="bg-red-600 text-white" onClick={handleAddBlogClick}>Thêm Blog</Button>
          </div>
          </div>
        </div>
      </section>

      <section
        className="relative bg-white py-16"
        style={{
          backgroundImage:
            "url(https://cdn.diemnhangroup.com/seoulcenter/2023/08/Group-1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-1/2 mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://cdn.diemnhangroup.com/seoulcenter/2023/08/HINH-BAC-SY-1.png"
              alt="Đội ngũ bác sĩ"
              className="w-full max-w-md object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-pink-500 mb-2 text-center">
              ĐĂNG KÝ NGAY
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              để được tư vấn miễn phí
            </p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nhập họ và tên"
                className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border-l-4"
              />
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border-l-4"
              />
              <button className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-pink-600">
                NHẬN TƯ VẤN
              </button>
            </form>
          </div>
        </div>
      </section>

      <AddService open={isAddServiceOpen} onClose={handleCloseModal} />
      <AddBlog open={isAddBlogOpen} onClose={handleCloseModalBlog} />

    </div>
  );
}
