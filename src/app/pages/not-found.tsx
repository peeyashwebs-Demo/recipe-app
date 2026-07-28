import { Link } from "react-router";
import { ChefHat, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <span className="mx-auto grid place-items-center size-16 rounded-full bg-secondary text-primary">
        <ChefHat className="size-7" />
      </span>
      <h1 className="font-display mt-6 text-4xl">This page isn't on the menu</h1>
      <p className="text-muted-foreground mt-3">
        The page you're looking for doesn't exist — it may have moved, or the link might be off.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Button asChild className="rounded-full h-11 px-6">
          <Link to="/">Back home</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full h-11 px-6">
          <Link to="/explore">Explore recipes <ArrowRight className="size-4" /></Link>
        </Button>
      </div>
    </div>
  );
}
