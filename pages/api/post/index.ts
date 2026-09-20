import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { title, content, published } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    const result = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        published: Boolean(published),
      },
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Database transaction failed." });
  }
}