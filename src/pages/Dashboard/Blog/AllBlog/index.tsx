import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import BlogService from "@/services/blog.services";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import MDEditor from "@uiw/react-md-editor";
import { Loader2, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Blog {
  id?: number;
  blogId?: number;
  title: string;
  author?: string;
  authorName?: string;
  createdAt: string;
  publishAt?: string;
  status?: string;
  isPublished?: boolean;
  isDeleted?: boolean;
  content?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  tags?: string;
}

export default function AllBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const pageSize = 6;
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPublishedBlogs = async () => {
    try {
      setLoading(true);

      const response = await BlogService.getPublishBlogs(currentPage, pageSize);

      // Kiểm tra và thiết lập danh sách bài viết
      const blogItems = Array.isArray(response.data.items)
        ? response.data.items
        : [];
      setBlogs(blogItems);

      // Tính toán tổng số trang
      const totalRecords = response.data.totalRecords || 0;
      const calculatedTotalPages = Math.ceil(totalRecords / pageSize);
      setTotalPages(Math.max(1, calculatedTotalPages));

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách blog đã xuất bản",
        variant: "destructive",
      });
      console.error("Error fetching published blogs:", error);
    }
  };

  useEffect(() => {
    fetchPublishedBlogs();
  }, [currentPage]);

  const confirmDelete = (id: number) => {
    setBlogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      await BlogService.deleteBlog(blogToDelete);
      setIsDeleteDialogOpen(false);
      fetchPublishedBlogs();
      toast({
        title: "Thành công",
        description: "Đã xóa blog",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa blog",
        variant: "destructive",
      });
      console.error("Error deleting blog:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDetailDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${date.getHours() >= 12 ? "PM" : "AM"} ${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleViewDetail = async (id: number) => {
    if (!id) {
      toast({
        title: "Lỗi",
        description: "ID không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    try {
      setDetailLoading(true);
      setIsDetailOpen(true);

      const response = await BlogService.getBlogById(id);

      if (response && response.data) {
        setSelectedBlog(response.data);
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      toast({
        title: "Lỗi khi tải thông tin",
        description:
          error.message ||
          "Không thể tải thông tin chi tiết. Vui lòng thử lại sau.",
        variant: "destructive",
      });

      // Tạo dữ liệu mẫu cho trường hợp lỗi
      setSelectedBlog({
        id: id,
        title: "Lỗi tải dữ liệu",
        authorName: "Unknown",
        createdAt: new Date().toISOString(),
        content: "Không thể tải nội dung bài viết. Vui lòng thử lại sau.",
        thumbnailUrl: undefined,
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationLink className="cursor-default">
                    ...
                  </PaginationLink>
                </PaginationItem>
              )}
            </>
          )}

          {pages}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink className="cursor-default">
                    ...
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl font-bold">
              Blog Đã Xuất Bản
            </CardTitle>
            <CardDescription>
              Quản lý tất cả các bài blog đã xuất bản trên hệ thống
            </CardDescription>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate("/dashboard/blog/create")}
          >
            Tạo Blog Mới
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-500">
                Không có blog nào đã xuất bản
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/blog/waiting")}
              >
                Quản lý blog chờ xuất bản
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-16">ID</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead className="w-32">Tác giả</TableHead>
                      <TableHead className="w-32">Ngày tạo</TableHead>
                      <TableHead className="w-32">Ngày xuất bản</TableHead>
                      <TableHead className="w-32 text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(blogs) &&
                      blogs.map((blog) => (
                        <TableRow
                          key={blog.blogId || blog.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {blog.blogId || blog.id}
                          </TableCell>
                          <TableCell className="max-w-md truncate font-medium">
                            {blog.title}
                          </TableCell>
                          <TableCell>
                            {blog.authorName || blog.author}
                          </TableCell>
                          <TableCell>{formatDate(blog.createdAt)}</TableCell>
                          <TableCell>
                            {blog.publishAt && formatDate(blog.publishAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleViewDetail(blog.blogId || blog.id || 0)
                                }
                                title="Xem chi tiết"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                  const id = blog.blogId || blog.id;
                                  if (id) confirmDelete(id);
                                }}
                                title="Xóa bài viết"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  {renderPagination()}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog for blog detail view */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Chi tiết bài viết</DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
          ) : selectedBlog ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <div className="rounded-md overflow-hidden border shadow-sm">
                    <img
                      src={
                        selectedBlog.thumbnailUrl
                          ? `https://skincare-api.azurewebsites.net/api/upload/${selectedBlog.thumbnailUrl}`
                          : "/api/placeholder/400/300?text=No+Image"
                      }
                      alt={selectedBlog.title || "Blog image"}
                      className="w-full h-auto object-cover max-h-[300px]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "/api/placeholder/400/300?text=Image+Error";
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">ID:</p>
                        <p className="font-medium">
                          {selectedBlog.id || selectedBlog.blogId || 1}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Ngày tạo:
                        </p>
                        <p className="font-medium">
                          {formatDetailDate(
                            selectedBlog.createdAt || new Date().toISOString()
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Tác giả:
                        </p>
                        <p className="font-medium">
                          {selectedBlog.authorName ||
                            selectedBlog.author ||
                            "Unknown"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Trạng thái:
                        </p>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Đã xuất bản
                        </Badge>
                      </div>
                      {selectedBlog.viewCount !== undefined && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Lượt xem:
                          </p>
                          <p className="font-medium">
                            {selectedBlog.viewCount}
                          </p>
                        </div>
                      )}
                      {selectedBlog.tags && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Tags:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedBlog.tags.split(",").map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Nội dung</h3>
                <div className="bg-muted/50 p-4 rounded-md shadow-sm border overflow-auto max-h-[400px]">
                  {selectedBlog.content ? (
                    <div data-color-mode="light" className="blog-content">
                      <MDEditor.Markdown source={selectedBlog.content} />
                    </div>
                  ) : (
                    <div className="text-muted-foreground italic text-center py-8">
                      Không có nội dung
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <p>Không tìm thấy thông tin bài viết</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Đóng
            </Button>
            {selectedBlog && (
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDetailOpen(false);
                  const id = selectedBlog.blogId || selectedBlog.id;
                  if (id) confirmDelete(id);
                }}
              >
                Xóa bài viết
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
