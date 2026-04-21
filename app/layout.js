import SideBar from "@/component/sidebar";
import Header from "@/component/header";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from '@/component/theme-provider';
import "./globals.css";

export const metadata = {
  title: 'FinDash — Finance Analytics',
  description: 'CFO-grade financial analytics platform',
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen bg-background overflow-hidden text-foreground">
        <ThemeProvider>
          {/* Sidebar */}
          <SideBar />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
            <Header />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
              <NuqsAdapter>
                {children}
              </NuqsAdapter>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}