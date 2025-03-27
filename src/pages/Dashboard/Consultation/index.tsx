import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import consultationService from "@/services/consultation.services";
import { useEffect, useState } from "react";

interface Customer {
  accountId?: string;
  fullName?: string;
}

interface Guest {
  guestId?: string;
  fullName?: string;
}

interface ConsultingForm {
  id: number;
  consultingFormId: number;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer | null;
  guest?: Guest | null;
}

export default function Consultation() {
  const [consultingForms, setConsultingForms] = useState<ConsultingForm[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedForm, setSelectedForm] = useState<ConsultingForm | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [formStatus, setFormStatus] = useState("");
  

  useEffect(() => {
    fetchConsultingForms();
  }, [currentPage, pageSize, statusFilter]);

  const fetchConsultingForms = async () => {
    try {
      setLoading(true);
      const response = await consultationService.getConsultingForms(currentPage, pageSize);
      const sortedForms = response.data.items || [];
      
      // Sắp xếp theo trạng thái
      sortedForms.sort((a: ConsultingForm, b: ConsultingForm) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1; // a lên trước
        if (a.status !== 'pending' && b.status === 'pending') return 1; // b lên trước
        if (a.status === 'completed' && b.status !== 'completed') return 1; // a xuống sau
        if (a.status !== 'completed' && b.status === 'completed') return -1; // b lên trước
        if (a.status === 'cancelled' && b.status !== 'cancelled') return 1; // a xuống sau
        if (a.status !== 'cancelled' && b.status === 'cancelled') return -1; // b lên trước
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Nếu cùng trạng thái, sắp xếp theo ngày tạo
      });

      setConsultingForms(sortedForms);
      setTotalPages(Math.ceil(response.data.totalRecords / pageSize) || 1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách form tư vấn:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách form tư vấn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (form: ConsultingForm) => {
    if (form.customer && form.customer.fullName) {
      return form.customer.fullName;
    } else if (form.guest && form.guest.fullName) {
      return form.guest.fullName;
    }
    return "Không có tên";
  };

  const getUserId = (form: ConsultingForm) => {
    if (form.customer && form.customer.accountId) {
      return `Khách hàng đã tạo tài khoản`;
    } else if (form.guest && form.guest.guestId) {
      return `Khách vãng lai`;
    }
    return "Không có ID";
  };

  const handleViewForm = (form: ConsultingForm) => {
    setSelectedForm(form);
    setIsViewDialogOpen(true);
  };

  const handleEditForm = (form: ConsultingForm) => {
    setSelectedForm(form);
    setFormStatus(form.status);
    setIsEditDialogOpen(true);
  };

  const handleDeleteForm = (form: ConsultingForm) => {
    setSelectedForm(form);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedForm) return;

    try {
      setLoading(true);
      await consultationService.updateConsultingForm(selectedForm.consultingFormId, { 
        status: formStatus 
      });
      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái thành công",
        variant: "default",
      });
      setIsEditDialogOpen(false);
      fetchConsultingForms();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedForm) return;

    try {
      setLoading(true);
      await consultationService.deleteConsultingForm(selectedForm.consultingFormId);
      toast({
        title: "Thành công",
        description: "Xóa form tư vấn thành công",
        variant: "default",
      });
      setIsDeleteDialogOpen(false);
      fetchConsultingForms();
    } catch (error) {
      console.error("Lỗi khi xóa form tư vấn:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa form tư vấn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge className="bg-yellow-500">Đang chờ</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Tạo mảng trang để hiển thị
  const generatePaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    // Đảm bảo hiển thị đúng số lượng trang
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quản lý Form Tư vấn</h1>
        <div className="flex gap-2">
          <select
            className="p-2 border rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="processing">Đang xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <Button onClick={fetchConsultingForms}>Làm mới</Button>
        </div>
      </div>

      {loading && <div className="text-center">Đang tải...</div>}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultingForms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              consultingForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>{form.consultingFormId}</TableCell>  
                  <TableCell>{getUserId(form)}</TableCell>
                  <TableCell>{getFullName(form)}</TableCell>
                  <TableCell>{renderStatusBadge(form.status)}</TableCell>
                  <TableCell>{formatDate(form.createdAt)}</TableCell>
                  <TableCell>{formatDate(form.updatedAt)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewForm(form)}>
                      Xem
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditForm(form)}>
                      Sửa
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteForm(form)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
              </PaginationItem>
            )}
            
            {generatePaginationItems()}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      {/* Dialog xem chi tiết */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết Form Tư vấn</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID Form</Label>
                  <div className="font-medium">{selectedForm.consultingFormId}</div>
                </div>
                <div>
                  <Label>Trạng thái</Label>
                  <div>{renderStatusBadge(selectedForm.status)}</div>
                </div>
                <div>
                  <Label>ID người dùng</Label>
                  <div className="font-medium">{getUserId(selectedForm)}</div>
                </div>
                <div>
                  <Label>Họ tên</Label>
                  <div className="font-medium">{getFullName(selectedForm)}</div>
                </div>
                <div>
                  <Label>Ngày tạo</Label>
                  <div className="font-medium">{formatDate(selectedForm.createdAt)}</div>
                </div>
                <div>
                  <Label>Ngày cập nhật</Label>
                  <div className="font-medium">{formatDate(selectedForm.updatedAt)}</div>
                </div>
              </div>
              <div>
                <Label>Nội dung</Label>
                <div className="p-3 border rounded-md mt-1 bg-gray-50 min-h-[100px]">
                  {selectedForm.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa trạng thái */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái</DialogTitle>
          </DialogHeader>
          {selectedForm && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <select
                  id="status"
                  className="w-full p-2 mt-1 border rounded-md"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                >
                  <option value="pending">Đang chờ</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleStatusChange} disabled={loading}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa form tư vấn này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 text-white">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
