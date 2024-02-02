import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import Link from "next/link";


export default async function SinglePost({ params }) {
    const {userId} = auth();
    
    

    const post = await sql`SELECT * FROM posts WHERE user_id = ${userId}`;

    const comments = await sql`SELECT * FROM comments where user_id = ${userId} ORDER BY id desc`;

    async function handleAddComment(formData) {
        "use server";
        const username = formData.get("username");
        const content = formData.get("content");
    
        await sql`INSERT INTO comments (username, content, post_id, user_id) VALUES (${username}, ${content}, ${params.postid}, ${userId})`;
        revalidatePath(`/${params.postid}`);
        }
    
  
    return (
        <div>
            <h3>{post.rows[0].title}</h3>
            <p>{post.rows[0].content}</p>
            {userId === post.rows[0].user_id && <Link href={`/profiles/${params.profileId}/posts/${params.postid}/edit`}>Edit</Link>}

        {userId && <form action={handleAddComment}>
            <h4>Add a comment</h4>
            <input name="username" placeholder="Username" />
             <textarea name="content" placeholder="Content"></textarea>
             <button>Submit</button>
         </form>}
         {!userId && <h2>Please sign in to add comments</h2>}

         {comments.rows.map((comment) => {
        return (
          <div key={comment.id}>
            <h3>{comment.username}</h3>
            <p>{comment.content}</p>
            {userId === comment.user_id && <Link href={`/profiles/${params.profileId}/posts/${params.postid}/comments/${comments.rows[0].id}/edit`}>
              Edit
            </Link>}
          </div>
        );
      })}
        </div>
    );
}