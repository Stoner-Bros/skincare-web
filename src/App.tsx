import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import AppRouter from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { BookingProvider } from "./context/BookingContext";

function App() {
  return (
    <>
      <SidebarProvider>
        <AuthProvider>
          <BookingProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </BookingProvider>
        </AuthProvider>
      </SidebarProvider>
      <Toaster />
    </>
  );
}

export default App;
