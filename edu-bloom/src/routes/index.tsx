import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Stats } from "@/components/site/stats";
import { About } from "@/components/site/about";
import { Courses } from "@/components/site/courses";
import { Ranks } from "@/components/site/ranks";
import { Materials } from "@/components/site/materials";
import { Lessons } from "@/components/site/lessons";
import { Gallery } from "@/components/site/gallery";
import { Testimonials } from "@/components/site/testimonials";
import { Events } from "@/components/site/events";
import { Schedule } from "@/components/site/schedule";
import { Fees } from "@/components/site/fees";
import { Faq } from "@/components/site/faq";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";

const title = "Next Level ICT | A/L ICT Classes by Kavishna Munasingha";
const description =
  "A/L ICT theory, revision and paper classes with Kavishna Munasingha. 5,000+ students, 150+ district ranks. Maharagama, Piliyandala, Homagama and online island-wide.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="hero-mesh">
          <Hero />
          <Stats />
        </div>

        <About />
        <Courses />
        {/* <Ranks /> */}
        <section className="container-page py-6 sm:py-8">
          <div className="rounded-[2rem] border border-border/80 bg-gradient-to-r from-primary/10 via-background to-accent/10 p-6 shadow-[var(--shadow-soft)] sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Student Portal</p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Access your student dashboard
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Log in to continue with your lessons, resources, and class updates through the student portal.
                </p>
              </div>

              <a
                href="https://nextlvlict.com/login"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5"
              >
                Open Student Portal
              </a>
            </div>
          </div>
        </section>
        <Lessons />
        {/* <Materials /> */}
        <Schedule />
        <Events />
        <Testimonials />
        {/* <Fees /> */}
        {/* <Faq /> */}
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
