import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import SkinTherapistSchedulesServices from "@/services/skin-therapist-schedules.services";
import TimeSlotServices from "@/services/time-slot.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const scheduleFormSchema = z.object({
  startDate: z.date({
    required_error: "Ngày bắt đầu là bắt buộc.",
  }),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

type State = {
  allTimeSlots: any[];
  therapistSchedulesByDay: Record<string, any[]>;
  selectedDate: Date | null;
  selectedDays: Date[];
  isLoading: boolean;
  selectedTimeSlotsByDay: Record<string, any[]>;
};

type Action =
  | { type: "SET_ALL_TIME_SLOTS"; payload: any[] }
  | {
      type: "SET_THERAPIST_SCHEDULES_BY_DAY";
      payload: { date: string; schedules: any[] };
    }
  | { type: "SET_SELECTED_DATE"; payload: Date | null }
  | { type: "SET_SELECTED_DAYS"; payload: Date[] }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "TOGGLE_TIME_SLOT_SELECTION";
      payload: { date: string; timeSlot: any };
    }
  | { type: "RESET_SELECTED_TIME_SLOTS" }
  | { type: "RESET_STATE" };

const initialState: State = {
  allTimeSlots: [],
  therapistSchedulesByDay: {},
  selectedDate: null,
  selectedDays: [],
  isLoading: false,
  selectedTimeSlotsByDay: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALL_TIME_SLOTS":
      return { ...state, allTimeSlots: action.payload };
    case "SET_THERAPIST_SCHEDULES_BY_DAY": {
      const { date, schedules } = action.payload;
      return {
        ...state,
        therapistSchedulesByDay: {
          ...state.therapistSchedulesByDay,
          [date]: schedules,
        },
      };
    }
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_SELECTED_DAYS":
      return { ...state, selectedDays: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "TOGGLE_TIME_SLOT_SELECTION": {
      const { date, timeSlot } = action.payload;
      // Check if the time slot is busy
      const isBusy = (state.therapistSchedulesByDay[date] || []).some(
        (schedule) =>
          schedule.startTime === timeSlot.startTime &&
          schedule.endTime === timeSlot.endTime &&
          !schedule.isAvailable
      );

      // Don't allow selecting busy slots
      if (isBusy) return state;

      const currentDaySlots = state.selectedTimeSlotsByDay[date] || [];
      const isAlreadySelected = currentDaySlots.some(
        (selected) => selected.timeSlotId === timeSlot.timeSlotId
      );

      let updatedDaySlots;
      if (isAlreadySelected) {
        updatedDaySlots = currentDaySlots.filter(
          (selected) => selected.timeSlotId !== timeSlot.timeSlotId
        );
      } else {
        updatedDaySlots = [...currentDaySlots, timeSlot];
      }

      return {
        ...state,
        selectedTimeSlotsByDay: {
          ...state.selectedTimeSlotsByDay,
          [date]: updatedDaySlots,
        },
      };
    }
    case "RESET_SELECTED_TIME_SLOTS":
      return { ...state, selectedTimeSlotsByDay: {} };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

export default function RegisterSchedule() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [therapist, setTherapist] = useState<any | null>(null);
  const [activeDay, setActiveDay] = useState<string>("");
  const { user } = useAuth();
  const {
    allTimeSlots,
    therapistSchedulesByDay,
    selectedDays,
    isLoading,
    selectedTimeSlotsByDay,
  } = state;

  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    // Khởi tạo trang
    fetchAllTimeSlots();

    // Trong môi trường thực tế, bạn có thể lấy therapist từ API hoặc context
    setTherapist({
      accountId: user?.accountId || "default-id", // Thay thế bằng ID thực tế hoặc lấy từ context
      name: user?.fullName || "Chuyên viên da hiện tại",
    });
  }, [user]);

  const fetchAllTimeSlots = async () => {
    try {
      const response = await TimeSlotServices.getTimeSlots();
      dispatch({ type: "SET_ALL_TIME_SLOTS", payload: response.data });
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải khung giờ",
        variant: "destructive",
      });
    }
  };

  const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (date: Date): string => {
    return format(date, "EEE, dd/MM/yyyy");
  };

  const fetchTherapistSchedulesForWeek = async (startDate: Date) => {
    if (!therapist) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Tạo mảng 7 ngày kể từ startDate
      const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
      dispatch({ type: "SET_SELECTED_DAYS", payload: days });

      // Lấy lịch trình cho từng ngày
      for (const day of days) {
        const formattedDate = formatDateForApi(day);
        try {
          const response: any =
            await SkinTherapistSchedulesServices.getSkinTherapistSchedules(
              therapist.accountId,
              1,
              50, // Tăng limit để lấy tất cả time slots
              formattedDate
            );

          dispatch({
            type: "SET_THERAPIST_SCHEDULES_BY_DAY",
            payload: { date: formattedDate, schedules: response.data.items },
          });
        } catch (error) {
          console.error(
            `Error fetching schedules for ${formattedDate}:`,
            error
          );
        }
      }

      // Sau khi tải xong, set ngày đầu tiên làm active tab
      if (days.length > 0) {
        setActiveDay(formatDateForApi(days[0]));
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch trình",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;

    dispatch({ type: "SET_SELECTED_DATE", payload: date });
    scheduleForm.setValue("startDate", date);
    dispatch({ type: "RESET_SELECTED_TIME_SLOTS" });
    fetchTherapistSchedulesForWeek(date);
  };

  const isTimeSlotAvailable = (date: string, timeSlot: any) => {
    const daySchedules = therapistSchedulesByDay[date] || [];
    return daySchedules.some(
      (schedule) =>
        schedule.startTime === timeSlot.startTime &&
        schedule.endTime === timeSlot.endTime &&
        schedule.isAvailable
    );
  };

  const isTimeSlotBusy = (date: string, timeSlot: any) => {
    const daySchedules = therapistSchedulesByDay[date] || [];
    return daySchedules.some(
      (schedule) =>
        schedule.startTime === timeSlot.startTime &&
        schedule.endTime === timeSlot.endTime &&
        !schedule.isAvailable
    );
  };

  const isTimeSlotSelected = (date: string, timeSlot: any) => {
    const selectedSlots = selectedTimeSlotsByDay[date] || [];
    return selectedSlots.some(
      (selected) => selected.timeSlotId === timeSlot.timeSlotId
    );
  };

  const toggleTimeSlotSelection = (date: string, timeSlot: any) => {
    dispatch({
      type: "TOGGLE_TIME_SLOT_SELECTION",
      payload: { date, timeSlot },
    });
  };

  const getAssignableTimeSlots = (date: string) => {
    const selectedSlots = selectedTimeSlotsByDay[date] || [];
    const daySchedules = therapistSchedulesByDay[date] || [];

    return selectedSlots.filter((slot) => {
      // Slot có thể đăng ký nếu chưa được đăng ký (không có trong therapistSchedules)
      return !daySchedules.some(
        (schedule) =>
          schedule.startTime === slot.startTime &&
          schedule.endTime === slot.endTime
      );
    });
  };

  const getUnassignableTimeSlots = (date: string) => {
    const selectedSlots = selectedTimeSlotsByDay[date] || [];
    const daySchedules = therapistSchedulesByDay[date] || [];

    return selectedSlots.filter((slot) => {
      // Slot có thể hủy đăng ký nếu đã được đăng ký (có trong therapistSchedules và isAvailable)
      return daySchedules.some(
        (schedule) =>
          schedule.startTime === slot.startTime &&
          schedule.endTime === slot.endTime &&
          schedule.isAvailable
      );
    });
  };

  // Lấy tổng số khung giờ có thể đăng ký cho tất cả các ngày
  const getTotalAssignableTimeSlots = () => {
    let total = 0;
    for (const date of Object.keys(selectedTimeSlotsByDay)) {
      total += getAssignableTimeSlots(date).length;
    }
    return total;
  };

  // Lấy tổng số khung giờ có thể hủy đăng ký cho tất cả các ngày
  const getTotalUnassignableTimeSlots = () => {
    let total = 0;
    for (const date of Object.keys(selectedTimeSlotsByDay)) {
      total += getUnassignableTimeSlots(date).length;
    }
    return total;
  };

  const handleAssign = async () => {
    if (!therapist) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin chuyên viên",
        variant: "destructive",
      });
      return;
    }

    const totalAssignable = getTotalAssignableTimeSlots();
    if (totalAssignable === 0) {
      toast({
        title: "Lỗi",
        description: "Không có khung giờ nào khả dụng để đăng ký",
        variant: "destructive",
      });
      return;
    }

    // Chuẩn bị dữ liệu cho API
    const registrationsByDate: Record<string, number[]> = {};

    // Gom nhóm các timeSlotIds theo ngày
    for (const date of Object.keys(selectedTimeSlotsByDay)) {
      const assignableSlots = getAssignableTimeSlots(date);
      if (assignableSlots.length > 0) {
        registrationsByDate[date] = assignableSlots.map(
          (slot) => slot.timeSlotId
        );
      }
    }

    // Gọi API cho từng ngày
    let successCount = 0;
    let errorCount = 0;

    for (const date of Object.keys(registrationsByDate)) {
      const timeSlotIds = registrationsByDate[date];
      try {
        const response =
          await SkinTherapistSchedulesServices.createSkinTherapistSchedule({
            skinTherapistId: therapist.accountId,
            workDates: [date],
            timeSlotIds: timeSlotIds,
          });

        if (response.status === 200) {
          successCount += timeSlotIds.length;

          // Cập nhật lại dữ liệu lịch trình cho ngày này
          const updatedResponse: any =
            await SkinTherapistSchedulesServices.getSkinTherapistSchedules(
              therapist.accountId,
              1,
              50,
              date
            );

          dispatch({
            type: "SET_THERAPIST_SCHEDULES_BY_DAY",
            payload: { date, schedules: updatedResponse.data.items },
          });
        }
      } catch (error) {
        console.error(`Error assigning time slots for ${date}:`, error);
        errorCount += timeSlotIds.length;
      }
    }

    if (successCount > 0) {
      toast({
        title: "Thành công",
        description: `${successCount} khung giờ đã được đăng ký thành công`,
      });
    }

    if (errorCount > 0) {
      toast({
        title: "Lỗi",
        description: `${errorCount} khung giờ không thể đăng ký`,
        variant: "destructive",
      });
    }

    // Reset selected time slots
    dispatch({ type: "RESET_SELECTED_TIME_SLOTS" });
  };

  const handleUnassign = async () => {
    if (!therapist) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin chuyên viên",
        variant: "destructive",
      });
      return;
    }

    const totalUnassignable = getTotalUnassignableTimeSlots();
    if (totalUnassignable === 0) {
      toast({
        title: "Lỗi",
        description: "Không có khung giờ nào khả dụng để huỷ đăng ký",
        variant: "destructive",
      });
      return;
    }

    // Chuẩn bị dữ liệu cho API
    const cancelsByDate: Record<string, number[]> = {};

    // Gom nhóm các timeSlotIds theo ngày
    for (const date of Object.keys(selectedTimeSlotsByDay)) {
      const unassignableSlots = getUnassignableTimeSlots(date);
      if (unassignableSlots.length > 0) {
        cancelsByDate[date] = unassignableSlots.map((slot) => slot.timeSlotId);
      }
    }

    // Gọi API cho từng ngày
    let successCount = 0;
    let errorCount = 0;

    for (const date of Object.keys(cancelsByDate)) {
      const timeSlotIds = cancelsByDate[date];
      try {
        const response =
          await SkinTherapistSchedulesServices.cancelSkinTherapistSchedule({
            skinTherapistId: therapist.accountId,
            workDates: [date],
            timeSlotIds: timeSlotIds,
          });

        if (response.status === 200) {
          successCount += timeSlotIds.length;

          // Cập nhật lại dữ liệu lịch trình cho ngày này
          const updatedResponse: any =
            await SkinTherapistSchedulesServices.getSkinTherapistSchedules(
              therapist.accountId,
              1,
              50,
              date
            );

          dispatch({
            type: "SET_THERAPIST_SCHEDULES_BY_DAY",
            payload: { date, schedules: updatedResponse.data.items },
          });
        }
      } catch (error) {
        console.error(`Error unassigning time slots for ${date}:`, error);
        errorCount += timeSlotIds.length;
      }
    }

    if (successCount > 0) {
      toast({
        title: "Thành công",
        description: `${successCount} khung giờ đã được huỷ đăng ký thành công`,
      });
    }

    if (errorCount > 0) {
      toast({
        title: "Lỗi",
        description: `${errorCount} khung giờ không thể huỷ đăng ký`,
        variant: "destructive",
      });
    }

    // Reset selected time slots
    dispatch({ type: "RESET_SELECTED_TIME_SLOTS" });
  };

  // Tính tổng số khung giờ đã chọn cho tất cả các ngày
  const getTotalSelectedTimeSlots = () => {
    let total = 0;
    for (const date of Object.keys(selectedTimeSlotsByDay)) {
      total += (selectedTimeSlotsByDay[date] || []).length;
    }
    return total;
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Lịch Trình Chuyên Viên Da</CardTitle>
          {therapist && (
            <p className="text-sm text-muted-foreground">
              Chuyên viên: {therapist.name}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...scheduleForm}>
            <form className="space-y-4">
              <FormField
                control={scheduleForm.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Chọn Tuần (Ngày Bắt Đầu)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "EEEE, dd/MM/yyyy")
                            ) : (
                              <span>Chọn ngày bắt đầu</span>
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
                            if (date) {
                              handleDateSelect(date);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {selectedDays.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Lịch Trình 7 Ngày</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAssign}
                    disabled={getTotalAssignableTimeSlots() === 0}
                  >
                    Đăng ký{" "}
                    {getTotalAssignableTimeSlots() > 0 &&
                      `(${getTotalAssignableTimeSlots()})`}
                  </Button>
                  <Button
                    onClick={handleUnassign}
                    disabled={getTotalUnassignableTimeSlots() === 0}
                  >
                    Huỷ đăng ký{" "}
                    {getTotalUnassignableTimeSlots() > 0 &&
                      `(${getTotalUnassignableTimeSlots()})`}
                  </Button>
                </div>
              </div>

              <Tabs value={activeDay} onValueChange={setActiveDay}>
                <TabsList className="mb-2 flex flex-wrap h-auto">
                  {selectedDays.map((day) => {
                    const dayStr = formatDateForApi(day);
                    const selectedCount = (selectedTimeSlotsByDay[dayStr] || [])
                      .length;
                    return (
                      <TabsTrigger
                        key={dayStr}
                        value={dayStr}
                        className={cn(
                          "px-3 py-1.5 relative",
                          selectedCount > 0 && "font-medium"
                        )}
                      >
                        {formatDateForDisplay(day)}
                        {selectedCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            {selectedCount}
                          </span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {selectedDays.map((day) => {
                  const dayStr = formatDateForApi(day);
                  return (
                    <TabsContent
                      key={dayStr}
                      value={dayStr}
                      className="border rounded-md p-4"
                    >
                      <div className="flex flex-wrap gap-2">
                        {isLoading ? (
                          <div className="text-sm text-muted-foreground">
                            Đang tải lịch trình...
                          </div>
                        ) : allTimeSlots?.length > 0 ? (
                          allTimeSlots?.map((timeSlot: any) => (
                            <div
                              key={timeSlot?.timeSlotId}
                              onClick={() =>
                                toggleTimeSlotSelection(dayStr, timeSlot)
                              }
                              className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors",
                                isTimeSlotBusy(dayStr, timeSlot)
                                  ? "bg-red-100 text-red-700 cursor-not-allowed"
                                  : isTimeSlotAvailable(dayStr, timeSlot)
                                  ? isTimeSlotSelected(dayStr, timeSlot)
                                    ? "bg-green-500 text-white"
                                    : "bg-green-100 text-green-700 hover:bg-green-200"
                                  : isTimeSlotSelected(dayStr, timeSlot)
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              )}
                            >
                              {timeSlot?.startTime?.substring(0, 5)} -{" "}
                              {timeSlot?.endTime?.substring(0, 5)}
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Không tìm thấy khung giờ nào
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-100" />
                            <span>Đã đăng ký</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span>Đã chọn (Đã đăng ký)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-gray-100" />
                            <span>Chưa đăng ký</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span>Đã chọn (Chưa đăng ký)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-100" />
                            <span>Đã bận</span>
                          </div>
                        </div>

                        {(selectedTimeSlotsByDay[dayStr] || []).length > 0 && (
                          <div className="text-sm font-medium">
                            <span className="mr-1">
                              {(selectedTimeSlotsByDay[dayStr] || []).length}
                            </span>
                            khung giờ đã chọn
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>

              {getTotalSelectedTimeSlots() > 0 && (
                <div className="mt-4 p-2 bg-gray-50 rounded-md text-sm">
                  <span className="font-medium">
                    {getTotalSelectedTimeSlots()}
                  </span>{" "}
                  khung giờ đã được chọn trong 7 ngày
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
