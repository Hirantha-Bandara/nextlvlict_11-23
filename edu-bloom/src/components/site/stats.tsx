import { Reveal } from "@/components/site/ui";
import { Award, GraduationCap, Medal, Users } from "lucide-react";
import { stats } from "../../../mockData";

const icons = [Users, GraduationCap, Award, Medal];

export function Stats() {
  return <section className="relative -mt-3 sm:-mt-8"><div className="container-page"><div className="grid gap-3 rounded-[2rem] border border-border bg-card p-3 shadow-[var(--shadow-soft)] sm:grid-cols-2 sm:gap-4 sm:p-6 lg:grid-cols-3">
    {stats.map((stat, index) => { const Icon = icons[index % icons.length]!; return <Reveal key={stat.text} delay={index * 0.08}><div className="flex items-center gap-3 rounded-3xl bg-surface px-4 py-4 sm:gap-4 sm:px-5 sm:py-6"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground sm:h-12 sm:w-12"><Icon className="h-5 w-5" /></span><div className="min-w-0"><p className="text-xl font-extrabold text-foreground sm:text-3xl">{stat.number}</p><p className="truncate text-xs text-muted-foreground sm:text-sm">{stat.text}</p></div></div></Reveal>; })}
  </div></div></section>;
}
