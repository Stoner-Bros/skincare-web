import CreateTherapistDialog from "@/components/skin-therapist/create-therapist-dialog";
import DeleteTherapistDialog from "@/components/skin-therapist/delete-therapist-dialog";
import EditTherapistDialog from "@/components/skin-therapist/edit-therapist-dialog";
import ScheduleDialog from "@/components/skin-therapist/schedule-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import SkinTherapistService from "@/services/skin-therapist.services";
import { Loader2 } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";

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
  | { type: "SET_SELECTED_THERAPIST"; payload: any | null };

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
  selectedTherapist: any | null;
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
  selectedTherapist: null,
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
    case "SET_SELECTED_THERAPIST":
      return { ...state, selectedTherapist: action.payload };
    default:
      return state;
  }
}

export default function SkinTherapists() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMounted = useRef(false);

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

  const handleDeleteClick = (id: number) => {
    dispatch({ type: "SET_THERAPIST_TO_DELETE", payload: id });
    dispatch({ type: "SET_DELETE_DIALOG", payload: true });
  };

  const handleEditClick = (therapist: any) => {
    dispatch({ type: "SET_THERAPIST_TO_EDIT", payload: therapist });
    dispatch({ type: "SET_EDIT_DIALOG", payload: true });
  };

  const handleScheduleClick = (therapist: any) => {
    dispatch({ type: "SET_SELECTED_THERAPIST", payload: therapist });
    dispatch({ type: "SET_SCHEDULE_DIALOG", payload: true });
  };

  const handlePageChange = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(therapist);
                            }}
                            disabled={therapist.account.isDeleted}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(therapist.accountId);
                            }}
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
      <CreateTherapistDialog
        isOpen={state.isCreateDialogOpen}
        onClose={() => dispatch({ type: "SET_CREATE_DIALOG", payload: false })}
        onSuccess={() => fetchTherapists(state.currentPage)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteTherapistDialog
        isOpen={state.isDeleteDialogOpen}
        onClose={() => dispatch({ type: "SET_DELETE_DIALOG", payload: false })}
        onSuccess={() => fetchTherapists(state.currentPage)}
        therapistId={state.therapistToDelete}
      />

      {/* Edit Therapist Dialog */}
      <EditTherapistDialog
        isOpen={state.isEditDialogOpen}
        onClose={() => dispatch({ type: "SET_EDIT_DIALOG", payload: false })}
        onSuccess={() => fetchTherapists(state.currentPage)}
        therapist={state.therapistToEdit}
      />

      {/* Schedule Dialog */}
      <ScheduleDialog
        isOpen={state.isScheduleDialogOpen}
        onClose={() =>
          dispatch({ type: "SET_SCHEDULE_DIALOG", payload: false })
        }
        therapist={state.selectedTherapist}
      />
    </>
  );
}
