import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: "#FFFFFF",
            color: "#111111",
            border: "1px solid rgba(84, 198, 157, 0.45)",
            borderRadius: "12px",
            boxShadow: "0 10px 26px rgba(17, 17, 17, 0.12)",
            padding: "14px 16px",
          },
          success: { iconTheme: { primary: "#54C69D", secondary: "#111111" } },
          error: { iconTheme: { primary: "#D9534F", secondary: "#FFFFFF" } },
        }}
      />
    </>
  </StrictMode>,
);
