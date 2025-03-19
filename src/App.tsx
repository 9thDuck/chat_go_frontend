import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import useThemeStore from "./store/useThemeStore";

function App() {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen" data-theme={theme}>
      <Navbar />
      <div className="h-16 p-8"> </div>
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
