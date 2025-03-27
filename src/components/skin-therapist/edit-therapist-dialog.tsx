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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import SkinTherapistService from "@/services/skin-therapist.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const editFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  specialization: z
    .string()
    .min(2, "Specialization must be at least 2 characters"),
  experience: z.string().min(2, "Experience must be at least 2 characters"),
  introduction: z
    .string()
    .min(10, "Introduction must be at least 10 characters")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .optional()
    .or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional()
    .or(z.literal("")),
  dob: z.string().optional().or(z.literal("")),
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
  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
      specialization: "",
      experience: "",
      introduction: "",
      bio: "",
      phone: "",
      address: "",
      dob: "",
      otherInfo: "",
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (therapist && isOpen) {
      editForm.reset({
        email: therapist.account.email,
        fullName: therapist.account.accountInfo.fullName,
        specialization: therapist.specialization,
        experience: therapist.experience,
        introduction: therapist.introduction || "",
        bio: therapist.bio || "",
        avatar: therapist.account.accountInfo.avatar || "",
        phone: therapist.account.accountInfo.phone || "",
        address: therapist.account.accountInfo.address || "",
        dob: therapist.account.accountInfo.dob || "",
        otherInfo: therapist.account.accountInfo.otherInfo || "",
        isAvailable: therapist.isAvailable,
      });
    }
  }, [therapist, isOpen, editForm]);

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
        title: "Success",
        description: "Skin therapist updated successfully",
      });
    } catch (error) {
      console.error("Error updating skin therapist:", error);
      toast({
        title: "Error",
        description: "Failed to update skin therapist",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Edit Skin Therapist</DialogTitle>
        </DialogHeader>
        <Form {...editForm}>
          <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
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
                        <Input placeholder="Enter email" {...field} />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
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
                      <FormLabel>Date of Birth</FormLabel>
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Professional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter specialization" {...field} />
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
                      <FormLabel>Experience *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter experience" {...field} />
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
                    <FormLabel>Introduction</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter introduction" {...field} />
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
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <FormField
                control={editForm.control}
                name="otherInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Information</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter other information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Availability</FormLabel>
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={editForm.handleSubmit(handleEditTherapist)}>
              Update Therapist
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
