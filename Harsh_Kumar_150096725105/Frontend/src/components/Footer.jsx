import { Link } from "react-router-dom";
import { API_URL } from "../api/client";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-[#211e1c] text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_1fr] lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-400/50 bg-brand-400/10 font-display text-xl text-brand-300">A</span>
            <span className="font-display text-2xl text-white">Atelier</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
            A modern salon management interface for maintaining services, pricing and treatment information.
          </p>
        </div>

        <nav>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-300">Navigate</p>
          <div className="mt-4 space-y-3 text-sm">
            <Link to="/" className="block hover:text-white">Home</Link>
            <Link to="/services" className="block hover:text-white">Services</Link>
            <Link to="/login" className="block hover:text-white">Login</Link>
            <Link to="/register" className="block hover:text-white">Register</Link>
          </div>
        </nav>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-300">System</p>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            React frontend connected to the salon REST API.
          </p>
          <a href={`${API_URL}/`} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-semibold text-brand-300 hover:text-brand-200">
            API health check →
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© {new Date().getFullYear()} Atelier Salon Studio</span>
          <span>Salon Management System</span>
        </div>
      </div>
    </footer>
  );
}
