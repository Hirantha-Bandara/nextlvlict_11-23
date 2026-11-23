import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import heroTeacher from "@/assets/hero-cutout.asset.json";
import classroom from "@/assets/teacher-board.asset.json";
import teaching from "@/assets/teacher-teaching.asset.json";
import notes from "@/assets/teacher-notes.asset.json";

const heroSlides = [
  {
    src: "https://i.postimg.cc/XvM9d9J3/Untitled-1.jpg",
    alt: "ICT theory class in progress",
    color: "from-[#163f6b]/95 via-[#24598e]/82 to-[#38b2ac]/56",
  },
  {
    src: "https://i.postimg.cc/TYgtS2WZ/Untitled-4.jpg",
    alt: "Interactive classroom session",
    color: "from-[#1a365d]/95 via-[#2c5282]/80 to-[#ed8936]/52",
  },
  {
    src: "https://i.postimg.cc/C5KcXbbp/Untitled-3.jpg",
    alt: "Reviewing ICT class notes",
    color: "from-[#163f6b]/95 via-[#2f6e91]/76 to-[#38b2ac]/52",
  },
];

export function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeHeroSlide = heroSlides[activeSlide]!;

  useEffect(() => {
    if (reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const selectSlide = (index: number) => setActiveSlide((index + heroSlides.length) % heroSlides.length);

  return (
    <section id="top" className="relative isolate overflow-hidden pb-8 pt-20 sm:pb-16 sm:pt-32 md:pb-24 md:pt-40">
      <AnimatePresence initial={false}>
        <motion.div
          key={activeHeroSlide.src}
          initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 1.15, ease: "easeOut" }}
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)]"
        >
          <img
            src={activeHeroSlide.src}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${activeHeroSlide.color}`} />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.1),transparent_36%,rgba(0,0,0,0.18))]" />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.2),transparent_22%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-15 h-70 w-70 rounded-full bg-accent/25 blur-3xl" />

      <div className="container-page relative grid items-center gap-5 sm:gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full flex-col items-start gap-5 sm:gap-6"
        >
          {/* <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            G.C.E. Advanced Level ICT
          </span> */}

          <div className="w-full space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-200 sm:text-sm sm:tracking-[0.28em]">
              Kavishna Munasingha
            </p>
            <h1 className="text-[2.15rem] font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
              Take Your ICT Skills to the &nbsp;
              {/* <br /> */}
              <span className="text-orange-200">NEXT LEVEL</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-blue-50/90 sm:text-lg">
              Professional O/L & A/L ICT Classes designed to build strong conceptual understanding, practical skills, and examination confidence. Learn with clear explanations, structured guidance, and a focused approach to achieving your best results.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="https://nextlvlict.com/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-lift)] transition-transform hover:-translate-y-0.5 sm:w-auto sm:py-4"
            >
              Enroll Now <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#lessons"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto sm:py-4"
            >
              <PlayCircle className="h-4 w-4" /> Watch Free Lessons
            </a>
          </div>

          {/* <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 fill-accent text-accent" /> 4.9 / 5 student rating
            </span>
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" /> 5,000+ students taught
            </span>
          </div> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          <div className="">
            {/* <span className="absolute inset-x-8 bottom-0 top-16 rounded-t-[6rem] bg-primary/10" /> */}
            <img
              src="public/hero.png"
              alt="Kavishna Munasingha, A/L ICT teacher"
              className="relative mx-auto h-[24rem] w-auto max-w-full object-contain [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)] sm:h-[28rem] lg:h-[40rem]"
              width={307}
              height={888}
            />
          </div>


          {/* <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass-panel absolute -left-2 top-16 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)] sm:-left-8"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
              <Award className="h-4 w-4" />
            </span>
            <span className="text-xs leading-tight">
              <strong className="block text-sm font-bold text-foreground">150+</strong>
              District Ranks
            </span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="glass-panel absolute -right-2 bottom-20 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)] sm:-right-8"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="text-xs leading-tight">
              <strong className="block text-sm font-bold text-foreground">98%</strong>
              A / B Passes
            </span>
          </motion.div> */}
        </motion.div>
      </div>

      {/* <div className="container-page relative mt-7 flex items-center justify-between gap-4 md:mt-0">
        <div className="flex items-center gap-2" aria-label="Hero slideshow controls">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${index + 1}: ${slide.alt}`}
              aria-current={activeSlide === index ? "true" : undefined}
              onClick={() => selectSlide(index)}
              className={`h-1.5 rounded-full transition-all ${activeSlide === index ? "w-10 bg-orange-200" : "w-5 bg-white/45 hover:bg-white/75"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => selectSlide(activeSlide - 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => selectSlide(activeSlide + 1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div> */}
    </section>
  );
}

