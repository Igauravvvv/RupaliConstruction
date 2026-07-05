import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--rc-gray)] flex items-center justify-center p-4">
      <div className="text-center">
        <img
          src="/logo-icon.png"
          alt="Rupali Construction"
          className="h-20 w-auto mx-auto mb-8 opacity-30"
        />
        <h1 className="text-6xl font-bold text-[var(--rc-blue)] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[var(--rc-dark)] mb-4">
          Page Not Found
        </h2>
        <p className="text-[var(--rc-muted)] mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--rc-blue)] text-white rounded-full font-medium hover:bg-[var(--rc-orange)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
