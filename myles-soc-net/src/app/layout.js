import Link from "next/link";
import "./globals.css";
import { ClerkProvider, UserButton, auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import CreateProfile from "./comps/CreateProfile";




export const metadata = {
  title: "Myles Social Network",
  description: "Social network made by me, Myles",
};

export default async function RootLayout({ children }) {
  const { userId } = auth();

  const profileRes =
    await sql`SELECT * FROM profiles WHERE clerk_user_id = ${userId}`;


  return (
    <ClerkProvider>
      <html lang="en">
        <body>
        <header>Social Network</header>
        <nav>
     <Link href ="/">HOME</Link> | <Link href ="/about">ABOUT</Link> | <Link href="/profiles">PROFILES</Link>
   </nav>
        {!userId && <div><Link href="/sign-in">Sign In</Link>{children}</div>}
        {userId && <UserButton afterSignOutUrl="/" />}
        {userId && profileRes.rowCount === 0 && <CreateProfile />}
        {userId && profileRes.rowCount !== 0 && children}
        <div>
     <footer>Property of Myles &copy;</footer>
       </div>
        </body>
      </html>
    </ClerkProvider> 
  );

}

// {profileRes.rowCount !== 0 && 
//   <div>
//   <header>Social Network</header>
//   <nav>
//     <Link href ="/">HOME</Link> | <Link href ="/about">ABOUT</Link> | <Link href ="/posts">POSTS</Link>
//   </nav>
//   {children}
//     <footer>Property of Myles &copy;</footer>
//     {profileRes.rowCount === 0 && <CreateProfile />}
//     </div> }

// {userId && <UserButton afterSignOutUrl="/" />}
//         {!userId && <Link href="/sign-in">Sign In</Link>}