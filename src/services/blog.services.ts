import api from "@/lib/api";
import {
  Blog,
  BlogCreateRequest,
  BlogListResponse,
  BlogUpdateRequest,
} from "@/types/blog.types";

class BlogService {
  private baseUrl = "/blogs";

  async getBlogs(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<BlogListResponse> {
    try {
      const response = await api.get(`${this.baseUrl}`, {
        params: {
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  }

  async getBlogById(id: number): Promise<Blog> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog with id ${id}:`, error);
      throw error;
    }
  }

  async createBlog(blogData: BlogCreateRequest): Promise<Blog> {
    try {
      const response = await api.post(`${this.baseUrl}`, blogData);
      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  }

  async updateBlog(id: number, blogData: BlogUpdateRequest): Promise<Blog> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, blogData);
      return response.data;
    } catch (error) {
      console.error(`Error updating blog with id ${id}:`, error);
      throw error;
    }
  }

  async deleteBlog(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting blog with id ${id}:`, error);
      throw error;
    }
  }
}

export default new BlogService();
