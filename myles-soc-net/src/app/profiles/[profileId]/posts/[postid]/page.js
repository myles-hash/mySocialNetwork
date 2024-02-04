import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import Link from "next/link";


export default async function SinglePost({ params }) {
    const {userId} = auth();

    const post = await sql`SELECT * FROM posts WHERE id = ${params.postid}`;


    const comments = await sql`SELECT * FROM comments where post_id = ${params.postid} ORDER BY id asc`;

    const currentUsername = await sql`SELECT username FROM profiles where clerk_user_id = ${userId} `;


    

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
            {userId === post.rows[0].user_id  && <Link href={`/profiles/${params.profileId}/posts/${params.postid}/edit`}>Edit</Link>}

        {userId && <form action={handleAddComment}>
            <h4>Add a comment</h4>
            <input name="username" placeholder="Username" defaultValue={currentUsername.rows[0].username} value={currentUsername.rows[0].username} readOnly/>
             <textarea name="content" placeholder="Content"></textarea>
             <button>Submit</button>
         </form>}
         {!userId && <h2>Please sign in to add comments</h2>}

         {comments.rows.map((comment) => {
        return (
          <div key={comment.id}>
            <h3>{comment.username}</h3>
            <p>{comment.content}</p>
            <p>
            {userId === comment.user_id && <Link href={`/profiles/${params.profileId}/posts/${params.postid}/comments/${comment.id}/edit`}>
              Edit
            </Link>}</p>
          </div>
        );
      })}
        </div>
    );
}