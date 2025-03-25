import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Pencil, Trash2, Loader2, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import SkinTestService from '@/services/skin-test';
import SkinTestQuestionService from '@/services/skin-test-question';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Định nghĩa schema cho form
const skinTestSchema = z.object({
  testName: z.string().min(1, "Tên bài kiểm tra không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
});

// Schema cho form câu hỏi
const questionSchema = z.object({
  questionText: z.string().min(1, "Câu hỏi không được để trống"),
  optionA: z.string().min(1, "Lựa chọn A không được để trống"),
  optionB: z.string().min(1, "Lựa chọn B không được để trống"),
  optionC: z.string().min(1, "Lựa chọn C không được để trống"),
  optionD: z.string().min(1, "Lựa chọn D không được để trống"),
});

type SkinTestFormValues = z.infer<typeof skinTestSchema>;
type QuestionFormValues = z.infer<typeof questionSchema>;

interface SkinTest {
  skinTestId: number;
  testName: string;
  description: string;
  createdAt: string;
}

interface Question {
  skinTestQuestionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export default function SkinTest() {
  const [tests, setTests] = useState<SkinTest[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [currentSkinTestId, setCurrentSkinTestId] = useState<number | null>(null);
  const [currentSkinTest, setCurrentSkinTest] = useState<SkinTest | null>(null);
  const [openQuestions, setOpenQuestions] = useState<{ [id: number]: boolean }>({});
  const { toast } = useToast();
  
  const form = useForm<SkinTestFormValues>({
    resolver: zodResolver(skinTestSchema),
    defaultValues: {
      testName: "",
      description: "",
    },
  });

  const questionForm = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
    },
  });

  useEffect(() => {
    fetchSkinTests();
  }, []);

  const fetchSkinTests = async () => {
    setLoading(true);
    try {
      const data = await SkinTestService.getSkinTests();
      setTests(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi khi tải danh sách bài kiểm tra da",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsBySkinTestId = async (skinTestId: number) => {
    try {
      const data = await SkinTestQuestionService.getSkinTestQuestionsBySkinTestId(skinTestId);
      setQuestions(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi khi tải danh sách câu hỏi",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (record: SkinTest) => {
    setEditingId(record.skinTestId);
    form.reset({
      testName: record.testName,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await SkinTestService.deleteSkinTest(id);
      toast({
        title: "Thành công",
        description: "Xóa bài kiểm tra thành công",
        variant: "default",
      });
      fetchSkinTests();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi khi xóa bài kiểm tra",
        variant: "destructive",
      });
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.reset();
    setIsModalOpen(true);
  };

  const handleAddQuestion = (skinTestId: number) => {
    setCurrentSkinTestId(skinTestId);
    setEditingQuestionId(null);
    questionForm.reset();
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question.skinTestQuestionId);
    questionForm.reset({
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
    });
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await SkinTestQuestionService.deleteSkinTestQuestion(id);
      toast({
        title: "Thành công",
        description: "Xóa câu hỏi thành công",
        variant: "default",
      });
      if (currentSkinTestId) {
        fetchQuestionsBySkinTestId(currentSkinTestId);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Lỗi khi xóa câu hỏi",
        variant: "destructive",
      });
    }
  };

  const handleViewDetail = async (test: SkinTest) => {
    setCurrentSkinTest(test);
    setCurrentSkinTestId(test.skinTestId);
    await fetchQuestionsBySkinTestId(test.skinTestId);
    setIsDetailModalOpen(true);
  };

  const toggleQuestion = (id: number) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const onSubmit = async (values: SkinTestFormValues) => {
    try {
      if (editingId) {
        await SkinTestService.updateSkinTest(editingId, values);
        toast({
          title: "Thành công",
          description: "Cập nhật bài kiểm tra thành công",
          variant: "default",
        });
      } else {
        await SkinTestService.createSkinTest(values);
        toast({
          title: "Thành công",
          description: "Thêm bài kiểm tra thành công",
          variant: "default",
        });
      }
      
      setIsModalOpen(false);
      fetchSkinTests();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu bài kiểm tra",
        variant: "destructive",
      });
    }
  };

  const onSubmitQuestion = async (values: QuestionFormValues) => {
    try {
      if (editingQuestionId) {
        await SkinTestQuestionService.updateSkinTestQuestion(editingQuestionId, values);
        toast({
          title: "Thành công",
          description: "Cập nhật câu hỏi thành công",
          variant: "default",
        });
      } else if (currentSkinTestId) {
        await SkinTestQuestionService.createSkinTestQuestionForSkinTest(currentSkinTestId, values);
        toast({
          title: "Thành công",
          description: "Thêm câu hỏi thành công",
          variant: "default",
        });
      }
      
      setIsQuestionModalOpen(false);
      if (currentSkinTestId) {
        fetchQuestionsBySkinTestId(currentSkinTestId);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu câu hỏi",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Quản lý bài kiểm tra da</CardTitle>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Tên bài kiểm tra</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Câu hỏi</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.length > 0 ? (
                    tests.map((test) => (
                      <TableRow key={test.skinTestId}>
                        <TableCell>{test.skinTestId}</TableCell>
                        <TableCell>{test.testName}</TableCell>
                        <TableCell className="max-w-md whitespace-normal break-words line-clamp-3">{test.description}</TableCell>
                        <TableCell>{formatDate(test.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            className="flex items-start p-0 h-auto rounded-md hover:bg-slate-100 px-2 py-1"
                            onClick={() => handleViewDetail(test)}
                          >
                            Xem chi tiết
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEdit(test)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => handleDelete(test.skinTestId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal thêm/sửa bài kiểm tra */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Cập nhật bài kiểm tra" : "Thêm bài kiểm tra mới"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="testName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bài kiểm tra</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên bài kiểm tra" {...field} />
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
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập mô tả cho bài kiểm tra" 
                        rows={4} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Hủy</Button>
                </DialogClose>
                <Button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal thêm/sửa câu hỏi */}
      <Dialog open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingQuestionId ? "Cập nhật câu hỏi" : "Thêm câu hỏi mới"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...questionForm}>
            <form onSubmit={questionForm.handleSubmit(onSubmitQuestion)} className="space-y-4">
              <FormField
                control={questionForm.control}
                name="questionText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Câu hỏi</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập câu hỏi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={questionForm.control}
                name="optionA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lựa chọn A</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập lựa chọn A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={questionForm.control}
                name="optionB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lựa chọn B</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập lựa chọn B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={questionForm.control}
                name="optionC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lựa chọn C</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập lựa chọn C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={questionForm.control}
                name="optionD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lựa chọn D</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập lựa chọn D" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Hủy</Button>
                </DialogClose>
                <Button type="submit">{editingQuestionId ? "Cập nhật" : "Thêm mới"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal xem chi tiết bài kiểm tra */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl">
          
          {currentSkinTest && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Quiz Details</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <p className="text-sm font-medium w-28">ID:</p>
                    <p>{currentSkinTest.skinTestId}</p>
                  </div>
                  <div className="flex">
                    <p className="text-sm font-medium w-28">Name:</p>
                    <p>{currentSkinTest.testName}</p>
                  </div>
                  <div className="flex">
                    <p className="text-sm font-medium w-28">Description:</p>
                    <p className="whitespace-pre-wrap break-words">{currentSkinTest.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Questions:</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddQuestion(currentSkinTest.skinTestId)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Thêm câu hỏi
                  </Button>
                </div>

                {questions.length > 0 ? (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <Collapsible 
                        key={question.skinTestQuestionId} 
                        open={openQuestions[question.skinTestQuestionId]} 
                        onOpenChange={() => toggleQuestion(question.skinTestQuestionId)}
                        className="border rounded-md"
                      >
                        <div className="flex items-center justify-between p-4">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="flex items-center justify-between w-full">
                              <span>Question {index + 1}: {question.questionText}</span>
                              <ChevronDown className={`h-4 w-4 transition-transform ${openQuestions[question.skinTestQuestionId] ? 'rotate-180' : ''}`} />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                          <div className="p-4 pt-0 space-y-2">
                            <div className="ml-6 space-y-2">
                              <p>1. {question.optionA}</p>
                              <p>2. {question.optionB}</p>
                              <p>3. {question.optionC}</p>
                              <p>4. {question.optionD}</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditQuestion(question)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Sửa
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteQuestion(question.skinTestQuestionId)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <p>Chưa có câu hỏi nào</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button>Đóng</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
