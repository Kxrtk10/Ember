import { useMemo, useState } from "react";
import {
  Check,
  Heart,
  MessageCircle,
  Sparkles,
  Waves,
} from "lucide-react";
import {
  generateReplayReflection,
  useCoachGeneration,
} from "../coach/coachEngine";
import { recordGrowthEvent } from "../growth/growthEngine";

const feelings = [
  "Confused",
  "Embarrassed",
  "Frustrated",
  "Anxious",
  "Proud",
  "Relieved",
  "Disappointed",
  "Unsure",
];

const examples = [
  "A date",
  "Networking event",
  "Interview",
  "Argument",
  "Friendship interaction",
  "Presentation",
  "Group conversation",
];

const reflectionSections = [
  {
    title: "What likely happened",
    body: "There may have been a real moment of uncertainty, but that does not mean the whole interaction went badly. Most conversations include pauses, missed cues, and uneven timing.",
  },
  {
    title: "What you may be overlooking",
    body: "You are probably focusing on the part that felt uncomfortable and giving less weight to the parts where you stayed engaged, listened, or tried to repair the rhythm.",
  },
  {
    title: "Alternative interpretations",
    body: "The other person may have been distracted, tired, nervous, or interpreting the moment much more neutrally than you are. Silence or awkwardness is not always a verdict.",
  },
  {
    title: "Things you handled well",
    body: "You cared enough to reflect instead of dismissing the interaction. That shows social awareness, and it gives you a chance to choose your next step with more steadiness.",
  },
  {
    title: "Things worth exploring",
    body: "Notice where your mind jumps from one moment to a larger story about who you are. That leap is often where unnecessary self-criticism enters.",
  },
];

const feelingSignals = {
  Confused: ["Emotional Intelligence", "Curiosity"],
  Embarrassed: ["Resilience", "Self-Expression"],
  Frustrated: ["Resilience", "Communication"],
  Anxious: ["Resilience", "Presence"],
  Proud: ["Confidence", "Self-Expression"],
  Relieved: ["Resilience", "Presence"],
  Disappointed: ["Emotional Intelligence", "Resilience"],
  Unsure: ["Emotional Intelligence", "Curiosity"],
};

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

function ReplayInput({ value, onChange }) {
  return (
    <SectionShell eyebrow="Start here" title="What happened?" icon={MessageCircle}>
      <p className="text-sm leading-6 text-[#75665c]">
        Share the interaction as you remember it. It does not need to be
        perfectly objective or complete.
      </p>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe the conversation, moment, or interaction..."
        className="mt-5 min-h-64 w-full resize-none rounded-[1.35rem] border border-[#ead8c7] bg-white/74 p-4 text-base leading-7 text-[#211a16] outline-none transition placeholder:text-[#b09a8b] focus:border-[#ff9b78] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,143,112,0.12)]"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {examples.map((example) => (
          <span
            key={example}
            className="rounded-full border border-[#ead8c7] bg-[#fffaf2]/75 px-3 py-1.5 text-xs font-semibold text-[#75665c]"
          >
            {example}
          </span>
        ))}
      </div>
    </SectionShell>
  );
}

function EmotionalCheckIn({ selectedFeeling, onSelect }) {
  return (
    <SectionShell
      eyebrow="How it feels"
      title="How are you feeling about it?"
      icon={Heart}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {feelings.map((feeling) => {
          const isSelected = selectedFeeling === feeling;

          return (
            <button
              key={feeling}
              type="button"
              onClick={() => onSelect(feeling)}
              className={`rounded-full border px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                isSelected
                  ? "border-[#211a16] bg-[#211a16] text-white shadow-[0_14px_34px_rgba(33,26,22,0.16)]"
                  : "border-[#ead8c7] bg-[#fffaf2]/72 text-[#67584f] hover:bg-white"
              }`}
            >
              {feeling}
            </button>
          );
        })}
      </div>
    </SectionShell>
  );
}

