import {
  Check,
  Compass,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useGrowthSnapshot } from "../growth/growthEngine";

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

function SignalBar({ signal }) {
  return (
    <article className="rounded-[1.35rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.035em] text-[#211a16]">
            {signal.label}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#75665c]">{signal.note}</p>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#9a8173]">
          Growing
        </span>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#ead8c7]/55">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff8f70] via-[#ffc44d] to-[#74d4c2]"
          style={{ width: `${signal.value}%` }}
        />
      </div>
    </article>
  );
}

function PathwayCard({ pathway }) {
  return (
    <article className="rounded-[1.5rem] border border-[#ead8c7] bg-white/58 p-5 shadow-[0_16px_45px_rgba(74,51,35,0.06)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#211a16]">
          {pathway.title}
        </h3>
        <span className="rounded-full bg-[#effdf9] px-3 py-1.5 text-xs font-semibold text-[#247d72]">
          In progress
        </span>
      </div>
      <p className="mt-3 text-sm leading-7 text-[#67584f]">
        {pathway.description}
      </p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#ead8c7]/55">
        <div
          className="h-full rounded-full bg-[#211a16]"
          style={{ width: `${pathway.value}%` }}
        />
      </div>
    </article>
  );
}

function EmptyMoments() {
  return (
    <div className="rounded-[1.35rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-5">
      <p className="text-lg font-semibold tracking-[-0.03em] text-[#211a16]">
        Your first moments will appear here.
      </p>
      <p className="mt-2 text-sm leading-7 text-[#75665c]">
        Practice a situation, reflect on something that happened, or save an
        idea you want to talk about. Ember will keep track gently.
      </p>
    </div>
  );
}

export default function GrowthJourney() {
  const snapshot = useGrowthSnapshot();
  const activeSignals = snapshot.hasActivity
    ? snapshot.signals.slice(0, 5)
    : snapshot.signals.slice(0, 5);
  const recentMoments = snapshot.recentMoments;
  const visiblePathways = snapshot.hasActivity
    ? [...snapshot.pathways].sort((a, b) => b.activity - a.activity).slice(0, 5)
    : snapshot.pathways.slice(0, 4);

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
            <span className="h-2 w-2 rounded-full bg-[#ff8f70] shadow-[0_0_22px_rgba(255,143,112,0.85)]" />
            Growth is becoming more of yourself
          </div>
          <h1 className="text-[clamp(3.35rem,9vw,7.7rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[#211a16]">
            My Growth
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-[#6c5c52]">
            A simple look at what you are practicing and how it is adding up.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 pb-24 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <SectionShell
            eyebrow="What you're improving"
            title="Skills you're building"
            icon={Compass}
          >
            <div className="grid gap-3">
              {activeSignals.map((signal) => (
                <SignalBar key={signal.label} signal={signal} />
              ))}
            </div>
          </SectionShell>

          <SectionShell
            eyebrow="What you've tried"
            title="Recent practice"
            icon={MessageCircle}
          >
            <div className="space-y-3">
              {recentMoments.length > 0 ? (
                recentMoments.map((moment) => (
                  <article
                    key={moment.id}
                    className="flex flex-col gap-3 rounded-[1.35rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c56d54]">
                        {moment.type}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#211a16]">
                        {moment.title}
                      </h3>
                    </div>
                    <span className="w-fit rounded-full border border-[#ead8c7] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#75665c]">
                      {moment.capabilities[0]}
                    </span>
                  </article>
                ))
              ) : (
                <EmptyMoments />
              )}
            </div>
          </SectionShell>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <SectionShell
            eyebrow="Areas you're working on"
            title="Where your practice is going"
            icon={Sparkles}
          >
            <div className="grid gap-4">
              {visiblePathways.map((pathway) => (
                <PathwayCard key={pathway.title} pathway={pathway} />
              ))}
            </div>
          </SectionShell>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 pb-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-[#211a16] p-6 text-white shadow-[0_24px_80px_rgba(33,26,22,0.16)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffc44d]">
            Things we notice
          </p>
          <div className="mt-5 space-y-4">
            {snapshot.insights.map((insight) => (
              <p
                key={insight}
                className="rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-4 text-lg font-semibold leading-8 text-white/82"
              >
                {insight}
              </p>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] border border-[#ead8c7] bg-white/62 p-6 shadow-[0_20px_65px_rgba(74,51,35,0.08)] backdrop-blur-xl sm:p-8">
          <div className="absolute right-[-5rem] top-[-6rem] h-52 w-52 rounded-full bg-[#ff8f70]/16 blur-3xl" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2d9c8d]">
              Who You're Becoming
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#211a16] sm:text-5xl">
              Not a different person. A less hidden version of you.
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {snapshot.becoming.map((item) => (
                <p
                  key={item}
                  className="flex gap-3 rounded-[1.25rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4 text-sm font-semibold leading-6 text-[#67584f]"
                >
                  <Check size={17} className="mt-0.5 shrink-0 text-[#2d9c8d]" />
                  {item}
                </p>
              ))}
            </div>
            <div className="mt-8 rounded-[1.35rem] border border-[#ead8c7] bg-[#fffaf2]/75 p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1ec] text-[#c56d54]">
                <Heart size={20} />
              </div>
              <p className="text-lg leading-8 text-[#67584f]">
                Growth is not becoming someone else. Growth is becoming more of
                yourself in the moments where you used to disappear.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
