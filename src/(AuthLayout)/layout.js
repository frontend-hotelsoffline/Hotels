import MainLayout from "./components/Layout/MainLayout";
import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hotels Offline",
  description: "Hotels",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" to="/Login.jpeg" type="image" sizes="any" />
      <body className={inter.className}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
