import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "@/provider/socketProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ChatApp",
  description: "Realtime chat application",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full bg-[#0f1117] text-[#e2e8f0] font-[var(--font-inter)] antialiased overflow-hidden">
        <div className="h-full flex flex-col">
          <SocketProvider>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </SocketProvider>
        </div>
      </body>
    </html>
  );
}