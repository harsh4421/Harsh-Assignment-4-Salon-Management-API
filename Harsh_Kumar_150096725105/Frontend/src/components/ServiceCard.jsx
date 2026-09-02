import { Link } from "react-router-dom";
import { formatPrice, formatDuration } from "../utils/format";

const accents = [
  "bg-brand-100", "bg-stone-100", "bg-[#eee8e0]", "bg-[#e9dfd2]", "bg-[#f1ece6]"
];

export default function ServiceCard({ service, index = 0 }) {
  const duration = formatDuration(service.duration_minutes);
  const accent = accents[index % accents.length];

  return (
    <Link
      to={`/services/${service.id}`}
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className={`relative flex h-36 items-end justify-between ${accent} p-5`}>
        <div>
          <span className="eyebrow">Treatment {String(index + 1).padStart(2, "0")}</span>
          <div className="mt-2 font-display text-4xl text-stone-800">
            {(service.name || "?").charAt(0).toUpperCase()}
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-800 shadow-sm">
          {formatPrice(service.price)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-stone-900 group-hover:text-brand-700">{service.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-stone-500">
          {service.description || "A carefully curated salon treatment designed around you."}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="text-xs font-medium text-stone-500">{duration || "Flexible session"}</span>
          <span className="text-xs font-bold uppercase tracking-wide text-brand-700 transition group-hover:translate-x-1">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
