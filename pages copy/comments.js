import clientPromise from "../lib/mongodb";
import { useEffect, useState } from "react";

function Comments({ comments }) {
  async function addComment() {
    let res = await fetch("http://localhost:3000/api/comments", {
      method: "POST",
      body: JSON.stringify({
        value: "ssss",
      }),
    });
  }

  // addComment();

  return (
    <>
      {/* // INSERT COMMENTS */}
      <button type="button" onClick={addComment}>
        {" "}
        add{" "}
      </button>

      {/* // SHOW COMMENTS */}
      <div>
        <h1>Comments</h1>
        {comments.map((comment) => (
          <p key={comment._id}>{comment.value}</p>
        ))}
      </div>
    </>
  );
}

export default Comments;

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db("social-spotify");
  const comments = await db.collection("comments").find({}).toArray();

  return {
    props: { comments: JSON.parse(JSON.stringify(comments)) },
  };
}
