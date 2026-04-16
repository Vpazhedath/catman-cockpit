import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { TabNav } from "@/components/TabNav";

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
        <main className="p-6">
          {children}
        </main>
      </body>
    </html>
  );
}