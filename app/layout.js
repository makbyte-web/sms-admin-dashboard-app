import "./globals.css";
import { ThemeProvider } from "@/context/themeContext";
import { UserContextProvider } from "@/context/UserContext";
export const metadata = {
  title: "School Management Dashboard",
  description:
    "A modern and efficient school management system built for administrators, teachers, and students.",
};
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
