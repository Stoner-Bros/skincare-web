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
        title: "Success",
        description: "Skin therapist deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting skin therapist:", error);
      toast({
        title: "Error",
        description: "Failed to delete skin therapist",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Skin Therapist</DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-muted-foreground">
            Are you sure you want to delete this skin therapist? This action
            cannot be undone.
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
