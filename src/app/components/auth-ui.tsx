import { createContext, useContext, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useStore } from "../store";
import { toast } from "sonner";
import { ChefHat, Sparkles } from "lucide-react";
import { img } from "../data/seed";

interface AuthUI {
  /** Runs `action` if signed in, otherwise opens the auth dialog with a reason. */
  requireAuth: (action: () => void, reason?: string) => void;
  openAuth: (mode?: "signin" | "signup", reason?: string) => void;
}

const AuthUIContext = createContext<AuthUI | null>(null);

export function AuthUIProvider({ children }: { children: ReactNode }) {
  const { currentUser, signIn, signUp } = useStore();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [reason, setReason] = useState<string | undefined>();
  const [pending, setPending] = useState<(() => void) | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();

  const openAuth = (m: "signin" | "signup" = "signup", r?: string) => {
    setMode(m);
    setReason(r);
    setError(undefined);
    setOpen(true);
  };

  const requireAuth = (action: () => void, r?: string) => {
    if (currentUser) {
      action();
      return;
    }
    setPending(() => action);
    openAuth("signup", r);
  };

  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(undefined);
    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    const res =
      mode === "signin" ? await signIn(email, password) : await signUp(name, email, password);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setOpen(false);
    toast.success(mode === "signin" ? "Welcome back to Larder" : "Your seat at the table is ready", {
      description: mode === "signin" ? "Pick up right where you left off." : "Start saving and reviewing recipes.",
    });
    const p = pending;
    setPending(null);
    setName(""); setEmail(""); setPassword("");
    if (p) setTimeout(p, 120);
  };

  return (
    <AuthUIContext.Provider value={{ requireAuth, openAuth }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 overflow-hidden border-none max-w-[420px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto sm:rounded-2xl gap-0 lg:grid lg:grid-cols-[1.05fr_1fr] bg-card">
          {/* Photo panel */}
          <div className="relative hidden lg:block">
            <img
              src={img("1528712306091-ed0763094c98", 700, 900)}
              alt="A cook at work in a warm kitchen"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/45" />
            <div className="relative h-full flex flex-col justify-between p-8 xl:p-10 text-white">
              <div className="flex items-center gap-2 font-display text-xl" >
                <ChefHat className="size-6" /> Larder
              </div>
              <div className="max-w-sm">
                <p className="font-display" style={{ fontSize: "clamp(1.5rem, 2.2vw + 1rem, 2.25rem)", lineHeight: 1.2 }}>
                  Cook from the recipes people actually make.
                </p>
                <p className="mt-3 text-white/80 text-sm" style={{ lineHeight: 1.5 }}>
                  Save, scale and review — join a table of home cooks.
                </p>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 mb-4 text-xs" style={{ letterSpacing: "0.04em" }}>
              <Sparkles className="size-3.5" /> {mode === "signin" ? "WELCOME BACK" : "JOIN LARDER"}
            </div>
            <h2 className="font-display text-2xl" style={{ lineHeight: 1.25 }}>
              {mode === "signin" ? "Sign in to keep cooking" : "Create your free account"}
            </h2>
            {reason && (
              <p className="text-muted-foreground mt-2 text-sm" style={{ lineHeight: 1.5 }}>
                {reason}
              </p>
            )}

            <div className="mt-6 space-y-4">
              <AnimatePresence initial={false} mode="popLayout">
                {mode === "signup" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label htmlFor="au-name">Name</Label>
                    <Input id="au-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Amara Okafor" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-2">
                <Label htmlFor="au-email">Email</Label>
                <Input id="au-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@table.co" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="au-pass">Password</Label>
                <Input id="au-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" minLength={8} onKeyDown={(e) => e.key === "Enter" && submit()} />
                {mode === "signup" && (
                  <p className="text-muted-foreground text-xs" >At least 8 characters.</p>
                )}
              </div>
              {error && <p className="text-destructive text-sm" >{error}</p>}

              <Button className="w-full h-11 rounded-full" onClick={submit} disabled={busy}>
                {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>

              <p className="text-center text-muted-foreground text-sm" >
                {mode === "signin" ? "New to Larder? " : "Already have an account? "}
                <button
                  className="text-primary hover:underline"
                  onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(undefined); }}
                >
                  {mode === "signin" ? "Create one" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AuthUIContext.Provider>
  );
}

const fallbackAuthUI: AuthUI = {
  requireAuth: (action) => action(),
  openAuth: () => {},
};

export function useAuthUI() {
  return useContext(AuthUIContext) ?? fallbackAuthUI;
}
