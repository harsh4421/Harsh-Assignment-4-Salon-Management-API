import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const navClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "text-brand-800"
      : "text-stone-500 hover:text-stone-900"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  function handleLogout() {
    logout();
    close();
    toast.success("You have been logged out.");
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#faf8f4]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" onClick={close} className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-300 bg-brand-100 text-brand-800 transition group-hover:rotate-6">
            <span className="font-display text-xl">A</span>
          </span>
          <span>
            <span className="block font-display text-xl leading-none text-stone-900">Atelier</span>
            <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.28em] text-brand-700">Salon Studio</span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/services" className={navClass}>Services</NavLink>
          {user ? (
            <div className="ml-3 flex items-center gap-3 border-l border-stone-200 pl-5">
              <span className="flex items-center gap-2 text-sm text-stone-700">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
                  {(user.name || "?").charAt(0).toUpperCase()}
                </span>
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2">Logout</button>
            </div>
          ) : (
            <div className="ml-3 flex items-center gap-2 border-l border-stone-200 pl-5">
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900">Login</Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">Get started</Link>
            </div>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          {open ? "×" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-stone-200 bg-[#faf8f4] px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col">
            <NavLink to="/" end className={navClass} onClick={close}>Home</NavLink>
            <NavLink to="/services" className={navClass} onClick={close}>Services</NavLink>
          </div>
          <div className="mt-3 border-t border-stone-200 pt-4">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-stone-600">Signed in as <b>{user.name}</b></span>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={close} className="btn-secondary">Login</Link>
                <Link to="/register" onClick={close} className="btn-primary">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
