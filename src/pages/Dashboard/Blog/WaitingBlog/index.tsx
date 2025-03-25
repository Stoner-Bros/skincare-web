import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import AddBlog from "@/pages/Blogs/add-blog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  status?: string;
  isPublished?: boolean;
  isDeleted?: boolean;
  content?: string;
  thumbnailUrl?: string;
  viewCount?: number;
}

export default function WaitingBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isAddBlogOpen, setIsAddBlogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const pageSize = 5;
  const navigate = useNavigate();
  const { toast } = useToast();

  const isPublishedBlog = (blog: Blog): boolean => {
    return Boolean(blog.isPublished) || blog.status === "Published";
  };

  const fetchWaitingBlogs = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy tất cả bài viết - tăng pageSize để lấy nhiều hơn
      const response = await BlogService.getBlogs(1, 100); // Lấy số lượng lớn các bài viết để xử lý phân trang ở client
      console.log("API response:", response);
      
      // Kiểm tra nếu không có dữ liệu
      if (!response.data || !response.data.items) {
        setBlogs([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }
      
      // Lọc các blog chưa được xuất bản
      const allBlogs = response.data.items;
      const waitingBlogs = Array.isArray(allBlogs) 
        ? allBlogs.filter((blog: Blog) => !isPublishedBlog(blog))
        : [];
      
      console.log("Tổng số bài viết:", allBlogs.length);
      console.log("Số bài viết đang chờ:", waitingBlogs.length);
      
      // Lưu toàn bộ danh sách bài viết đang chờ
      setBlogs(waitingBlogs);
      
      // Tính toán lại tổng số trang dựa trên số bài viết chờ duyệt
      const totalWaitingBlogs = waitingBlogs.length;
      const calculatedTotalPages = Math.ceil(totalWaitingBlogs / pageSize);
      setTotalPages(Math.max(1, calculatedTotalPages));
      
      console.log("Tổng số trang:", calculatedTotalPages);
      console.log("Trang hiện tại:", currentPage);
      
      // Kiểm tra xem trang hiện tại có hợp lệ không
      if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
        setCurrentPage(1);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách blog chờ duyệt",
        variant: "destructive",
      });
      console.error("Error fetching waiting blogs:", error);
    }
  };

  useEffect(() => {
    console.log("Đang tải trang:", currentPage);
    fetchWaitingBlogs();
  }, [currentPage]);

  // Thêm effect mới để tải lại danh sách khi thêm bài viết mới
  useEffect(() => {
    if (!isAddBlogOpen) {
      // Tải lại danh sách khi đóng màn hình thêm bài viết
      fetchWaitingBlogs();
    }
  }, [isAddBlogOpen]);

  const handlePublish = async (id: number) => {
    try {

      const response = await BlogService.publishBlog(id);
      console.log("Kết quả xuất bản:", response);

      // Xóa bài viết đã xuất bản khỏi danh sách hiển thị
      const updatedBlogs = blogs.filter(blog => (blog.blogId || blog.id) !== id);
      setBlogs(updatedBlogs);
      
      // Cập nhật số trang dựa trên số bài viết còn lại
      const newTotalPages = Math.max(1, Math.ceil(updatedBlogs.length / pageSize));
      setTotalPages(newTotalPages);
      
      // Điều chỉnh trang hiện tại nếu không còn bài viết nào trên trang này
      if (updatedBlogs.length === 0 || currentPage > newTotalPages) {
        console.log("Chuyển về trang 1 vì không còn đủ bài viết");
        setCurrentPage(1);
      }

      // Hiển thị toast thành công
      toast({
        title: "Thành công",
        description: "Đã xuất bản bài viết thành công!",
        variant: "default",
      });

      // Nếu đã xuất bản tất cả bài viết
      if (updatedBlogs.length === 0) {
        toast({
          title: "Thông báo",
          description: "Đã xuất bản tất cả bài viết. Không còn bài viết nào đang chờ.",
          variant: "default",
        });
      }
      
      // Tải lại danh sách sau một khoảng thời gian ngắn để đảm bảo đồng bộ với server
      setTimeout(() => {
        fetchWaitingBlogs();
      }, 500);
    } catch (error) {
      console.error("Lỗi khi xuất bản bài viết:", error);

      toast({
        title: "Lỗi",
        description: "Không thể xuất bản bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleAddBlog = () => {
    setIsAddBlogOpen(true);
  };

  const handleCloseAddBlog = () => {
    setIsAddBlogOpen(false);
    fetchWaitingBlogs(); // Tải lại danh sách sau khi thêm blog
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

  // Hàm để lấy các bài viết cho trang hiện tại
  const getCurrentPageBlogs = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return blogs.slice(startIndex, endIndex);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    // Lưu ý: totalPages đã được tính toán dựa trên số lượng bài viết chờ xuất bản
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
          <CardTitle>News and Blog</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleAddBlog} className="bg-blue-500">
              <span className="mr-1">+</span> Add News
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">News</h2>
            <div className="flex justify-between mb-4">
              <div className="w-1/3">
                <Input
                  type="search"
                  placeholder="Search by Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p>Không có blog nào đang chờ duyệt</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Change Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(blogs) && blogs.length > 0 ? (
                    getCurrentPageBlogs().map((blog) => (
                      <TableRow key={blog.blogId || blog.id}>
                        <TableCell>{blog.blogId || blog.id}</TableCell>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>
                          {blog.authorName || blog.author || "Dang Khoi"}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 px-2 py-1 rounded">
                            Waiting
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-500 text-white hover:bg-blue-600"
                            onClick={() =>
                              handlePublish(blog.blogId || blog.id || 0)
                            }
                          >
                            Xuất bản
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-blue-500 text-white hover:bg-blue-600"
                            onClick={() =>
                              handleViewDetail(blog.blogId || blog.id || 0)
                            }
                          >
                            View detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p>Không tìm thấy bài viết nào đang chờ duyệt</p>
                      </TableCell>
                    </TableRow>
                  )}
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
              <span>View Detail</span>
              {/* <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(false)} className="h-8 w-8 p-0">
                &times;
              </Button> */}
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
                          <p className="text-sm text-gray-500 mb-1">Date:</p>
                          <p className="font-medium">
                            {formatDetailDate(
                              selectedBlog.createdAt || new Date().toISOString()
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Author:</p>
                          <p className="font-medium">
                            {selectedBlog.authorName ||
                              selectedBlog.author ||
                              "Dang Khoi"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status:</p>
                          <Badge className="bg-green-100 text-green-800 border-green-300 px-2 py-1 rounded">
                            Published
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Content</h3>
                <div className="bg-gray-900 text-white p-4 rounded-md">
                  {selectedBlog.content ? (
                    <div data-color-mode="dark" className="blog-content">
                      <MDEditor.Markdown source={selectedBlog.content} />
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <p>
                        In today's rapidly evolving world, technology is
                        transforming every facet of our lives, and the skincare
                        industry is no exception. With innovations ranging from
                        artificial intelligence to biotechnology, the future of
                        skincare is poised for a revolution that promises
                        personalized, efficient, and sustainable solutions. This
                        news article explores the groundbreaking technologies
                        that are reshaping the way we understand and care for
                        our skin, marking a new era in beauty and wellness.
                      </p>
                      <h3>A New Era of Personalized Skincare</h3>
                      <p>
                        Gone are the days when skincare was limited to
                        one-size-fits-all products. The modern landscape now
                        embraces personalization powered by advanced diagnostics
                        and smart devices. Companies are deploying machine
                        learning algorithms alongside high-resolution imaging
                        tools to assess skin conditions accurately. These
                        systems analyze factors such as hydration, UV exposure,
                        and even genetic predispositions to create truly
                        customized skincare regimens.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Không tìm thấy dữ liệu</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddBlog open={isAddBlogOpen} onClose={handleCloseAddBlog} />
    </div>
  );
}
