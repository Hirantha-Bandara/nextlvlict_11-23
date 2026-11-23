import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import galleryVideo from "@/assets/gallery_video.mp4";

type ClassLocation = {
  name: string;
  location: string;
  image?: string;
};

const classLocations: ClassLocation[] = [
  { name: "Sasip", location: "Nugegoda", image: "/Classes-logo/Sasip.png" },
  { name: "Sasira", location: "Piliyandala", image: "/Classes-logo/Sasira.png" },
  { name: "Ziyonpen", location: "Maharagama", image: "/Classes-logo/Ziyonpen.PNG" },
  { name: "Wings", location: "Maharagama", image: "/Classes-logo/Wings.png" },
  { name: "Susipka", location: "Homagama", image: "/Classes-logo/Susipka.png" },
  { name: "Wales", location: "Moratuwa", image: "/Classes-logo/Wels.png" },
  { name: "Online", location: "Islandwide", image: "/Classes-logo/Online.png" },
  { name: "Universe", location: "Homagama", image: "/Classes-logo/Universe.PNG" },
];

export function Gallery() {
  const { images, isLoading } = useGalleryImages();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="gallery" className="section-pad">
      <div className="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Gallery"
          title={
            <>
              Inside the <span className="text-gradient-navy">classroom</span>
            </>
          }
          description="Bright halls, small batches and a whiteboard that never stops moving."
        />

        {isLoading ? (
          /* Skeleton grid while fetching from ImageUploadServlet */
          <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-3 lg:auto-rows-[210px]">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl bg-muted" />
            ))}
          </div>
        ) : (
          <Stagger className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-3 lg:auto-rows-[210px]">
            <StaggerItem className="col-span-2 md:col-span-3 md:row-span-3">
              <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-secondary shadow-[var(--shadow-soft)]">
                <video
                  src={galleryVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="Classroom gallery video"
                  className="h-full w-full object-cover"
                />
              </div>
            </StaggerItem>
            {images.map((img) => (
              <StaggerItem key={img.id}>
                <button
                  type="button"
                  onClick={() => setActive(img.imageUrl)}
                  className="group relative h-full w-full overflow-hidden rounded-3xl border border-border bg-secondary shadow-[var(--shadow-soft)]"
                >
                  <img
                    src={img.imageUrl}
                    alt={`Gallery image ${img.displayOrder}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-primary/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomIn className="h-6 w-6 text-primary-foreground" />
                  </span>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        )}

        <div className="class-logo-marquee" aria-label="Our class locations">
          <div className="class-logo-track">
            {[...classLocations, ...classLocations].map((classLocation, index) => (
              <div
                key={`${classLocation.name}-${index}`}
                aria-hidden={index >= classLocations.length}
                className="flex w-44 shrink-0 flex-col items-center gap-10 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:w-52"
              >
                <div className="grid h-28 w-full place-items-center rounded-2xl p-3">
                  {classLocation.image ? (
                    <img
                      src={classLocation.image}
                      alt={`${classLocation.name} class logo`}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-3xl font-extrabold tracking-tight text-primary">
                      {classLocation.name.slice(0, 1)}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold text-foreground">{classLocation.name}</p>
                  <p className="text-sm text-muted-foreground">{classLocation.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] grid place-items-center bg-foreground/80 p-4 sm:p-6 backdrop-blur-sm"
          >
            <motion.img
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              src={active}
              alt="Classroom gallery enlarged"
              className="max-h-[85vh] max-w-full w-auto rounded-3xl object-contain shadow-[var(--shadow-lift)]"
            />
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-2xl bg-background text-foreground sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
