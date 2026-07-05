import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Brain,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import {
  generateConversationFuel,
  useCoachGeneration,
} from "../coach/coachEngine";
import { recordGrowthEvent } from "../growth/growthEngine";

const featuredFuel = {
  topic: "Why do embarrassing memories stay with us longer than achievements?",
  capabilities: ["Curiosity", "Emotional Intelligence", "Resilience"],
  quickTake:
    "Embarrassing memories often stick because they feel unfinished. Your mind keeps replaying what happened, how it felt, and what you wish you had done. Achievements can feel complete. Awkward moments can feel like they still need an answer.",
  perspectives: [
    {
      label: "Psychology",
      text: "Your mind tends to remember moments that felt socially risky, especially when you cared how you came across.",
    },
    {
      label: "Social",
      text: "Embarrassment is often about imagining how others saw us, even when most people moved on quickly.",
    },
    {
      label: "Personal",
      text: "An awkward memory can become less powerful when you treat it as proof that you were trying, learning, or being seen.",
    },
  ],
  starters: [
    "What's the most random thing you still remember from school?",
    "Do you think other people remember our awkward moments as much as we do?",
    "What's a moment that felt embarrassing then but feels funny now?",
    "Why do compliments fade faster than criticism?",
    "What would change if we treated cringe as proof that we participated?",
  ],
  deepDive: [
    "People often notice our mistakes less than we think. A moment that feels huge to you may have been a tiny detail to everyone else.",
    "Embarrassment can also show that you care. It often means you wanted the moment to go well.",
    "A useful reframe: the memory may not be asking you to disappear. It may be asking you to update the story from 'I failed socially' to 'I survived being seen.'",
  ],
};

const relatedTopics = [
  {
    title: "Why small talk is secretly about safety",
    capabilities: ["Communication", "Presence", "Curiosity"],
  },
  {
    title: "The difference between being impressive and being memorable",
    capabilities: ["Self-Expression", "Storytelling", "Communication"],
  },
  {
    title: "Why people bond faster over tiny confessions",
    capabilities: ["Empathy", "Self-Expression", "Curiosity"],
  },
  {
    title: "How stories make ordinary experiences feel meaningful",
    capabilities: ["Storytelling", "Communication", "Curiosity"],
  },
  {
    title: "Why silence in conversation feels louder than it is",
    capabilities: ["Presence", "Resilience", "Emotional Intelligence"],
  },
  {
    title: "The art of asking a question people actually want to answer",
    capabilities: ["Curiosity", "Communication", "Empathy"],
  },
];

