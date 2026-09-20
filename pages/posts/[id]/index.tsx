import { GetServerSideProps } from "next";
import Link from "next/link";
import { Post, Comment } from "@prisma/client";
import prisma from "@/lib/prisma";
import Layout from "@/components/Layout";

type PostWithComments = Post & {
  comments: Comment[];
};

interface PostDetailProps {
  post: PostWithComments;
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <Layout title={`${post.title} - Posts App`}>
      <article>
        <header className="page-header">
          <h1 className="page-title">{post.title}</h1>
        </header>

        <div className="card-body" style={{ fontSize: "1.125rem", color: "var(--text)" }}>
          {post.content}
        </div>

        <section className="comments-section">
          <div className="comments-header">
            <span>Comments ({post.comments ? post.comments.length : 0})</span>
            <Link href={`/posts/${post.id}/comment`} className="btn btn-primary">
              Leave a comment
            </Link>
          </div>

          {!post.comments || post.comments.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", marginTop: "16px" }}>
              No comments yet.
            </p>
          ) : (
            <ul className="comment-list">
              {post.comments.map((comment) => (
                <li key={comment.id} className="comment-item">
                  {comment.content}
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { comments: true },
  });

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};