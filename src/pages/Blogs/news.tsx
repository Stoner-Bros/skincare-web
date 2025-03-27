import { Skeleton } from "@/components/ui/skeleton";
import BlogService from "@/services/blog.services";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho blog
interface Blog {
  id?: number;
  blogId?: number; // Thêm blogId để tương thích với API
  title: string;
  content: string;
  thumbnailUrl?: string;
  description?: string;
  authorName?: string;
  tags?: string | string[]; // Tags có thể là string hoặc mảng string
  createdAt: string;
}

// Định nghĩa kiểu dữ liệu cho category
interface Category {
  id: string;
  label: string;
  title: string;
  tag: string;
}

// URL cơ sở của API
const API_BASE_URL = "https://skincare-api.azurewebsites.net";

export default function NewsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const navigate = useNavigate();

  // Hàm để tạo URL đầy đủ cho hình ảnh thumbnail
  const getImageUrl = (thumbnailUrl: string) => {
    if (!thumbnailUrl) return "/default-blog-image.jpg";

    // Kiểm tra nếu đã có URL đầy đủ
    if (thumbnailUrl.startsWith("http")) {
      return thumbnailUrl;
    }

    // Nếu chỉ là tên file, thêm đường dẫn API
    return `${API_BASE_URL}/api/upload/${thumbnailUrl}`;
  };

  // Hàm xử lý khi người dùng click vào bài viết
  const handleBlogClick = (blogId: number) => {
    console.log("Chuyển hướng đến blog có ID:", blogId);
    navigate(`/blog/${blogId}`);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await BlogService.getBlogs(1, 100);
        console.log("API Response:", response);

        // Kiểm tra cấu trúc response
        if (response && response.data) {
          // Kiểm tra xem response.data có thuộc tính items không (dựa vào API của bạn)
          const blogsData = Array.isArray(response.data)
            ? response.data
            : response.data.items || response.data.data || [];

          console.log("Blogs data:", blogsData);

          // Lưu mảng blogs
          setBlogs(blogsData);

          // Tạo danh sách categories từ tags trong API
          if (Array.isArray(blogsData)) {
            // Tạo danh sách duy nhất từ tất cả tags
            let allTags: string[] = [];

            blogsData.forEach((blog: Blog) => {
              if (!blog.tags) return;

              if (typeof blog.tags === "string") {
                // Nếu tags là string, thêm vào danh sách
                allTags.push(blog.tags);
              } else if (Array.isArray(blog.tags)) {
                // Nếu tags là mảng, gộp vào danh sách
                allTags = [...allTags, ...blog.tags];
              }
            });

            // Lọc các tags trùng lặp
            const uniqueTags = [...new Set(allTags)].filter(Boolean);

            console.log("Unique tags:", uniqueTags);

            const newCategories = uniqueTags.map((tag: string) => {
              // Tạo ID từ tag (loại bỏ dấu cách, chuyển thành chữ thường)
              const id = tag.toLowerCase().replace(/\s+/g, "-");

              // Tạo title từ tag (in hoa)
              const title = tag.toUpperCase();

              return {
                id,
                label: tag,
                title,
                tag,
              };
            });

            setCategories(newCategories);

            // Đặt category đầu tiên làm active nếu có
            if (newCategories.length > 0) {
              setActiveCategory(newCategories[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Lọc blog theo tag
  const filterBlogsByCategory = (categoryId: string): Blog[] => {
    if (!blogs || !Array.isArray(blogs) || !categories.length) return [];

    // Tìm tag tương ứng với categoryId
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return [];

    // Lọc blogs có tag chính xác - hỗ trợ cả string và array tags
    return blogs.filter((blog) => {
      if (!blog.tags) return false;

      if (typeof blog.tags === "string") {
        return blog.tags === category.tag;
      }

      if (Array.isArray(blog.tags)) {
        return blog.tags.includes(category.tag);
      }

      return false;
    });
  };

  // Lấy tiêu đề hiển thị dựa trên category đang active
  const getActiveCategoryTitle = () => {
    const category = categories.find((cat) => cat.id === activeCategory);
    return category ? category.title : "TIN TỨC & BÀI VIẾT";
  };

  // Lấy tên hiển thị của header sidebar
  const getSidebarHeaderTitle = () => {
    // Lấy category đầu tiên nếu có
    return categories.length > 0 ? categories[0].label : "Tin tức";
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 md:pr-4">
          <div className="rounded-lg border border-pink-100 overflow-hidden sticky top-4">
            <div className="bg-red-600 text-white font-bold p-3 text-center">
              {getSidebarHeaderTitle()}
            </div>
            <ul className="divide-y divide-pink-100">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left p-3 hover:bg-pink-50 transition-colors ${
                      activeCategory === category.id
                        ? "text-red-600 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {category.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-8">
            {getActiveCategoryTitle()}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden shadow-md">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {blogs.length > 0 &&
              filterBlogsByCategory(activeCategory).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterBlogsByCategory(activeCategory).map((blog) => (
                    <div
                      key={blog.id || blog.blogId}
                      onClick={() =>
                        handleBlogClick(blog.id || blog.blogId || 0)
                      }
                      className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={getImageUrl(blog.thumbnailUrl || "")}
                          alt={blog.title}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/default-blog-image.jpg";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 bg-red-500 text-white text-xs px-2 py-1 m-2 rounded">
                          {typeof blog.tags === "string"
                            ? blog.tags
                            : Array.isArray(blog.tags) && blog.tags.length > 0
                            ? blog.tags[0]
                            : "Tin tức"}
                        </div>
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>

                        <div className="mt-auto flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {new Date(blog.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="text-sm font-medium text-red-600">
                            Xem thêm
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">
                    Không có bài viết nào trong mục này
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
