import "./globals.css";
import { ThemeProvider } from "@/context/themeContext";
import { UserContextProvider } from "@/context/UserContext";
import packageInfo from '@/package.json'

export const metadata = {
  title: "MAK {Byte} SMS Dashboard",
  description:
    "A modern and efficient school management system built for school administrators, teachers and students. App developed and maintained by MAK {Byte} Team.",
};
export default function RootLayout({ children }) {

  // Added version in meta tag for app version tracking and DOM visibility
  const { version } = packageInfo

  return (
    <html lang="en" className="scroll-smooth" title="MAK {Byte} SMS Dashboard">
      <head>
        <meta name='version' content={version ? version : ''}/>
      </head>
      <body>
        <UserContextProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </UserContextProvider>
      </body>
    </html>
  );
}
