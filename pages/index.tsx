import { useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Layout from "@/components/Layout";
import PostCard, { PostWithCommentsCount } from "@/components/PostCard";

interface HomeProps {
  posts: PostWithCommentsCount[];
}

export default function Home({ posts }: HomeProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string>("");

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/post/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToast("Post deleted successfully");
        setTimeout(() => setToast(""), 3000);
        router.replace(router.asPath);
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      alert("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout title="Published Posts - Posts App">
      <header className="page-header">
        <h1 className="page-title">Posts</h1>
        <p className="page-subtitle">Everything published to the community.</p>
      </header>

      {posts.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state-title">No published posts found.</h2>
          <p className="empty-state-subtitle">
            Create a post and publish it from your drafts to see it here.
          </p>
          <Link href="/posts/create" className="btn btn-primary">
            Add Post
          </Link>
        </div>
      ) : (
        <div className="card-list">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              actionButton={
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                  className="btn btn-danger"
                >
                  {deletingId === post.id ? "Deleting…" : "Delete"}
                </button>
              }
            />
          ))}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      comments: { select: { id: true } },
    },
  });

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};