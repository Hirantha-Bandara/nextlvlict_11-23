import { Reveal, SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { BookOpen, Compass, Target } from "lucide-react";
import teacherBoard from "@/assets/teacher-board.asset.json";

const timeline = [
  { year: "2015", title: "Started teaching ICT", text: "First A/L batch of 18 students in Maharagama." },
  { year: "2018", title: "Institute partnerships", text: "Joined leading institutes across Colombo district." },
  { year: "2021", title: "Online island-wide", text: "Live online classes reaching students in every province." },
  { year: "2026", title: "Next Level ICT", text: "Full theory, revision and paper programme with 5,000+ alumni." },
];

const pillars = [
  { icon: Compass, title: "Concept First", text: "Every unit starts from the ground up — no memorising without understanding." },
  { icon: Target, title: "Past-Paper Driven", text: "Weekly structured MCQ and essay drills modelled on the real exam." },
  { icon: BookOpen, title: "Personal Follow-Up", text: "Progress tracking, feedback and doubt-clearing for every student." },
];

export function About() {
  return (
    <section id="about" className="section-pad bg-surface">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="absolute -left-4 -top-4 hidden h-32 w-32 rounded-3xl border border-primary/20 sm:block" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-lift)]">
            <img
              src="https://i.postimg.cc/xCJTvXHh/leaflet-front-page-00011.jpg"
              alt="Kavishna Munasingha teaching an ICT class"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          <SectionHeading
            align="left"
            eyebrow="About the teacher"
            title={
              <>
                BEHIND THE  &nbsp;<span className="text-gradient-navy">EXPERTISE</span>
              </>
            }
            description="
With a strong passion and in-depth interest in Information and Communication Technology (ICT), he entered the field of education while continuously pursuing further studies to strengthen his professional knowledge and qualifications in the computing industry.

Having completed his Advanced Level studies in the Mathematics stream at Isipathana College, Colombo, he successfully completed the BTEC Higher National Diploma (HND) in Computing. He is currently pursuing a BSc (Hons) degree in Cyber Security & Digital Forensics in collaboration with Kingston University, UK.

Beyond his academic qualifications, he actively engages in teaching, combining up-to-date ICT knowledge with practical industry-related experience. His primary focus is to provide quality ICT education for students preparing for both the Ordinary Level (O/L) and Advanced Level (A/L) examinations.

One of the key strengths of his teaching approach is the ability to simplify even complex technological concepts and present them in a clear, structured, and student-friendly manner. His teaching goes beyond theoretical subject knowledge, with special emphasis on developing students’ logical thinking, problem-solving abilities, and practical technological skills.

Through the NEXT LEVEL ICT brand, his ultimate vision is to deliver a modern, high-quality, and results-driven ICT learning experience that goes beyond traditional teaching methods, empowering students with the knowledge and skills needed to succeed in an ever-evolving technological world."
          />

          {/* <Stagger className="grid gap-4 sm:grid-cols-3">
            {pillars.map((p) => (
              <StaggerItem key={p.title} className="card-soft p-5">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </StaggerItem>
            ))}
          </Stagger> */}

          {/* <div className="relative border-l border-border pl-6">
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.07} className="relative pb-6 last:pb-0">
                <span className="absolute -left-[1.9rem] top-1.5 grid h-3 w-3 place-items-center rounded-full bg-accent ring-4 ring-surface" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.year}</p>
                <p className="mt-1 font-semibold text-foreground">{t.title}</p>
                <p className="text-sm text-muted-foreground">{t.text}</p>
              </Reveal>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
