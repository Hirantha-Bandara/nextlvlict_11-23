import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { Quote } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

function initials(name: string) {
  return name
    .split(" ")
    .map((namePart) => namePart[0])
    .join("");
}

export function Testimonials() {
  const { testimonials, testimonialsLoading } = usePortfolioData();

  return (
    <section id="testimonials" className="section-pad bg-surface">
      <div className="container-page flex flex-col gap-12">
        <SectionHeading eyebrow="Testimonials" title={<>What <span className="text-gradient-navy">students say</span></>} description="Real feedback from students who studied ICT with Kavishna Munasingha." />

        {testimonialsLoading ? (
          /* Skeleton grid while fetching live data */
          <div className="grid gap-3 sm:gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-soft h-40 sm:h-56 animate-pulse rounded-xl sm:rounded-3xl bg-muted" />
            ))}
          </div>
        ) : (
          <Stagger className="grid gap-3 sm:gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.id} className="h-full">
                <article className="card-soft flex h-full flex-col p-4 sm:p-7 rounded-xl sm:rounded-3xl">
                  <Quote className="h-5 w-5 sm:h-8 sm:w-8 text-primary-soft" />
                  <p className="mt-2 sm:mt-4 flex-1 text-[11px] sm:text-sm leading-relaxed text-muted-foreground">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="mt-2 sm:mt-4 flex min-w-0 items-center gap-2 sm:gap-3 border-t border-border pt-2 sm:pt-4">
                    <span className="relative grid h-8 w-8 sm:h-11 sm:w-11 shrink-0 place-items-center overflow-hidden rounded-lg sm:rounded-2xl bg-primary text-[10px] sm:text-sm font-bold text-primary-foreground">
                      {initials(testimonial.name)}
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="absolute inset-0 h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </span>
                    <span className="min-w-0"><span className="block truncate text-[11px] sm:text-sm font-bold text-foreground">{testimonial.name}</span><span className="block truncate text-[9px] sm:text-xs text-muted-foreground">{testimonial.role}</span></span>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
