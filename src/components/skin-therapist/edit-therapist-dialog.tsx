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
import { Textarea } from "@/components/ui/textarea"; // Thêm Textarea cho nội dung dài
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card"; // Thêm Card để phân nhóm
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Thêm Tabs
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Thêm Avatar
import { toast } from "@/hooks/use-toast";
import SkinTherapistService from "@/services/skin-therapist.services";
import UploadService from "@/services/upload.services"; // Thêm import UploadService
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Upload, ImageIcon, RefreshCw } from "lucide-react";

const editFormSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  specialization: z.string().min(2, "Chuyên môn phải có ít nhất 2 ký tự"),
  experience: z.string().min(2, "Kinh nghiệm phải có ít nhất 2 ký tự"),
  introduction: z.string().min(10, "Giới thiệu phải có ít nhất 10 ký tự"),
  bio: z.string().min(10, "Tiểu sử phải có ít nhất 10 ký tự").optional(),
  avatar: z.string().optional(),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  dob: z.string().nonempty("Ngày sinh là bắt buộc"),
  otherInfo: z.string().optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
});

export type EditFormValues = z.infer<typeof editFormSchema>;

interface EditTherapistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  therapist: any | null;
}

export default function EditTherapistDialog({
  isOpen,
  onClose,
  onSuccess,
  therapist,
}: EditTherapistDialogProps) {
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      specialization: "",
      experience: "",
      introduction: "",
      bio: "",
      avatar: "",
      phone: "",
      address: "",
      dob: "",
      otherInfo: "",
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (therapist && isOpen) {
      const avatarUrl = therapist.account.accountInfo.avatar || "";
      setAvatarPreview(avatarUrl);

      editForm.reset({
        email: therapist.account.email,
        fullName: therapist.account.accountInfo.fullName,
        specialization: therapist.specialization,
        experience: therapist.experience,
        introduction: therapist.introduction || "",
        bio: therapist.bio || "",
        avatar: avatarUrl,
        phone: therapist.account.accountInfo.phone || "",
        address: therapist.account.accountInfo.address || "",
        dob: therapist.account.accountInfo.dob || "",
        otherInfo: therapist.account.accountInfo.otherInfo || "",
        isAvailable: therapist.isAvailable,
      });
    }
  }, [therapist, isOpen, editForm]);

  // Xử lý tải lên ảnh đại diện
  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Đọc file thành định dạng base64 để preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);

      // Tải lên file lên server
      const response = await UploadService.uploadImage(file);
      // Lấy fileName từ response để lưu vào trường avatar
      const fileName = response.data.fileName;
      editForm.setValue("avatar", fileName);
      setIsUploading(false);

      toast({
        title: "Thành công",
        description: "Tải lên ảnh đại diện thành công",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setIsUploading(false);
      toast({
        title: "Lỗi",
        description: "Không thể tải lên ảnh đại diện",
        variant: "destructive",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleEditTherapist = async (values: EditFormValues) => {
    if (!therapist) return;
    try {
      await SkinTherapistService.updateSkinTherapist(therapist.accountId, {
        ...values,
        accountInfo: {
          ...therapist.account.accountInfo,
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          dob: values.dob,
          otherInfo: values.otherInfo,
          avatar: values.avatar,
        },
      });
      onClose();
      onSuccess();
      toast({
        title: "Thành công",
        description: "Cập nhật chuyên viên da thành công",
      });
    } catch (error) {
      console.error("Error updating skin therapist:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật chuyên viên da",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chỉnh Sửa Chuyên Viên Da
          </DialogTitle>
        </DialogHeader>
        <Form {...editForm}>
          <div className="max-h-[75vh] px-1 overflow-y-auto">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="professional">
                  Thông tin chuyên môn
                </TabsTrigger>
                <TabsTrigger value="additional">Thông tin bổ sung</TabsTrigger>
              </TabsList>

              {/* Tab Thông tin cá nhân */}
              <TabsContent value="personal" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Avatar upload section */}
                      <div className="flex flex-col items-center mb-6">
                        <FormField
                          control={editForm.control}
                          name="avatar"
                          render={({ field }) => (
                            <FormItem className="flex flex-col items-center">
                              <FormLabel className="mb-2">
                                Ảnh đại diện
                              </FormLabel>
                              <FormControl>
                                <div className="flex flex-col items-center gap-4">
                                  {/* Avatar preview */}
                                  <Avatar
                                    className="w-24 h-24 cursor-pointer relative group"
                                    onClick={triggerFileInput}
                                  >
                                    {avatarPreview ? (
                                      <AvatarImage
                                        src={avatarPreview}
                                        className="object-cover"
                                      />
                                    ) : (
                                      <AvatarFallback className="bg-primary/10">
                                        <ImageIcon className="w-8 h-8 text-primary" />
                                      </AvatarFallback>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      {isUploading ? (
                                        <RefreshCw className="w-8 h-8 text-white animate-spin" />
                                      ) : (
                                        <Upload className="w-8 h-8 text-white" />
                                      )}
                                    </div>
                                  </Avatar>

                                  {/* Hidden file input */}
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                      handleAvatarUpload(e);
                                      // Cần đảm bảo field.onChange được gọi nếu cần thiết
                                      field.onChange(e.target.value);
                                    }}
                                    // Không sử dụng {...field} vì nó sẽ ghi đè lên ref và onChange
                                    // thay vào đó gán name và onBlur từ field nếu cần
                                    name={field.name}
                                    onBlur={field.onBlur}
                                    // Input file không thể có value="" khi đã chọn file
                                  />

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={triggerFileInput}
                                    disabled={isUploading}
                                  >
                                    {isUploading
                                      ? "Đang tải lên..."
                                      : "Tải lên ảnh"}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={editForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Họ Tên *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập họ tên" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={editForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={editForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số Điện Thoại *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập số điện thoại"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={editForm.control}
                          name="dob"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày Sinh *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={editForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa Chỉ *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập địa chỉ" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Thông tin chuyên môn */}
              <TabsContent value="professional" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={editForm.control}
                          name="specialization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chuyên Môn *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập chuyên môn"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={editForm.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kinh Nghiệm *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập kinh nghiệm"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={editForm.control}
                        name="introduction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giới Thiệu *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập giới thiệu ngắn gọn về chuyên viên"
                                className="resize-none min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiểu Sử *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập tiểu sử chi tiết của chuyên viên"
                                className="resize-none min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Thông tin bổ sung */}
              <TabsContent value="additional" className="pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <FormField
                        control={editForm.control}
                        name="otherInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thông Tin Khác</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Các thông tin bổ sung khác (nếu có)"
                                className="resize-none min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editForm.control}
                        name="isAvailable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Trạng Thái Hoạt Động
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Chọn trạng thái hiển thị của chuyên viên
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={editForm.handleSubmit(handleEditTherapist)}>
              Cập Nhật
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
