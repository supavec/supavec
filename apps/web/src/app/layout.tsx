import "@/styles/tailwind.css";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { APP_NAME } from "./consts";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import { CSPostHogProvider } from "./providers";
import { ThemeReceiver } from "@/components/theme-receiver";

import { PreviewcnDevtools } from "@/components/ui/previewcn";
export const metadata: Metadata = {
  title: {
    template: `%s - ${APP_NAME}`,
    default: `${APP_NAME} - The open source RAG as a Service platform.`,
  },
  metadataBase: new URL("https://www.supavec.com"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <CSPostHogProvider>
        <body className="min-h-screen bg-background antialiased w-full mx-auto scroll-smooth font-sans">
          {process.env.NODE_ENV === "development" && <PreviewcnDevtools />}
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors />
          </ThemeProvider>
          {process.env.NODE_ENV === "development" && <ThemeReceiver />}
        </body>
      </CSPostHogProvider>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!} />
    </html>
  );
}
