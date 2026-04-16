import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { TabNav } from "@/components/TabNav";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "CatMan Cockpit - Delivery Hero",
  description: "Category Management Cockpit for Delivery Hero",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dh-gray">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <SidebarWrapper />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <nav className="text-sm text-gray-500">
                <span className="text-gray-400">All Categories</span>
                <span className="mx-2">›</span>
                <span className="text-dh-blue font-medium">Beverages & Dairy</span>
              </nav>
              <div className="text-sm text-gray-500">
                Last 7 days
              </div>
            </div>
            <TabNav />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

// Server component wrapper for sidebar
function SidebarWrapper() {
  return (
    <div className="w-64 shrink-0">
      <div className="h-full bg-dh-blue text-white">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <div className="w-8 h-8 bg-dh-red rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold">DH</span>
          </div>
          <span className="font-semibold text-white">CatMan Cockpit</span>
        </div>
        <nav className="p-4">
          <div className="mb-6">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Overview</h3>
            <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm">Performance</span>
            </a>
          </div>
          <div className="mb-6">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">SKU Management</h3>
            <div className="space-y-1">
              <a href="/sku-tower" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-sm">SKU Tower</span>
              </a>
              <a href="/assortment" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Assortment</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Engines</h3>
            <div className="space-y-1">
              <a href="/price" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm">Price & Promo</span>
              </a>
              <a href="/lifecycle" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">Lifecycle</span>
              </a>
              <a href="/profitability" className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Profitability</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}