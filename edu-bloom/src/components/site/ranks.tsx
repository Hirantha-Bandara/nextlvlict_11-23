import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { Medal, School, Trophy } from "lucide-react";

const students = [
  { name: "Sanduni Perera", rank: "District Rank 01", school: "Devi Balika Vidyalaya", result: "A", year: "2025" },
  { name: "Hasitha Bandara", rank: "District Rank 03", school: "Ananda College", result: "A", year: "2025" },
  { name: "Nethmi Silva", rank: "District Rank 05", school: "Vishaka Vidyalaya", result: "A", year: "2024" },
  { name: "Tharindu Jayasinghe", rank: "District Rank 08", school: "Nalanda College", result: "A", year: "2024" },
  { name: "Amaya Fernando", rank: "District Rank 11", school: "Musaeus College", result: "A", year: "2024" },
  { name: "Kavindu Rathnayake", rank: "District Rank 14", school: "Isipathana College", result: "A", year: "2023" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export function Ranks() {
  return (
    <section id="results" className="section-pad bg-surface">
      <div className="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Student results"
          title={
            <>
              Our <span className="text-gradient-navy">top rank</span> achievers
            </>
          }
          description="Every year Next Level ICT students place among the highest ICT results in their districts."
        />

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => (
            <StaggerItem key={s.name}>
              <article className="card-soft group relative overflow-hidden p-6">
                <span className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-lg font-extrabold text-accent-foreground">
                  {s.result}
                </span>
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary text-xl font-extrabold text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                  {initials(s.name)}
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{s.name}</h3>
                <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  <Trophy className="h-4 w-4" /> {s.rank}
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <School className="h-4 w-4 shrink-0" /> {s.school}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
                  <Medal className="h-3.5 w-3.5" /> A/L {s.year}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
