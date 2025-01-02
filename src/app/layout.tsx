import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"

// fonts
const poppins = Poppins({
  weight:'400',
  subsets:['latin']
  
})


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      
      <body className={poppins.className}>
      <Navbar/>
          
          <main>{children}</main>
          <Toaster/>
      <Footer />  
       
      </body>
    </html>
  );
}
