import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import consultationService from "@/services/consultation.services";
import serviceService from "@/services/service.services";
import { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import AddBlog from "../Blogs/add-blog";
import AddService from "../Services/add-service";
import AddTherapist from "../Therapists/add-therapist";
import AddTreatment from "../Treatment/add-treatment";

// Define initial state
interface HomeState {
  index: number;
  isAddServiceOpen: boolean;
  isAddBlogOpen: boolean;
  isAddTherapistOpen: boolean;
  isAddTreatmentOpen: boolean;
  featuredServices: any[];
  isLoading: boolean;
  fullName: string;
  phone: string;
  isSubmitting: boolean;
  submitMessage: string;
}

const initialState: HomeState = {
  index: 0,
  isAddServiceOpen: false,
  isAddBlogOpen: false,
  isAddTherapistOpen: false,
  isAddTreatmentOpen: false,
  featuredServices: [],
  isLoading: true,
  fullName: "",
  phone: "",
  isSubmitting: false,
  submitMessage: "",
};

// Define action types
type HomeAction =
  | { type: "SET_INDEX"; payload: number }
  | { type: "TOGGLE_ADD_SERVICE"; payload: boolean }
  | { type: "TOGGLE_ADD_BLOG"; payload: boolean }
  | { type: "TOGGLE_ADD_THERAPIST"; payload: boolean }
  | { type: "TOGGLE_ADD_TREATMENT"; payload: boolean }
  | { type: "SET_FEATURED_SERVICES"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FULL_NAME"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_SUBMIT_MESSAGE"; payload: string };

// Create reducer function
function homeReducer(state: HomeState, action: HomeAction): HomeState {
  switch (action.type) {
    case "SET_INDEX":
      return { ...state, index: action.payload };
    case "TOGGLE_ADD_SERVICE":
      return { ...state, isAddServiceOpen: action.payload };
    case "TOGGLE_ADD_BLOG":
      return { ...state, isAddBlogOpen: action.payload };
    case "TOGGLE_ADD_THERAPIST":
      return { ...state, isAddTherapistOpen: action.payload };
    case "TOGGLE_ADD_TREATMENT":
      return { ...state, isAddTreatmentOpen: action.payload };
    case "SET_FEATURED_SERVICES":
      return { ...state, featuredServices: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_FULL_NAME":
      return { ...state, fullName: action.payload };
    case "SET_PHONE":
      return { ...state, phone: action.payload };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_SUBMIT_MESSAGE":
      return { ...state, submitMessage: action.payload };
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(homeReducer, initialState);
  const { toast } = useToast();

  
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
      title:
        "LuxSpa.Vn quả là lựa chọn đúng đắn! Làn da mình đã thay đổi hoàn toàn",
      image: "da1.jpg",
    },
    {
      title:
        "Mình rất hài lòng với dịch vụ trị mụn tại LuxSpa.Vn, các vết mụn đã biến mất",
      image: "da2.jpg",
    },
    {
      title:
        "Không ngờ chỉ sau 1 liệu trình tại LuxSpa.Vn, làn da mình đã láng mịn",
      image: "da3.jpg",
    },
    {
      title:
        "Thật tuyệt vời! LuxSpa.Vn đã giúp mình xóa tan nỗi lo về làn da sạm khô",
      image: "da4.jpg",
    },
    {
      title: "LuxSpa.Vn thật sự là 'Cứu tinh' cho làn da của mình ",
      image: "da5.jpg",
    },
    {
      title:
        "Mình đã từng rất tự ti vì làn da nhiều khuyết điểm. Nhưng giờ đây dẫ đỡ hơn nhiều.",
      image: "da6.jpg",
    },
  ];

  // Thêm mảng dữ liệu mới cho công nghệ độc quyền
  const technologies = [
    {
      name: "Nâng cơ Collagen",
      description: "Sử dụng chỉ Collagen sinh học tạo lưới nâng đỡ da, làm căng vùng da chảy xệ, trẻ hóa tự nhiên không cần phẫu thuật",
      image: "/nangco.webp"
    },
    {
      name: "Căn chỉnh khuôn mặt",
      description: "Công nghệ CODE định vị và đưa collagen vào nhóm cơ lão hóa, giúp căng da, nâng cơ, giảm nếp nhăn và định hình khuôn mặt.",
      image: "/canchinh.webp"
    },
    {
      name: "MD-CODE",
      description: "Công nghệ MD-CODE sử dụng sóng vô tuyến để làm căng da, xóa nhăn và mang lại làn da trẻ trung hơn. Không xâm lấn, không thời gian nghỉ dưỡng và mang lại kết quả lâu dài cho mọi loại da",
      image: "/mdcode.webp"
    },
    {
      name: "Nâng Cơ Sinh Học",
      description: "Công nghệ căng da không phẫu thuật 5.0 đột phá: ứng dụng chỉ sinh học tự thân, xóa nhăn và trẻ hóa da hiệu quả",
      image: "/sinhhoc.webp"
    },
  ];

  const handleAddServiceClick = () => {
    dispatch({ type: "TOGGLE_ADD_SERVICE", payload: true });
  };

  const handleCloseModal = () => {
    dispatch({ type: "TOGGLE_ADD_SERVICE", payload: false });
  };

  // const handleAddBlogClick = () => {
  //   dispatch({ type: "TOGGLE_ADD_BLOG", payload: true });
  // };

  const handleCloseModalBlog = () => {
    dispatch({ type: "TOGGLE_ADD_BLOG", payload: false });
  };


  const handleCloseModalTherapist = () => {
    dispatch({ type: "TOGGLE_ADD_THERAPIST", payload: false });
  };

  const handleCloseModalTreatment = () => {
    dispatch({ type: "TOGGLE_ADD_TREATMENT", payload: false });
  };
  useEffect(() => {
    const fetchFeaturedServices = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const serviceIds = [1, 2, 3, 4];
        const servicesPromises = serviceIds.map(async (id) => {
          try {
            const service = await serviceService.getServiceById(id);
            if (service && service.serviceThumbnailUrl) {
              try {
                const imageUrl = await serviceService.getServiceImage(
                  `/api/upload/${service.serviceThumbnailUrl}`
                );
                service.serviceThumbnailUrl = imageUrl;
              } catch (imageError) {
                console.error(
                  `Lỗi khi lấy hình ảnh cho dịch vụ ${id}:`,
                  imageError
                );
              }
            }
            // @ts-ignore
            return service.data;
          } catch (error) {
            console.error(`Không tìm thấy dịch vụ có ID ${id}:`, error);
            return null;
          }
        });

        const results = await Promise.all(servicesPromises);
        console.log(results);
        const validServices = results.filter(
          (service) => service !== null
        ) as any[];
        dispatch({ type: "SET_FEATURED_SERVICES", payload: validServices });
      } catch (error) {
        console.error("Lỗi khi lấy dịch vụ nổi bật:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
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
            height: "700px",
          }}
        >
          <SwiperSlide>
            <img
              src="/test.webp"
              alt="Slide 1"
              className="w-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/test.webp"
              alt="Slide 2"
              className="w-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/test.webp"
              alt="Slide 3"
              className="w-full object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </section>

      <section className="bg-pink-50 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-rose-600 mb-8">
            DỊCH VỤ NỔI BẬT
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {state.isLoading ? (
              <div className="col-span-3 text-center py-8">
                Đang tải dịch vụ...
              </div>
            ) : state.featuredServices.length > 0 ? (
              state.featuredServices.map((service) => (
                <div
                  key={service.serviceId}
                  className=" border rounded-lg p-4 border-red-500"
                >
                  <img
                    src={`https://skincare-api.azurewebsites.net/api/upload/${service.serviceThumbnailUrl}`}
                    alt={service.serviceName}
                    className="w-full h-64 object-cover rounded-t-lg"
                    // onError={(e) => {
                    //   (e.target as HTMLImageElement).src = "/mun.jpg";
                    // }}
                  />
                  <h3 className="text-xl font-semibold text-red-600 mt-4">
                    {service.serviceName}
                  </h3>
                  <p className="text-gray-600 mt-2 line-clamp-3">
                    {service.serviceDescription}
                  </p>
                  <div className="flex mt-4 items-center justify-center">
                    <Link to={`/treatment/${service.serviceId}`}>
                      <Button className="bg-red-600 text-white">
                        Xem chi tiết
                      </Button>
                    </Link>
                    <Button className="bg-gray-300 text-gray-800 ml-2">
                      Nhận tư vấn
                    </Button>
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
            <Button
              className="bg-red-600 text-white"
              onClick={handleAddServiceClick}
            >
              Thêm dịch vụ
            </Button>
          </div>
        </div>
      </section>

      <section className="swiper2-container relative w-full py-10">
        <h2 className="text-center text-2xl font-bold text-pink-500 mb-6">
          CÔNG NGHỆ ĐỘC QUYỀN
        </h2>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          autoplay={{ delay: 3000 }}
          navigation
          className="w-3/5 mx-auto select-none"
        >
          {technologies.map((tech, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-lg flex items-center border border-pink-300">
                <img
                  src={tech.image}
                  alt={tech.name}
                  className="aspect-[11/9] h-[200px] object-cover rounded-xl"
                />
                <div className="h-[200px] px-4 py-2 flex flex-col grow">
                  <h3 className="text-pink-500 font-semibold text-lg mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-gray-600 text-sm tracking-widest">
                    {tech.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="py-12 bg-pink-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">
            CƠ SỞ VẬT CHẤT HIỆN ĐẠI
          </h2>
          <h2 className="text-sm text-center text-black mb-2">
            Hệ thống thẩm mỹ viện SeoulSpa.Vn sở hữu không gian hiện đại, sang
            trọng với trang thiết bị nhập khẩu từ
          </h2>
          <h2 className="text-sm text-center text-black mb-8">
            Hàn Quốc, Nhật Bản, Mỹ,… mang đến trải nghiệm làm đẹp thư giãn, an
            toàn và hiệu quả.
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

      {/* <section className="w-[80%] mx-auto py-10">
        <div className="w-full grid grid-cols-12 gap-4">
          <div className="col-span-4 flex justify-end">
            <img
              src={bacSi[state.index].image}
              alt="MD-CODE"
              className="aspect-[9/16] h-[600px] object-cover rounded-xl"
            />
          </div>
          <div className="col-span-8">
            <div className="w-full text-center text-4xl font-semibold mb-8 uppercase">
              Đội ngũ chuyên gia
            </div>
            <div className="w-80% h-[260px] mx-16 rounded-2xl relative border-2 border-red-500 px-8">
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-5 bg-white px-8 text-red-500 text-2xl font-semibold">
                {bacSi[state.index].name}
              </div>
              <div className="my-8 h-[200px] overflow-y-scroll pr-2">
                {bacSi[state.index].description}
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
                onSlideChange={() => {
                  dispatch({
                    type: "SET_INDEX",
                    payload: (state.index + 1) % bacSi.length,
                  });
                }}
                // className="w-80%"
              >
                <SwiperSlide>
                  <img
                    src="/bacsikhoa1.png"
                    alt="MD-CODE"
                    className="aspect-square rounded-full h-[200px] object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/vothanhhuong1.png"
                    alt="MD-CODE"
                    className="aspect-square rounded-full h-[200px] object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/maihuunghia1.png"
                    alt="MD-CODE"
                    className="aspect-square rounded-full h-[200px] object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/truonglinh1.png"
                    alt="MD-CODE"
                    className="aspect-square rounded-full h-[200px] object-cover"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/bacsinu1.jpg"
                    alt="MD-CODE"
                    className="aspect-square rounded-full h-[200px] object-cover"
                  />
                </SwiperSlide>
              </Swiper>
              <div className="mt-4 text-start">
                <Link
                  to="/therapist"
                  className="text-red-600 px-4 py-2 font-bold "
                >
                  Xem thêm
                </Link>
              </div>
              <div className="mt-8">
                <Button
                  className="bg-red-600 text-white"
                  onClick={handleAddTherapistClick}
                >
                  Thêm Bác Sĩ
                </Button>
              </div>
              <div className="mt-8">
                <Button
                  className="bg-red-600 text-white"
                  onClick={handleAddTreatmentClick}
                >
                  Thêm Treatment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-12 bg-pink-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-4">
            Hình ảnh thực tế
          </h2>
          <h2 className="text-lg text-center text-black mb-6">
            Hơn hàng ngàn khách hàng đã tin tưởng và lựa chọn sử dụng dịch vụ
            làm đẹp tại Thẩm mỹ viện SeoulSpa.Vn. Sau đây là những cảm nhận thực
            tế từ khách hàng
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

      {/* <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-rose-600">THÔNG TIN LUXSPA</h2>

          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Thẩm mỹ viện LuxSpa.Vn liên tục mang đến những sự kiện hấp dẫn cho
            khách hàng. Cùng với đó là các ưu đãi "cực hot" khi sử dụng dịch vụ
            làm đẹp tại tất cả chi nhánh trên toàn quốc.
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
              <img
                src="/mun.jpg"
                alt="Nhượng quyền LuxSpa.Vn"
                className="w-full h-[386px] object-cover rounded-lg"
              />
              <div className="flex flex-col w-full text-left flex-grow justify-end">
                <h3 className="text-lg font-bold text-red-600 mt-4 leading-snug">
                  Nhượng quyền LuxSpa.Vn với vốn đầu tư hợp lý, lợi nhuận hấp
                  dẫn
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Bạn đang có một số vốn và có ý định hợp tác kinh doanh với
                  mong muốn giảm thiểu rủi ro và đạt được tiềm năng lớn...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">
                  Xem chi tiết
                </a>
              </div>
            </div>
            <div className="flex flex-col w-full h-full">
              <img
                src="/mun.jpg"
                alt="Nhượng quyền LuxSpa.Vn"
                className="w-full h-[386px] object-cover rounded-lg"
              />
              <div className="flex flex-col w-full text-left flex-grow justify-end">
                <h3 className="text-lg font-bold text-red-600 mt-4 leading-snug">
                  Nhượng quyền LuxSpa.Vn với vốn đầu tư hợp lý, lợi nhuận hấp
                  dẫn
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Bạn đang có một số vốn và có ý định hợp tác kinh doanh với
                  mong muốn giảm thiểu rủi ro và đạt được tiềm năng lớn...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">
                  Xem chi tiết
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 mt-8">
            <div className="flex w-full h-[145px]">
              <img
                src="/mun.jpg"
                alt="Nhượng quyền LuxSpa.Vn"
                className="w-[200px] h-full object-cover rounded-lg"
              />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược
                  và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức
                  buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">
                  Xem chi tiết
                </a>
              </div>
            </div>

            <div className="flex w-full h-[145px]">
              <img
                src="/mun.jpg"
                alt="Nhượng quyền LuxSpa.Vn"
                className="w-[200px] h-full object-cover rounded-lg"
              />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược
                  và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức
                  buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">
                  Xem chi tiết
                </a>
              </div>
            </div>

            <div className="flex w-[598px] h-[145px]">
              <img
                src="/mun.jpg"
                alt="Nhượng quyền LuxSpa.Vn"
                className="w-[200px] h-full object-cover rounded-lg"
              />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược
                  và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức
                  buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">
                  Xem chi tiết
                </a>
              </div>
            </div>

            <div className="flex w-[598px] h-[145px]">
              <img
                src="/mun.jpg"
                alt="Nhượng quyền LuxSpa.Vn"
                className="w-[200px] h-full object-cover rounded-lg"
              />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược
                  và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức
                  buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">
                  Xem chi tiết
                </a>
              </div>
            </div>
            <div className="mt-8">
              <Button
                className="bg-red-600 text-white"
                onClick={handleAddBlogClick}
              >
                Thêm Blog
              </Button>
            </div>
          </div>
        </div>
      </section> */}

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
            {state.submitMessage && (
              <div
                className={`p-3 mb-4 rounded-lg text-center ${
                  state.submitMessage.includes("thành công")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {state.submitMessage}
              </div>
            )}
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!state.fullName || !state.phone) {
                  toast({
                    variant: "destructive",
                    title: "Lỗi",
                    description: "Vui lòng nhập đầy đủ họ tên và số điện thoại",
                  });
                  return;
                }

                dispatch({ type: "SET_SUBMITTING", payload: true });
                try {
                  await consultationService.createConsultingForm({
                    fullName: state.fullName,
                    phone: state.phone,
                    email: "customer@luxspa.vn",
                    message: "Yêu cầu tư vấn từ trang chủ",
                  });
                  toast({
                    title: "Thành công",
                    description:
                      "Chúng tôi đã nhận được thông tin của bạn. Chúng tôi sẽ liên hệ với bạn sớm.",
                    variant: "default",
                  });
                  dispatch({ type: "SET_FULL_NAME", payload: "" });
                  dispatch({ type: "SET_PHONE", payload: "" });
                } catch (error) {
                  console.error("Lỗi khi gửi yêu cầu tư vấn:", error);
                  toast({
                    title: "Lỗi",
                    description: "Có lỗi xảy ra. Vui lòng thử lại sau.",
                    variant: "default",
                  });
                } finally {
                  dispatch({ type: "SET_SUBMITTING", payload: false });
                }
              }}
            >
              <input
                type="text"
                placeholder="Nhập họ và tên"
                value={state.fullName}
                onChange={(e) =>
                  dispatch({ type: "SET_FULL_NAME", payload: e.target.value })
                }
                className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border-l-4"
              />
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={state.phone}
                onChange={(e) =>
                  dispatch({ type: "SET_PHONE", payload: e.target.value })
                }
                className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border-l-4"
              />
              <button
                type="submit"
                disabled={state.isSubmitting}
                className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-pink-600 disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {state.isSubmitting ? "ĐANG GỬI..." : "NHẬN TƯ VẤN"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <AddService open={state.isAddServiceOpen} onClose={handleCloseModal} />
      <AddBlog open={state.isAddBlogOpen} onClose={handleCloseModalBlog} />
      <AddTherapist
        open={state.isAddTherapistOpen}
        onClose={handleCloseModalTherapist}
      />
      <AddTreatment
        open={state.isAddTreatmentOpen}
        onClose={handleCloseModalTreatment}
      />
    </div>
  );
}
