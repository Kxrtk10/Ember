import {
  ArrowRight,
  CalendarCheck,
  Flame,
  Lightbulb,
  MessageCircle,
  Quote,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Mission", href: "#mission" },
  { label: "How it works", href: "#pillars" },
  { label: "Story", href: "#story" },
];

const pillars = [
  {
    title: "Practice",
    description:
      "Practice the moments that usually make your mind go quiet, from walking up to someone new to speaking clearly in a room that matters.",
    icon: MessageCircle,
    accent: "from-[#ff8f70] to-[#ffc44d]",
    href: "/scenario",
  },
  {
    title: "Reflect",
    description:
      "Look back at conversations without being hard on yourself. Understand what happened, what you felt, and what you can try next time.",
    icon: RefreshCw,
    accent: "from-[#74d4c2] to-[#7aa7ff]",
    href: "/replay",
  },
  {
    title: "Ideas to Talk About",
    description:
      "Find interesting questions, stories, and ideas so you are not starting from a blank page.",
    icon: Lightbulb,
    accent: "from-[#ffd36c] to-[#ff8f70]",
    href: "/knowledge",
  },
  {
    title: "Daily Practice",
    description:
      "Small, human reps for courage. Say the thing, make the ask, start the exchange, and collect evidence that you can handle being seen.",
    icon: CalendarCheck,
    accent: "from-[#9ea7ff] to-[#74d4c2]",
    href: "#cta",
  },
];

