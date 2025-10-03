import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  // Get session on server side
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // User is authenticated, return their data
  res.status(200).json({
    user: session.user,
    message: "This is protected data!",
  });
}
