import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });
import toast, { Toaster } from 'react-hot-toast';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 ${inter.className}`}
      >
          <div className="max-w-2xl mx-auto py-10 px-4">
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <Link href="https://manuel-navarro.netlify.app/" target="_blank">
                  <Image src="/logo.svg" alt="logo" width={50} height={50}/>
                </Link>
                <nav className="ml-auto text-sm font-medium space-x-6">
                  <Link href="/">Home</Link>
                  <Link href="/products">Productos</Link>
                </nav>
              </div>
            </header>
            <main>{children}</main>
          </div>
          <Toaster />
      </body>
    </html>
  );
}
