import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
// import { useParams } from "react-router-dom";

interface Blog {
  blogId: string;
  title: string;
  content: string;
  imageUrl: string;
  authorFullName: string;
  createdAt: string;
  hashtags: string[];
}

interface RecommendedBlog {
  blogId: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

// const placeholderImage = "https://placehold.co/300x500/gray/white?text=Beauty+Tips";

const fakeBlogData: Blog = {
  blogId: "1",
  title: "Bí quyết làm đẹp với công nghệ mới nhất 2023",
  content: `# Bí quyết làm đẹp với công nghệ mới nhất 2023

  ## 1. Công nghệ Laser tái tạo da

  Công nghệ laser tái tạo da giúp làn da trở nên trẻ trung, săn chắc và rạng rỡ hơn.

  ## 2. Liệu pháp Hydrafacial

  Hydrafacial là một liệu pháp làm đẹp không xâm lấn, phù hợp với mọi loại da.

  ## 3. Tiêm Botox và Filler

  Botox làm giãn cơ và giảm nếp nhăn, trong khi Filler bổ sung thể tích cho các vùng bị lõm.`,
  imageUrl: "https://placehold.co/600x400/pink/white?text=Beauty+Blog",
  authorFullName: "Nguyễn Thị Hương",
  createdAt: new Date().toISOString(),
  hashtags: ["làmđẹp", "công nghệ", "spa", "chămsócda", "trendmới"],
};

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
  // const { id } = useParams<{ id: string }>();
  const [blog] = useState<Blog>(fakeBlogData);
  const [recommended] = useState<RecommendedBlog[]>(fakeRecommendedBlogs);

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
          </div>
        </div>
        <div className="flex flex-col md:flex-row">

          <div className="w-full md:w-1/4 p-4 flex justify-center items-start">
            <img src="/khachdacbiet.jpg" alt="Fixed Beauty Image" className="rounded-lg shadow-md" />
          </div>


          <div className="w-full md:w-2/4 p-4">
            <div className="mb-4">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="p-2">
              <div data-color-mode="light">
                <MDEditor.Markdown source={blog.content} />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {blog.hashtags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
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
