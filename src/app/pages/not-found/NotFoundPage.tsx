import { Link, useLocation } from "react-router-dom";
import Seo from "../../main/seo/Seo";

export default function NotFoundPage() {
  const { pathname } = useLocation();

  return (
    <Seo
      title="404 - Page Not Found | Futballero"
      description="This page does not exist."
      url={`https://futballero.com${pathname}`}
      robots="noindex, nofollow"
    >
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-8xl font-bold text-brand-orange mb-4">404</h1>
        <p className="text-2xl font-semibold text-brand-white mb-2">Page not found</p>
        <p className="text-brand-lightGray mb-10 max-w-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-lg bg-brand-orange text-white font-semibold hover:brightness-110 transition"
        >
          Back to home
        </Link>
      </section>
    </Seo>
  );
}
