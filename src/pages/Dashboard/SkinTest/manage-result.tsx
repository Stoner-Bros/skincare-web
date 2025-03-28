import skinTestAnswerService, {
  SkinTestAnswer,
} from "@/services/skin-test-answer";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";
import ViewResultDetail from "./view-result-detail";

export default function ManageResult() {
  const [loading, setLoading] = useState<boolean>(true);
  const [results, setResults] = useState<SkinTestAnswer[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, [currentPage, pageSize]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await skinTestAnswerService.getSkinTestAnswers();

      if (response && Array.isArray(response)) {
        // Sắp xếp theo answerId mới nhất lên đầu
        const sortedResults = [...response].sort(
          (a, b) => b.answerId - a.answerId
        );

        setResults(sortedResults);

        // Tính toán tổng số trang
        setTotalPages(Math.ceil(sortedResults.length / pageSize) || 1);
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi dữ liệu",
          description: "Dữ liệu không đúng định dạng",
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu kết quả:", error);
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description: "Không thể tải dữ liệu kết quả kiểm tra da",
      });
    } finally {
      setLoading(false);
    }
  };

  // Lấy dữ liệu cho trang hiện tại
  const getPaginatedResults = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return results.slice(startIndex, endIndex);
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

  useEffect(() => {}, [results]);

  const viewDetail = (id: number) => {
    setSelectedAnswerId(id);
    setIsDetailModalOpen(true);
  };

  const getFullName = (result: SkinTestAnswer): string => {
    if (result.customer) {
      return result.customer.fullName || "N/A";
    } else if (result.guest) {
      return result.guest.fullName || "N/A";
    } else if (result.email) {
      return result.email;
    }
    return "Khách vãng lai";
  };

  const getPhone = (result: SkinTestAnswer): string => {
    if (result.customer) {
      return result.customer.phone || "N/A";
    } else if (result.guest) {
      return result.guest.phone || "N/A";
    }
    return "N/A";
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            Quản lý kết quả bài kiểm tra da
          </h1>
          <Button variant="outline" onClick={fetchResults}>
            Làm mới
          </Button>
        </div>

        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">
          Quản lý kết quả bài kiểm tra da
        </h1>
        <Button variant="outline" onClick={fetchResults}>
          Làm mới
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Tên bài kiểm tra</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Câu trả lời</TableHead>
              <TableHead className="w-24">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && results && results.length > 0 ? (
              getPaginatedResults().map((result) => (
                <TableRow key={result.answerId}>
                  <TableCell>{result.answerId}</TableCell>
                  <TableCell>{result.skinTest?.testName || "N/A"}</TableCell>
                  <TableCell>{getFullName(result)}</TableCell>
                  <TableCell>{getPhone(result)}</TableCell>
                  <TableCell>
                    {Array.isArray(result.answers) ? result.answers.length : 0}{" "}
                    câu trả lời
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => viewDetail(result.answerId)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Xem chi tiết</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  {loading
                    ? "Đang tải dữ liệu..."
                    : "Không có dữ liệu kết quả kiểm tra"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>
            )}

            {generatePaginationItems()}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      <ViewResultDetail
        answerId={selectedAnswerId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
