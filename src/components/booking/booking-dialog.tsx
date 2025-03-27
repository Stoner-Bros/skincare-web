import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import bookingService from "@/services/booking.services";
import skinTherapistService from "@/services/skin-therapist.services";
import timeSlotService from "@/services/time-slot.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define state type
interface BookingDialogState {
  timeSlots: any[];
  selectedTimeSlots: number[];
  skinTherapists: any[];
  paymentMethods: { label: string; value: string }[];
  bookingLoading: boolean;
}

// Define action types
type BookingDialogAction =
  | { type: "SET_TIME_SLOTS"; payload: any[] }
  | { type: "TOGGLE_TIME_SLOT"; payload: number }
  | { type: "SET_SKIN_THERAPISTS"; payload: any[] }
  | { type: "SET_BOOKING_LOADING"; payload: boolean };

// Define initial state
const initialState: BookingDialogState = {
  timeSlots: [],
  selectedTimeSlots: [],
  skinTherapists: [],
  paymentMethods: [
    { label: "Thẻ ATM", value: "atm" },
    { label: "Thẻ tín dụng", value: "cc" },
    { label: "Ví Momo", value: "momo" },
  ],
  bookingLoading: false,
};

// Reducer function
function bookingDialogReducer(
  state: BookingDialogState,
  action: BookingDialogAction
): BookingDialogState {
  switch (action.type) {
    case "SET_TIME_SLOTS":
      return { ...state, timeSlots: action.payload };
    case "TOGGLE_TIME_SLOT":
      const timeSlotId = action.payload;

      // Nếu timeSlotId là -1, thì đây là yêu cầu reset danh sách slots đã chọn
      if (timeSlotId === -1) {
        return { ...state, selectedTimeSlots: [] };
      }

      // Kiểm tra xem slot này đã được chọn hay chưa
      if (state.selectedTimeSlots.includes(timeSlotId)) {
        // Nếu slot này đang nằm ở giữa chuỗi các slots đã chọn, không cho phép bỏ chọn
        const sortedSlots = [...state.selectedTimeSlots].sort((a, b) => a - b);
        const index = sortedSlots.indexOf(timeSlotId);

        // Chỉ cho phép bỏ chọn nếu slot là đầu hoặc cuối của chuỗi
        if (index === 0 || index === sortedSlots.length - 1) {
          return {
            ...state,
            selectedTimeSlots: state.selectedTimeSlots.filter(
              (id) => id !== timeSlotId
            ),
          };
        } else {
          // Nếu slot nằm ở giữa, không cho phép bỏ chọn
          return state;
        }
      } else {
        // Kiểm tra xem có thể thêm slot này không (phải liền kề với slot đã chọn)
        if (state.selectedTimeSlots.length === 0) {
          // Nếu chưa có slot nào được chọn, cho phép chọn slot này
          return {
            ...state,
            selectedTimeSlots: [timeSlotId],
          };
        } else {
          // Tìm slot id nhỏ nhất và lớn nhất trong các slots đã chọn
          const sortedSlots = [...state.selectedTimeSlots].sort(
            (a, b) => a - b
          );
          const minSlot = sortedSlots[0];
          const maxSlot = sortedSlots[sortedSlots.length - 1];

          // Chỉ cho phép chọn nếu slot mới liền kề với chuỗi slot đã chọn
          if (timeSlotId === minSlot - 1 || timeSlotId === maxSlot + 1) {
            return {
              ...state,
              selectedTimeSlots: [...state.selectedTimeSlots, timeSlotId],
            };
          } else {
            // Nếu không liền kề, không cho phép chọn thêm
            toast({
              title: "Thông báo",
              description: "Bạn chỉ có thể chọn các khung giờ liền kề nhau",
              variant: "destructive",
            });
            return state;
          }
        }
      }
    case "SET_SKIN_THERAPISTS":
      return { ...state, skinTherapists: action.payload };
    case "SET_BOOKING_LOADING":
      return { ...state, bookingLoading: action.payload };
    default:
      return state;
  }
}

