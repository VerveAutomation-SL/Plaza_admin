import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { DropdownProvider } from '@/context/DropdownContext';
import { Toaster } from 'react-hot-toast';
import AccessControlWrapper from '@/components/auth/AccessControlWrapper';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <DropdownProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    marginTop: "4rem",
                    zIndex: 99999,
                  },
                }}
              />
              <AccessControlWrapper>
                {children}
              </AccessControlWrapper>
            </DropdownProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
