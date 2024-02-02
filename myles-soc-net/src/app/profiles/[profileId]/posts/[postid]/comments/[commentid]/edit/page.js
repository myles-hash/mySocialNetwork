import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export default async function EditComment({ params }) {
    const { userId } = auth();

  const comment =
    await sql`SELECT * FROM comments WHERE id = ${params.commentid}`;

   const profile = await sql`SELECT * FROM profiles WHERE clerk_user_id = ${userId}`;

  async function handleEditComment(formData) {
    "use server";
    const username = formData.get("username");
    const content = formData.get("content");

    await sql`UPDATE comments SET username = ${username}, content = ${content} WHERE id = ${params.commentid}`;
    revalidatePath(`/profiles/${params.profileId}/posts/${params.postid}/comments/${params.commentid}/edit`);
    revalidatePath(`/profiles/${params.profileId}/posts/${params.postid}`);
    redirect(`/profiles/${params.profileId}/posts/${params.postid}`);
  }
  
  if(userId !== comment.rows[0].user_id) {
   return <p>404 not found</p>
  }

  return (
    <div>
      <form action={handleEditComment}>
        <h3>Edit Comment</h3>
        <input
          name="username"
          placeholder="Username"
          defaultValue={profile.rows[0].username}
          value={profile.rows[0].username} 
          readOnly
        />
        <textarea
          name="content"
          placeholder="Content"
          defaultValue={comment.rows[0].content}
        ></textarea>
        <button>Submit</button>
      </form>
    </div>
  );
}