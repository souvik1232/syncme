import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./LocalisationProvider";
import { ThemeProvider } from "./context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const locale = "en";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider><Providers>{children}</Providers></ThemeProvider>
      </body>
    </html>
  );
}
