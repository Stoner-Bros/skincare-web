import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import serviceService from "@/services/service.services";
import skinTestAnswerService from "@/services/skin-test-answer";
import skinTestQuestionService from "@/services/skin-test-question";
import treatmentService from "@/services/treatment.services";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ViewResultDetailProps {
  answerId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewResultDetail({
  answerId,
  isOpen,
  onClose,
}: ViewResultDetailProps) {
  const [loading, setLoading] = useState(true);
  const [resultDetail, setResultDetail] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const { toast } = useToast();

  // States for Recommendation
  const [isAddRecommendationOpen, setIsAddRecommendationOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedTreatment, setSelectedTreatment] = useState<string>("");
  const [minScore, setMinScore] = useState<string>("");
  const [maxScore, setMaxScore] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingTreatments, setIsLoadingTreatments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && answerId) {
      fetchResultDetail(answerId);
    } else {
      // Reset dữ liệu khi đóng modal
      setResultDetail(null);
      setQuestions([]);
    }
  }, [isOpen, answerId]);

  // Fetch Services for dropdown
  useEffect(() => {
    if (isAddRecommendationOpen) {
      fetchServices();
    }
  }, [isAddRecommendationOpen]);

  // Fetch Treatments based on service selection
  useEffect(() => {
    if (selectedService) {
      fetchTreatmentsByServiceId(parseInt(selectedService));
    } else {
      setTreatments([]);
      setSelectedTreatment("");
    }
  }, [selectedService]);

  const fetchServices = async () => {
    try {
      setIsLoadingServices(true);
      const servicesData = await serviceService.getServices();
      console.log("Danh sách dịch vụ:", servicesData);

      // Xử lý đúng dạng dữ liệu trả về từ API
      if (Array.isArray(servicesData)) {
        setServices(servicesData);
      } else if (servicesData && servicesData.items) {
        setServices(servicesData.items);
      } else {
        setServices([]);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách dịch vụ",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách dịch vụ từ API",
        variant: "destructive",
      });
    } finally {
      setIsLoadingServices(false);
    }
  };

  const fetchTreatmentsByServiceId = async (serviceId: number) => {
    try {
      setIsLoadingTreatments(true);
      const treatmentsData = await treatmentService.getTreatments(serviceId);
      console.log("Danh sách liệu trình:", treatmentsData);

      setTreatments(treatmentsData?.data?.items);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách liệu trình:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách liệu trình từ API",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTreatments(false);
    }
  };

  const handleAddRecommendation = () => {
    setIsAddRecommendationOpen(true);
  };

  const handleRecommendationCancel = () => {
    setIsAddRecommendationOpen(false);
    resetRecommendationForm();
  };

  const resetRecommendationForm = () => {
    setSelectedService("");
    setSelectedTreatment("");
    setMinScore("");
    setMaxScore("");
    setDescription("");
    setDuration("");
  };

  const handleRecommendationSubmit = async () => {
    if (!selectedTreatment || !answerId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn dịch vụ và liệu trình",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      

      toast({
        title: "Thành công",
        description: "Đã thêm khuyến nghị thành công",
        variant: "default",
      });

      handleRecommendationCancel();
    } catch (error) {
      console.error("Lỗi khi tạo khuyến nghị:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo khuyến nghị. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchResultDetail = async (id: number) => {
    try {
      setLoading(true);
      console.log(`Đang lấy dữ liệu cho bài kiểm tra với ID: ${id}`);

      // Lấy thông tin bài làm từ API
      const resultData = await skinTestAnswerService.getSkinTestAnswerById(id);
      setResultDetail(resultData);

      // Log thông tin để debug
      console.log("Dữ liệu kết quả bài kiểm tra:", {
        answerId: resultData?.answerId,
        skinTestId: resultData?.skinTestId,
        answers: resultData?.answers,
      });

      // Nếu có skinTestId, lấy danh sách câu hỏi
      if (resultData.skinTestId) {
        try {
          const questionsData =
            await skinTestQuestionService.getSkinTestQuestionsBySkinTestId(
              resultData.skinTestId
            );
          setQuestions(questionsData);
          console.log("Danh sách câu hỏi:", questionsData);
          console.log("Danh sách câu trả lời:", resultData.answers);
        } catch (err) {
          console.error("Lỗi khi lấy câu hỏi từ API:", err);
          setQuestions([]);
          toast({
            title: "Lỗi",
            description: "Không thể lấy danh sách câu hỏi từ API",
            variant: "destructive",
          });
        }
      } else {
        console.warn("Không có skinTestId trong kết quả");
        toast({
          title: "Cảnh báo",
          description: "Không tìm thấy thông tin bài kiểm tra",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết kết quả:", error);
      setResultDetail(null);
      setQuestions([]);
      toast({
        variant: "destructive",
        title: "Có lỗi xảy ra",
        description:
          "Không thể tải chi tiết kết quả bài kiểm tra. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm kết hợp câu hỏi và câu trả lời
  const getQuestionWithAnswer = () => {
    if (
      !resultDetail ||
      !questions.length ||
      !Array.isArray(resultDetail.answers)
    ) {
      console.log("Không có dữ liệu câu hỏi hoặc câu trả lời");
      return [];
    }

    console.log("Kết hợp câu hỏi và câu trả lời:", {
      questions: questions.length,
      answers: resultDetail.answers.length,
    });

    return questions.map((question, index) => {
      const answer =
        index < resultDetail.answers.length
          ? resultDetail.answers[index]
          : "Không có câu trả lời";
      return {
        question,
        answer,
      };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bài kiểm tra da</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <span className="sr-only">Đóng</span>
          </DialogClose>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">
                {resultDetail?.skinTest?.testName || "Bài kiểm tra da"}
              </h3>
              <p className="text-sm text-gray-500">
                {resultDetail?.skinTest?.description ||
                  "Kết quả và câu trả lời bài kiểm tra da của khách hàng"}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Danh sách câu hỏi và câu trả lời:</h4>

              {getQuestionWithAnswer().length > 0 ? (
                getQuestionWithAnswer().map((item, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="font-medium mb-2">
                      Câu hỏi {index + 1}: {item.question.questionText}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-gray-100 p-2 rounded text-sm">
                        A: {item.question.optionA}
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-sm">
                        B: {item.question.optionB}
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-sm">
                        C: {item.question.optionC}
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-sm">
                        D: {item.question.optionD}
                      </div>
                    </div>
                    <div className="bg-green-100 p-2 rounded">
                      <span className="font-medium">Câu trả lời: </span>
                      {item.answer}
                    </div>
                  </div>
                ))
              ) : resultDetail?.answers && resultDetail.answers.length > 0 ? (
                // Nếu không có câu hỏi nhưng có câu trả lời, hiển thị dạng đơn giản
                resultDetail.answers.map((answer: string, index: number) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="font-medium mb-2">Câu hỏi {index + 1}</div>
                    <div className="bg-green-100 p-2 rounded">
                      <span className="font-medium">Câu trả lời: </span>
                      {answer}
                    </div>
                  </div>
                ))
              ) : (
                <div className="border border-red-200 rounded-md p-4 bg-red-50">
                  <p className="text-gray-800 font-medium">
                    Không tìm thấy dữ liệu
                  </p>
                  <p className="text-gray-500">
                    Không có dữ liệu câu hỏi và câu trả lời
                  </p>
                  <p className="text-gray-500 mt-2">Thông tin debug:</p>
                  <ul className="text-gray-500 list-disc pl-5">
                    <li>Số câu hỏi: {questions.length}</li>
                    <li>
                      Câu trả lời:{" "}
                      {resultDetail?.answers
                        ? `${resultDetail.answers.length} câu trả lời`
                        : "Không có dữ liệu"}
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={handleAddRecommendation}>
                Thêm Khuyến Nghị
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Add Recommendation Modal */}
      <Dialog
        open={isAddRecommendationOpen}
        onOpenChange={setIsAddRecommendationOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Khuyến Nghị</DialogTitle>
            <DialogClose
              className="absolute right-4 top-4"
              onClick={handleRecommendationCancel}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Đóng</span>
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service">Dịch vụ</Label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
                disabled={isLoadingServices}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem
                      key={service.serviceId}
                      value={service.serviceId.toString()}
                    >
                      {service.serviceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingServices && (
                <p className="text-sm text-gray-500">Đang tải dịch vụ...</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Liệu trình</Label>
              <Select
                value={selectedTreatment}
                onValueChange={setSelectedTreatment}
                disabled={isLoadingTreatments || !selectedService}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn liệu trình" />
                </SelectTrigger>
                <SelectContent>
                  {treatments.map((treatment) => (
                    <SelectItem
                      key={treatment.treatmentId}
                      value={treatment.treatmentId.toString()}
                    >
                      {treatment.treatmentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingTreatments && (
                <p className="text-sm text-gray-500">Đang tải liệu trình...</p>
              )}
              {!selectedService && (
                <p className="text-sm text-gray-500">
                  Vui lòng chọn dịch vụ trước
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả khuyến nghị"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Thời gian (phút)</Label>
              <Input
                id="duration"
                placeholder="Thời gian dự kiến (phút)"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                type="number"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minScore">Điểm tối thiểu</Label>
                <Input
                  id="minScore"
                  placeholder="Nhập điểm tối thiểu"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxScore">Điểm tối đa</Label>
                <Input
                  id="maxScore"
                  placeholder="Nhập điểm tối đa"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  type="number"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleRecommendationCancel}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                onClick={handleRecommendationSubmit}
                disabled={isSubmitting || !selectedTreatment}
              >
                {isSubmitting ? "Đang xử lý..." : "Thêm Khuyến Nghị"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
