import "./globals.css";
import "./utils/i18n";

import { NuqsAdapter } from "nuqs/adapters/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import App from "./App";
import { ThemeProvider } from "./providers/NextThemesProvider";
import QueryProvider from "./providers/QueryProvider";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/seller">
      <NuqsAdapter>
        <QueryProvider>
          <ThemeProvider 
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          >
            <App />
          <Toaster  richColors position="top-center"/>
          </ThemeProvider>
        </QueryProvider>
      </NuqsAdapter>
    </BrowserRouter>
  </StrictMode>
);
