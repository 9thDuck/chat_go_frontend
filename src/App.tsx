import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="h-16 p-8"> </div>
      <Outlet />
      <Toaster />
    </div>
  );
}

export default App;
