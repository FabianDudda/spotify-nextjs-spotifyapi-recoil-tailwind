import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("social-spotify");

    console.log("REQ: ", req.method);

    switch (req.method) {
      case "POST":
        let bodyObject = JSON.parse(req.body);
        let myComment = await db.collection("comments").insertOne(bodyObject);
        res.json(myComment.ops[0]);
        break;
      case "GET":
        const allComments = await db.collection("comments").find({}).toArray();
        res.json({ allComments });
        break;
    }

    // const posts = await db.collection("comments").find({}).toArray();

    // res.json(posts);
  } catch (e) {
    console.error(e);
  }
};

// export default async function handler(req, res) {

// }
