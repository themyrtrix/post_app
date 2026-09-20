import Link from "next/link";
import Layout from "@/components/Layout";

export default function Custom404() {
  return (
    <Layout title="Page Not Found - Posts App">
      <div className="empty-state" style={{ paddingTop: "120px" }}>
        <h1 className="page-title" style={{ fontSize: "5rem" }}>404</h1>
        <h2 className="empty-state-title">Page not found.</h2>
        <p className="empty-state-subtitle">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary">
          Return Home
        </Link>
      </div>
    </Layout>
  );
}