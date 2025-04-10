import api from "@/lib/api";

class BlogService {
  private baseUrl = "/blogs";

  async getBlogs(pageNumber: number = 1, pageSize: number = 10): Promise<any> {
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

  async getBlogById(id: number): Promise<any> {
    if (!id || isNaN(id) || id <= 0) {
      console.error("Invalid blog ID:", id);
      throw new Error("ID bài viết không hợp lệ");
    }
    
    try {
      console.log("Fetching blog with ID:", id);
      console.log("Request URL:", `${this.baseUrl}/${id}`);
      
      // Thử thêm trailing slash nếu API yêu cầu
      const response = await api.get(`${this.baseUrl}/${id}`);
      
      // Log response để dễ debug
      console.log("API Response:", response);
      
      // Nếu response là null hoặc undefined
      if (!response) {
        throw new Error("Không nhận được phản hồi từ API");
      }
      
      if (!response.data) {
        console.error("API returned empty data for blog ID:", id);
        throw new Error("API trả về dữ liệu trống");
      }
      
      console.log("API response data:", response.data);
      
      // Trả về trực tiếp dữ liệu từ response
      return response.data;
      
    } catch (error: any) {
      console.error(`Error fetching blog with id ${id}:`, error);
      
      // Log chi tiết lỗi để dễ debug
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        
        if (error.response.status === 404) {
          throw new Error("Không tìm thấy bài viết");
        }
        
      } else if (error.request) {
        console.error("Error request:", error.request);
        throw new Error("Không nhận được phản hồi từ máy chủ");
      } else {
        console.error("Error message:", error.message);
      }
      
      throw error;
    }
  }

  async createBlog(blogData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}`, blogData);
      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  }

  async updateBlog(id: number, blogData: any): Promise<any> {
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

  async publishBlog(id: number): Promise<any> {
    if (!id) {
      console.error("Invalid blog ID for publishing:", id);
      throw new Error("ID bài viết không hợp lệ");
    }
    
    try {
      console.log("Publishing blog with ID:", id);
      console.log("Publish URL:", `${this.baseUrl}/publish/${id}`);
      
      const response = await api.patch(`${this.baseUrl}/publish/${id}`);
      
      console.log("Publish response:", response);
      
      if (response && response.status === 200) {
        console.log("Blog successfully published:", response.data);
        return {
          success: true,
          data: response.data,
          message: "Bài viết đã được xuất bản thành công"
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error(`Error publishing blog with id ${id}:`, error);
      
      // Log chi tiết lỗi để dễ debug
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        
        // Trả về thông báo lỗi từ API nếu có
        throw new Error(error.response.data?.message || "Không thể xuất bản bài viết");
      } else if (error.request) {
        console.error("Error request:", error.request);
        throw new Error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        console.error("Error message:", error.message);
        throw error;
      }
    }
  }

  async getPublishBlogs(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/published`, {
        params: {
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching published blogs:", error);
      throw error;
    }
  }
}

export default new BlogService();
