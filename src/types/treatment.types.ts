export interface Treatment {
  treatmentId: number;
  serviceId: number;
  treatmentName: string;
  description: string;
  duration: number;
  price: number;
  isAvailable: boolean;
  treatmentThumbnailUrl?: string;
}

export interface TreatmentCreateRequest {
  serviceId: number;
  treatmentName: string;
  description: string;
  duration: number;
  price: number;
  treatmentThumbnailUrl: string;
}

export interface TreatmentUpdateRequest {
  serviceId: number;
  treatmentName: string;
  description: string;
  duration: number;
  price: number;
  isAvailable?: boolean;
  treatmentThumbnailUrl?: string;
}

export interface TreatmentListResponse {
  items: Treatment[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
