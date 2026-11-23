import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "About", href: "#about" },
  { label: "Courses", href: "#courses" },
  { label: "Free Lessons", href: "#lessons" },
  // { label: "Student Results", href: "#results" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-2.5 sm:py-4",
      )}
    >
      <div className="container-page">
        <nav
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl px-3 py-2.5 transition-all duration-300 sm:gap-4 sm:px-4 sm:py-3 lg:px-6",
            scrolled ? "glass-panel shadow-[var(--shadow-soft)]" : "border border-transparent",
          )}
        >
          <a href="#top" className="shrink-0" aria-label="Next Level ICT home">
            <img src="/Logo[1]-4.png" alt="Next Level ICT" className="h-10 w-auto sm:h-12" />
          </a>

          <div className="hidden items-center gap-1 xl:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  scrolled
                    ? "text-muted-foreground hover:bg-secondary hover:text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary xl:text-white xl:hover:bg-white/10 xl:hover:text-white",
                )}
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://nextlvlict.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
            >
              Enroll Now
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-border bg-background text-primary xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="glass-panel mt-2 rounded-3xl p-3 xl:hidden"
            >
              <div className="flex flex-col">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="https://nextlvlict.com/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-2xl bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground"
                >
                  Enroll Now
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
