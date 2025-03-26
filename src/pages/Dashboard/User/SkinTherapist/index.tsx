import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import skinTherapistSchedulesServices from "@/services/skin-therapist-schedules.services";
import SkinTherapistService from "@/services/skin-therapist.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const createFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  specialization: z
    .string()
    .min(2, "Specialization must be at least 2 characters"),
  experience: z.string().min(2, "Experience must be at least 2 characters"),
  introduction: z
    .string()
    .min(10, "Introduction must be at least 10 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  avatar: z.string().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  dob: z.string(),
  otherInfo: z.string().optional(),
  isAvailable: z.boolean(),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

// Add schedule form schema
const scheduleFormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

// Define action types
type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_THERAPISTS"; payload: any[] }
  | { type: "SET_TOTAL_PAGES"; payload: number }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_DELETE_DIALOG"; payload: boolean }
  | { type: "SET_CREATE_DIALOG"; payload: boolean }
  | { type: "SET_EDIT_DIALOG"; payload: boolean }
  | { type: "SET_SCHEDULE_DIALOG"; payload: boolean }
  | { type: "SET_THERAPIST_TO_DELETE"; payload: number | null }
  | { type: "SET_THERAPIST_TO_EDIT"; payload: any | null }
  | { type: "SET_SELECTED_DATE"; payload: Date | null }
  | { type: "SET_SCHEDULE_DATA"; payload: any[] };

// Define state type
interface State {
  therapists: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  isDeleteDialogOpen: boolean;
  isCreateDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isScheduleDialogOpen: boolean;
  therapistToDelete: number | null;
  therapistToEdit: any | null;
  selectedDate: Date | null;
  scheduleData: any[];
}

// Initial state
const initialState: State = {
  therapists: [],
  loading: true,
  currentPage: 1,
  totalPages: 0,
  pageSize: 10,
  isDeleteDialogOpen: false,
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isScheduleDialogOpen: false,
  therapistToDelete: null,
  therapistToEdit: null,
  selectedDate: null,
  scheduleData: [],
};

// Reducer function
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_THERAPISTS":
      return { ...state, therapists: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_DELETE_DIALOG":
      return { ...state, isDeleteDialogOpen: action.payload };
    case "SET_CREATE_DIALOG":
      return { ...state, isCreateDialogOpen: action.payload };
    case "SET_EDIT_DIALOG":
      return { ...state, isEditDialogOpen: action.payload };
    case "SET_SCHEDULE_DIALOG":
      return { ...state, isScheduleDialogOpen: action.payload };
    case "SET_THERAPIST_TO_DELETE":
      return { ...state, therapistToDelete: action.payload };
    case "SET_THERAPIST_TO_EDIT":
      return { ...state, therapistToEdit: action.payload };
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_SCHEDULE_DATA":
      return { ...state, scheduleData: action.payload };
    default:
      return state;
  }
}

