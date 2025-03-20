import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import AppRouter from "./routes";

function App() {
  console.log("test commit");
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
