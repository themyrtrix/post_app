import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid query parameter: id" });
  }

  try {
    const post = await prisma.post.delete({
      where: { id },
    });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete post." });
  }
}