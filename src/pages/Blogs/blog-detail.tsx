import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import blogService from "@/services/blog.services";
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

const placeholderImage = "https://placehold.co/300x500/gray/white?text=Beauty+Tips";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<RecommendedBlog[]>([]);

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
  }, [id]);

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
            <img src="/khachdacbiet.jpg" alt="Fixed Beauty Image" className="rounded-lg shadow-md" />
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
