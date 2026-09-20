import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { comment, postId } = req.body;

  if (!comment || !postId) {
    return res.status(400).json({ error: "Comment text and postId are required." });
  }

  try {
    const result = await prisma.comment.create({
      data: {
        content: comment.trim(),
        postId: postId,
        published: true,
      },
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to save comment." });
  }
}