function ReflectionView({ selectedFeeling, replayReflection, error, status }) {
  const coachSections = replayReflection
    ? [
        {
          title: "Possible interpretations",
          body: replayReflection.possibleInterpretations.join(" "),
        },
        {
          title: "What you may be overlooking",
          body: replayReflection.thingsOverlooked.join(" "),
        },
        {
          title: "Reflective questions",
          body: replayReflection.reflectiveQuestions.join(" "),
        },
        {
          title: "Things worth exploring",
          body: replayReflection.growthInsight,
        },
      ]
    : reflectionSections;

  return (
    <section className="rounded-[2rem] border border-[#ead8c7] bg-[#fffaf2]/70 p-5 shadow-[0_20px_65px_rgba(74,51,35,0.08)] backdrop-blur-xl sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d9c8d]">
            Let's think it through
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16]">
            A few ways to see it
          </h2>
        </div>
        <span className="hidden rounded-full bg-[#effdf9] p-3 text-[#2d9c8d] sm:inline-flex">
          <Waves size={20} />
        </span>
      </div>

      {selectedFeeling ? (
        <p className="mb-5 rounded-[1.25rem] border border-[#ead8c7] bg-white/60 p-4 text-sm leading-7 text-[#67584f]">
          You marked this as{" "}
          <span className="font-semibold text-[#211a16]">{selectedFeeling}</span>
          . That feeling is information, not a final conclusion about what
          happened.
        </p>
      ) : null}

      {status === "loading" ? (
        <p className="mb-5 rounded-[1.25rem] border border-[#ead8c7] bg-white/60 p-4 text-sm font-semibold leading-7 text-[#67584f]">
          Ember is looking for a kinder, wider way to understand this.
        </p>
      ) : null}

      {error ? (
        <p className="mb-5 rounded-[1.25rem] border border-[#ead8c7] bg-white/60 p-4 text-sm font-semibold leading-7 text-[#67584f]">
          Live AI is not available right now, so Ember is showing a gentle
          fallback.
        </p>
      ) : null}

      <div className="space-y-3">
        {coachSections.map((section) => (
          <article
            key={section.title}
            className="rounded-[1.35rem] border border-[#ead8c7] bg-white/58 p-4"
          >
            <h3 className="flex items-center gap-2 text-lg font-semibold tracking-[-0.025em] text-[#211a16]">
              <Check size={17} className="text-[#2d9c8d]" />
              {section.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#67584f]">
              {section.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function SocialReplay() {
  const [reflection, setReflection] = useState("");
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [reflectionAdded, setReflectionAdded] = useState(false);

  const inputNote = useMemo(() => {
    if (reflectionAdded) {
      return "Saved. This moment is now part of your growth.";
    }

    if (reflection.trim().length > 0) {
      return "Your replay is held as context, not evidence against you.";
    }

    return "You can start with fragments. A few sentences are enough.";
  }, [reflection, reflectionAdded]);

  const fallbackReflection = useMemo(
    () =>
      generateReplayReflection({
        userReflection: reflection,
        emotions: selectedFeeling ? [selectedFeeling] : [],
      }),
    [reflection, selectedFeeling],
  );
  const replayInput = useMemo(
    () => ({
      userReflection: reflection,
      emotions: selectedFeeling ? [selectedFeeling] : [],
    }),
    [reflection, selectedFeeling],
  );
  const {
    data: replayReflection,
    error: replayError,
    status: replayStatus,
  } = useCoachGeneration({
    surface: "replay",
    input: replayInput,
    fallback: fallbackReflection,
    enabled: reflection.trim().length > 10 || Boolean(selectedFeeling),
  });

  const addReflectionToGrowth = () => {
    const capabilities = [
      "Emotional Intelligence",
      "Resilience",
      ...(feelingSignals[selectedFeeling] ?? []),
    ];

    recordGrowthEvent({
      source: "replay",
      title: selectedFeeling
        ? `${selectedFeeling} conversation reflection`
        : "Conversation reflection",
      capabilities,
    });
    setReflectionAdded(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211a16]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#ffad7a]/24 blur-3xl" />
        <div className="absolute right-[-10rem] top-[16rem] h-[30rem] w-[30rem] rounded-full bg-[#72d8c5]/24 blur-3xl" />
        <div className="absolute bottom-[10rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[#9da7ff]/14 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-6 sm:pb-16 sm:pt-20">
        <div className="max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ead8c7] bg-white/55 px-3 py-2 text-sm font-medium text-[#6c5c52] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#74d4c2] shadow-[0_0_22px_rgba(116,212,194,0.85)]" />
            Think it through without beating yourself up
          </div>
          <h1 className="text-[clamp(3.35rem,9vw,7.7rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[#211a16]">
            Reflect
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-[#6c5c52]">
            Look back at a conversation and see it more clearly.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 pb-24 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div className="space-y-6 lg:sticky lg:top-6">
          <ReplayInput
            value={reflection}
            onChange={(value) => {
              setReflection(value);
              setReflectionAdded(false);
            }}
          />
          <EmotionalCheckIn
            selectedFeeling={selectedFeeling}
            onSelect={(feeling) => {
              setSelectedFeeling(feeling);
              setReflectionAdded(false);
            }}
          />
          <section className="rounded-[2rem] bg-[#211a16] p-6 text-white shadow-[0_24px_80px_rgba(33,26,22,0.16)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffc44d]">
              Gentle note
            </p>
            <p className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em]">
              {inputNote}
            </p>
            <button
              type="button"
              onClick={addReflectionToGrowth}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#211a16] transition hover:-translate-y-0.5 hover:bg-[#fffaf2]"
            >
              <Sparkles size={16} />
              Save this reflection
            </button>
          </section>
        </div>

        <div className="space-y-6">
          <ReflectionView
            selectedFeeling={selectedFeeling}
            replayReflection={replayReflection}
            error={replayError}
            status={replayStatus}
          />

          <section className="relative overflow-hidden rounded-[2rem] border border-[#ead8c7] bg-white/62 p-6 shadow-[0_20px_65px_rgba(74,51,35,0.08)] backdrop-blur-xl">
            <div className="absolute right-[-5rem] top-[-6rem] h-52 w-52 rounded-full bg-[#ff8f70]/16 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
                Another way to see it
              </p>
              <h2 className="mt-3 text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#211a16]">
                One awkward moment does not define the entire interaction.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#67584f]">
                A conversation is a sequence, not a single frame. You can learn
                from one uncomfortable second without letting it rewrite the
                whole story.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-6 shadow-[0_20px_65px_rgba(74,51,35,0.08)] backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2d9c8d]">
              A small idea
            </p>
            <p className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#211a16]">
              {replayReflection.growthInsight}
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