function SectionShell({ eyebrow, title, children, icon: Icon }) {
  return (
    <section className="rounded-[2rem] border border-[#ead8c7] bg-white/58 p-5 shadow-[0_20px_65px_rgba(74,51,35,0.07)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
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

function PerspectiveCard({ perspective }) {
  return (
    <article className="rounded-[1.35rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-5">
      <h3 className="text-xl font-semibold tracking-[-0.035em] text-[#211a16]">
        {perspective.label}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#67584f]">
        {perspective.text}
      </p>
    </article>
  );
}

function SaveButton({ saved, onToggle }) {
  const Icon = saved ? BookmarkCheck : Bookmark;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_16px_38px_rgba(33,26,22,0.14)] transition hover:-translate-y-0.5 ${
        saved
          ? "bg-[#2d9c8d] text-white hover:bg-[#268779]"
          : "bg-[#211a16] text-white hover:bg-[#362a24]"
      }`}
    >
      <Icon size={17} />
      {saved ? "Saved for later" : "Save For Later"}
    </button>
  );
}

export default function KnowledgeFeed() {
  const [saved, setSaved] = useState(false);
  const fallbackFuel = useMemo(
    () =>
      generateConversationFuel({
        topic: featuredFuel.topic,
        interests: featuredFuel.capabilities,
      }),
    [],
  );
  const fuelInput = useMemo(
    () => ({
      topic: featuredFuel.topic,
      interests: featuredFuel.capabilities,
    }),
    [],
  );
  const {
    data: coachFuel,
    error: fuelError,
    status: fuelStatus,
  } = useCoachGeneration({
    surface: "fuel",
    input: fuelInput,
    fallback: fallbackFuel,
  });

  const recordFuelExplored = (title, capabilities = featuredFuel.capabilities) => {
    recordGrowthEvent({
      source: "fuel",
      title,
      capabilities,
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211a16]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#ffad7a]/28 blur-3xl" />
        <div className="absolute right-[-10rem] top-[16rem] h-[30rem] w-[30rem] rounded-full bg-[#72d8c5]/22 blur-3xl" />
        <div className="absolute bottom-[10rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[#9da7ff]/16 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20">
        <div className="max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ead8c7] bg-white/55 px-3 py-2 text-sm font-medium text-[#6c5c52] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#ffc44d] shadow-[0_0_22px_rgba(255,196,77,0.85)]" />
            Something interesting to talk about
          </div>
          <h1 className="text-[clamp(3.25rem,9vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[#211a16]">
            Ideas to Talk About
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-[#6c5c52]">
            Find one idea, question, or story you can bring into a real
            conversation today.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 pb-24 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-6">
          <article className="relative overflow-hidden rounded-[2.2rem] border border-[#ead8c7] bg-[#211a16] p-6 text-white shadow-[0_28px_90px_rgba(33,26,22,0.18)] sm:p-8">
            <div className="absolute right-[-6rem] top-[-7rem] h-64 w-64 rounded-full bg-[#ff8f70]/30 blur-3xl" />
            <div className="absolute bottom-[-7rem] left-[18%] h-60 w-60 rounded-full bg-[#74d4c2]/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffc44d]">
                Today's idea
              </p>
              <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
                {featuredFuel.topic}
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <SaveButton
                  saved={saved}
                  onToggle={() => {
                    setSaved((current) => {
                      if (!current) {
                        recordFuelExplored(featuredFuel.topic);
                      }

                      return !current;
                    });
                  }}
                />
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-4 py-3 text-sm font-medium text-white/68">
                  <MessageCircle size={16} className="text-[#74d4c2]" />
                  Made for real conversation
                </span>
              </div>
            </div>
          </article>

          <SectionShell eyebrow="Quick take" title="The useful idea" icon={Brain}>
            <p className="text-lg leading-9 text-[#67584f]">
              {featuredFuel.quickTake}
            </p>
          </SectionShell>

          <SectionShell
            eyebrow="Different ways to see it"
            title="Three angles"
            icon={Sparkles}
          >
            {fuelStatus === "loading" ? (
              <p className="mb-4 rounded-[1.25rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4 text-sm font-semibold leading-6 text-[#67584f]">
                Ember is shaping this idea around your interests.
              </p>
            ) : null}
            {fuelError ? (
              <p className="mb-4 rounded-[1.25rem] border border-[#ead8c7] bg-[#fff7ed]/80 p-4 text-sm font-semibold leading-6 text-[#67584f]">
                Live AI is not available right now, so Ember is showing a
                thoughtful fallback.
              </p>
            ) : null}
            <div className="grid gap-4 md:grid-cols-3">
              {coachFuel.perspectives.map((perspective) => (
                <PerspectiveCard
                  key={perspective.label}
                  perspective={perspective}
                />
              ))}
            </div>
          </SectionShell>

          <SectionShell eyebrow="More context" title="A little more to know">
            <div className="space-y-3">
              {featuredFuel.deepDive.map((item, index) => (
                <p
                  key={item}
                  className="rounded-[1.25rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4 text-base leading-8 text-[#67584f]"
                >
                  <span className="mr-3 font-semibold text-[#c56d54]">
                    0{index + 1}
                  </span>
                  {item}
                </p>
              ))}
            </div>
          </SectionShell>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6">
          <SectionShell
            eyebrow="Questions to ask"
            title="Easy ways to bring it up"
          >
            <div className="space-y-3">
              {coachFuel.conversationStarters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() =>
                    recordFuelExplored("Conversation starter explored", [
                      "Curiosity",
                      "Communication",
                    ])
                  }
                  className="group flex w-full items-start justify-between gap-4 rounded-[1.25rem] border border-[#ead8c7] bg-[#fffaf2]/75 p-4 text-left text-base font-medium leading-7 text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span>{starter}</span>
                  <ArrowRight
                    size={18}
                    className="mt-1 shrink-0 text-[#9a8173] transition group-hover:translate-x-1 group-hover:text-[#211a16]"
                  />
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-[1.25rem] border border-[#ead8c7] bg-white/48 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c56d54]">
                If the conversation keeps going
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {coachFuel.followUpQuestions.map((question) => (
                  <span
                    key={question}
                    className="rounded-full bg-[#fffaf2]/80 px-3 py-2 text-xs font-semibold text-[#67584f]"
                  >
                    {question}
                  </span>
                ))}
              </div>
            </div>
          </SectionShell>

          <section className="rounded-[2rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-5 shadow-[0_20px_65px_rgba(74,51,35,0.08)] backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d9c8d]">
                  More ideas
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16]">
                  Other things to talk about
                </h2>
              </div>
              <span className="hidden rounded-full bg-[#effdf9] p-3 text-[#2d9c8d] sm:inline-flex">
                <Sparkles size={20} />
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((topic) => (
                <button
                  key={topic.title}
                  type="button"
                  onClick={() =>
                    recordFuelExplored(topic.title, topic.capabilities)
                  }
                  className="rounded-full border border-[#ead8c7] bg-white/58 px-3 py-2 text-sm font-semibold text-[#67584f] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {topic.title}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] bg-[#211a16] p-6 text-white shadow-[0_24px_80px_rgba(33,26,22,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffc44d]">
              Remember
            </p>
            <p className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em]">
              Being interesting is not about knowing everything. It is about
              noticing something worth sharing.
            </p>
          </section>
        </aside>
      </section>
    </main>
  );
}
