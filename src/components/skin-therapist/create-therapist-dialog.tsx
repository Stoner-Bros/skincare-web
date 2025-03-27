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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SkinTherapistService from "@/services/skin-therapist.services";
import { toast } from "@/hooks/use-toast";

// Schema chỉ chứa các trường được yêu cầu
const createFormSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  specialization: z.string().min(2, "Chuyên môn phải có ít nhất 2 ký tự"),
  experience: z.string().min(2, "Kinh nghiệm phải có ít nhất 2 ký tự"),
  introduction: z.string().min(10, "Giới thiệu phải có ít nhất 10 ký tự"),
  bio: z.string().min(10, "Tiểu sử phải có ít nhất 10 ký tự"),
});

export type CreateFormValues = z.infer<typeof createFormSchema>;

interface CreateTherapistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTherapistDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateTherapistDialogProps) {
  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      specialization: "",
      experience: "",
      introduction: "",
      bio: "",
    },
  });

  const handleCreateTherapist = async (values: CreateFormValues) => {
    try {
      await SkinTherapistService.createSkinTherapist(values);
      onClose();
      createForm.reset();
      onSuccess();
      toast({
        title: "Thành công",
        description: "Tạo chuyên viên da thành công",
      });
    } catch (error) {
      console.error("Error creating skin therapist:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo chuyên viên da",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Thêm Chuyên Viên Da Mới
          </DialogTitle>
        </DialogHeader>
        <Form {...createForm}>
          <div className="max-h-[75vh] px-1 overflow-y-auto">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="account">Tài khoản</TabsTrigger>
                <TabsTrigger value="professional">
                  Thông tin chuyên môn
                </TabsTrigger>
              </TabsList>

              {/* Tab Tài khoản */}
              <TabsContent value="account" className="pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={createForm.control}
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

                    <FormField
                      control={createForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu *</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Nhập mật khẩu"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
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
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab Thông tin chuyên môn */}
              <TabsContent value="professional" className="pt-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chuyên Môn *</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập chuyên môn" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
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
                      control={createForm.control}
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
                      control={createForm.control}
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={createForm.handleSubmit(handleCreateTherapist)}>
              Tạo Chuyên Viên
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
