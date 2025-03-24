import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import SkinTherapistService from "@/services/skin-therapist.services";
import { SkinTherapist } from "@/types/skin-therapist.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
});

type CreateFormValues = z.infer<typeof createFormSchema>;

export default function SkinTherapists() {
  const [therapists, setTherapists] = useState<SkinTherapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [therapistToDelete, setTherapistToDelete] = useState<number | null>(
    null
  );

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

  useEffect(() => {
    fetchTherapists(currentPage);
  }, [currentPage]);

  const fetchTherapists = async (page: number) => {
    try {
      setLoading(true);
      const response: any = await SkinTherapistService.getSkinTherapists(
        page,
        pageSize
      );
      setTherapists(response.data.items);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching skin therapists:", error);
      toast({
        title: "Error",
        description: "Failed to fetch skin therapists",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCreateTherapist = async (values: CreateFormValues) => {
    try {
      await SkinTherapistService.createSkinTherapist(values);
      setIsCreateDialogOpen(false);
      createForm.reset();
      fetchTherapists(currentPage);
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
    setTherapistToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!therapistToDelete) return;
    try {
      await SkinTherapistService.deleteSkinTherapist(therapistToDelete);
      setIsDeleteDialogOpen(false);
      setTherapistToDelete(null);
      fetchTherapists(currentPage);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container px-4 py-10 space-y-8">
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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Add New Therapist
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[300px]">Therapist</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {therapists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-32">
                    No skin therapists found
                  </TableCell>
                </TableRow>
              ) : (
                therapists.map((therapist) => (
                  <TableRow key={therapist.accountId}>
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
                    <TableCell>{therapist.account.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {therapist.specialization}
                      </Badge>
                    </TableCell>
                    <TableCell>{therapist.experience}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {therapist.rating.toFixed(1)} ★
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
                        <Badge
                          variant={
                            therapist.isAvailable ? "default" : "secondary"
                          }
                          className="capitalize"
                        >
                          {therapist.isAvailable ? "Available" : "Busy"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(therapist.accountId)}
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
      {!loading && therapists.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 && (
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                )}
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                {currentPage < totalPages && (
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Create Therapist Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Skin Therapist</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateTherapist)}
              className="space-y-6"
            >
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
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Therapist</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
