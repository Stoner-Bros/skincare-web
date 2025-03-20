export interface Blog {
  blogId: number;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishAt: string;
  thumbnailUrl: string;
  viewCount: number;
  tags: string;
  isDeleted: boolean;
}

export interface BlogCreateRequest {
  title: string;
  content: string;
  thumbnailUrl: string;
  tags: string;
}

export interface BlogUpdateRequest {
  title: string;
  content: string;
  thumbnailUrl: string;
  tags: string;
}

export interface BlogListResponse {
  items: Blog[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
