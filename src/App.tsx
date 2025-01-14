import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes";
import { SidebarProvider } from "./components/ui/sidebar";

function App() {
  return (
    <>
      <SidebarProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </SidebarProvider>
    </>
  );
}

export default App;
