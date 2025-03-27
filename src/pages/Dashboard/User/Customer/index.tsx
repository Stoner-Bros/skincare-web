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
import CustomerService from "@/services/customer.services";
import { Customer, PaginatedCustomerResponse } from "@/types/customer.types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
    fetchCustomers(currentPage);
  }, [currentPage]);

  const fetchCustomers = async (page: number) => {
    try {
      setLoading(true);
      const response: PaginatedCustomerResponse =
        await CustomerService.getCustomers(page, pageSize);
      setCustomers(response.data.items);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách khách hàng",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setCustomerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await CustomerService.deleteCustomer(customerToDelete);
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
      fetchCustomers(currentPage);
      toast({
        title: "Thành công",
        description: "Đã xóa khách hàng thành công",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa khách hàng",
        variant: "destructive",
      });
    }
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
            Quản Lý Khách Hàng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý tài khoản khách hàng và thông tin của họ.
          </p>
        </div>
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
                <TableHead className="w-[300px]">Khách Hàng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Điện Thoại</TableHead>
                <TableHead>Lần Ghé Gần Nhất</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32">
                    Không tìm thấy khách hàng nào.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.accountId}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={customer.account.accountInfo.avatar}
                        />
                        <AvatarFallback>
                          {customer.account.accountInfo.fullName.substring(
                            0,
                            2
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {customer.account.accountInfo.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {customer.account.accountInfo.address}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{customer.account.email}</TableCell>
                    <TableCell>{customer.account.accountInfo.phone}</TableCell>
                    <TableCell>
                      {format(new Date(customer.lastVisit), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.account.isDeleted ? "destructive" : "success"
                        }
                      >
                        {customer.account.isDeleted
                          ? "Không hoạt động"
                          : "Đang hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(customer.accountId)}
                      >
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa Khách Hàng</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Bạn có chắc chắn muốn xóa khách hàng này? Hành động này không thể
              hoàn tác.
            </p>
          </div>
          <DialogFooter>
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
