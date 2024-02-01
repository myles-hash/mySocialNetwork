import Link from "next/link";
import "./globals.css";


export const metadata = {
  title: "Myles Social Network",
  description: "Social network made by me, Myles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <header>Social Network</header>
      <nav>
        <Link href ="/">HOME</Link><Link href ="/posts">POSTS</Link>
      </nav>
        {children}
        <footer>Property of Myles &copy;</footer>
        </body>
    </html>
  );
}
