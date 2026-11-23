import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { BookMarked, Download, FileText, Notebook, Printer } from "lucide-react";
import { resources } from "../../../mockData";

const icons = [BookMarked, FileText, Notebook, Printer];

export function Materials() {
  return <section className="section-pad"><div className="container-page flex flex-col gap-12">
    <SectionHeading eyebrow="Study materials" title={<>Everything you need, <span className="text-gradient-navy">already prepared</span></>} description="Resources to support your ICT learning." />
    <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{resources.map((resource, index) => { const Icon = icons[index % icons.length]!; return <StaggerItem key={resource.id} className="h-full"><article className="card-soft flex h-full flex-col p-6"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold text-foreground">{resource.title}</h3><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{resource.description}</p><a href={resource.downloadLink} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent"><Download className="h-4 w-4" /> Download</a></article></StaggerItem>; })}</Stagger>
  </div></section>;
}
