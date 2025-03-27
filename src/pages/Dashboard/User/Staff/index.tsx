import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import StaffService from "@/services/staff.services";
import { PaginatedStaffResponse, Staff } from "@/types/staff.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const createFormSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
});

const updateFormSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  avatar: z.string().optional(),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 ký tự")
    .optional(),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự").optional(),
  dob: z.string().optional(),
  otherInfo: z.string().optional(),
  startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
  isAvailable: z.boolean().default(true),
});

type CreateFormValues = z.infer<typeof createFormSchema>;
type UpdateFormValues = z.infer<typeof updateFormSchema>;

export default function Staffs() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const isMounted = useRef(false);

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      startDate: "",
    },
  });

  const updateForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      fullName: "",
      avatar: "",
      phone: "",
      address: "",
      dob: "",
      otherInfo: "",
      startDate: "",
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
    fetchStaffs(currentPage);
  }, [currentPage]);

  const fetchStaffs = async (page: number) => {
    try {
      setLoading(true);
      const response: PaginatedStaffResponse = await StaffService.getStaffs(
        page,
        pageSize
      );
      setStaffs(response.data.items);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching staffs:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách nhân viên",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCreateStaff = async (values: CreateFormValues) => {
    try {
      await StaffService.createStaff(values);
      setIsCreateDialogOpen(false);
      createForm.reset();
      fetchStaffs(currentPage);
      toast({
        title: "Thành công",
        description: "Tạo nhân viên thành công",
      });
    } catch (error) {
      console.error("Error creating staff:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo nhân viên",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStaff = async (values: UpdateFormValues) => {
    if (!selectedStaff) return;
    try {
      await StaffService.updateStaff(selectedStaff.accountId, values);
      setIsUpdateDialogOpen(false);
      setSelectedStaff(null);
      fetchStaffs(currentPage);
      toast({
        title: "Thành công",
        description: "Cập nhật nhân viên thành công",
      });
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật nhân viên",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    setStaffToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;
    try {
      await StaffService.deleteStaff(staffToDelete);
      setIsDeleteDialogOpen(false);
      setStaffToDelete(null);
      fetchStaffs(currentPage);
      toast({
        title: "Thành công",
        description: "Xóa nhân viên thành công",
      });
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa nhân viên",
        variant: "destructive",
      });
    }
  };

  const handleUpdateClick = (staff: Staff) => {
    setSelectedStaff(staff);
    updateForm.reset({
      fullName: staff.account.accountInfo.fullName,
      avatar: staff.account.accountInfo.avatar,
      phone: staff.account.accountInfo.phone,
      address: staff.account.accountInfo.address,
      dob: staff.account.accountInfo.dob,
      otherInfo: staff.account.accountInfo.otherInfo,
      startDate: staff.startDate,
      isAvailable: staff.isAvailable,
    });
    setIsUpdateDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quản Lý Nhân Viên
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý nhân viên, vai trò và quyền hạn của họ.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Thêm Nhân Viên Mới
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
                <TableHead className="w-[300px]">Nhân Viên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Điện Thoại</TableHead>
                <TableHead>Ngày Bắt Đầu</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    Không tìm thấy nhân viên nào
                  </TableCell>
                </TableRow>
              ) : (
                staffs.map((staff) => (
                  <TableRow key={staff.accountId}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={staff.account.accountInfo.avatar} />
                        <AvatarFallback className="bg-primary/10">
                          {staff.account.accountInfo.fullName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {staff.account.accountInfo.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {staff.account.accountInfo.address}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{staff.account.email}</TableCell>
                    <TableCell>{staff.account.accountInfo.phone}</TableCell>
                    <TableCell>
                      {format(new Date(staff.startDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Badge
                          variant={staff.isAvailable ? "success" : "secondary"}
                          className="capitalize"
                        >
                          {staff.isAvailable
                            ? "Đang hoạt động"
                            : "Không hoạt động"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateClick(staff)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(staff.accountId)}
                        >
                          Xóa
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
      {!loading && staffs.length > 0 && (
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

      {/* Create Staff Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Nhân Viên Mới</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(handleCreateStaff)}
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
                        <Input placeholder="Nhập email" {...field} />
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
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Nhập mật khẩu"
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
                      <FormLabel>Họ tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Tạo Nhân Viên</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Update Staff Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cập Nhật Thông Tin Nhân Viên</DialogTitle>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdateStaff)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={updateForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={updateForm.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL hình đại diện</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập URL hình đại diện"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={updateForm.control}
                  name="otherInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thông tin khác</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập thông tin khác" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={updateForm.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Khả dụng để làm việc</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">Cập Nhật Nhân Viên</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xóa Nhân Viên</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="text-muted-foreground">
              Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể
              hoàn tác.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
