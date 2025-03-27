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
import SkinTherapistSchedulesServices from "@/services/skin-therapist-schedules.services";
import TimeSlotServices from "@/services/time-slot.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useReducer } from "react";
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

type State = {
  allTimeSlots: any[];
  therapistSchedules: any[];
  selectedDate: Date | null;
  isLoading: boolean;
  selectedTimeSlots: any[];
};

type Action =
  | { type: "SET_ALL_TIME_SLOTS"; payload: any[] }
  | { type: "SET_THERAPIST_SCHEDULES"; payload: any[] }
  | { type: "SET_SELECTED_DATE"; payload: Date | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "TOGGLE_TIME_SLOT_SELECTION"; payload: any }
  | { type: "RESET_SELECTED_TIME_SLOTS" }
  | { type: "RESET_STATE" };

const initialState: State = {
  allTimeSlots: [],
  therapistSchedules: [],
  selectedDate: null,
  isLoading: false,
  selectedTimeSlots: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_ALL_TIME_SLOTS":
      return { ...state, allTimeSlots: action.payload };
    case "SET_THERAPIST_SCHEDULES":
      return { ...state, therapistSchedules: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "TOGGLE_TIME_SLOT_SELECTION":
      const timeSlot = action.payload;
      // Check if the time slot is busy
      const isBusy = state.therapistSchedules.some(
        (schedule) =>
          schedule.startTime === timeSlot.startTime &&
          schedule.endTime === timeSlot.endTime &&
          !schedule.isAvailable
      );

      // Don't allow selecting busy slots
      if (isBusy) return state;

      const isAlreadySelected = state.selectedTimeSlots.some(
        (selected) => selected.timeSlotId === timeSlot.timeSlotId
      );

      if (isAlreadySelected) {
        return {
          ...state,
          selectedTimeSlots: state.selectedTimeSlots.filter(
            (selected) => selected.timeSlotId !== timeSlot.timeSlotId
          ),
        };
      } else {
        return {
          ...state,
          selectedTimeSlots: [...state.selectedTimeSlots, timeSlot],
        };
      }
    case "RESET_SELECTED_TIME_SLOTS":
      return { ...state, selectedTimeSlots: [] };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

export default function ScheduleDialog({
  isOpen,
  onClose,
  therapist,
}: ScheduleDialogProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    allTimeSlots,
    therapistSchedules,
    selectedDate,
    isLoading,
    selectedTimeSlots,
  } = state;

  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: "SET_SELECTED_DATE", payload: null });
      scheduleForm.reset();
      fetchAllTimeSlots();
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset selected time slots when date changes
    dispatch({ type: "RESET_SELECTED_TIME_SLOTS" });
  }, [selectedDate]);

  const fetchAllTimeSlots = async () => {
    try {
      const response = await TimeSlotServices.getTimeSlots();
      dispatch({ type: "SET_ALL_TIME_SLOTS", payload: response.data });
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast({
        title: "Error",
        description: "Failed to fetch time slots",
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

  const fetchTherapistSchedules = async (date: Date) => {
    if (!therapist) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const formattedDate = formatDateForApi(date);
      const response: any =
        await SkinTherapistSchedulesServices.getSkinTherapistSchedules(
          therapist.accountId,
          1,
          10,
          formattedDate
        );

      dispatch({
        type: "SET_THERAPIST_SCHEDULES",
        payload: response.data.items,
      });
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Failed to fetch schedules",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleDateSelect = (date: Date | null) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
    if (date) {
      scheduleForm.setValue("date", date);
      if (therapist) {
        fetchTherapistSchedules(date);
      }
    }
  };

  const isTimeSlotAvailable = (timeSlot: any) => {
    return therapistSchedules.some(
      (schedule) =>
        schedule.startTime === timeSlot.startTime &&
        schedule.endTime === timeSlot.endTime &&
        schedule.isAvailable
    );
  };

  const isTimeSlotBusy = (timeSlot: any) => {
    return therapistSchedules.some(
      (schedule) =>
        schedule.startTime === timeSlot.startTime &&
        schedule.endTime === timeSlot.endTime &&
        !schedule.isAvailable
    );
  };

  const isTimeSlotSelected = (timeSlot: any) => {
    return selectedTimeSlots.some(
      (selected) => selected.timeSlotId === timeSlot.timeSlotId
    );
  };

  const toggleTimeSlotSelection = (timeSlot: any) => {
    dispatch({ type: "TOGGLE_TIME_SLOT_SELECTION", payload: timeSlot });
  };

  const getAssignableTimeSlots = () => {
    return selectedTimeSlots.filter((slot) => {
      // Slot có thể đăng ký nếu chưa được đăng ký (không có trong therapistSchedules)
      return !therapistSchedules.some(
        (schedule) =>
          schedule.startTime === slot.startTime &&
          schedule.endTime === slot.endTime
      );
    });
  };

  const getUnassignableTimeSlots = () => {
    return selectedTimeSlots.filter((slot) => {
      // Slot có thể hủy đăng ký nếu đã được đăng ký (có trong therapistSchedules và isAvailable)
      return therapistSchedules.some(
        (schedule) =>
          schedule.startTime === slot.startTime &&
          schedule.endTime === slot.endTime &&
          schedule.isAvailable
      );
    });
  };

  const handleAssign = async () => {
    if (!selectedDate || !therapist) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    const assignableSlots = getAssignableTimeSlots();

    if (assignableSlots.length === 0) {
      toast({
        title: "Error",
        description: "No time slots available for assignment",
        variant: "destructive",
      });
      return;
    }

    const workDates = [formatDateForApi(selectedDate)];
    const timeSlotIds = assignableSlots.map((slot) => slot.timeSlotId);

    try {
      const response =
        await SkinTherapistSchedulesServices.createSkinTherapistSchedule({
          skinTherapistId: therapist.accountId,
          workDates: workDates,
          timeSlotIds: timeSlotIds,
        });
      if (response.status === 200) {
        toast({
          title: "Success",
          description: `${timeSlotIds.length} time slot(s) assigned successfully`,
        });
        if (selectedDate) {
          fetchTherapistSchedules(selectedDate);
        }
        dispatch({ type: "RESET_SELECTED_TIME_SLOTS" });
      }
    } catch (error) {
      console.error("Error assigning time slot:", error);
      toast({
        title: "Error",
        description: "Failed to assign time slot",
        variant: "destructive",
      });
    }
  };

  const handleUnassign = async () => {
    if (!selectedDate || !therapist) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    const unassignableSlots = getUnassignableTimeSlots();

    if (unassignableSlots.length === 0) {
      toast({
        title: "Error",
        description: "No time slots available for unassignment",
        variant: "destructive",
      });
      return;
    }

    const workDates = [formatDateForApi(selectedDate)];
    const timeSlotIds = unassignableSlots.map((slot) => slot.timeSlotId);

    try {
      const response =
        await SkinTherapistSchedulesServices.cancelSkinTherapistSchedule({
          skinTherapistId: therapist.accountId,
          workDates: workDates,
          timeSlotIds: timeSlotIds,
        });
      if (response.status === 200) {
        toast({
          title: "Success",
          description: `${timeSlotIds.length} time slot(s) unassigned successfully`,
        });
        if (selectedDate) {
          fetchTherapistSchedules(selectedDate);
        }
        dispatch({ type: "RESET_SELECTED_TIME_SLOTS" });
      }
    } catch (error) {
      console.error("Error unassigning time slot:", error);
      toast({
        title: "Error",
        description: "Failed to unassign time slot",
        variant: "destructive",
      });
    }
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
                allTimeSlots?.length > 0 ? (
                  allTimeSlots?.map((timeSlot: any) => (
                    <div
                      key={timeSlot?.timeSlotId}
                      onClick={() => toggleTimeSlotSelection(timeSlot)}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors",
                        isTimeSlotBusy(timeSlot)
                          ? "bg-red-100 text-red-700 cursor-not-allowed"
                          : isTimeSlotAvailable(timeSlot)
                          ? isTimeSlotSelected(timeSlot)
                            ? "bg-green-500 text-white"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                          : isTimeSlotSelected(timeSlot)
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
                    No time slots found
                  </div>
                )
              ) : (
                <div className="text-sm text-muted-foreground">
                  Please select a date to view schedules
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-100" />
                <span>Registered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Selected (Registered)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-100" />
                <span>Not Registered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Selected (Not Registered)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-100" />
                <span>Busy</span>
              </div>
            </div>
            {selectedTimeSlots.length > 0 && (
              <div className="mt-2 text-sm">
                <span className="font-medium">{selectedTimeSlots.length}</span>{" "}
                time slot(s) selected
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleAssign}
            disabled={getAssignableTimeSlots().length === 0 || !selectedDate}
          >
            Assign{" "}
            {getAssignableTimeSlots().length > 0 &&
              `(${getAssignableTimeSlots().length})`}
          </Button>
          <Button
            onClick={handleUnassign}
            disabled={getUnassignableTimeSlots().length === 0 || !selectedDate}
          >
            Unassign{" "}
            {getUnassignableTimeSlots().length > 0 &&
              `(${getUnassignableTimeSlots().length})`}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
