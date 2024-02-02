import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";



export const metadata = {
    title: "Myles Social Network | Posts",
    description: "Posts made on the Myles social network",
  };

export default async function ProfilePage({ params }) {
    const {userId} = auth();
    console.log(params); 


    const profile = await sql `
    SELECT * FROM profiles WHERE id = ${params.profileId}
    `;

    if (profile.rowCount === 0){
      notFound();
    }

    const posts = await sql `
    SELECT * FROM posts WHERE user_id = ${profile.rows[0].clerk_user_id} ORDER BY id desc
    `;

    

    async function handleEditProfile(formData) {
        "use server";
    
        const username = formData.get("username");
        const bio = formData.get("bio");
    
        await sql`UPDATE profiles SET username = ${username}, bio = ${bio} WHERE clerk_user_id = ${userId}`;
        revalidatePath(`/profiles`);
        revalidatePath(`/profiles/${params.profileId}/posts`);
        redirect(`/profiles/${params.profileId}/posts`);
      }


      async function handleCreatePost(formData) {
        "use server";
        const title = formData.get("title");
        const content = formData.get("content");

        await sql`INSERT INTO posts (title, content, user_id) VALUES (${title}, ${content}, ${userId})`;

        revalidatePath(`/profiles/${params.profileId}/posts`);
    }
     

    return (
        <div>
                <p>username:</p>
                <h1>{profile.rows[0].username}</h1>
                <p>bio:</p>
                <h2>{profile.rows[0].bio}</h2>
            
                
                {userId === profile.rows[0].clerk_user_id && (
              <form action={handleEditProfile}>
                 <h4>Edit profile</h4>
                 <input
                   name="username"
                   placeholder="Usernmae"
                   defaultValue={profile.rows[0].username}
                   required
                 />
                 <textarea
                   name="bio"
                   placeholder="Bio"
                   defaultValue={profile.rows[0].bio}
                   required
                 ></textarea>
                 <button>Submit</button>
               </form>
                )}
                 <h1>Posts</h1>
      {userId === profile.rows[0].clerk_user_id && (<form action={handleCreatePost}>
        <h4>Add a new post</h4>
        <input name="title" placeholder="Post Title" />
        <textarea name="content" placeholder="Post content"></textarea>
        <button>Submit</button>
      </form>)}
      {!userId && <div><h2>Please... Sign in to add posts</h2></div>}


        {posts.rows.map((post) => {
            return (
              <Link key ={post.id} href={`/profiles/${params.profileId}/posts/${post.id}`}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                </Link>
            )})}
               </div>
    )

              
}






