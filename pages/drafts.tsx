import { useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { Post } from "@prisma/client";
import prisma from "@/lib/prisma";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";

interface DraftsProps {
  drafts: Post[];
}

export default function Drafts({ drafts }: DraftsProps) {
  const router = useRouter();
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      const res = await fetch(`/api/post/edit?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });
      if (res.ok) {
        router.push("/");
      } else {
        alert("Failed to publish post");
      }
    } catch (err) {
      alert("An error occurred while publishing");
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <Layout title="Drafts - Posts App">
      <header className="page-header">
        <h1 className="page-title">Drafts</h1>
        <p className="page-subtitle">Posts waiting to be published.</p>
      </header>

      {drafts.length === 0 ? (
        <div className="empty-state">
          <h2 className="empty-state-title">No draft posts found.</h2>
          <p className="empty-state-subtitle">
            All your ideas are out in the world! Create a new post to get started.
          </p>
          <Link href="/posts/create" className="btn btn-primary">
            Add Post
          </Link>
        </div>
      ) : (
        <div className="card-list">
          {drafts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              actionButton={
                <button
                  onClick={() => handlePublish(post.id)}
                  disabled={publishingId === post.id}
                  className="btn btn-primary"
                >
                  {publishingId === post.id ? "Publishing…" : "Publish"}
                </button>
              }
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<DraftsProps> = async () => {
  const drafts = await prisma.post.findMany({
    where: { published: false },
  });

  return {
    props: {
      drafts: JSON.parse(JSON.stringify(drafts)),
    },
  };
};