import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import useThemeStore from "@/store/useThemeStore";

function Layout() {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen flex flex-col" data-theme={theme}>
      <Navbar />
      <main className="flex-1 pt-14 sm:pt-16 flex min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

export default Layout;
