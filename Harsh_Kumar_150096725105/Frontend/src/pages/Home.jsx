import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { listServices } from "../api/serviceApi";
import { getApiError } from "../api/client";
import ServiceCard from "../components/ServiceCard";
import useAuth from "../hooks/useAuth";
import useScrollReveal from "../hooks/useScrollReveal";
import { gsap, useGSAP, prefersReducedMotion } from "../utils/gsap";
import heroImg from "../assets/salon-hero.jpg";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const rootRef = useRef(null);
  const heroRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(".atelier-reveal", {
      y: 24, opacity: 0, duration: 0.75, stagger: 0.08, ease: "power3.out"
    });
    gsap.to(".atelier-photo", {
      yPercent: 8,
      ease: "none",
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true }
    });
  }, { scope: rootRef });

  useScrollReveal(rootRef, [loading]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listServices();
        if (!cancelled) setServices(data.slice(0, 6));
      } catch (error) {
        if (!cancelled) toast.error(getApiError(error, "Could not load services."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div ref={rootRef}>
      <section ref={heroRef} className="relative overflow-hidden bg-[#211e1c] text-white">
        <div className="atelier-photo absolute inset-0">
          <img src={heroImg} alt="" className="h-full w-full scale-105 object-cover object-center opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#211e1c] via-[#211e1c]/90 to-[#211e1c]/35" />
        </div>

        <div className="relative mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="atelier-reveal text-xs font-bold uppercase tracking-[0.3em] text-brand-300">Independent salon management</p>
            <h1 className="atelier-reveal mt-6 font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              A better way to run your <em className="text-brand-300">salon.</em>
            </h1>
            <p className="atelier-reveal mt-7 max-w-xl text-base leading-8 text-stone-300 sm:text-lg">
              Manage your service catalogue, keep treatments organized and give clients a polished digital experience from one simple application.
            </p>
            <div className="atelier-reveal mt-9 flex flex-wrap gap-3">
              <Link to="/services" className="rounded-lg bg-brand-400 px-6 py-3 text-sm font-bold text-stone-950 transition hover:bg-brand-300">
                Explore services →
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="rounded-lg border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15">
                  Create account
                </Link>
              )}
            </div>
            <div className="atelier-reveal mt-12 grid max-w-lg grid-cols-3 border-y border-white/15 py-5">
              <div><p className="font-display text-2xl text-brand-300">24/7</p><p className="mt-1 text-[10px] uppercase tracking-widest text-stone-400">Access</p></div>
              <div className="border-l border-white/15 pl-5"><p className="font-display text-2xl">CRUD</p><p className="mt-1 text-[10px] uppercase tracking-widest text-stone-400">Management</p></div>
              <div className="border-l border-white/15 pl-5"><p className="font-display text-2xl text-brand-300">1</p><p className="mt-1 text-[10px] uppercase tracking-widest text-stone-400">Workspace</p></div>
            </div>
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <div className="atelier-reveal w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-7 backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-300">Studio note</p>
              <h2 className="mt-4 font-display text-3xl">Everything in its place.</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                Add services, update pricing and durations, review details, and remove outdated treatments without touching the database directly.
              </p>
              <Link to="/services" className="mt-7 inline-flex border-b border-brand-300 pb-1 text-sm font-bold text-brand-300">
                View the catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end" data-reveal>
          <div>
            <p className="eyebrow">The catalogue</p>
            <h2 className="mt-3 font-display text-4xl text-stone-900">Signature services</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
              A clean overview of the treatments currently available in the system.
            </p>
          </div>
          <Link to="/services" className="text-sm font-bold text-brand-700 hover:text-brand-900">See all services →</Link>
        </div>

        <div className="mt-9">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1,2,3].map(i => <div key={i} className="h-80 animate-pulse rounded-2xl bg-stone-200" />)}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center">
              <p className="font-display text-2xl text-stone-800">No services yet</p>
              <p className="mt-2 text-sm text-stone-500">Add your first service to populate the catalogue.</p>
              {isAuthenticated && <Link to="/services/new" className="btn-primary mt-5">Add service</Link>}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => <div key={service.id} data-reveal><ServiceCard service={service} index={i} /></div>)}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-stone-200 bg-brand-100/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:grid-cols-3 lg:px-8">
          {[
            ["01", "Simple catalogue", "Keep every treatment, price and duration in one place."],
            ["02", "Secure access", "Authentication protects management actions and private areas."],
            ["03", "Fast updates", "Create, edit and remove services through the REST API."]
          ].map(([n, title, text]) => (
            <div key={n} className="border-l-2 border-brand-400 pl-5" data-reveal>
              <p className="text-xs font-bold text-brand-700">{n}</p>
              <h3 className="mt-2 font-display text-2xl text-stone-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
