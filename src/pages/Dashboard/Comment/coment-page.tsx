import { useEffect, useState } from "react";
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
import commentService from "@/services/comment.services";
import blogService from "@/services/blog.services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Trash2, Edit, Eye, AlertCircle } from "lucide-react";

interface Comment {
  commentId?: number;
  authorName?: string;
  blogId?: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

interface Blog {
  id?: number;
  blogId?: number;
  title: string;
  authorName?: string;
  createdAt: string;
}

export default function CommentPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [blogsLoading, setBlogsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  
  const [editContent, setEditContent] = useState<string>("");
  const [filteredBlogId, setFilteredBlogId] = useState<number | null>(null);
  
  const { toast } = useToast();

  // Fetch tất cả blogs để hiển thị trong dropdown
  const fetchBlogs = async () => {
    try {
      setBlogsLoading(true);
      // Lấy nhiều blogs để có đủ lựa chọn
      const response = await blogService.getBlogs(1, 100);
      
      if (response) {
        const blogData = Array.isArray(response.items) 
          ? response.items 
          : response.data?.items || [];
        
        setBlogs(blogData);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài viết:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bài viết",
        variant: "destructive",
      });
    } finally {
      setBlogsLoading(false);
    }
  };

  // Fetch tất cả comments theo blog ID
  const fetchComments = async () => {
    if (!filteredBlogId) return;
    
    try {
      setLoading(true);
      const response = await commentService.getCommentsByBlogId(
        filteredBlogId,
        currentPage,
        pageSize
      );
      
      console.log("Dữ liệu comments từ API:", response);
      
      if (response) {
        setComments(response.items || []);
        setTotalPages(response.totalPages || 1);
        setTotalRecords(response.totalRecords || 0);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách bình luận:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bình luận",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách blogs khi component được tạo
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Load comments khi trang thay đổi hoặc filter thay đổi
  useEffect(() => {
    if (filteredBlogId) {
      fetchComments();
    }
  }, [currentPage, pageSize, filteredBlogId]);

  // Xử lý khi chọn blog từ dropdown
  const handleBlogSelect = (blogId: string) => {
    const parsedId = parseInt(blogId);
    if (!isNaN(parsedId) && parsedId > 0) {
      setFilteredBlogId(parsedId);
      setCurrentPage(1); // Reset về trang đầu khi lọc
    }
  };

  // Xem chi tiết một comment
  const handleViewDetail = (comment: Comment) => {
    setSelectedComment(comment);
    setIsDetailOpen(true);
  };

  // Mở dialog chỉnh sửa comment
  const handleOpenEdit = (comment: Comment) => {
    setSelectedComment(comment);
    setEditContent(comment.content);
    setIsEditOpen(true);
  };

  // Xử lý lưu chỉnh sửa comment
  const handleSaveEdit = async () => {
    if (!selectedComment || !selectedComment.commentId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin bình luận",
        variant: "destructive",
      });
      return;
    }

    try {
      await commentService.updateComment(selectedComment.commentId, editContent);
      
      // Cập nhật lại comment trong state
      setComments(comments.map(c => 
        c.commentId === selectedComment.commentId 
          ? { ...c, content: editContent } 
          : c
      ));
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật bình luận",
        variant: "default",
      });
      
      setIsEditOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bình luận",
        variant: "destructive",
      });
    }
  };

  // Mở dialog xác nhận xóa comment
  const handleOpenDelete = (comment: Comment) => {
    setSelectedComment(comment);
    setIsDeleteOpen(true);
  };

  // Xử lý xóa comment
  const handleConfirmDelete = async () => {
    if (!selectedComment || !selectedComment.commentId) return;
    
    try {
      await commentService.deleteComment(selectedComment.commentId);
      
      // Xóa comment khỏi state
      setComments(comments.filter(c => c.commentId !== selectedComment.commentId));
      
      toast({
        title: "Thành công",
        description: "Đã xóa bình luận",
        variant: "default",
      });
      
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa bình luận",
        variant: "destructive",
      });
    }
  };

  // Format thời gian
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Lấy tiêu đề blog từ ID
  const getBlogTitleById = (blogId?: number) => {
    if (!blogId) return "Không rõ bài viết";
    
    const blog = blogs.find(b => (b.blogId === blogId || b.id === blogId));
    return blog ? blog.title : `Bài viết ID: ${blogId}`;
  };

  // Rút gọn nội dung để hiển thị
  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Rút gọn tiêu đề blog trong dropdown
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader className="bg-white rounded-t-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-2xl font-bold">Quản lý bình luận</CardTitle>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="flex gap-2 min-w-[250px]">
                {blogsLoading ? (
                  <div className="w-full h-10 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <Select onValueChange={handleBlogSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn bài viết" />
                    </SelectTrigger>
                    <SelectContent>
                      {blogs.length > 0 ? (
                        blogs.map((blog) => (
                          <SelectItem 
                            key={blog.blogId || blog.id} 
                            value={(blog.blogId || blog.id)?.toString() || ""}
                          >
                            ID: {blog.blogId || blog.id} - {truncateTitle(blog.title)}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>Không có bài viết nào</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {!filteredBlogId ? (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">Chọn bài viết để xem bình luận</h3>
              <p className="text-gray-500 mt-2">Vui lòng chọn một bài viết từ dropdown để xem danh sách bình luận</p>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Không có bình luận nào cho bài viết này</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-medium">Bình luận của bài viết: {getBlogTitleById(filteredBlogId)}</h3>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Người bình luận</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.commentId}>
                      <TableCell>{comment.commentId}</TableCell>
                      <TableCell>
                        {comment.authorName || "Người dùng ẩn danh"}
                      </TableCell>
                      <TableCell>{truncateContent(comment.content)}</TableCell>
                      <TableCell>{formatDate(comment.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(comment)}
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Phân trang */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Hiển thị {comments.length} trên tổng số {totalRecords} bình luận
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog xem chi tiết comment */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết bình luận</DialogTitle>
          </DialogHeader>
          
          {selectedComment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">ID:</p>
                  <p>{selectedComment.commentId}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Bài viết:</p>
                  <p>{getBlogTitleById(selectedComment.blogId)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Người bình luận:</p>
                  <p>{selectedComment.authorName || "Người dùng ẩn danh"}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Thời gian:</p>
                  <p>{formatDate(selectedComment.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">Nội dung bình luận:</p>
                <div className="bg-gray-50 p-3 rounded border">{selectedComment.content}</div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenEdit(selectedComment)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleOpenDelete(selectedComment)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa comment */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bình luận</DialogTitle>
          </DialogHeader>
          
          {selectedComment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500">ID:</p>
                  <p>{selectedComment.commentId}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Người bình luận:</p>
                  <p>{selectedComment.authorName || "Người dùng ẩn danh"}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">Nội dung bình luận:</p>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={5}
                />
              </div>
              
              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                <Button onClick={handleSaveEdit}>Lưu thay đổi</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa comment */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Xác nhận xóa bình luận</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-center">Bạn có chắc chắn muốn xóa bình luận này không?</p>
            <p className="text-center text-sm text-gray-500">Hành động này không thể hoàn tác.</p>
            
            <DialogFooter className="flex justify-center space-x-4">
              <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Xác nhận xóa
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
