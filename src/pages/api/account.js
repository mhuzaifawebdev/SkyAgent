import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const accounts = await db.collection("accounts").find({}).limit(5).toArray();

    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
 
}
