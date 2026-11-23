import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { ArrowUpRight, Check } from "lucide-react";
import { courses } from "../../../mockData";

export function Courses() {
  // return <section id="courses" className="section-pad"><div className="container-page flex flex-col gap-12">
  //   <SectionHeading eyebrow="Courses" title={<>ICT programmes for every <span className="text-gradient-navy">stage</span></>} description="Choose the programme that matches where you are today." />
  //   <Stagger className="grid gap-6 md:grid-cols-2">{courses.map((course) => <StaggerItem key={course.id} className="h-full"><article className="card-soft flex h-full flex-col p-6">
  //     <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">ICT programme</span>
  //     <h3 className="mt-4 text-xl font-extrabold text-foreground">{course.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
  //     <ul className="mt-5 flex flex-1 flex-col gap-2.5">{course.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary-teal" />{feature}</li>)}</ul>
  //     <a href="#contact" className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">Enroll <ArrowUpRight className="h-4 w-4" /></a>
  //   </article></StaggerItem>)}</Stagger>
  // </div></section>;
}
