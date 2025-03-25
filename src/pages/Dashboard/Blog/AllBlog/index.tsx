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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/dashboard/blog/detail/${blog.blogId || blog.id}`)}
                          >
                            Chi tiết
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/dashboard/blog/edit/${blog.blogId || blog.id}`)}
                          >
                            Sửa
                          </Button>
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
    </div>
  );
}