const proofPoints = [
  "Confidence without performance mode",
  "Communication that sounds like you",
  "Resilience after awkward moments",
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211a16]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#ffad7a]/35 blur-3xl" />
        <div className="absolute right-[-10rem] top-[14rem] h-[30rem] w-[30rem] rounded-full bg-[#72d8c5]/25 blur-3xl" />
        <div className="absolute bottom-[18rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[#9da7ff]/20 blur-3xl" />
      </div>

      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/70 bg-[#fffaf2]/80 px-4 py-3 shadow-[0_18px_60px_rgba(74,51,35,0.10)] backdrop-blur-2xl sm:px-5">
          <a href="#" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#211a16] text-[#fffaf2] shadow-[0_10px_30px_rgba(33,26,22,0.20)]">
              <Sparkles size={17} strokeWidth={2.2} />
            </span>
            <span className="text-[1.05rem] font-semibold tracking-[-0.02em]">
              Ember
            </span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-[#6c5c52] transition hover:text-[#211a16]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <Link
            to="/onboarding"
            className="group inline-flex items-center gap-2 rounded-full bg-[#211a16] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(33,26,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#362a24]"
          >
            Begin
            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
        </nav>
      </header>

      <section className="relative px-5 pb-24 pt-32 sm:px-6 sm:pb-28 sm:pt-40 lg:pb-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ead8c7] bg-white/55 px-3 py-2 text-sm font-medium text-[#6c5c52] shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[#ff8f70] shadow-[0_0_22px_rgba(255,143,112,0.85)]" />
              For the moments you almost say it
            </div>

            <div className="relative mb-5 inline-block">
              <div className="absolute inset-x-2 bottom-2 h-6 rounded-full bg-[#ff8f70]/22 blur-xl sm:h-8" />
              <p className="relative bg-gradient-to-r from-[#211a16] via-[#7a4b39] to-[#d17352] bg-clip-text text-[clamp(3.8rem,10vw,8.4rem)] font-black uppercase leading-none tracking-[0.02em] text-transparent">
                Ember
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="h-px w-16 bg-gradient-to-r from-[#ff8f70] to-[#ffc44d]" />
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a8173]">
                  A place to practice being yourself
                </span>
              </div>
            </div>

            <h1 className="max-w-5xl text-[clamp(3.2rem,8.4vw,7.7rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-[#211a16]">
              Become comfortable being yourself.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#6c5c52] sm:text-xl sm:leading-9">
              Ember helps you stop shrinking in the moments that matter. If you
              replay conversations, hesitate before speaking, or worry how you
              will be judged, this is a place to build confidence with warmth,
              practice, and honest self-expression.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#pillars"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-6 py-4 text-base font-semibold text-white shadow-[0_20px_50px_rgba(33,26,22,0.22)] transition hover:-translate-y-0.5 hover:bg-[#362a24]"
              >
                See how it works
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </a>
              <a
                href="#mission"
                className="inline-flex items-center justify-center rounded-full border border-[#dfcab8] bg-white/50 px-6 py-4 text-base font-semibold text-[#2f261f] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80"
              >
                Why it exists
              </a>
            </div>

            <div className="mt-10 flex flex-col gap-3 text-sm font-medium text-[#75665c] sm:flex-row sm:flex-wrap">
              {proofPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full bg-white/45 px-3 py-2"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#74d4c2]" />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto mt-4 w-full max-w-[24.75rem] lg:mr-4 lg:mt-24">
            <div className="absolute -inset-10 rounded-[3rem] bg-[radial-gradient(circle_at_35%_20%,rgba(255,143,112,0.20),transparent_34%),radial-gradient(circle_at_75%_62%,rgba(116,212,194,0.24),transparent_32%),radial-gradient(circle_at_45%_95%,rgba(157,167,255,0.16),transparent_30%)] blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/75 bg-[#fffaf2]/70 p-3.5 shadow-[0_24px_70px_rgba(74,51,35,0.13)] backdrop-blur-xl">
              <div className="rounded-[1.35rem] border border-[#efe1d3] bg-[#211a16] p-4 text-white shadow-inner">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                      Today's practice
                    </p>
                    <p className="mt-1 text-base font-semibold">
                      Say the first sentence
                    </p>
                  </div>
                  <span className="rounded-full bg-white/10 p-1.5">
                    <Flame size={16} className="text-[#ffc44d]" />
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="rounded-2xl bg-white/[0.07] p-3.5">
                    <p className="text-[0.82rem] leading-6 text-white/68">
                      You see someone interesting at an event. Your mind starts
                      planning an exit.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-3.5 text-[#211a16] shadow-[0_15px_34px_rgba(0,0,0,0.15)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff7f61]">
                      Ember prompt
                    </p>
                    <p className="mt-2 text-[1.42rem] font-semibold leading-tight tracking-[-0.04em]">
                      What could you say if it did not need to be impressive?
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="rounded-2xl bg-[#74d4c2]/18 p-3.5">
                      <p className="text-xs text-white/45">Signal</p>
                      <p className="mt-1 text-[0.8rem] font-medium leading-5 text-white/82">
                        Curiosity beats perfection
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#ffc44d]/18 p-3.5">
                      <p className="text-xs text-white/45">Next rep</p>
                      <p className="mt-1 text-[0.8rem] font-medium leading-5 text-white/82">
                        One honest opener
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-2.5 text-center">
                {["Voice", "Presence", "Courage"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#efe1d3] bg-white/55 px-2.5 py-3 text-xs font-semibold text-[#5b4b43]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="relative px-5 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c56d54]">
                Why Ember exists
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#211a16] sm:text-6xl">
                Growth should feel human, not like homework.
              </h2>
            </div>
            <p className="max-w-3xl text-xl leading-9 text-[#67584f]">
              Ember is for the person who has ideas but edits them down, who
              wants deeper conversations but gets stuck at the first hello, who
              leads well in their head before they lead out loud. We help people
              practice confidence, communication, storytelling, and emotional
              resilience in a way that feels calm, precise, and deeply personal.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              ["Not a script", "Build range without losing your voice."],
              ["Not a classroom", "Practice real life with nuance and care."],
              ["Not a mask", "Become more yourself under pressure."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-[1.5rem] border border-[#ead8c7] bg-white/45 p-6 shadow-[0_18px_55px_rgba(74,51,35,0.06)] backdrop-blur"
              >
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#211a16]">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-[#75665c]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pillars" className="relative px-5 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2d9c8d]">
                How it works
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                Practice for the human moments no one taught you.
              </h2>
            </div>
            <p className="max-w-sm text-lg leading-8 text-[#75665c]">
              Four simple ways to practice real moments, understand yourself,
              and feel more comfortable around people.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <Link
                  key={pillar.title}
                  to={pillar.href}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-[#ead8c7] bg-white/58 p-6 shadow-[0_20px_70px_rgba(74,51,35,0.08)] backdrop-blur transition hover:-translate-y-1 hover:bg-white/75"
                >
                  <div
                    className={`absolute right-[-4rem] top-[-5rem] h-44 w-44 rounded-full bg-gradient-to-br ${pillar.accent} opacity-20 blur-2xl transition group-hover:opacity-30`}
                  />
                  <div className="relative">
                    <div
                      className={`mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.accent} text-white shadow-[0_16px_35px_rgba(74,51,35,0.16)]`}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-3xl font-semibold tracking-[-0.04em] text-[#211a16]">
                        {pillar.title}
                      </h3>
                      <ArrowRight
                        size={20}
                        className="mt-2 shrink-0 text-[#9a8173] transition group-hover:translate-x-1 group-hover:text-[#211a16]"
                      />
                    </div>
                    <p className="mt-4 max-w-xl text-base leading-7 text-[#6c5c52]">
                      {pillar.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="story" className="relative px-5 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.2rem] border border-[#ead8c7] bg-[#211a16] text-white shadow-[0_30px_100px_rgba(33,26,22,0.20)]">
          <div className="relative grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,143,112,0.34),transparent_30%),radial-gradient(circle_at_82%_82%,rgba(116,212,194,0.24),transparent_34%)]" />
            <div className="relative border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="flex h-full min-h-[23rem] flex-col justify-between">
                <Quote size={34} className="text-[#ffc44d]" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/45">
                    A quiet shift
                  </p>
                  <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                    From rehearsing your life to actually living it.
                  </h2>
                </div>
              </div>
            </div>

            <div className="relative p-7 sm:p-10 lg:p-12">
              <div className="space-y-8 text-xl leading-9 text-white/74">
                <p>
                  There is a version of you that knows what to say after the
                  moment passes. They are funny on the walk home. Honest in the
                  shower. Brave at 1:12 AM when the conversation is already over.
                </p>
                <p>
                  Ember is built for bringing that version forward in real time.
                  Not by forcing charisma, but by helping you understand your
                  patterns, practice the hard seconds, and trust your own voice
                  before the perfect words arrive.
                </p>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  ["01", "Notice the fear"],
                  ["02", "Choose a small rep"],
                  ["03", "Build self-trust"],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <p className="text-xs font-semibold text-[#ffc44d]">
                      {number}
                    </p>
                    <p className="mt-3 text-sm font-medium leading-6 text-white/78">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="relative px-5 pb-20 pt-12 sm:px-6 sm:pb-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full bg-white/65 text-[#ff7f61] shadow-[0_18px_50px_rgba(74,51,35,0.12)]">
            <Sparkles size={24} />
          </div>
          <h2 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#211a16] sm:text-6xl">
            The next conversation can feel different.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6c5c52]">
            Start with one rep. One sentence. One moment where you let yourself
            be seen a little more clearly than before.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/scenario"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-7 py-4 text-base font-semibold text-white shadow-[0_22px_55px_rgba(33,26,22,0.22)] transition hover:-translate-y-0.5 hover:bg-[#362a24]"
            >
              Start with practice
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/replay"
              className="inline-flex items-center justify-center rounded-full border border-[#dfcab8] bg-white/50 px-7 py-4 text-base font-semibold text-[#2f261f] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80"
            >
              Replay a moment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
