import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import SkinTherapistService from "@/services/skin-therapist.services";

interface DeleteTherapistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  therapistId: number | null;
}

export default function DeleteTherapistDialog({
  isOpen,
  onClose,
  onSuccess,
  therapistId,
}: DeleteTherapistDialogProps) {
  const handleDelete = async () => {
    if (!therapistId) return;
    try {
      await SkinTherapistService.deleteSkinTherapist(therapistId);
      onClose();
      onSuccess();
      toast({
        title: "Thành công",
        description: "Đã xóa chuyên viên da thành công",
      });
    } catch (error) {
      console.error("Error deleting skin therapist:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa chuyên viên da",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Xóa Chuyên Viên Da</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa chuyên viên da này? Hành động này không
            thể hoàn tác.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
