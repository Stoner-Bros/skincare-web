import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/login-form";
import SignUpForm from "../../components/sign-up-form";

export type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
};

export default function AuthDialog({
  open,
  onOpenChange,
  defaultTab = "login",
}: AuthDialogProps) {
  const navigate = useNavigate();

  // Handle dialog close by updating the URL without the query parameter
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Remove auth-related query params when dialog is closed
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      navigate(url.pathname + url.search, { replace: true });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-pink-500">
            Chào mừng bạn
          </DialogTitle>
          <DialogDescription className="text-center">
            Đăng nhập hoặc đăng ký để trải nghiệm dịch vụ tốt nhất
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Đăng nhập</TabsTrigger>
            <TabsTrigger value="signup">Đăng ký</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-0">
            <LoginForm onSuccess={() => handleOpenChange(false)} />
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <SignUpForm onSuccess={() => handleOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
