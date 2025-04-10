import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import serviceService from "@/services/service.services";
import { useLocation, useNavigate } from "react-router-dom";

const formSchema = z.object({
  serviceName: z.string().min(1, "Tên dịch vụ không được để trống"),
  serviceDescription: z.string().min(1, "Mô tả không được để trống"),
  serviceThumbnailUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type AddServiceProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddService({ open, onClose }: AddServiceProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  // const [previewUrl, setPreviewUrl] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: "",
      serviceDescription: "",
      serviceThumbnailUrl: "",
    },
  });

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      form.reset();
      setThumbnailFile(null);
    }
  }, [open, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      // const fileUrl = URL.createObjectURL(file);
      // setPreviewUrl(fileUrl);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      let thumbnailUrl = data.serviceThumbnailUrl || "";

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
        // Lấy tên file từ phản hồi JSON, bỏ đường dẫn /Uploads
        thumbnailUrl = responseData.data.fileName;
      }

      // Tạo đối tượng request để gửi đến API
      const serviceData: any = {
        serviceName: data.serviceName,
        serviceDescription: data.serviceDescription,
        serviceThumbnailUrl: thumbnailUrl,
      };

      // Sử dụng serviceService thay vì gọi API trực tiếp
      await serviceService.createService(serviceData);

      toast({
        title: "Thành công",
        description: "Đã thêm dịch vụ mới thành công",
      });

      // Đóng modal
      onClose();

      // Cập nhật lại trang nếu đang ở trang dịch vụ
      if (location.pathname.includes('/services') || location.pathname.includes('/dashboard')) {
        // Refresh trang để cập nhật danh sách
        window.location.reload();
      } else {
        // Chuyển hướng về trang dịch vụ
        navigate("/services");
      }
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm dịch vụ. Vui lòng thử lại sau.",
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
          <h1 className="text-2xl font-bold">Thêm dịch vụ mới</h1>
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
              <FormField
                control={form.control}
                name="serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên dịch vụ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên dịch vụ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả dịch vụ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả chi tiết về dịch vụ"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Hình ảnh thumbnail</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />

                {/* {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm mb-2">Xem trước:</p>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-xs rounded-md border border-gray-200"
                    />
                  </div>
                )} */}
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
                    "Thêm dịch vụ"
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
