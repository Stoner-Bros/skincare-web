import api from "@/lib/api";

interface Comment {
  commentId?: number;
  authorName?: string;
  blogId?: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

class CommentService {
  private baseUrl = "/comments";

  /**
   * Lấy thông tin một comment dựa trên ID
   * @param id ID của comment
   */
  async getCommentById(id: number): Promise<Comment> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy comment ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cập nhật nội dung comment
   * @param id ID của comment cần cập nhật
   * @param content Nội dung mới của comment
   */
  async updateComment(id: number, content: string): Promise<Comment> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, { content });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật comment ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa comment
   * @param id ID của comment cần xóa
   */
  async deleteComment(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Lỗi khi xóa comment ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo comment mới cho bài viết
   * @param blogId ID của bài viết
   * @param content Nội dung comment
   */
  async createComment(blogId: number, content: string): Promise<Comment> {
    try {
      const response = await api.post(`${this.baseUrl}/${blogId}`, { content });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tạo comment cho blog ID ${blogId}:`, error);
      throw error;
    }
  }

  /**
   * Lấy danh sách comment của một bài viết
   * @param blogId ID của bài viết
   * @param pageNumber Số trang (mặc định là 1)
   * @param pageSize Kích thước trang (mặc định là 10)
   */
  async getCommentsByBlogId(
    blogId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<{
    items: Comment[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  }> {
    try {
      const response = await api.get(`${this.baseUrl}/blog/${blogId}`, {
        params: {
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy comments cho blog ID ${blogId}:`, error);
      throw error;
    }
  }
}

export default new CommentService();
