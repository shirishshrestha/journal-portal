"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import store, { persistor } from "@/store/store";
import { useRouter } from "next/navigation";
import { setAxiosRouter } from "@/lib/instance";
import { useCrossTabAuth } from "@/features/auth/hooks";

const AuthSetupWrapper = ({ children }) => {
  const router = useRouter();

  // Setup axios router
  useEffect(() => {
    setAxiosRouter(router);
  }, [router]);

  // Setup cross-tab auth
  useCrossTabAuth();

  return <>{children}</>;
};

export default function Providers({ children }) {
  // Prevent query client from re-creating on each render
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AuthSetupWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </AuthSetupWrapper>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
