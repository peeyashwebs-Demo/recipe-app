import { Link } from "react-router";
import { ChefHat } from "lucide-react";

// Only real destinations that exist in the app — every link here goes
// somewhere. If you add real pages for About/Careers/Privacy/etc. later,
// add them back here rather than pointing at "#".
const columns = [
  {
    title: "Discover",
    links: [
      { label: "Explore recipes", to: "/explore" },
      { label: "Browse by mood", to: "/#browse-by-mood" },
      { label: "Saved & collections", to: "/collections" },
    ],
  },
  {
    title: "For Cooks",
    links: [
      { label: "Publish a recipe", to: "/creator" },
      { label: "Creator studio", to: "/creator" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2 w-fit">
            <span className="grid place-items-center size-9 rounded-full bg-primary text-primary-foreground">
              <ChefHat className="size-5" />
            </span>
            <span className="font-display text-xl" >Larder</span>
          </Link>
          <p className="text-muted-foreground mt-4 max-w-xs text-sm" >
            A warm corner of the internet where cooks share the recipes they actually make — and home cooks find their next favourite.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-base" >{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground text-xs" >
          <span>© {new Date().getFullYear()} Larder. Made for people who love to cook.</span>
        </div>
      </div>
    </footer>
  );
}
