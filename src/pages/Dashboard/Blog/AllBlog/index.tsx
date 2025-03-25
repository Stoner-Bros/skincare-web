import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import BlogService from "@/services/blog.services";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MDEditor from "@uiw/react-md-editor";

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
  const pageSize = 6;
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchPublishedBlogs = async () => {
    try {
      setLoading(true);
      console.log("Đang tải trang:", currentPage, "với kích thước trang:", pageSize);
      
      const response = await BlogService.getPublishBlogs(currentPage, pageSize);
      console.log("Phản hồi API:", response);
      
      // Kiểm tra và thiết lập danh sách bài viết
      const blogItems = Array.isArray(response.data.items) ? response.data.items : [];
      setBlogs(blogItems);
      
      // Tính toán tổng số trang
      const totalRecords = response.data.totalRecords || 0;
      const calculatedTotalPages = Math.ceil(totalRecords / pageSize);
      setTotalPages(Math.max(1, calculatedTotalPages));
      
      console.log("Tổng số bài viết:", totalRecords, "- Tổng số trang:", calculatedTotalPages);
      
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
    console.log("Trang hiện tại thay đổi thành:", currentPage);
    fetchPublishedBlogs();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    try {
      await BlogService.deleteBlog(id);
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
      .padStart(2, "0")} AM ${
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

      // BlogService.getBlogById bây giờ trả về response, không phải response.data
      const response = await BlogService.getBlogById(id);

      // Kiểm tra xem response có tồn tại không
      if (response && response.data) {
        console.log("Đã nhận dữ liệu từ API:", response.data);

        // Xử lý dữ liệu trước khi hiển thị
        const blogData = response.data;

        // Kiểm tra và điều chỉnh đường dẫn hình ảnh nếu cần
        if (blogData.thumbnailUrl) {
          console.log("Thumbnail gốc:", blogData.thumbnailUrl);
          // Không cần điều chỉnh đường dẫn ở đây, sẽ xử lý trong phần render
        }

        setSelectedBlog(blogData);
        setIsDetailOpen(true);
      } else {
        throw new Error("Không nhận được dữ liệu từ API");
      }
    } catch (error: any) {
      console.error("Error fetching blog detail:", error);

      // Kiểm tra lỗi từ API
      if (error.response && error.response.status === 500) {
        console.error("Server error details:", error.response.data);
      }

      // Hiển thị thông báo lỗi chi tiết hơn
      toast({
        title: "Lỗi khi tải thông tin",
        description:
          error.message ||
          "Không thể tải thông tin chi tiết. Vui lòng thử lại sau.",
        variant: "destructive",
      });

      // Tạo dữ liệu mẫu để hiển thị nếu API lỗi
      setSelectedBlog({
        id: id,
        title: "Lỗi tải dữ liệu",
        authorName: "Unknown",
        createdAt: new Date().toISOString(),
        content: "Không thể tải nội dung bài viết. Vui lòng thử lại sau.",
        thumbnailUrl: undefined,
      });
      setIsDetailOpen(true);
    } finally {
      setDetailLoading(false);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
    
    // Đảm bảo có log để theo dõi
    console.log("Rendering pagination with total pages:", totalPages);
    
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
            onClick={() => {
              console.log("Chuyển sang trang:", i);
              setCurrentPage(i);
            }}
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
                  console.log("Chuyển đến trang trước:", currentPage - 1);
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
                <PaginationLink onClick={() => {
                  console.log("Chuyển đến trang đầu tiên");
                  setCurrentPage(1);
                }}>
                  1
                </PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationLink className="cursor-default">...</PaginationLink>
                </PaginationItem>
              )}
            </>
          )}

          {pages}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink className="cursor-default">...</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => {
                  console.log("Chuyển đến trang cuối cùng:", totalPages);
                  setCurrentPage(totalPages);
                }}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (currentPage < totalPages) {
                  console.log("Chuyển đến trang tiếp theo:", currentPage + 1);
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
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Blog Đã Xuất Bản</CardTitle>
          {/* <Button
            onClick={() => navigate("/dashboard/blog/create")}
          >
            Tạo Blog Mới
          </Button> */}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p>Không có blog nào đã xuất bản</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Ngày xuất bản</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(blogs) && blogs.map((blog) => (
                    <TableRow key={blog.blogId || blog.id}>
                      <TableCell>{blog.blogId || blog.id}</TableCell>
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.authorName || blog.author}</TableCell>
                      <TableCell>{formatDate(blog.createdAt)}</TableCell>
                      <TableCell>{blog.publishAt && formatDate(blog.publishAt)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(blog.blogId || blog.id || 0)}
                          >
                            Chi tiết
                          </Button> */}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const id = blog.blogId || blog.id;
                              if (id) handleDelete(id);
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  {renderPagination()}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Chi tiết bài viết</span>
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : selectedBlog ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <img
                    src={
                      selectedBlog.thumbnailUrl
                        ? `https://skincare-api.azurewebsites.net/api/upload/${selectedBlog.thumbnailUrl}`
                        : "https://placehold.co/300x300/gray/white?text=No+Image"
                    }
                    alt={selectedBlog.title || "Blog image"}
                    className="w-full h-auto rounded-md shadow-md object-cover max-h-[300px]"
                    onError={(e) => {
                      console.error(
                        "Lỗi tải hình ảnh. Link gốc:",
                        selectedBlog.thumbnailUrl
                      );
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://placehold.co/300x300/gray/white?text=Image+Error";
                    }}
                  />
                </div>

                <div className="col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedBlog.title}
                      </h2>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">ID:</p>
                          <p className="font-medium">
                            {selectedBlog.id || selectedBlog.blogId || 1}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Ngày tạo:</p>
                          <p className="font-medium">
                            {formatDetailDate(
                              selectedBlog.createdAt || new Date().toISOString()
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Tác giả:</p>
                          <p className="font-medium">
                            {selectedBlog.authorName ||
                              selectedBlog.author ||
                              "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Trạng thái:</p>
                          <Badge className="bg-green-100 text-green-800 border-green-300 px-2 py-1 rounded">
                            Đã xuất bản
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Nội dung</h3>
                <div className="bg-gray-900 text-white p-4 rounded-md">
                  {selectedBlog.content ? (
                    <div data-color-mode="dark" className="blog-content">
                      <MDEditor.Markdown source={selectedBlog.content} />
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <p>Không có nội dung</p>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
