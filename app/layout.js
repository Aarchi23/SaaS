import SideBar from "@/component/sidebar";
import Header from "@/component/header";   
import "./globals.css";
export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-white overflow-hidden text-slate-800">
        
        {/* Sidebar: Now properly separated from the route logic */}
        <SideBar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          
          <Header />

          {/* Main Content Area: This is where your OverviewPage (children) lives */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-white">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}