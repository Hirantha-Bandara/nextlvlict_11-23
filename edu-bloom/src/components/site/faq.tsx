import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/site/ui";

const faqs = [
  {
    q: "Do I need prior ICT knowledge to join?",
    a: "No. Grade 12 theory starts from unit one and assumes zero background. Students joining mid-year get catch-up recordings and notes.",
  },
  {
    q: "Are online classes the same as physical classes?",
    a: "Yes — the same syllabus, same tutorials and the same marked papers. Online students get a 7-day recording window for every session.",
  },
  {
    q: "How are papers marked?",
    a: "Papers are marked personally with written feedback, then discussed in the following session so you understand every lost mark.",
  },
  {
    q: "Can I attend a class before paying?",
    a: "The first class is free at every venue. Attend a full session, then decide whether to register.",
  },
  {
    q: "How do I pay the monthly fee?",
    a: "Bank transfer, online payment or at the institute counter. Send your slip on WhatsApp and your seat is confirmed instantly.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad">
      <div className="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="text-gradient-navy">answered</span>
            </>
          }
        />

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-foreground">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0">
                    <ChevronDown className="h-5 w-5 text-primary" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
