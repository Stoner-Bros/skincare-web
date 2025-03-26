import skinTestAnswerService, {
  SkinTestAnswer,
} from "@/services/skin-test-answer";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await skinTestAnswerService.getSkinTestAnswers();
      console.log("API Response:", response);

      if (response && Array.isArray(response)) {
        const sortedResults = [...response].sort(
          (a, b) => b.answerId - a.answerId
        );
        setResults(sortedResults);
        console.log("Processed Results:", sortedResults);
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

  useEffect(() => {
    console.log("Current Results State:", results);
  }, [results]);

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
          <Button onClick={fetchResults}>Làm mới</Button>
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
        <Button onClick={fetchResults}>Làm mới</Button>
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
              results.map((result) => (
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

      <ViewResultDetail
        answerId={selectedAnswerId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}
