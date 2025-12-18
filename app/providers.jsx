'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import store, { persistor } from '@/store/store';
import { useRouter } from 'next/navigation';
import { setAxiosRouter, setStoreReference } from '@/lib/instance';
import { useCrossTabAuth } from '@/features/auth/hooks';
import { logout } from '@/features/auth/redux/authSlice';

const AuthSetupWrapper = ({ children }) => {
  const router = useRouter();

  // Setup axios router and store reference
  useEffect(() => {
    setAxiosRouter(router);
    setStoreReference(store, logout);
  }, [router]);

  // Setup cross-tab auth
  useCrossTabAuth();

  return <>{children}</>;
};

export default function Providers({ children }) {
  // Prevent query client from re-creating on each render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          refetchOnWindowFocus: false,
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
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
