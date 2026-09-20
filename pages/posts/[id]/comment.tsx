import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Layout from "@/components/Layout";

interface AddCommentProps {
  postId: string;
}

export default function AddComment({ postId }: AddCommentProps) {
  const router = useRouter();
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      setError("Comment cannot be empty");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/post/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: trimmedComment,
          postId: postId,
        }),
      });

      if (res.ok) {
        router.push(`/posts/${postId}`);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add comment.");
      }
    } catch (err) {
      setError("An error occurred while posting comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Add Comment - Posts App">
      <header className="page-header">
        <h1 className="page-title">Add Comment</h1>
        <p className="page-subtitle">Share your thoughts on this post.</p>
      </header>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label htmlFor="comment" className="form-label">Comment</label>
          <textarea
            id="comment"
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-textarea"
            placeholder="Write your comment..."
          />
        </div>

        <div>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      postId: params?.id,
    },
  };
};