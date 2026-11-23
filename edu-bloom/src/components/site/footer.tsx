import { Facebook, Instagram, Youtube, Music2 } from "lucide-react";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/icttutorlk", Icon: Facebook },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kavishnamunasingha?stkn=MWRybWRodHIzNHp2Yw==",
    Icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@kavishnamunasingha?si=R9aFn83N-kYV67Tm",
    Icon: Youtube,
  },
  { label: "TikTok", href: "https://www.tiktok.com/@kavishnamunasingha", Icon: Music2 },
];

const quickLinks = [
  { label: "About", href: "#about" },
  // { label: "Courses", href: "#courses" },
  { label: "Free Lessons", href: "#lessons" },
  // { label: "Student Results", href: "#results" },
  { label: "Class Schedule", href: "#schedule" },
  // { label: "Course Fees", href: "#fees" },
  { label: "Privacy Policy", href: "/privacy-policy.html" },
  { label: "Terms of Service", href: "/terms-and-conditions.html" },
  { label: "Refund Policy", href: "/refund-policy.html" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <a href="#top" className="flex items-center gap-3">
            {/* <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </span> */}
            <a href="#top" className="shrink-0" aria-label="Next Level ICT home">
            <img src="/Logo[1]-4.png" alt="Next Level ICT" className="h-12 w-auto" />
          </a>
            {/* <span className="leading-tight">
              <span className="block text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
                Next Level ICT
              </span>
              <span className="block text-xs text-muted-foreground">Kavishna Munasingha</span>
            </span> */}
          </a>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            A/L ICT theory, revision and paper classes in Maharagama, Piliyandala, Homagama and live
            online across Sri Lanka.
          </p>
          <div className="flex gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-border text-primary transition-colors hover:bg-secondary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">
            Quick links
          </h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {l.label}
                </a>
                
              </li>
              
            ))}
          </ul>
          
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-foreground">Contact</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <li>
              <a href="tel:+94784800385" className="hover:text-primary">
                +94 78 480 0385
              </a>
            </li>
            <li>
              <a href="tel:+94761338551" className="hover:text-primary">
                +94 76 133 8551
              </a>
            </li>
            <li>
              <a href="mailto:info@nextlvlict.com" className="break-all hover:text-primary">
                nextlevelict.info@gmail.com
              </a>
            </li>
            <li>Maharagama · Piliyandala · Homagama</li>
            <li>www.nextlvlict.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <p className="container-page text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Next Level ICT — Kavishna Munasingha. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
