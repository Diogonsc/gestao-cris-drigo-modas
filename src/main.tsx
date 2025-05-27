import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SEOProvider } from "./providers/SEOProvider";
import { AppProvider } from "./providers/app-provider";
import App from "./App";
import "./index.css";

async function prepare() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start({
      onUnhandledRequest: "bypass", // Ignora requisições não tratadas
    });
  }
}

prepare().then(() => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
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
