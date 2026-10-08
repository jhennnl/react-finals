import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./auth";
import { ModalProvider } from "./components/Modal";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </AuthProvider>
  </StrictMode>
);
