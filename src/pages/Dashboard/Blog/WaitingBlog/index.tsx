import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import AddBlog from "@/pages/Blogs/add-blog";
import BlogService from "@/services/blog.services";
import MDEditor from "@uiw/react-md-editor";
import {
  CheckCircle,
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";

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
  publishAt?: string | null;
  tags?: string;
}

export default function WaitingBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [publishLoading, setPublishLoading] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isAddBlogOpen, setIsAddBlogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const pageSize = 5;
  const { toast } = useToast();

  // Kiểm tra xem blog đã được xuất bản hay chưa dựa vào trường publishAt
  const isPublishedBlog = (blog: Blog): boolean => {
    return Boolean(blog.publishAt);
  };

  const fetchWaitingBlogs = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getBlogs(1, 100);

      if (!response.data || !response.data.items) {
        setBlogs([]);
        setFilteredBlogs([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const allBlogs = response.data.items;
      // Lọc các blog chưa được xuất bản (publishAt === null)
      const waitingBlogs = Array.isArray(allBlogs)
        ? allBlogs.filter((blog: Blog) => !isPublishedBlog(blog))
        : [];

      // Sắp xếp blogs theo thời gian tạo mới nhất
      const sortedBlogs = [...waitingBlogs].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setBlogs(sortedBlogs);
      setFilteredBlogs(sortedBlogs);

      const totalWaitingBlogs = sortedBlogs.length;
      const calculatedTotalPages = Math.ceil(totalWaitingBlogs / pageSize);
      setTotalPages(Math.max(1, calculatedTotalPages));

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
    fetchWaitingBlogs();
  }, []);

  useEffect(() => {
    if (!isAddBlogOpen) {
      fetchWaitingBlogs();
    }
  }, [isAddBlogOpen]);

  // Khi searchTerm thay đổi
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredBlogs(blogs);
    } else {
      const term = searchTerm.toLowerCase();
      const results = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(term) ||
          (blog.authorName && blog.authorName.toLowerCase().includes(term)) ||
          (blog.author && blog.author.toLowerCase().includes(term)) ||
          (blog.tags && blog.tags.toLowerCase().includes(term))
      );
      setFilteredBlogs(results);
    }

    // Reset về trang 1 khi tìm kiếm
    setCurrentPage(1);

    // Tính lại số trang
    const calculatedTotalPages = Math.ceil(filteredBlogs.length / pageSize);
    setTotalPages(Math.max(1, calculatedTotalPages));
  }, [searchTerm, blogs]);

  const handlePublish = async (id: number) => {
    try {
      setPublishLoading(id);

      await BlogService.publishBlog(id);

      // Xóa bài viết đã xuất bản khỏi danh sách hiển thị
      const updatedBlogs = blogs.filter(
        (blog) => (blog.blogId || blog.id) !== id
      );
      setBlogs(updatedBlogs);

      // Cập nhật danh sách đã lọc
      if (searchTerm.trim()) {
        const updatedFiltered = filteredBlogs.filter(
          (blog) => (blog.blogId || blog.id) !== id
        );
        setFilteredBlogs(updatedFiltered);
      } else {
        setFilteredBlogs(updatedBlogs);
      }

      // Cập nhật số trang dựa trên số bài viết còn lại
      const newTotalPages = Math.max(
        1,
        Math.ceil(filteredBlogs.length / pageSize)
      );
      setTotalPages(newTotalPages);

      // Điều chỉnh trang hiện tại nếu không còn bài viết nào trên trang này
      if (filteredBlogs.length === 0 || currentPage > newTotalPages) {
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
          description:
            "Đã xuất bản tất cả bài viết. Không còn bài viết nào đang chờ.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Lỗi khi xuất bản bài viết:", error);

      toast({
        title: "Lỗi",
        description: "Không thể xuất bản bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setPublishLoading(null);
    }
  };

  const handleAddBlog = () => {
    setIsAddBlogOpen(true);
  };

  const handleCloseAddBlog = () => {
    setIsAddBlogOpen(false);
    fetchWaitingBlogs();
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

  // Hàm để lấy các bài viết cho trang hiện tại
  const getCurrentPageBlogs = () => {
    if (filteredBlogs.length === 0) {
      return [];
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredBlogs.length);
    return filteredBlogs.slice(startIndex, endIndex);
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
    <>
      <div className="p-4 space-y-6">
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle className="text-2xl font-bold">Quản lý Blog</CardTitle>
              <CardDescription>
                Quản lý và xuất bản bài viết đang chờ duyệt
              </CardDescription>
            </div>
            <Button
              onClick={handleAddBlog}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Blog Mới
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4 gap-4">
                <div className="w-full max-w-sm relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm theo tiêu đề, tác giả hoặc tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-10 border-gray-200 focus:border-primary"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchTerm("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchWaitingBlogs}
                  className="h-10 flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tải lại
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64 flex-col space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Đang tải dữ liệu...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
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
                  {searchTerm
                    ? "Không tìm thấy kết quả phù hợp"
                    : "Không có blog nào đang chờ duyệt"}
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                  >
                    Xóa bộ lọc tìm kiếm
                  </Button>
                )}
                {!searchTerm && (
                  <Button
                    variant="outline"
                    onClick={handleAddBlog}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo blog mới
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="rounded-md border text-nowrap text-ellipsis">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead className="w-32">Tác giả</TableHead>
                        <TableHead className="w-28">Ngày tạo</TableHead>
                        <TableHead className="w-28">Tags</TableHead>
                        <TableHead className="w-32 text-right">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCurrentPageBlogs().map((blog) => (
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
                            {blog.tags ? (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-800 border-blue-200"
                              >
                                {blog.tags}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                Không có
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewDetail(blog.blogId || blog.id || 0)
                                }
                                className="h-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handlePublish(blog.blogId || blog.id || 0)
                                }
                                className="h-8 bg-green-600 hover:bg-green-700"
                                disabled={
                                  publishLoading === (blog.blogId || blog.id)
                                }
                              >
                                {publishLoading === (blog.blogId || blog.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
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
      </div>
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
                          {selectedBlog.blogId || selectedBlog.id || 1}
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
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                        >
                          Chờ duyệt
                        </Badge>
                      </div>
                      {selectedBlog.tags && (
                        <div className="space-y-1 col-span-2">
                          <p className="text-sm text-muted-foreground">Tags:</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-800 border-blue-200"
                            >
                              {selectedBlog.tags}
                            </Badge>
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

          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Đóng
            </Button>
            {selectedBlog && (
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setIsDetailOpen(false);
                  const id = selectedBlog.blogId || selectedBlog.id;
                  if (id) handlePublish(id);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Xuất bản bài viết
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddBlog open={isAddBlogOpen} onClose={handleCloseAddBlog} />
    </>
  );
}
