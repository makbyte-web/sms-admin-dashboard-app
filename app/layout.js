"use client";
import "./globals.css";
import { ThemeProvider } from "@/context/themeContext";
import { UserContextProvider } from "@/context/UserContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" title="School Admin Dashboard">
      <body>
        <UserContextProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
