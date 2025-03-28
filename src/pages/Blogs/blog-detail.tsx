import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import blogService from "@/services/blog.services";
import commentService from "@/services/comment.services";
// import { useParams } from "react-router-dom";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  imageUrl: string;
  authorFullName: string;
  createdAt: string;
  hashtags: string[];
  authorName?: string;
  thumbnailUrl?: string;
  viewCount?: number;
  tags?: string[];
  isDeleted?: boolean;
}

interface RecommendedBlog {
  blogId: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

interface Comment {
  commentId?: number;
  authorName?: string;
  blogId?: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

interface CommentPagination {
  items: Comment[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

const placeholderImage = "https://placehold.co/300x500/gray/white?text=Beauty+Tips";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<RecommendedBlog[]>([]);
  
  // Comment state
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [commentPage, setCommentPage] = useState<number>(1);
  const [commentPageSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [newComment, setNewComment] = useState<string>("");
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch comments
  const fetchComments = async (blogId: number, page: number = 1) => {
    if (!blogId) return;
    
    try {
      setCommentLoading(true);
      setCommentError(null);
      
      const data: CommentPagination = await commentService.getCommentsByBlogId(
        blogId,
        page,
        commentPageSize
      );
      
      setComments(data.items || []);
      setTotalComments(data.totalRecords || 0);
      setTotalPages(data.totalPages || 1);
      setCommentPage(data.pageNumber || 1);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Submit new comment
  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }
    
    if (!id) {
      setCommentError("ID bài viết không hợp lệ");
      return;
    }
    
    try {
      setSubmitting(true);
      setCommentError(null);
      
      const blogId = parseInt(id);
      await commentService.createComment(blogId, newComment);
      
      // Reset form and refresh comments
      setNewComment("");
      fetchComments(blogId, 1); // Quay lại trang đầu tiên sau khi comment
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      setCommentError("Không thể gửi bình luận. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (id) {
      const blogId = parseInt(id);
      setCommentPage(page);
      fetchComments(blogId, page);
    }
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) {
        setError('ID bài viết không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Đang lấy dữ liệu cho blog có ID:", id);
        const blogId = parseInt(id);
        
        if (isNaN(blogId)) {
          throw new Error('ID bài viết không hợp lệ');
        }
        
        const data = await blogService.getBlogById(blogId);
        console.log("Dữ liệu blog nhận được từ API:", data);
        
        // Kiểm tra xem data có rỗng hay không
        if (!data) {
          throw new Error('Dữ liệu blog trống');
        }
        
        // Chuyển đổi dữ liệu từ API sang định dạng Blog với kiểm tra null/undefined
        const formattedBlog: Blog = {
          blogId: data.blogId?.toString() || data.id?.toString() || "0",
          title: data.title || "Không có tiêu đề",
          content: data.content || "Không có nội dung",
          imageUrl: data.imageUrl || placeholderImage,
          authorFullName: data.authorName || data.authorFullName || 'Không có tên tác giả',
          createdAt: data.createdAt || new Date().toISOString(),
          hashtags: Array.isArray(data.tags) 
            ? data.tags 
            : (typeof data.tags === 'string' && data.tags ? [data.tags] : (Array.isArray(data.hashtags) ? data.hashtags : ["spa"])),
          thumbnailUrl: data.thumbnailUrl || "",
          viewCount: data.viewCount || 0
        };
        
        console.log("Blog sau khi định dạng:", formattedBlog);
        setBlog(formattedBlog);
        
        // Tải bình luận sau khi có blog data
        fetchComments(blogId);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedBlogs = async () => {
      try {
        // Lấy danh sách ID từ 1-10 (trừ ID hiện tại)
        const blogIds = Array.from({ length: 10 }, (_, i) => i + 1)
          .filter(blogId => blogId !== Number(id));
        
        // Danh sách bài viết đề xuất
        const recommendedBlogs: RecommendedBlog[] = [];
        
        // Gọi API để lấy chi tiết từng bài viết
        for (const blogId of blogIds) {
          try {
            const blogData = await blogService.getBlogById(blogId);
            if (blogData) {
              recommendedBlogs.push({
                blogId: blogData.blogId?.toString() || blogData.id?.toString() || "0",
                title: blogData.title || "Bài viết đề xuất",
                imageUrl: blogData.thumbnailUrl 
                  ? `https://skincare-api.azurewebsites.net/api/upload/${blogData.thumbnailUrl}` 
                  : (blogData.imageUrl || placeholderImage),
                createdAt: blogData.createdAt || new Date().toISOString()
              });
            }
          } catch (error) {
            console.error(`Lỗi khi lấy bài viết đề xuất ID ${blogId}:`, error);
            // Bỏ qua bài viết lỗi và tiếp tục
          }
        }
        
        console.log("Bài viết đề xuất sau khi lấy từ API:", recommendedBlogs);
        
        if (recommendedBlogs.length > 0) {
          setRecommended(recommendedBlogs);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết đề xuất:", error);
      }
    };

    fetchBlogData();
    fetchRecommendedBlogs();
  }, [id, commentPageSize]);

  // Format date helper
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <p className="mt-4 text-gray-600">Đang tải nội dung bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Không thể hiển thị bài viết</h2>
          <p className="text-gray-700 mb-6">{error || 'Không tìm thấy bài viết với ID đã cung cấp'}</p>
          <button 
            onClick={() => navigate('/news')}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Quay lại trang tin tức
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-start text-red-600">{blog.title}</h1>
          <div className="flex items-center text-start text-gray-500 text-sm mt-2">
            <img src="https://cdn.diemnhangroup.com/seoulspa/2023/11/profile-circle.png" alt="" className="icon-profile mr-2" />
            Tác giả: {blog.authorFullName}
            <img src="https://cdn.diemnhangroup.com/seoulspa/2023/11/clock.png" alt="" className="icon-clock mx-2" />
            Cập nhật: {new Date(blog.createdAt).toLocaleDateString()}
            {blog.viewCount !== undefined && (
              <span className="ml-2">
                <i className="fas fa-eye mr-1"></i>
                Lượt xem: {blog.viewCount} 
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row">

          <div className="w-full md:w-1/4 p-4 flex justify-center items-start">
            <img src="/nhuongquyen.webp" alt="Fixed Beauty Image" className="rounded-lg shadow-md" />
          </div>


          <div className="w-full md:w-2/4 p-4">
            <div className="mb-4">
              <img 
                src={blog.thumbnailUrl 
                  ? `https://skincare-api.azurewebsites.net/api/upload/${blog.thumbnailUrl}` 
                  : (blog.imageUrl || placeholderImage)} 
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = placeholderImage;
                }}
              />
            </div>
            <div className="p-2">
              <div data-color-mode="light">
                {blog.content ? (
                  <MDEditor.Markdown source={blog.content} />
                ) : (
                  <p className="text-gray-500 italic">Không có nội dung bài viết</p>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {blog.hashtags && blog.hashtags.length > 0 && blog.hashtags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* Comment Section */}
              <div className="mt-10 border-t pt-6">
                <h3 className="text-2xl font-bold text-red-600 mb-6">Bình luận ({totalComments})</h3>
                
                {/* Comment Form */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                  <h4 className="text-lg font-semibold mb-3">Để lại bình luận</h4>
                  <form onSubmit={handleCommentSubmit}>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[120px]"
                      placeholder="Viết bình luận của bạn..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    ></textarea>
                    {commentError && (
                      <p className="text-red-500 text-sm mt-1">{commentError}</p>
                    )}
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
                          submitting || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Comments List */}
                <div className="space-y-4">
                  {commentLoading ? (
                    <div className="text-center p-4">
                      <p className="text-gray-500">Đang tải bình luận...</p>
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.commentId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold mr-3">
                              {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <h5 className="font-semibold">{comment.authorName || 'Người dùng ẩn danh'}</h5>
                              <p className="text-xs text-gray-500">{comment.createdAt ? formatDate(comment.createdAt) : 'Không có thời gian'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pl-13">
                          <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Chưa có bình luận nào. Hãy trở thành người đầu tiên bình luận!</p>
                    </div>
                  )}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() => handlePageChange(commentPage - 1)}
                        disabled={commentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          commentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        &lt;
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            page === commentPage
                              ? 'bg-red-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(commentPage + 1)}
                        disabled={commentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          commentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        &gt;
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4 p-4">
            <h2 className="text-xl font-bold mb-4">Bài viết đề xuất</h2>
            {recommended.length > 0 ? (
              recommended.map((item) => (
                <div key={item.blogId} className="mb-4">
                  <Link to={`/blog/${item.blogId}`} className="flex gap-2">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = placeholderImage;
                      }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Không có bài viết đề xuất</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
