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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SkinTherapistService from "@/services/skin-therapist.services";
import { toast } from "@/hooks/use-toast";

const createFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
      phone: "",
      address: "",
      dob: "",
      otherInfo: "",
      isAvailable: true,
    },
  });

  const handleCreateTherapist = async (values: CreateFormValues) => {
    try {
      await SkinTherapistService.createSkinTherapist(values);
      onClose();
      createForm.reset();
      onSuccess();
      toast({
        title: "Success",
        description: "Skin therapist created successfully",
      });
    } catch (error) {
      console.error("Error creating skin therapist:", error);
      toast({
        title: "Error",
        description: "Failed to create skin therapist",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Skin Therapist</DialogTitle>
        </DialogHeader>
        <Form {...createForm}>
          <div className="space-y-6 max-h-[70vh] px-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={createForm.control}
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
              <FormField
                control={createForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={createForm.control}
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
                control={createForm.control}
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={createForm.control}
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
              <FormField
                control={createForm.control}
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
            </div>
            <FormField
              control={createForm.control}
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={createForm.control}
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
                control={createForm.control}
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
            <FormField
              control={createForm.control}
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
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={createForm.handleSubmit(handleCreateTherapist)}>
              Create Therapist
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
