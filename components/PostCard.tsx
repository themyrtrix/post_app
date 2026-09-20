import Link from "next/link";
import { Post } from "@prisma/client";
import { ReactNode } from "react";

// Allows the component to receive a post that optionally includes comments
export type PostWithCommentsCount = Post & {
  comments?: { id: string }[];
};

interface PostCardProps {
  post: PostWithCommentsCount;
  actionButton?: ReactNode;
}

export default function PostCard({ post, actionButton }: PostCardProps) {
  const commentCount = post.comments ? post.comments.length : 0;
  const commentLabel =
    commentCount === 1 ? "1 comment" : `${commentCount} comments`;

  return (
    <article className="card">
      <h2 className="card-title">
        <Link href={`/posts/${post.id}`} className="card-title-link">
          {post.title}
        </Link>
      </h2>
      <p className="card-body">
        {post.content ? post.content : "No content provided."}
      </p>
      <div className="card-footer">
        {post.published ? (
          <span className="pill">{commentLabel}</span>
        ) : (
          <span className="pill">Draft</span>
        )}
        {actionButton}
      </div>
    </article>
  );
}