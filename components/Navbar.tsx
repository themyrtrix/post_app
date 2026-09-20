import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand">
          Posts App
        </Link>
        <ul className="nav-links">
          <li>
            <Link
              href="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Posts
            </Link>
          </li>
          <li>
            <Link
              href="/drafts"
              className={`nav-link ${isActive("/drafts") ? "active" : ""}`}
            >
              Drafts
            </Link>
          </li>
          <li>
            <Link
              href="/posts/create"
              className={`nav-link ${isActive("/posts/create") ? "active" : ""}`}
            >
              Add Post
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}