import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { Image, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/use-toast";
import blogService from "@/services/blog.services";

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  thumbnailUrl: z.string().optional(),
  tags: z.string().min(1, "Tags không được để trống"),
});

type FormValues = z.infer<typeof formSchema>;

type AddBlogProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddBlog({ open, onClose }: AddBlogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [mdContent, setMdContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnailUrl: "",
      tags: "",
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setThumbnailFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    try {
      // Upload file ngay lập tức
      const formData = new FormData();
      formData.append("file", file);
      
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
      
      const responseData = await response.json();
      const thumbnailUrl = responseData.data.fileName;
      form.setValue("thumbnailUrl", thumbnailUrl);
      
      // Chèn hình ảnh vào nội dung Markdown
      const imageMarkdown = `![image](${import.meta.env.VITE_API_URL}/upload/${thumbnailUrl})`;
      const newContent = mdContent ? `${mdContent}\n${imageMarkdown}` : imageMarkdown;
      setMdContent(newContent);
      form.setValue("content", newContent);
      
      toast({
        title: "Thành công",
        description: "Hình ảnh đã được tải lên",
      });
    } catch (error) {
      console.error("Lỗi khi tải hình ảnh:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải hình ảnh lên. Vui lòng thử lại sau.",
      });
    }
    
    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Sử dụng thumbnailUrl đã được set từ handleFileChange
      let thumbnailUrl = data.thumbnailUrl || "";
      
      // Tạo đối tượng request để gửi đến API
      const blogData: any = {
        title: data.title,
        content: mdContent || data.content,
        thumbnailUrl: thumbnailUrl,
        tags: data.tags,
        isPublished: false
      };

      // Sử dụng blogService thay vì gọi API trực tiếp
      await blogService.createBlog(blogData);
      
      toast({
        title: "Thành công",
        description: "Đã thêm bài viết mới thành công",
      });
      
      // Reset form và đóng modal
      resetForm();
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm bài viết:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm bài viết. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setMdContent("");
    setThumbnailFile(null);
    setPreviewUrl("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold">Thêm bài viết mới</h1>
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề bài viết" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tags" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tips Làm đẹp">Tips Làm đẹp</SelectItem>
                          <SelectItem value="Tin Tức">Tin Tức</SelectItem>
                          <SelectItem value="Trải nghiệm dịch vụ">Trải nghiệm dịch vụ</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="block mb-2">Nội dung</FormLabel>
                <div className="flex items-center mb-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Thêm hình ảnh
                  </Button>
                </div>
                <div data-color-mode="light">
                  <MDEditor
                    value={mdContent}
                    onChange={(value) => {
                      setMdContent(value || "");
                      form.setValue("content", value || "");
                    }}
                    height={350}
                    preview="live"
                  />
                </div>
                {form.formState.errors.content && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </FormItem>

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
                    "Thêm bài viết"
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
