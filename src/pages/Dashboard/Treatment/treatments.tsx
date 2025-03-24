import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import treatmentService from "@/services/treatment.services";
import serviceService from "@/services/service.services";
import { PlusCircle, Pencil, Trash2, Search, Image, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddTreatment from "@/pages/Treatment/add-treatment";
import { useParams, useNavigate } from "react-router-dom";

// Định nghĩa schema cho form
const treatmentSchema = z.object({
  treatmentName: z.string().min(1, "Tên liệu trình không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  duration: z.coerce.number().min(1, "Thời gian phải lớn hơn 0"),
  price: z.coerce.number().min(1, "Giá phải lớn hơn 0"),
  treatmentThumbnailUrl: z.string().optional(),
  serviceId: z.coerce.number().optional(),
  image: z.any().optional()
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

export default function TreatmentsList() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm,  setSearchTerm] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Form cho chỉnh sửa
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

  // Lấy thông tin service
  const fetchService = async () => {
    if (!serviceId) return;
    
    try {
      const serviceData = await serviceService.getServiceById(Number(serviceId));
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

  // Lấy danh sách treatments
  const fetchTreatments = async (page = 1) => {
    if (!serviceId) return;
    
    setLoading(true);
    try {
      const response = await treatmentService.getTreatments(Number(serviceId), page, 10);
      if (response.data && response.data.items) {
        setTreatments(response.data.items);
        setTotalPages(Math.ceil(response.data.totalCount / 10));
      } else {
        setTreatments([]);
      }
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

  useEffect(() => {
    fetchService();
    fetchTreatments(currentPage);
  }, [serviceId, currentPage]);

  // Xử lý khi chọn file ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
    }
  };

  // Xử lý chỉnh sửa treatment
  const handleEditTreatment = async (data: TreatmentFormValues) => {
    if (!selectedTreatment) return;
    
    setIsSubmitting(true);
    try {
      let thumbnailUrl = data.treatmentThumbnailUrl || "";
      
      if (selectedFile) {
        // Upload file trước
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
          method: 'POST',
          headers: {
            'Accept': '*/*',
          },
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Lỗi khi upload hình ảnh');
        }
        
        // Phân tích cú pháp JSON
        const responseData = await response.json();
        console.log("Response upload file:", responseData);
        // Lấy tên file từ phản hồi JSON
        thumbnailUrl = responseData.data.fileName;
      }
      
      // Tạo đối tượng request để gửi đến API
      const treatmentData = {
        treatmentName: data.treatmentName,
        description: data.description,
        duration: data.duration,
        price: data.price,
        serviceId: Number(serviceId),
        treatmentThumbnailUrl: thumbnailUrl,
      };
      
      const updateResponse = await treatmentService.updateTreatment(selectedTreatment.treatmentId, treatmentData);
      
      toast({
        title: "Thành công",
        description: "Cập nhật liệu trình thành công",
      });
      setIsEditDialogOpen(false);
      fetchTreatments(currentPage);
    } catch (error: any) {
      console.error("Error updating treatment:", error);
      
      let errorMessage = "Không thể cập nhật liệu trình";
      if (error.response && error.response.data && error.response.data.message) {
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

  // Xử lý xóa treatment
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

  // Mở dialog chỉnh sửa và điền dữ liệu
  const openEditDialog = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setPreviewImage(getImageUrl(treatment.treatmentThumbnailUrl));
    setSelectedFile(null);
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

  // Mở dialog xóa
  const openDeleteDialog = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsDeleteDialogOpen(true);
  };

  // Mở dialog xem ảnh
  const openImageDialog = (imageUrl: string | undefined) => {
    if (imageUrl) {
      setSelectedImage(getImageUrl(imageUrl));
      setIsImageDialogOpen(true);
    }
  };

  // Format URL hình ảnh
  const getImageUrl = (url: string | undefined) => {
    if (!url) return '/default-treatment.jpg';
    
    // Nếu URL đã là đường dẫn đầy đủ, trả về luôn
    if (url.startsWith('http')) return url;
    
    // Nếu URL chỉ là tên file, thêm base URL
    return `${import.meta.env.VITE_API_URL}/upload/${url}`;
  };

  // Filter treatments theo search term
  const filteredTreatments = treatments.filter(treatment =>
    treatment.treatmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container bg-gray-50 mx-auto py-6 px-4 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 hidden md:block">
          {service?.serviceName || 'Quản lý liệu trình'}
        </h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 ml-auto">
          <PlusCircle className="h-4 w-4 mr-2" /> Thêm liệu trình mới
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-lg font-medium text-gray-700">
            Danh sách liệu trình ({filteredTreatments.length})
          </h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm liệu trình theo tên..."
              className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="rounded-md border overflow-hidden min-w-full">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[80px] font-semibold">ID</TableHead>
                    <TableHead className="font-semibold w-[240px]">Tên liệu trình</TableHead>
                    <TableHead className="font-semibold w-[100px]">Hình ảnh</TableHead>
                    <TableHead className="w-[120px] font-semibold text-center">Thời gian (phút)</TableHead>
                    <TableHead className="w-[150px] font-semibold">Giá</TableHead>
                    <TableHead className="text-center w-[120px] font-semibold">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTreatments.length > 0 ? (
                    filteredTreatments.map((treatment) => (
                      <TableRow key={treatment.treatmentId} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-center">{treatment.treatmentId}</TableCell>
                        <TableCell className="font-medium text-blue-600">{treatment.treatmentName}</TableCell>
                        <TableCell className="text-center">
                          <div className="relative h-12 w-12 cursor-pointer rounded-md overflow-hidden border mx-auto" 
                               onClick={() => openImageDialog(treatment.treatmentThumbnailUrl)}>
                            <img
                              src={getImageUrl(treatment.treatmentThumbnailUrl)}
                              alt={treatment.treatmentName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{treatment.duration}</TableCell>
                        <TableCell className="font-medium">{formatPrice(treatment.price)}</TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditDialog(treatment)}
                              className="h-9 w-9 p-0"
                            >
                              <Pencil className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openDeleteDialog(treatment)}
                              className="h-9 w-9 p-0 border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        Không có liệu trình nào cho dịch vụ này
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4"
            >
              Trước
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4"
            >
              Sau
            </Button>
          </div>
        )}
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
            <form onSubmit={editForm.handleSubmit(handleEditTreatment)} className="space-y-4">
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
                        {(previewImage || field.value) ? (
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
                                <span className="text-sm text-gray-500">Click để tải lên hình ảnh</span>
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
                            Đã chọn: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
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
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
            Bạn có chắc chắn muốn xóa liệu trình "{selectedTreatment?.treatmentName}" không?
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
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
    </div>
  );
} 