export default function SkinTherapists() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMounted = useRef(false);

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      specialization: "",
      experience: "",
      introduction: "",
      bio: "",
    },
  });

  const editForm = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      specialization: "",
      experience: "",
      introduction: "",
      bio: "",
    },
  });

  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      fetchTherapists(state.currentPage);
    }
  }, [state.currentPage]);

  const fetchTherapists = async (page: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response: any = await SkinTherapistService.getSkinTherapists(
        page,
        state.pageSize,
        true
      );
      dispatch({ type: "SET_THERAPISTS", payload: response.data.items });
      dispatch({ type: "SET_TOTAL_PAGES", payload: response.data.totalPages });
      dispatch({ type: "SET_LOADING", payload: false });
    } catch (error) {
      console.error("Error fetching skin therapists:", error);
      toast({
        title: "Error",
        description: "Failed to fetch skin therapists",
        variant: "destructive",
      });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleCreateTherapist = async (values: CreateFormValues) => {
    try {
      await SkinTherapistService.createSkinTherapist(values);
      dispatch({ type: "SET_CREATE_DIALOG", payload: false });
      createForm.reset();
      fetchTherapists(state.currentPage);
      toast({
        title: "Success",
        description: "Skin therapist created successfully",
      });
    } catch (error) {
      console.error("Error creating skin therapist:", error);
      toast({
        title: "Error",
        description: "Failed to create skin therapist",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    dispatch({ type: "SET_THERAPIST_TO_DELETE", payload: id });
    dispatch({ type: "SET_DELETE_DIALOG", payload: true });
  };

  const handleConfirmDelete = async () => {
    if (!state.therapistToDelete) return;
    try {
      await SkinTherapistService.deleteSkinTherapist(state.therapistToDelete);
      dispatch({ type: "SET_DELETE_DIALOG", payload: false });
      dispatch({ type: "SET_THERAPIST_TO_DELETE", payload: null });
      fetchTherapists(state.currentPage);
      toast({
        title: "Success",
        description: "Skin therapist deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting skin therapist:", error);
      toast({
        title: "Error",
        description: "Failed to delete skin therapist",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (therapist: any) => {
    dispatch({ type: "SET_THERAPIST_TO_EDIT", payload: therapist });
    editForm.reset({
      email: therapist.account.email,
      fullName: therapist.account.accountInfo.fullName,
      specialization: therapist.specialization,
      experience: therapist.experience,
      introduction: therapist.introduction,
      bio: therapist.bio,
      avatar: therapist.account.accountInfo.avatar,
      phone: therapist.account.accountInfo.phone,
      address: therapist.account.accountInfo.address,
      dob: therapist.account.accountInfo.dob,
      otherInfo: therapist.account.accountInfo.otherInfo,
      isAvailable: therapist.isAvailable,
    });
    dispatch({ type: "SET_EDIT_DIALOG", payload: true });
  };

  const handleEditTherapist = async (values: CreateFormValues) => {
    if (!state.therapistToEdit) return;
    try {
      await SkinTherapistService.updateSkinTherapist(
        state.therapistToEdit.accountId,
        {
          ...values,
          accountInfo: {
            ...state.therapistToEdit.account.accountInfo,
            fullName: values.fullName,
            phone: values.phone,
            address: values.address,
            dob: values.dob,
            otherInfo: values.otherInfo,
            avatar: values.avatar,
          },
        }
      );
      dispatch({ type: "SET_EDIT_DIALOG", payload: false });
      dispatch({ type: "SET_THERAPIST_TO_EDIT", payload: null });
      fetchTherapists(state.currentPage);
      toast({
        title: "Success",
        description: "Skin therapist updated successfully",
      });
    } catch (error) {
      console.error("Error updating skin therapist:", error);
      toast({
        title: "Error",
        description: "Failed to update skin therapist",
        variant: "destructive",
      });
    }
  };

  const handleScheduleClick = async (therapist: any) => {
    dispatch({ type: "SET_SCHEDULE_DIALOG", payload: true });
    try {
      const response: any =
        await skinTherapistSchedulesServices.getSkinTherapistSchedules(
          therapist.accountId
        );
      dispatch({ type: "SET_SCHEDULE_DATA", payload: response.data.items });
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast({
        title: "Error",
        description: "Failed to fetch schedules",
        variant: "destructive",
      });
    }
  };

  const handleDateSelect = (date: Date | null) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
    if (date) {
      scheduleForm.setValue("date", date);
    }
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  // Add function to filter schedules by date
  const getSchedulesByDate = (date: Date) => {
    return state.scheduleData.filter((schedule: any) => {
      const scheduleDate = new Date(schedule.workDate);
      return (
        scheduleDate.getDate() === date.getDate() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Skin Therapist Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage skin therapists, their specializations and experience.
            </p>
          </div>
          <Button
            onClick={() =>
              dispatch({ type: "SET_CREATE_DIALOG", payload: true })
            }
          >
            Add New Therapist
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border shadow-sm">
          {state.loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Therapist</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.therapists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32">
                      No skin therapists found
                    </TableCell>
                  </TableRow>
                ) : (
                  state.therapists.map((therapist) => (
                    <TableRow
                      onClick={() => handleScheduleClick(therapist)}
                      key={therapist.accountId}
                      className={
                        therapist.account.isDeleted
                          ? "bg-muted/50"
                          : "cursor-pointer hover:bg-muted/50"
                      }
                    >
                      <TableCell className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={therapist.account.accountInfo.avatar}
                          />
                          <AvatarFallback className="bg-primary/10">
                            {therapist.account.accountInfo.fullName.substring(
                              0,
                              2
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {therapist.account.accountInfo.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {therapist.account.accountInfo.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{therapist.account.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {therapist.account.accountInfo.address}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="capitalize">
                            {therapist.specialization}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            therapist.account.isDeleted
                              ? "destructive"
                              : "success"
                          }
                          className="capitalize"
                        >
                          {therapist.account.isDeleted ? "Inactive" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(therapist)}
                            disabled={therapist.account.isDeleted}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteClick(therapist.accountId)
                            }
                            disabled={therapist.account.isDeleted}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {!state.loading && state.therapists.length > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {state.currentPage > 1 && (
                    <PaginationPrevious
                      onClick={() => handlePageChange(state.currentPage - 1)}
                    />
                  )}
                </PaginationItem>
                {[...Array(state.totalPages)].map((_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={state.currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  {state.currentPage < state.totalPages && (
                    <PaginationNext
                      onClick={() => handlePageChange(state.currentPage + 1)}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Create Therapist Dialog */}
      <Dialog
        open={state.isCreateDialogOpen}
        onOpenChange={(open) =>
          dispatch({ type: "SET_CREATE_DIALOG", payload: open })
        }
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Skin Therapist</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <div className="space-y-6 max-h-[70vh] px-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter specialization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={createForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter experience" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="introduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Introduction</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter introduction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={createForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  dispatch({ type: "SET_CREATE_DIALOG", payload: false })
                }
              >
                Cancel
              </Button>
              <Button onClick={createForm.handleSubmit(handleCreateTherapist)}>
                Create Therapist
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={state.isDeleteDialogOpen}
        onOpenChange={(open) =>
          dispatch({ type: "SET_DELETE_DIALOG", payload: open })
        }
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Skin Therapist</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-muted-foreground">
              Are you sure you want to delete this skin therapist? This action
              cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() =>
                dispatch({ type: "SET_DELETE_DIALOG", payload: false })
              }
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Therapist Dialog */}
      <Dialog
        open={state.isEditDialogOpen}
        onOpenChange={(open) =>
          dispatch({ type: "SET_EDIT_DIALOG", payload: open })
        }
      >
        <DialogContent className="max-w-screen-lg">
          <DialogHeader>
            <DialogTitle>Edit Skin Therapist</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Professional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Professional Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter specialization"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={editForm.control}
                  name="introduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Introduction</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter introduction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Information</h3>
                <FormField
                  control={editForm.control}
                  name="otherInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Information</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter other information"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Availability
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() =>
                  dispatch({ type: "SET_EDIT_DIALOG", payload: false })
                }
              >
                Cancel
              </Button>
              <Button onClick={editForm.handleSubmit(handleEditTherapist)}>
                Update Therapist
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog
        open={state.isScheduleDialogOpen}
        onOpenChange={(open) =>
          dispatch({ type: "SET_SCHEDULE_DIALOG", payload: open })
        }
      >
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
                {state.selectedDate ? (
                  getSchedulesByDate(state.selectedDate).length > 0 ? (
                    getSchedulesByDate(state.selectedDate).map(
                      (schedule: any) => (
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
                      )
                    )
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
            <Button
              variant="outline"
              onClick={() =>
                dispatch({ type: "SET_SCHEDULE_DIALOG", payload: false })
              }
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
