import { useState, type FormEvent } from "react";
import { MapPin, Phone, Send, MessageCircle, Mail } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/ui";

const inputCls =
  "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary sm:text-sm";

export function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = [
      `Full name: ${formData.get("name") || "-"}`,
      `Phone number: ${formData.get("phone") || "-"}`,
      `School: ${formData.get("school") || "-"}`,
      `Class: ${formData.get("class") || "-"}`,
      `Message: ${formData.get("message") || "-"}`,
    ].join("\n");

    window.open(`https://wa.me/94761338551?text=${encodeURIComponent(message)}`, "_blank");
    e.currentTarget.reset();
    setSent(true);
  }

  return (
    <section id="contact" className="section-pad bg-surface">
      <div className="container-page flex flex-col gap-12">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Reserve your <span className="text-gradient-navy">seat today</span>
            </>
          }
          description="Message on WhatsApp for the fastest reply, or send the form and we'll call you back."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-5">
            <a
              href="https://wa.me/94784800385"
              target="_blank"
              rel="noreferrer"
              className="card-soft flex items-center gap-4 p-5 sm:p-6"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-secondary-teal">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-foreground">WhatsApp</span>
                <span className="block truncate text-sm text-muted-foreground">
                  +94 78 480 0385
                </span>
              </span>
            </a>

            <div className="grid gap-5 sm:grid-cols-2">
              <a href="tel:+94784800385" className="card-soft flex items-center gap-4 p-5 sm:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Phone className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-foreground">Call</span>
                  <span className="block truncate text-sm text-muted-foreground">+94 76 133 8551</span>
                </span>
              </a>
              <a
                href="mailto:info@nextlvlict.com"
                className="card-soft flex items-center gap-4 p-5 sm:p-6"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-foreground">Email</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    nextlevelict.info@gmail.com
                  </span>
                </span>
              </a>
            </div>

            <div className="card-soft flex items-start gap-4 p-5 sm:p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                <strong className="block text-foreground">Class locations</strong>
                Ovidma &amp; Wings — Maharagama · Sesira — Piliyandala · Universe — Homagama · Online
                island-wide
              </span>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-soft)]">
              <iframe
                title="Class location map — Maharagama"
                src="https://www.google.com/maps?q=Maharagama,Sri%20Lanka&output=embed"
                loading="lazy"
                className="h-64 w-full border-0"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              className="flex h-full flex-col gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-soft)] sm:p-7"
            >
              <h3 className="text-xl font-extrabold text-foreground">Send an enquiry</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="name" className={inputCls} placeholder="Full name" required />
                <input name="phone" className={inputCls} placeholder="Phone number" required />
              </div>
              <input name="school" className={inputCls} placeholder="School" />
              <select name="class" className={inputCls} defaultValue="">
                <option value="" disabled>
                  Select a class
                </option>
                <option>O/L Theory</option>
                <option>A/L Theory</option>
                <option>Revision Class</option>
                <option>Paper Class</option>
                <option>Online Island-wide</option>
              </select>
              <textarea
                name="message"
                className={`${inputCls} min-h-32 flex-1 resize-none`}
                placeholder="Your message"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" /> {sent ? "Thank you — we'll call you" : "Send enquiry"}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                We usually reply within a few hours on class days.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
