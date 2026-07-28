import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { StoreProvider } from "./store";
import { AuthUIProvider } from "./components/auth-ui";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { FeedbackButton } from "./components/feedback-button";
import { Toaster } from "./components/ui/sonner";
import { HomePage } from "./pages/home";
import { ExplorePage } from "./pages/explore";
import { RecipePage } from "./pages/recipe";
import { CollectionsPage } from "./pages/collections";
import { CreatorPage } from "./pages/creator";
import { AdminPage } from "./pages/admin";
import { NotFoundPage } from "./pages/not-found";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Give the new page a tick to render before we look for the anchor
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <ScrollToTop />
      <SiteHeader />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
      <FeedbackButton />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <AuthUIProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/recipe/:id" element={<RecipePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/creator" element={<CreatorPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthUIProvider>
      </BrowserRouter>
      <Toaster position="bottom-center" />
    </StoreProvider>
  );
}
