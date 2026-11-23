import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { useFreeLessons } from "@/hooks/useFreeLessons";
import { Youtube } from "lucide-react";

function getYouTubeEmbedUrl(youtubeUrl: string): string | null {
  // Also accepts Markdown links returned by some content tools.
  const urlValue = youtubeUrl.match(/^\[[^\]]*\]\((.+)\)$/)?.[1] ?? youtubeUrl;

  try {
    const url = new URL(urlValue);
    const host = url.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (host === "youtu.be") videoId = url.pathname.slice(1).split("/")[0];
    if (host === "youtube.com" || host === "m.youtube.com") {
      videoId =
        url.searchParams.get("v") ??
        url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ??
        null;
    }

    return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : null;
  } catch {
    return null;
  }
}

export function Lessons() {
  const { freeLessons, isLoading } = useFreeLessons();

  return (
    <section id="lessons" className="section-pad bg-surface">
      <div className="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Free lessons"
          title={
            <>
              Learn a full unit <span className="text-gradient-navy">for free</span>
            </>
          }
          description="Sample the teaching style before you enroll. New lessons are published on YouTube every week."
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="card-soft aspect-video animate-pulse bg-secondary" />
            ))}
          </div>
        ) : (
          <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {freeLessons.map((lesson) => {
              const embedUrl = getYouTubeEmbedUrl(lesson.youtubeUrl);

              return (
                <StaggerItem key={lesson.id} className="h-full">
                  <article className="card-soft flex h-full flex-col overflow-hidden">
                    <div className="aspect-video w-full bg-secondary">
                      {embedUrl && (
                        <iframe
                          src={embedUrl}
                          title={lesson.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-teal">
                        {lesson.unitLabel}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-foreground">{lesson.title}</h3>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        <div className="flex justify-center">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
          >
            <Youtube className="h-4 w-4 text-accent" /> View the full YouTube channel
          </a>
        </div>
      </div>
    </section>
  );
}
