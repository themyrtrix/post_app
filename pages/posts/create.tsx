import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
          published: false,
        }),
      });

      if (res.ok) {
        router.push("/drafts");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to submit post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Add Post - Posts App">
      <header className="page-header">
        <h1 className="page-title">New Post</h1>
        <p className="page-subtitle">Draft a new post to save or publish later.</p>
      </header>

      <form onSubmit={handleSubmit} className="form">
        {error && <div className="error-banner">{error}</div>}

        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Enter post title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
            placeholder="Write your thoughts..."
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? "Adding…" : "Add Post"}
          </button>
        </div>
      </form>
    </Layout>
  );
}