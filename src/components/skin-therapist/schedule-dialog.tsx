import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import skinTherapistSchedulesServices from "@/services/skin-therapist-schedules.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const scheduleFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  therapist: any | null;
}

export default function ScheduleDialog({
  isOpen,
  onClose,
  therapist,
}: ScheduleDialogProps) {
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  useEffect(() => {
    if (therapist && isOpen) {
      const today = new Date();
      setSelectedDate(today);
      scheduleForm.setValue("date", today);

      fetchSchedules(today);
    }
  }, [therapist, isOpen]);

  // Hàm format date theo định dạng YYYY-MM-DD
  const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchSchedules = async (date: Date) => {
    if (!therapist) return;

    setIsLoading(true);
    try {
      const formattedDate = formatDateForApi(date);
      const response: any =
        await skinTherapistSchedulesServices.getSkinTherapistSchedules(
          therapist.accountId,
          1, // pageNumber
          10, // pageSize
          formattedDate // date
        );

      // Kiểm tra và cập nhật trạng thái dựa trên thời gian hiện tại
      const updatedItems = processScheduleData(response.data.items);
      setScheduleData(updatedItems);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Failed to fetch schedules",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processScheduleData = (schedules: any[]) => {
    // Lấy thời gian hiện tại theo múi giờ local của trình duyệt
    const now = new Date();

    return schedules.map((schedule) => {
      // Nếu lịch đã unavailable thì giữ nguyên
      if (!schedule.isAvailable) {
        return schedule;
      }

      try {
        // Parse workDate và tạo ngày từ schedule
        const [scheduleYear, scheduleMonth, scheduleDay] = schedule.workDate
          .split("-")
          .map(Number);
        const [endHours, endMinutes] = schedule.endTime.split(":").map(Number);

        // Lấy năm, tháng, ngày hiện tại
        const todayYear = now.getFullYear();
        const todayMonth = now.getMonth() + 1; // getMonth() trả về 0-11
        const todayDay = now.getDate();

        // So sánh ngày
        if (scheduleYear < todayYear) {
          // Lịch thuộc năm đã qua
          return { ...schedule, isAvailable: false };
        } else if (scheduleYear === todayYear) {
          if (scheduleMonth < todayMonth) {
            // Lịch thuộc tháng đã qua trong năm hiện tại
            return { ...schedule, isAvailable: false };
          } else if (scheduleMonth === todayMonth) {
            if (scheduleDay < todayDay) {
              // Lịch thuộc ngày đã qua trong tháng hiện tại
              return { ...schedule, isAvailable: false };
            } else if (scheduleDay === todayDay) {
              // Cùng ngày, kiểm tra giờ
              const currentHour = now.getHours();
              const currentMinute = now.getMinutes();

              if (
                currentHour > endHours ||
                (currentHour === endHours && currentMinute >= endMinutes)
              ) {
                // Đã qua giờ kết thúc
                return { ...schedule, isAvailable: false };
              }
            }
          }
        }

        // Nếu không rơi vào các trường hợp trên, lịch vẫn available
      } catch (error) {
        console.error("Error processing schedule:", error, schedule);
      }

      return schedule;
    });
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      scheduleForm.setValue("date", date);
      fetchSchedules(date);
    }
  };

  // Function to get schedules
  const getSchedulesByDate = () => {
    return scheduleData;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Schedule Skin Therapist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Form {...scheduleForm}>
            <form className="space-y-4">
              <FormField
                control={scheduleForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Date</FormLabel>
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Time Slots</h3>
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading schedules...
                </div>
              ) : selectedDate ? (
                getSchedulesByDate().length > 0 ? (
                  getSchedulesByDate().map((schedule: any) => (
                    <div
                      key={schedule.scheduleId}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium",
                        schedule.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {schedule.startTime.substring(0, 5)} -{" "}
                      {schedule.endTime.substring(0, 5)}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No schedules found for this date
                  </div>
                )
              ) : (
                <div className="text-sm text-muted-foreground">
                  Please select a date to view schedules
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-100" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-100" />
                <span>Unavailable</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
