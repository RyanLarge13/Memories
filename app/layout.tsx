import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignedOut } from "@clerk/nextjs";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Memories",
  description: "Share your memories with the whole world as your audience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <Nav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
