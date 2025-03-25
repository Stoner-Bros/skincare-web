import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { Textarea } from "@/components/ui/textarea";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useToast } from "@/hooks/use-toast";
import serviceService from "@/services/service.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema validation
const serviceSchema = z.object({
  serviceName: z.string().min(1, "Tên dịch vụ không được để trống"),
  serviceDescription: z.string().min(1, "Mô tả không được để trống"),
  serviceThumbnailUrl: z.string().optional(),
  image: z.any().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface EditServiceProps {
  open: boolean;
  onClose: () => void;
  service: {
    data: {
      serviceId: number;
      serviceName: string;
      serviceDescription: string;
      serviceThumbnailUrl?: string;
      isAvailable: boolean;
    };
  };
}

export default function EditService({
  open,
  onClose,
  service,
}: EditServiceProps) {
  const { toast } = useToast();
  const {
    selectedFile,
    previewImage,
    handleImageChange,
    uploadImage,
    resetImage,
    setPreviewImage,
  } = useImageUpload();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: service.data.serviceName,
      serviceDescription: service.data.serviceDescription,
      serviceThumbnailUrl: service.data.serviceThumbnailUrl,
    },
  });

  useEffect(() => {
    if (service.data.serviceThumbnailUrl) {
      setPreviewImage(getImageUrl(service.data.serviceThumbnailUrl));
    }
  }, [service]);

  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/default-service.jpg";
    return url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_URL}/upload/${url}`;
  };

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      let thumbnailUrl = data.serviceThumbnailUrl || "";

      if (selectedFile) {
        thumbnailUrl = await uploadImage();
      }

      const serviceData = {
        serviceName: data.serviceName,
        serviceDescription: data.serviceDescription,
        serviceThumbnailUrl: thumbnailUrl,
      };

      await serviceService.updateService(service.data.serviceId, serviceData);

      toast({
        title: "Thành công",
        description: "Cập nhật dịch vụ thành công",
      });

      // Reset form and close dialog
      form.reset();
      resetImage();
      onClose();

      // Refresh the page to update the sidebar
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating service:", error);

      let errorMessage = "Không thể cập nhật dịch vụ";
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormLabel>Mô tả</FormLabel>
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
            <FormField
              control={form.control}
              name="serviceThumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hình ảnh dịch vụ</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center space-y-4">
                      {previewImage ? (
                        <div className="relative h-40 w-40 rounded-md overflow-hidden border">
                          <img
                            src={previewImage}
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
