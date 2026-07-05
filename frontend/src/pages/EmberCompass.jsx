import { useMemo } from "react";
import {
  Check,
  Compass,
  Eye,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import {
  generateCompassNarrative,
  useCoachGeneration,
} from "../coach/coachEngine";
import { useCompassSnapshot } from "../growth/growthEngine";

function SectionShell({ eyebrow, title, children, icon: Icon }) {
  return (
    <section className="rounded-[2rem] border border-[#ead8c7] bg-white/58 p-5 shadow-[0_20px_65px_rgba(74,51,35,0.07)] backdrop-blur-xl sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16]">
            {title}
          </h2>
        </div>
        {Icon ? (
          <span className="hidden rounded-full bg-[#fff1ec] p-3 text-[#c56d54] sm:inline-flex">
            <Icon size={20} />
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function ThemeCard({ theme }) {
  return (
    <article className="rounded-[1.35rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4">
      <h3 className="text-xl font-semibold tracking-[-0.035em] text-[#211a16]">
        {theme.title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-[#75665c]">{theme.detail}</p>
    </article>
  );
}

function ReflectionList({ items, emptyText }) {
  const visibleItems = items.length > 0 ? items : [emptyText];

  return (
    <div className="space-y-3">
      {visibleItems.map((item) => (
        <p
          key={item}
          className="flex gap-3 rounded-[1.25rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4 text-sm font-semibold leading-7 text-[#67584f]"
        >
          <Check size={17} className="mt-1 shrink-0 text-[#2d9c8d]" />
          {item}
        </p>
      ))}
    </div>
  );
}

export default function EmberCompass() {
  const compass = useCompassSnapshot();
  const fallbackNarrative = useMemo(
    () =>
      generateCompassNarrative({
        context: {
          compass,
          growth: compass,
          activity: { all: compass.events ?? [] },
        },
      }),
    [compass],
  );
  const compassInput = useMemo(
    () => ({
      context: {
        compass,
        growth: compass,
        activity: { all: compass.events ?? [] },
      },
    }),
    [compass],
  );
  const {
    data: coachNarrative,
    error: compassError,
    status: compassStatus,
  } = useCoachGeneration({
    surface: "compass",
    input: compassInput,
    fallback: fallbackNarrative,
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211a16]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#ffad7a]/26 blur-3xl" />
        <div className="absolute right-[-10rem] top-[16rem] h-[30rem] w-[30rem] rounded-full bg-[#72d8c5]/22 blur-3xl" />
        <div className="absolute bottom-[10rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[#9da7ff]/14 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20">
        <div className="max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ead8c7] bg-white/55 px-3 py-2 text-sm font-medium text-[#6c5c52] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#74d4c2] shadow-[0_0_22px_rgba(116,212,194,0.85)]" />
            A clearer look at what keeps showing up
          </div>
          <h1 className="text-[clamp(3.35rem,9vw,7.7rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[#211a16]">
            Patterns
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-[#6c5c52]">
            See what you have been practicing lately.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 pb-24 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="space-y-6">
          <SectionShell
            eyebrow="What keeps showing up"
            title="The main things Ember notices"
            icon={Compass}
          >
            {compass.currentThemes.length > 0 ? (
              <div className="grid gap-3">
                {compass.currentThemes.map((theme) => (
                  <ThemeCard key={theme.title} theme={theme} />
                ))}
              </div>
            ) : (
              <p className="rounded-[1.35rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-5 text-base leading-8 text-[#75665c]">
                After you practice, reflect, or save an idea, Ember will show
                the themes that keep coming back.
              </p>
            )}
          </SectionShell>

          <SectionShell
            eyebrow="What you've been practicing"
            title="Situations you've explored"
            icon={Eye}
          >
            <div className="flex flex-wrap gap-2">
              {(compass.exploring.length > 0
                ? compass.exploring
                : ["Practice", "Reflection", "Conversation ideas"]
              ).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-[#ead8c7] bg-[#fffaf2]/75 px-3 py-2 text-sm font-semibold text-[#67584f]"
                >
                  {topic}
                </span>
              ))}
            </div>
          </SectionShell>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <SectionShell
            eyebrow="What seems to be growing"
            title="Strengths you may be building"
            icon={Sparkles}
          >
            <ReflectionList
              items={compass.strengths}
              emptyText="Your strengths will become easier to see after a few practice moments."
            />
          </SectionShell>

          <SectionShell
            eyebrow="What you could try next"
            title="Small invitations"
            icon={Lightbulb}
          >
            <ReflectionList
              items={compass.opportunities}
              emptyText="Try one practice or reflection, and Ember will suggest a gentle next step."
            />
          </SectionShell>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-24 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#211a16] p-7 text-white shadow-[0_24px_80px_rgba(33,26,22,0.16)] sm:p-10">
          <div className="absolute right-[-6rem] top-[-7rem] h-64 w-64 rounded-full bg-[#ff8f70]/24 blur-3xl" />
          <div className="absolute bottom-[-7rem] left-[18%] h-60 w-60 rounded-full bg-[#74d4c2]/18 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffc44d]">
              A helpful reminder
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
              {compass.reflection}
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              {coachNarrative.narratives.join(" ")} This page does not decide
              who you are. It simply reflects what you have been practicing.
            </p>
            {compassStatus === "loading" ? (
              <p className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4 text-sm font-semibold leading-6 text-white/68">
                Ember is reading your recent practice and looking for a simple
                pattern.
              </p>
            ) : null}
            {compassError ? (
              <p className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4 text-sm font-semibold leading-6 text-white/68">
                Live AI is not available right now, so Ember is showing a gentle
                fallback.
              </p>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}
