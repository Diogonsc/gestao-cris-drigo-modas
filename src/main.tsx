import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SEOProvider } from "./providers/SEOProvider";
import { AppProvider } from "./providers/app-provider";
import App from "./App";
import "./index.css";

// Configuração das flags futuras do React Router v7
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass", // Ignora requisições não tratadas
    });
  }
}

void prepare().then(() => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter {...router}>
        <AppProvider>
          <SEOProvider>
            <App />
          </SEOProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </AppProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
});
