import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useCheckAuth } from "./hooks/useCheckAuth";
import { Toaster } from "sonner";

function App() {
  const { isCheckingAuth, authenticated } = useCheckAuth();

  if (isCheckingAuth && !authenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loading-md loading-ring"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
