import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import AppRouter from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";

function App() {
  console.log("test commit");
  return (
    <>
      <SidebarProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AuthProvider>
      </SidebarProvider>
      <Toaster />
    </>
  );
}

export default App;
