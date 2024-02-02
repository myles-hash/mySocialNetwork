import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import Link from "next/link";


export default async function Profiles() {
  const {userId} = auth();

    const profiles = await sql `SELECT * FROM profiles`;

   
    return (

        <div>
        {!userId && <h2>Plese sign up/in to view user profiles</h2>}
         {profiles.rows.map((profile) => {
        return (
          <Link key ={profile.id} href={`/profiles/${profile.id}/posts`}>
                <h3>{profile.username}</h3>
                <p>{profile.bio}</p>
                </Link>
        );
      })}
        </div> 
    );
}