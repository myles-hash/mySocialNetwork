import { sql } from "@vercel/postgres";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

export const metadata = {
    title: "Myles Social Network | Posts",
    description: "Posts made on the Myles social network",
  };

export default async function Posts() {
    const {userId} = auth();

    const posts = await sql `
    SELECT * FROM posts ORDER BY id
    `;

    async function handleCreatePost(formData) {
        "use server";
        const title = formData.get("title");
        const content = formData.get("content");

        await sql`INSERT INTO posts (title, content, user_id) VALUES (${title}, ${content}, ${userId})`;

        revalidatePath("/posts");
    }

    return(
        <div>
      <h1>Posts</h1>
      {userId && (<form action={handleCreatePost}>
        <h4>Add a new post</h4>
        <input name="title" placeholder="Post Title" />
        <textarea name="content" placeholder="Post content"></textarea>
        <button>Submit</button>
      </form>)}
      {!userId && <div><h2>Please... Sign in to add posts</h2></div>}


        {posts.rows.map((post) => {
            return (
              <Link key ={post.id} href={`/posts/${post.id}`}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                </Link>
            )})}
        </div>
    )
}