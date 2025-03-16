import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.tsx";
import { ReactQueryClientProvider } from "./providers/ReactQueryClientProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryClientProvider>
      <RouterProvider router={router} />
    </ReactQueryClientProvider>
  </StrictMode>
);
