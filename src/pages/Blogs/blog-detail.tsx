import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const fakeRecommendedBlogs: RecommendedBlog[] = [
  {
    blogId: "2",
    title: "5 bước chăm sóc da buổi tối không thể bỏ qua",
    imageUrl: "https://placehold.co/600x400/purple/white?text=SkinCare",
    createdAt: new Date().toISOString(),
  },
  {
    blogId: "3",
    title: "Bí quyết giảm nếp nhăn tự nhiên tại nhà",
    imageUrl: "https://placehold.co/600x400/skyblue/white?text=Anti+Aging",
    createdAt: new Date().toISOString(),
  },
];

export default function NewsDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommended, setRecommended] = useState<RecommendedBlog[]>(fakeRecommendedBlogs);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://skincare-api.azurewebsites.net/api/blogs/8`);
        
        if (!response.ok) {
          throw new Error('Không thể tải thông tin bài viết');
        }
        
        const data = await response.json();
        
        // Chuyển đổi dữ liệu từ API sang định dạng Blog
        const formattedBlog: Blog = {
          blogId: data.blogId.toString(),
          title: data.title,
          content: data.content,
          imageUrl: data.content.match(/\(https:\/\/skincare-api\.azurewebsites\.net\/api\/uploads\/.*\.png\)/g)?.[0]?.slice(1, -1) || placeholderImage,
          authorFullName: data.authorName,
          createdAt: data.createdAt,
          hashtags: data.tags || ["spa"],
          thumbnailUrl: data.thumbnailUrl,
          viewCount: data.viewCount
        };
        
        setBlog(formattedBlog);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  }

  if (error || !blog) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500">Lỗi: {error || 'Không tìm thấy bài viết'}</div>;
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
                src={blog.thumbnailUrl ? `https://skincare-api.azurewebsites.net/api/upload/${blog.thumbnailUrl}` : blog.imageUrl} 
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
                <MDEditor.Markdown source={blog.content} />
              </div>
              {/* <div className="mt-6 flex flex-wrap gap-2">
                {blog.hashtags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div> */}
            </div>
          </div>
          <div className="w-full md:w-1/4 p-4">
            <h2 className="text-xl font-bold mb-4">Bài viết đề xuất</h2>
            {recommended.map((item) => (
              <div key={item.blogId} className="mb-4">
                <a href={`/Blog/${item.blogId}`} className="flex gap-2">
                  <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
