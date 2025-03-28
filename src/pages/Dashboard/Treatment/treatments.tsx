import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useToast } from "@/hooks/use-toast";
import AddTreatment from "@/pages/Treatment/add-treatment";
import serviceService from "@/services/service.services";
import treatmentService from "@/services/treatment.services";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Image,
  Loader2,
  Pencil,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as z from "zod";

// Định nghĩa schema cho form
const treatmentSchema = z.object({
  treatmentName: z.string().min(1, "Tên liệu trình không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  duration: z.coerce.number().min(1, "Thời gian phải lớn hơn 0"),
  price: z.coerce.number().min(1, "Giá phải lớn hơn 0"),
  treatmentThumbnailUrl: z.string().optional(),
  serviceId: z.coerce.number().optional(),
  image: z.any().optional(),
});

type TreatmentFormValues = z.infer<typeof treatmentSchema>;

// Định nghĩa interface cho treatment
interface Treatment {
  treatmentId: number;
  treatmentName: string;
  description: string;
  duration: number;
  price: number;
  treatmentThumbnailUrl?: string;
  serviceId?: number;
  status?: string;
}

// Định nghĩa interface cho service
interface Service {
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  serviceThumbnailUrl?: string;
}

interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}

export default function TreatmentsList() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const pageSize = 7;
  const [totalRecords, setTotalRecords] = useState(0);

  // Use custom hooks
  const {
    searchTerm,
    setSearchTerm,
    filteredItems: filteredTreatments,
  } = useDebouncedSearch<Treatment>(treatments, "treatmentName");

  const {
    selectedFile,
    previewImage,
    handleImageChange,
    uploadImage,
    resetImage,
    setPreviewImage,
  } = useImageUpload();

  // Form initialization
  const editForm = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      treatmentName: "",
      description: "",
      duration: 30,
      price: 0,
      treatmentThumbnailUrl: "",
      serviceId: Number(serviceId),
    },
  });

  // Reset form and image when dialog closes
  useEffect(() => {
    if (!isEditDialogOpen) {
      resetImage();
      editForm.reset();
    }
  }, [isEditDialogOpen]);

  // Fetch data only once on mount
  useEffect(() => {
    fetchService();
    fetchTreatments(currentPage);
  }, [serviceId, currentPage]);

  // Reset page when serviceId changes
  useEffect(() => {
    setCurrentPage(1);
    setTreatments([]);
  }, [serviceId]);

  // API calls
  const fetchService = async () => {
    if (!serviceId) return;

    try {
      const serviceData = await serviceService.getServiceById(
        Number(serviceId)
      );
      setService(serviceData);
    } catch (error) {
      console.error("Error fetching service:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin dịch vụ",
        variant: "destructive",
      });
    }
  };

  const fetchTreatments = async (page = 1) => {
    if (!serviceId) return;

    setLoading(true);
    try {
      const response: PaginatedResponse<Treatment> =
        await treatmentService.getTreatments(Number(serviceId), page, pageSize);

      const { items, totalPages, pageNumber, totalRecords } = response.data;
      setTreatments(items);
      setTotalPages(totalPages);
      setCurrentPage(pageNumber);
      setTotalRecords(totalRecords);
    } catch (error) {
      console.error("Error fetching treatments:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách liệu trình",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleEditTreatment = async (data: TreatmentFormValues) => {
    if (!selectedTreatment) return;

    setIsSubmitting(true);
    try {
      let thumbnailUrl = data.treatmentThumbnailUrl || "";

      if (selectedFile) {
        thumbnailUrl = await uploadImage();
      }

      const treatmentData = {
        treatmentName: data.treatmentName,
        description: data.description,
        duration: data.duration,
        price: data.price,
        serviceId: Number(serviceId),
        treatmentThumbnailUrl: thumbnailUrl,
      };

      await treatmentService.updateTreatment(
        selectedTreatment.treatmentId,
        treatmentData
      );

      toast({
        title: "Thành công",
        description: "Cập nhật liệu trình thành công",
      });
      setIsEditDialogOpen(false);
      fetchTreatments(currentPage);
    } catch (error: any) {
      console.error("Error updating treatment:", error);

      let errorMessage = "Không thể cập nhật liệu trình";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTreatment = async () => {
    if (!selectedTreatment) return;

    setIsSubmitting(true);
    try {
      await treatmentService.deleteTreatment(selectedTreatment.treatmentId);
      toast({
        title: "Thành công",
        description: "Xóa liệu trình thành công",
      });
      setIsDeleteDialogOpen(false);
      fetchTreatments(currentPage);
    } catch (error) {
      console.error("Error deleting treatment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa liệu trình",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setPreviewImage(getImageUrl(treatment.treatmentThumbnailUrl));
    editForm.reset({
      treatmentName: treatment.treatmentName,
      description: treatment.description,
      duration: treatment.duration,
      price: treatment.price,
      treatmentThumbnailUrl: treatment.treatmentThumbnailUrl || "",
      serviceId: Number(serviceId),
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsDeleteDialogOpen(true);
  };

  const openImageDialog = (imageUrl: string | undefined) => {
    if (imageUrl) {
      setSelectedImage(getImageUrl(imageUrl));
      setIsImageDialogOpen(true);
    }
  };

  // Utility functions
  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/default-treatment.jpg";
    return url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_URL}/upload/${url}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <>
      <div className="container px-4 py-10 space-y-8 mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {service?.serviceName || "Quản lý liệu trình"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý các liệu trình và thông tin chi tiết
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Thêm liệu trình
          </Button>
        </div>

        {/* Main Content */}
        <div className="rounded-md border shadow-sm">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <h2 className="text-lg font-medium text-gray-700">
                Danh sách liệu trình ({filteredTreatments.length})
              </h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm liệu trình theo tên..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Tên liệu trình</TableHead>
                      <TableHead className="w-[100px]">Hình ảnh</TableHead>
                      <TableHead className="text-center">Thời gian</TableHead>
                      <TableHead className="text-right">Giá</TableHead>
                      <TableHead className="text-right w-[100px]">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTreatments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-32">
                          Không có liệu trình nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTreatments.map((treatment) => (
                        <TableRow key={treatment.treatmentId}>
                          <TableCell className="font-medium">
                            {treatment.treatmentId}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {treatment.treatmentName}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {treatment.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className="relative h-10 w-10 cursor-pointer rounded-md overflow-hidden border"
                              onClick={() =>
                                openImageDialog(treatment.treatmentThumbnailUrl)
                              }
                            >
                              <img
                                src={getImageUrl(
                                  treatment.treatmentThumbnailUrl
                                )}
                                alt={treatment.treatmentName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {treatment.duration} phút
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatPrice(treatment.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(treatment)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(treatment)}
                                className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 px-2">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {treatments.length} trên tổng số {totalRecords} liệu
                  trình
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Trang {currentPage} / {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Trang trước</span>
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Trang sau</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Sử dụng component AddTreatment */}
      <AddTreatment
        open={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          fetchTreatments(currentPage);
        }}
        serviceId={Number(serviceId)}
      />

      {/* Dialog chỉnh sửa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa liệu trình</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleEditTreatment)}
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="treatmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên liệu trình</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên liệu trình" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả chi tiết" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian (phút)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VNĐ)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={editForm.control}
                name="treatmentThumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh liệu trình</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center space-y-4">
                        {previewImage || field.value ? (
                          <div className="relative h-40 w-40 rounded-md overflow-hidden border">
                            <img
                              src={previewImage || getImageUrl(field.value)}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                              <label className="cursor-pointer p-2 rounded-full bg-white">
                                <Image className="h-6 w-6 text-gray-700" />
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/jpeg, image/png, image/gif"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                              <label className="cursor-pointer flex flex-col items-center p-4">
                                <Image className="h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500">
                                  Click để tải lên hình ảnh
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/jpeg, image/png, image/gif"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                          </div>
                        )}

                        {selectedFile && (
                          <p className="text-xs text-green-600">
                            Đã chọn: {selectedFile.name} (
                            {Math.round(selectedFile.size / 1024)} KB)
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Cập nhật
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Bạn có chắc chắn muốn xóa liệu trình "
            {selectedTreatment?.treatmentName}" không?
          </div>
          <DialogFooter className="flex space-x-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteTreatment}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xem hình ảnh */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Hình ảnh liệu trình</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Treatment"
                className="max-w-full max-h-[400px] object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
