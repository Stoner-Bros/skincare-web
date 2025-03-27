import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import serviceService from "@/services/service.services";
import treatmentService from "@/services/treatment.services";
// import uploadService from "@/services/upload.services";

const formSchema = z.object({
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  treatmentName: z.string().min(1, "Tên liệu trình không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  treatmentThumbnailUrl: z.string().optional(),
  duration: z.number().min(0, "Thời gian phải là số dương").default(0),
  price: z.number().min(0, "Giá phải là số dương").default(0),
});

type FormValues = z.infer<typeof formSchema>;

type AddTreatmentProps = {
  open: boolean;
  onClose: () => void;
  serviceId?: number;
};

export default function AddTreatment({ open, onClose, serviceId }: AddTreatmentProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [services, setServices] = useState<any[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId: serviceId ? String(serviceId) : "",
      treatmentName: "",
      description: "",
      treatmentThumbnailUrl: "",
      duration: 0,
      price: 0,
    },
  });

  // Cập nhật serviceId khi prop thay đổi
  React.useEffect(() => {
    if (serviceId) {
      form.setValue("serviceId", String(serviceId));
    }
  }, [serviceId, form]);

  // Lấy danh sách dịch vụ từ API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true);
        const response = await serviceService.getServices(1, 100); // Lấy 100 dịch vụ
        
        // Debug log để kiểm tra dữ liệu
        console.log("Response from getServices in component:", response);
        
        let serviceItems: any[] = [];
        
        // Xử lý kết quả trả về từ serviceService.getServices đã được sửa
        if (Array.isArray(response)) {
          // Trường hợp response là mảng Service[]
          serviceItems = response;
        } else if (response && response.items) {
          // Trường hợp response là ServiceListResponse
          serviceItems = response.items;
        }
        
        console.log("Processed services:", serviceItems);
        setServices(serviceItems);
        
        if (serviceItems.length === 0) {
          console.warn("Không tìm thấy dịch vụ nào từ API");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không thể lấy danh sách dịch vụ. Vui lòng thử lại sau.",
        });
        setServices([]);
      } finally {
        setIsLoadingServices(false);
      }
    };

    if (open) {
      fetchServices();
    }
  }, [open, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      let thumbnailUrl = data.treatmentThumbnailUrl || "";
      
      if (thumbnailFile) {
        // Upload file trước
        const formData = new FormData();
        formData.append("file", thumbnailFile);
        
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
        
        // Phân tích cú pháp JSON thay vì sử dụng response.text()
        const responseData = await response.json();
        console.log("Response upload file:", responseData);
        // Lấy tên file từ phản hồi JSON
        thumbnailUrl = responseData.data.fileName;
      }
      
      if (!thumbnailUrl) {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Vui lòng tải lên hình ảnh thumbnail cho liệu trình",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Tạo đối tượng request để gửi đến API
      const treatmentData: any = {
        serviceId: Number(data.serviceId),
        treatmentName: data.treatmentName,
        description: data.description,
        duration: data.duration,
        price: data.price,
        treatmentThumbnailUrl: thumbnailUrl, // Thêm trường này vào request
      };
      
      console.log("Sending treatment data:", treatmentData);
      
      // Sử dụng treatmentService thay vì gọi API trực tiếp
      await treatmentService.createTreatment(treatmentData);
      
      toast({
        title: "Thành công",
        description: "Đã thêm liệu trình mới thành công",
      });
      
      // Chuyển hướng về trang danh sách liệu trình
      // navigate("/Home");
      handleClose();
    } catch (error) {
      console.error("Lỗi khi thêm liệu trình:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm liệu trình. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold">Thêm liệu trình mới</h1>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Đóng
          </Button>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {!serviceId && (
                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dịch vụ</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoadingServices}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn dịch vụ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingServices ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="ml-2">Đang tải...</span>
                            </div>
                          ) : services && services.length > 0 ? (
                            services.map((service) => (
                              <SelectItem 
                                key={service.serviceId} 
                                value={String(service.serviceId)}
                              >
                                {service.serviceName}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="flex items-center justify-center p-2">
                              <span>Không có dịch vụ nào</span>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
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
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả liệu trình</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả chi tiết về liệu trình"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời gian (phút)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Nhập thời gian" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VNĐ)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Nhập giá liệu trình" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Hình ảnh thumbnail</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                
                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm mb-2">Xem trước:</p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-xs rounded-md border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" type="button" onClick={handleClose}>
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Thêm liệu trình"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
