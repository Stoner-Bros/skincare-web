export interface Service {
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  serviceThumbnailUrl: string;
  isAvailable: boolean;
}

export interface ServiceCreateRequest {
  serviceName: string;
  serviceDescription: string;
  serviceThumbnailUrl: string;
}

export interface ServiceUpdateRequest extends ServiceCreateRequest {
  isAvailable: boolean;
}

export interface ServiceListResponse {
  items: Service[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  extras?: string;
  debug_info?: string;
  data: T;
}
