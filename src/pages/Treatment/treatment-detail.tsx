import { Button } from "@/components/ui/button";
import timeSlotService from "@/services/time-slot.services";
import treatmentService from "@/services/treatment.services";
import { ArrowLeft, Check, Clock, Loader2, Tag, Users } from "lucide-react";
import { useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingDialog from "../../components/booking/booking-dialog";

// Define state type
interface TreatmentState {
  treatment: any | null;
  loading: boolean;
  error: string | null;
  bookingDialogOpen: boolean;
  timeSlots: any[];
  selectedTimeSlots: number[];
  skinTherapists: any[];
  paymentMethods: string[];
  bookingLoading: boolean;
}

// Define action types
type TreatmentAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: any }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "SET_BOOKING_DIALOG_OPEN"; payload: boolean }
  | { type: "SET_TIME_SLOTS"; payload: any[] }
  | { type: "TOGGLE_TIME_SLOT"; payload: number }
  | { type: "SET_SKIN_THERAPISTS"; payload: any[] }
  | { type: "SET_BOOKING_LOADING"; payload: boolean };

// Define initial state
const initialState: TreatmentState = {
  treatment: null,
  loading: true,
  error: null,
  bookingDialogOpen: false,
  timeSlots: [],
  selectedTimeSlots: [],
  skinTherapists: [],
  paymentMethods: ["Cash", "Credit Card", "Momo", "Bank Transfer"],
  bookingLoading: false,
};

// Reducer function
function treatmentReducer(
  state: TreatmentState,
  action: TreatmentAction
): TreatmentState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        treatment: action.payload,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        treatment: null,
      };
    case "SET_BOOKING_DIALOG_OPEN":
      return { ...state, bookingDialogOpen: action.payload };
    case "SET_TIME_SLOTS":
      return { ...state, timeSlots: action.payload };
    case "TOGGLE_TIME_SLOT":
      const timeSlotId = action.payload;
      if (state.selectedTimeSlots.includes(timeSlotId)) {
        return {
          ...state,
          selectedTimeSlots: state.selectedTimeSlots.filter(
            (id) => id !== timeSlotId
          ),
        };
      } else {
        return {
          ...state,
          selectedTimeSlots: [...state.selectedTimeSlots, timeSlotId],
        };
      }
    case "SET_SKIN_THERAPISTS":
      return { ...state, skinTherapists: action.payload };
    case "SET_BOOKING_LOADING":
      return { ...state, bookingLoading: action.payload };
    default:
      return state;
  }
}

export default function TreatmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(treatmentReducer, initialState);
  const { treatment, loading, error, bookingDialogOpen } = state;

  useEffect(() => {
    const fetchTreatmentDetail = async () => {
      try {
        dispatch({ type: "FETCH_START" });
        const treatmentId = parseInt(id || "0");

        if (treatmentId > 0) {
          const response = await treatmentService.getTreatmentById(treatmentId);
          const treatmentData = response.data;

          if (treatmentData) {
            dispatch({ type: "FETCH_SUCCESS", payload: treatmentData });
          } else {
            dispatch({
              type: "FETCH_ERROR",
              payload: "Không tìm thấy dữ liệu liệu trình",
            });
          }
        } else {
          dispatch({
            type: "FETCH_ERROR",
            payload: "Không tìm thấy thông tin liệu trình",
          });
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết liệu trình:", err);
        dispatch({
          type: "FETCH_ERROR",
          payload: "Không thể tải chi tiết liệu trình. Vui lòng thử lại sau.",
        });
      }
    };

    fetchTreatmentDetail();
  }, [id]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await timeSlotService.getTimeSlots();
        if (response.data) {
          dispatch({ type: "SET_TIME_SLOTS", payload: response.data });
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Format image URL correctly based on format
  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/default-treatment.jpg";

    // Nếu URL đã là đường dẫn đầy đủ, trả về luôn
    if (url.startsWith("http")) return url;

    // Nếu URL chỉ là tên file, thêm base URL
    return `https://skincare-api.azurewebsites.net/api/upload/${url}`;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex justify-center items-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#AF1F45]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white">
        <div className="container mx-auto py-8">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="mb-6 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="w-full min-h-screen bg-white">
        <div className="container mx-auto py-8">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="mb-6 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div className="text-center py-10">
            <p className="text-gray-500">Không tìm thấy thông tin liệu trình</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="mb-6 flex items-center hover:bg-pink-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
            <div className="md:flex">
              <div className="md:w-1/2 relative">
                <img
                  src={getImageUrl(treatment.treatmentThumbnailUrl)}
                  alt={treatment.treatmentName}
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/default-treatment.jpg";
                  }}
                />
                {treatment.isAvailable && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Có sẵn
                  </div>
                )}
              </div>

              <div className="md:w-1/2 p-8">
                <h1 className="text-3xl font-bold text-[#2F3B4B] mb-4">
                  {treatment.treatmentName}
                </h1>

                <div className="space-y-6">
                  <div className="flex items-center text-2xl font-bold text-[#AF1F45]">
                    <Tag className="h-6 w-6 mr-2" />
                    <span>{treatment.price?.toLocaleString("vi-VN")} VND</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{treatment.duration || "30"} phút</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    <span>
                      {treatment.isAvailable ? "Có sẵn" : "Không có sẵn"}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Mô tả:</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {treatment.description ||
                        `${treatment.treatmentName} là liệu trình chăm sóc da được thiết kế đặc biệt để điều trị và ngăn ngừa mụn, giảm viêm và phục hồi độ trong sáng cho da. Sử dụng kết hợp các phương pháp làm sạch sâu, tẩy tế bào chết và các thành phần kháng khuẩn, liệu trình này giúp kiểm soát mụn và giảm thiểu nguy cơ mụn tái phát.`}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Lợi ích chính:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Làm sạch sâu và loại bỏ tạp chất</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Cân bằng độ ẩm và dầu trên da</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 mr-2 text-green-500" />
                        <span>Giảm thiểu dấu hiệu lão hóa</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    className="w-full mt-8 bg-[#AF1F45] hover:bg-[#8a1936] text-white py-6 text-lg font-semibold"
                    onClick={() =>
                      dispatch({
                        type: "SET_BOOKING_DIALOG_OPEN",
                        payload: true,
                      })
                    }
                  >
                    Đặt lịch ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        open={bookingDialogOpen}
        onOpenChange={(open) =>
          dispatch({ type: "SET_BOOKING_DIALOG_OPEN", payload: open })
        }
        treatment={treatment}
        treatmentId={parseInt(id || "0")}
      />
    </>
  );
}
