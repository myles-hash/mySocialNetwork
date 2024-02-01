import Link from "next/link";
import "./globals.css";
import { ClerkProvider, UserButton, auth } from "@clerk/nextjs";



export const metadata = {
  title: "Myles Social Network",
  description: "Social network made by me, Myles",
};

export default function RootLayout({ children }) {
  const { userId } = auth();
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
        <header>Social Network</header>
        {userId && <UserButton afterSignOutUrl="/" />}
        {!userId && <Link href="/sign-in">Sign In</Link>}
        <nav>
          <Link href ="/">HOME</Link><Link href ="/posts">POSTS</Link>
        </nav>
          {children}
          <footer>Property of Myles &copy;</footer>
          </body>
      </html>
    </ClerkProvider> 
  );
}