// Booking form schema
const bookingFormSchema = z.object({
  email: z.string().email({ message: "Vui lòng nhập email hợp lệ" }),
  phone: z.string().min(9, { message: "Số điện thoại không hợp lệ" }),
  fullName: z.string().min(2, { message: "Vui lòng nhập họ tên" }),
  skinTherapistId: z.number().optional(),
  notes: z.string().optional(),
  date: z.date({ message: "Vui lòng chọn ngày" }),
  paymentMethod: z.string({ message: "Vui lòng chọn phương thức thanh toán" }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treatment: any;
  treatmentId: number;
}

export default function BookingDialog({
  open,
  onOpenChange,
  treatment,
  treatmentId,
}: BookingDialogProps) {
  const [state, dispatch] = useReducer(bookingDialogReducer, initialState);
  const {
    timeSlots,
    selectedTimeSlots,
    skinTherapists,
    paymentMethods,
    bookingLoading,
  } = state;

  const bookingForm = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      email: "",
      phone: "",
      fullName: "",
      notes: "",
      paymentMethod: "momo",
    },
  });

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

    if (open) {
      fetchTimeSlots();
      // Reset form khi mở dialog
      bookingForm.reset({
        email: "",
        phone: "",
        fullName: "",
        notes: "",
        paymentMethod: "momo",
      });

      // Đảm bảo phương thức thanh toán luôn được chọn
      setTimeout(() => {
        const value = bookingForm.getValues("paymentMethod");
        if (!value) bookingForm.setValue("paymentMethod", "momo");
      }, 0);
    }
  }, [open, bookingForm]);

  const fetchSkinTherapists = async (date: string) => {
    try {
      if (!date || selectedTimeSlots.length === 0) return;

      dispatch({ type: "SET_BOOKING_LOADING", payload: true });

      // Chuyển đổi danh sách timeSlotIds thành dạng query string mà API yêu cầu
      const response = await skinTherapistService.getFreeSkinTherapistSlots(
        date,
        selectedTimeSlots.join(","),
        1,
        10
      );

      if (response.status === 200 && response.data && response.data.items) {
        // Ánh xạ dữ liệu API trả về thành một mảng đơn giản hơn cho component
        const therapistsData = response.data.items.map((item: any) => ({
          accountId: item.accountId,
          fullName: item.account?.accountInfo?.fullName || "Chuyên viên",
          specialization: item.specialization || "",
          experience: item.experience || "",
          bio: item.bio || "",
          isAvailable: item.isAvailable,
        }));

        dispatch({ type: "SET_SKIN_THERAPISTS", payload: therapistsData });
      } else {
        // Nếu không có dữ liệu hoặc API trả về lỗi
        dispatch({ type: "SET_SKIN_THERAPISTS", payload: [] });
      }
    } catch (error) {
      console.error("Error fetching skin therapists:", error);
      dispatch({ type: "SET_SKIN_THERAPISTS", payload: [] });
      toast({
        title: "Lỗi",
        description:
          "Không thể tải danh sách chuyên viên. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_BOOKING_LOADING", payload: false });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      bookingForm.setValue("date", date);

      // Reset selected time slots when date changes
      dispatch({ type: "TOGGLE_TIME_SLOT", payload: -1 });

      // Cũng reset danh sách chuyên viên khi ngày thay đổi
      dispatch({ type: "SET_SKIN_THERAPISTS", payload: [] });
    }
  };

  const formatDateForApi = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const handleTimeSlotToggle = (timeSlotId: number, isAvailable: boolean) => {
    // Không cho phép chọn các time slots không available
    if (!isAvailable) return;

    dispatch({ type: "TOGGLE_TIME_SLOT", payload: timeSlotId });
  };

  // Theo dõi sự thay đổi của selectedTimeSlots để cập nhật danh sách chuyên viên
  useEffect(() => {
    const date = bookingForm.getValues("date");
    if (date && selectedTimeSlots.length > 0) {
      const formattedDate = formatDateForApi(date);
      fetchSkinTherapists(formattedDate);
    }
  }, [selectedTimeSlots]);

  // Khi danh sách skin therapists thay đổi, reset giá trị đã chọn nếu không còn tồn tại
  useEffect(() => {
    const currentTherapistId = bookingForm.getValues("skinTherapistId");
    if (currentTherapistId && skinTherapists.length > 0) {
      const exists = skinTherapists.some(
        (therapist) => therapist.accountId === currentTherapistId
      );
      if (!exists) {
        bookingForm.setValue("skinTherapistId", undefined);
      }
    }
  }, [skinTherapists, bookingForm]);

  // Đảm bảo giá trị mặc định luôn tồn tại trong danh sách
  useEffect(() => {
    const currentPaymentMethod = bookingForm.getValues("paymentMethod");
    const validPaymentMethod = paymentMethods.some(
      (method) => method.value === currentPaymentMethod
    );

    if (!validPaymentMethod && paymentMethods.length > 0) {
      bookingForm.setValue("paymentMethod", paymentMethods[0].value);
    }
  }, [paymentMethods, bookingForm]);

  const onSubmitBooking = async (data: BookingFormValues) => {
    if (selectedTimeSlots.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một khung giờ",
        variant: "destructive",
      });
      return;
    }

    try {
      dispatch({ type: "SET_BOOKING_LOADING", payload: true });

      const bookingData = {
        email: data.email,
        phone: data.phone,
        fullName: data.fullName,
        treatmentId: treatmentId,
        skinTherapistId: data.skinTherapistId || 0,
        notes: data.notes || "",
        date: formatDateForApi(data.date),
        timeSlotIds: selectedTimeSlots,
        paymentMethod: data.paymentMethod,
      };

      const response = await bookingService.createBooking(bookingData);

      if (response && response.data) {
        // Kiểm tra có payUrl để chuyển hướng không
        if (response.data.payUrl) {
          // Thông báo trước khi chuyển hướng
          const paymentMethod = paymentMethods.find(
            (m) => m.value === data.paymentMethod
          );
          toast({
            title: "Đặt lịch thành công",
            description: `Bạn sẽ được chuyển đến trang thanh toán ${
              paymentMethod?.label || ""
            }.`,
          });

          // Delay ngắn để cho toast hiển thị
          setTimeout(() => {
            try {
              // Lưu thông tin đặt lịch vào localStorage để phòng trường hợp có lỗi chuyển hướng
              localStorage.setItem(
                "latestBooking",
                JSON.stringify({
                  bookingId: response.data.orderId || response.data.requestId,
                  treatmentName: treatment?.treatmentName,
                  date: formatDateForApi(data.date),
                  paymentMethod: data.paymentMethod,
                })
              );

              // Chuyển hướng đến trang thanh toán
              window.location.href = response.data.payUrl;
            } catch (redirectError) {
              console.error(
                "Error redirecting to payment page:",
                redirectError
              );
              toast({
                title: "Lỗi chuyển hướng",
                description:
                  "Có lỗi khi chuyển đến trang thanh toán. Vui lòng thử lại sau hoặc liên hệ với chúng tôi.",
                variant: "destructive",
              });
              onOpenChange(false);
            }
          }, 1500);
        } else {
          // Trường hợp không có payUrl (thanh toán tại chỗ hoặc phương thức không hỗ trợ online)
          toast({
            title: "Đặt lịch thành công",
            description: "Chúng tôi sẽ liên hệ với bạn sớm nhất!",
          });
          onOpenChange(false);
        }

        // Reset form và state
        bookingForm.reset();
        dispatch({ type: "SET_TIME_SLOTS", payload: [] });
        dispatch({ type: "TOGGLE_TIME_SLOT", payload: -1 });
        dispatch({ type: "SET_SKIN_THERAPISTS", payload: [] });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đặt lịch. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_BOOKING_LOADING", payload: false });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Đặt lịch {treatment?.treatmentName}</DialogTitle>
          <DialogDescription>
            Điền thông tin của bạn để đặt lịch cho liệu trình này.
          </DialogDescription>
        </DialogHeader>

        <Form {...bookingForm}>
          <form
            onSubmit={bookingForm.handleSubmit(onSubmitBooking)}
            className="space-y-6"
          >
            <div className="max-h-[70vh] overflow-y-auto space-y-6 p-2">
              {/* Phần 1: Chọn thời gian */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">
                  1. Chọn thời gian
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={bookingForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày đặt lịch</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) handleDateChange(date);
                              }}
                              disabled={(date) =>
                                date < new Date() ||
                                date >
                                  new Date(
                                    new Date().setMonth(
                                      new Date().getMonth() + 3
                                    )
                                  )
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <FormLabel className="mb-2 block">Khung giờ</FormLabel>
                  {bookingForm.getValues("date") ? (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot.timeSlotId}
                            onClick={() =>
                              handleTimeSlotToggle(
                                slot.timeSlotId,
                                slot.isAvailable
                              )
                            }
                            className={cn(
                              "px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors",
                              selectedTimeSlots.includes(slot.timeSlotId)
                                ? "bg-[#AF1F45] text-white"
                                : slot.isAvailable
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-red-100 text-red-700 cursor-not-allowed opacity-60"
                            )}
                          >
                            {slot.startTime.substring(0, 5)} -{" "}
                            {slot.endTime.substring(0, 5)}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground mt-2">
                        <em>
                          Lưu ý: Bạn chỉ có thể chọn một khung giờ hoặc các
                          khung giờ liền kề nhau
                        </em>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                      Vui lòng chọn ngày để xem khung giờ
                    </div>
                  )}

                  {/* Chú thích trạng thái time slots */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gray-100" />
                      <span>Có sẵn</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#AF1F45]" />
                      <span>Đã chọn</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-100" />
                      <span>Không khả dụng</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần 2: Chọn chuyên viên */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">
                  2. Chọn chuyên viên
                </h3>
                <FormField
                  control={bookingForm.control}
                  name="skinTherapistId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Chuyên viên da liễu{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          (không bắt buộc)
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="text-ellipsis overflow-hidden">
                            <SelectValue placeholder="Chọn chuyên viên da liễu" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent
                          position="popper"
                          className="min-w-[200px] w-[var(--radix-select-trigger-width)]"
                        >
                          {bookingLoading ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span>Đang tải...</span>
                            </div>
                          ) : skinTherapists.length > 0 ? (
                            skinTherapists.map((therapist) => (
                              <SelectItem
                                key={therapist.accountId}
                                value={therapist.accountId.toString()}
                                className="py-2"
                              >
                                <span className="block font-medium">
                                  {therapist.fullName}
                                </span>
                              </SelectItem>
                            ))
                          ) : selectedTimeSlots.length > 0 ? (
                            <SelectItem value="none" disabled>
                              Không có chuyên viên nào khả dụng cho khung giờ đã
                              chọn
                            </SelectItem>
                          ) : (
                            <SelectItem value="none" disabled>
                              Vui lòng chọn ngày và khung giờ trước
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phần 3: Thông tin cá nhân */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">
                  3. Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={bookingForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0912345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bookingForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@domain.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Phần 4: Phương thức thanh toán và ghi chú */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">
                  4. Phương thức thanh toán và ghi chú
                </h3>
                <FormField
                  control={bookingForm.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phương thức thanh toán</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "momo"}
                      >
                        <FormControl>
                          <SelectTrigger className="border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                            <SelectValue placeholder="Chọn phương thức thanh toán" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent align="center" className="min-w-[180px]">
                          {paymentMethods.map((method) => (
                            <SelectItem
                              key={method.value}
                              value={method.value}
                              className="py-2 cursor-pointer"
                            >
                              <span className="font-medium">
                                {method.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bookingForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ghi chú{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          (không bắt buộc)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ghi chú thêm về yêu cầu của bạn"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={bookingLoading}
                className="bg-[#AF1F45] hover:bg-[#8a1936]"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  "Đặt lịch"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
