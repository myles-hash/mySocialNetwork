import Link from "next/link";
import "./globals.css";


export const metadata = {
  title: "Myles Social Network",
  description: "Social network made by me, Myles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <header>Social Network</header>
      <nav>
        <Link href ="/">HOME</Link><Link href ="/posts">POSTS</Link>
      </nav>
      <body>{children}</body>
      <footer>Social Network</footer>
    </html>
  );
}
