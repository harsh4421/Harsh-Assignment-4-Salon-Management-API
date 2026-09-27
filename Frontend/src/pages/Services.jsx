import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { listServices } from "../api/serviceApi";
import { getApiError } from "../api/client";
import ServiceCard from "../components/ServiceCard";
import EmptyState from "../components/EmptyState";
import { CardSkeletonGrid } from "../components/Spinner";
import useAuth from "../hooks/useAuth";
import useScrollReveal from "../hooks/useScrollReveal";

const SORTS = [
  { id: "newest", label: "Newest first" },
  { id: "price-asc", label: "Price: low → high" },
  { id: "price-desc", label: "Price: high → low" },
  { id: "duration-asc", label: "Quickest first" },
];

export default function Services() {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const rootRef = useRef(null);

  useScrollReveal(rootRef, [loading]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listServices();
        if (!cancelled) setServices(data);
      } catch (error) {
        if (!cancelled) toast.error(getApiError(error, "Could not load services."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = q
      ? services.filter(s => s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q))
      : services;

    return [...result].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "duration-asc") return (a.duration_minutes ?? Infinity) - (b.duration_minutes ?? Infinity);
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [services, query, sort]);

  return (
    <section ref={rootRef} className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="border-b border-stone-200 pb-8" data-reveal>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Atelier catalogue</p>
            <h1 className="mt-3 font-display text-4xl text-stone-900 sm:text-5xl">Services & treatments</h1>
            <p className="mt-3 text-sm text-stone-500">
              {loading ? "Loading catalogue…" : `${services.length} service${services.length === 1 ? "" : "s"} available`}
            </p>
          </div>
          {isAuthenticated && <Link to="/services/new" className="btn-primary">+ Add service</Link>}
        </div>
      </div>

      <div className="mt-7 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-card sm:grid-cols-[1fr_auto]" data-reveal>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search services…"
          aria-label="Search services"
          className="input"
        />
        <select value={sort} onChange={e => setSort(e.target.value)} className="input sm:w-56" aria-label="Sort services">
          {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="mt-8">
        {loading ? <CardSkeletonGrid count={6} /> : visible.length === 0 ? (
          <EmptyState
            icon="✦"
            title={query ? "No matches found" : "No services yet"}
            message={query ? `Nothing matches "${query}".` : isAuthenticated ? "Add your first treatment to begin." : "The catalogue is empty right now."}
            action={query ? <button className="btn-secondary" onClick={() => setQuery("")}>Clear search</button> : isAuthenticated ? <Link to="/services/new" className="btn-primary">Add service</Link> : null}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((service, i) => <div key={service.id} data-reveal><ServiceCard service={service} index={i} /></div>)}
          </div>
        )}
      </div>
    </section>
  );
}
