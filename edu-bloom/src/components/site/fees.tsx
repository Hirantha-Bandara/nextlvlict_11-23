import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Theory Class",
    price: "3,500",
    period: "per month",
    text: "Grade 12 or Grade 13 weekly theory session.",
    features: ["4 sessions per month", "Printed tutorials", "Weekly MCQ quiz", "WhatsApp doubt support"],
    featured: false,
  },
  {
    name: "Theory + Paper",
    price: "5,500",
    period: "per month",
    text: "Complete package for final-year students targeting an A.",
    features: [
      "Theory + paper classes",
      "40+ marked papers",
      "Revision note packs",
      "Individual progress review",
      "Priority WhatsApp support",
    ],
    featured: true,
  },
  {
    name: "Online Island-wide",
    price: "3,000",
    period: "per month",
    text: "Live Zoom class with recordings for one week.",
    features: ["Live interactive class", "7-day recording access", "Digital notes", "Online quizzes"],
    featured: false,
  },
];

export function Fees() {
  return (
    <section id="fees" className="section-pad bg-surface">
      <div className="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Course fees"
          title={
            <>
              Simple, transparent <span className="text-gradient-navy">monthly fees</span>
            </>
          }
          description="All materials included. First class is free — join, sit through a full session and then decide."
        />

        <Stagger className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <StaggerItem key={p.name} className="h-full">
              <article
                className={`card-soft flex h-full flex-col p-8 ${
                  p.featured ? "ring-2 ring-accent lg:-translate-y-3" : ""
                }`}
              >
                {p.featured ? (
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-accent-foreground">
                    <Sparkles className="h-3 w-3" /> Best value
                  </span>
                ) : null}
                <h3 className="text-lg font-extrabold text-foreground">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                <p className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-primary">Rs. {p.price}</span>
                  <span className="pb-1 text-sm text-muted-foreground">{p.period}</span>
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    p.featured
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  Register Now
                </a>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
