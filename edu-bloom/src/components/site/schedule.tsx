import { SectionHeading, Stagger, StaggerItem } from "@/components/site/ui";
import { Clock, MapPin, Users } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

export function Schedule() {
  const { olTimetable, alTimetable, scheduleLoading } = usePortfolioData();

  const timetableGroups = [
    // ----- O/L groups --------------------------------------------------------
    {
      title: "O/L Grade 10",
      sessions: olTimetable.flatMap((branch) =>
        branch.grade10.map((item) => ({
          // Derive the grade label from the array context so the card always
          // shows the correct value even if the API entry omits the grade field.
          grade: "Grade 10",
          location: item.location,
          time: item.time,
          group: item.group,
          key: `${branch.branch}-grade10-${item.time}`,
        })),
      ),
    },
    {
      title: "O/L Grade 11",
      sessions: olTimetable.flatMap((branch) =>
        branch.grade11.map((item) => ({
          grade: "Grade 11",
          location: item.location,
          time: item.time,
          group: item.group,
          key: `${branch.branch}-grade11-${item.time}`,
        })),
      ),
    },
    {
      // grade11RevisionPaper is not part of the core OLTimetableDTO spec;
      // it only exists in mockData. Guard with ?. and hide the group if empty.
      title: "O/L Grade 11 Revision + Paper",
      sessions: olTimetable.flatMap((branch) =>
        (branch.grade11RevisionPaper ?? []).map((item) => ({
          grade: "Grade 11",
          location: item.location,
          time: item.time,
          group: item.group,
          key: `${branch.branch}-grade11-revision-${item.time}`,
        })),
      ),
    },
    // ----- A/L groups --------------------------------------------------------
    // Group A/L timetable by year and type dynamically
    ...(() => {
      const alGroups = new Map<
        string,
        Array<{
          location: string;
          grade: string;
          time: string;
          group: string | undefined;
          key: string;
        }>
      >();

      alTimetable.forEach((item) => {
        const groupKey = `${item.year} - ${item.type}`;
        if (!alGroups.has(groupKey)) {
          alGroups.set(groupKey, []);
        }
        alGroups.get(groupKey)!.push({
          location: item.branch,
          grade: item.year,
          time: item.time,
          group: undefined as string | undefined,
          key: `${item.branch}-${item.year}-${item.type}-${item.time}`,
        });
      });

      return Array.from(alGroups.entries()).map(([key, sessions]) => ({
        title: `A/L ${key}`,
        sessions,
      }));
    })(),
  ].filter((group) => group.sessions.length > 0); // hide groups with no sessions

  return (
    <section id="schedule" className="section-pad">
      <div className="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Class schedule"
          title={
            <>
              Weekly <span className="text-gradient-navy">timetable</span>
            </>
          }
          description="Current O/L and A/L class times across our physical and online branches."
        />

        {scheduleLoading ? (
          /* Skeleton rows while fetching live data */
          <div className="flex flex-col gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="h-6 w-48 animate-pulse rounded-full bg-muted" />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-32 animate-pulse rounded-3xl bg-muted" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {timetableGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <h3 className="text-center text-lg font-extrabold text-foreground sm:text-xl">
                    {group.title}
                  </h3>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.sessions.map((session) => (
                    <StaggerItem key={session.key} className="h-full">
                      <article className="card-soft flex h-full flex-col p-6">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                          <span className="truncate text-xs font-bold uppercase tracking-[0.18em] text-secondary-teal">
                            {session.grade}
                          </span>
                          {session.group ? (
                            <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[0.7rem] font-semibold text-primary">
                              {session.group}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="min-w-0 break-words">{session.time}</span>
                        </p>
                        <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span className="min-w-0 break-words">{session.location}</span>
                        </p>
                        <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                          <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>Limited batch size</span>
                        </p>
                      </article>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
