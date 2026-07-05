import { useMemo, useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  generateGrowthMap,
  saveOnboardingProfile,
} from "../onboarding/onboardingEngine";

const steps = [
  "Welcome",
  "Why",
  "Situations",
  "Difficulty",
  "Becoming",
  "Map",
];

const options = {
  reasons: [
    "I want to become more confident.",
    "I overthink conversations.",
    "I want to make friends more easily.",
    "I want to become better at networking.",
    "I want to improve leadership skills.",
    "I struggle approaching new people.",
    "I want to communicate better at work.",
    "I want to stop caring so much about judgment.",
    "I want to become a better listener.",
    "I want to tell better stories.",
    "I want to improve public speaking.",
    "I want to support people emotionally.",
    "I want to think faster in conversations.",
  ],
  situations: [
    "Meeting new people",
    "Joining group conversations",
    "Dating",
    "Networking",
    "Interviews",
    "Presentations",
    "Leadership",
    "Conflict",
    "Difficult conversations",
    "Emotional support",
    "Making friends",
    "Professional communication",
    "Public speaking",
    "Quick thinking",
  ],
  difficulties: [
    "Knowing what to say",
    "Saying it confidently",
    "Thinking quickly",
    "Starting conversations",
    "Keeping conversations going",
    "Handling awkward moments",
    "Expressing my opinions",
    "Fear of judgment",
    "Handling criticism",
    "Being myself",
  ],
  becoming: [
    "More expressive",
    "More confident",
    "More curious",
    "More socially comfortable",
    "More empathetic",
    "More resilient",
    "More influential",
    "Better communicator",
    "Better leader",
    "Better storyteller",
    "Better listener",
  ],
};

const initialAnswers = {
  reasons: [],
  situations: [],
  difficulties: [],
  becoming: [],
};

function BrandMark() {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211a16] text-white shadow-[0_12px_30px_rgba(33,26,22,0.18)]">
        <Sparkles size={18} />
      </span>
      <span>
        <span className="block text-lg font-semibold tracking-[-0.03em] text-[#211a16]">
          Ember
        </span>
        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#9a8173]">
          Starting point
        </span>
      </span>
    </Link>
  );
}

function Progress({ currentStep }) {
  return (
    <div className="flex gap-2">
      {steps.map((step, index) => (
        <span
          key={step}
          className={`h-2 flex-1 rounded-full ${
            index <= currentStep ? "bg-[#211a16]" : "bg-[#ead8c7]"
          }`}
        />
      ))}
    </div>
  );
}

function OptionGrid({ values, selected, onToggle }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {values.map((value) => {
        const isSelected = selected.includes(value);

        return (
          <button
            key={value}
            type="button"
            onClick={() => onToggle(value)}
            className={`flex items-start gap-3 rounded-[1.25rem] border p-4 text-left text-sm font-semibold leading-6 transition hover:-translate-y-0.5 ${
              isSelected
                ? "border-[#211a16] bg-[#211a16] text-white shadow-[0_16px_40px_rgba(33,26,22,0.14)]"
                : "border-[#ead8c7] bg-white/58 text-[#67584f] hover:bg-white/82"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                isSelected ? "border-white/30 bg-white/14" : "border-[#dfcab8]"
              }`}
            >
              {isSelected ? <Check size={13} /> : null}
            </span>
            {value}
          </button>
        );
      })}
    </div>
  );
}

function MapSection({ title, items }) {
  return (
    <section className="rounded-[1.5rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
        {title}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#ead8c7] bg-white/68 px-3 py-2 text-sm font-semibold text-[#67584f]"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const growthMap = useMemo(() => generateGrowthMap(answers), [answers]);

  const toggleAnswer = (key, value) => {
    setAnswers((current) => {
      const hasValue = current[key].includes(value);

      return {
        ...current,
        [key]: hasValue
          ? current[key].filter((item) => item !== value)
          : [...current[key], value],
      };
    });
  };

  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  const finish = () => {
    saveOnboardingProfile(answers);
    navigate("/growth");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211a16]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#ffad7a]/28 blur-3xl" />
        <div className="absolute right-[-10rem] top-[16rem] h-[30rem] w-[30rem] rounded-full bg-[#72d8c5]/22 blur-3xl" />
        <div className="absolute bottom-[10rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[#9da7ff]/14 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 pt-6 sm:px-6">
        <BrandMark />
        <Link
          to="/growth"
          className="rounded-full border border-[#dfcab8] bg-white/45 px-4 py-2 text-sm font-semibold text-[#5b4b43] backdrop-blur transition hover:bg-white/75"
        >
          Skip for now
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="mb-8">
          <Progress currentStep={step} />
        </div>

        <div className="rounded-[2.2rem] border border-[#ead8c7] bg-white/62 p-6 shadow-[0_24px_80px_rgba(74,51,35,0.10)] backdrop-blur-xl sm:p-8">
          {step === 0 ? (
            <div className="py-8 sm:py-14">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ead8c7] bg-[#fffaf2]/75 px-3 py-2 text-sm font-medium text-[#6c5c52] shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#ff8f70] shadow-[0_0_22px_rgba(255,143,112,0.85)]" />
                Growth is not fixing yourself
              </div>
              <h1 className="max-w-4xl text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-[#211a16]">
                Everyone has conversations they replay.
                <br />
                Everyone has moments they wish they handled differently.
                <br />
                You're not alone.
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-[#6c5c52]">
                Let's understand where you're starting from.
              </p>
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c56d54]">
                Step 1
              </p>
              <h1 className="mt-3 text-5xl font-semibold tracking-[-0.055em]">
                Why are you here?
              </h1>
              <p className="mt-4 text-base leading-8 text-[#75665c]">
                Choose as many as feel true. This is not a test, just a way to
                give Ember a starting point.
              </p>
              <div className="mt-8">
                <OptionGrid
                  values={options.reasons}
                  selected={answers.reasons}
                  onToggle={(value) => toggleAnswer("reasons", value)}
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c56d54]">
                Step 2
              </p>
              <h1 className="mt-3 text-5xl font-semibold tracking-[-0.055em]">
                Situations you want to improve
              </h1>
              <p className="mt-4 text-base leading-8 text-[#75665c]">
                These help Ember suggest places to begin practicing.
              </p>
              <div className="mt-8">
                <OptionGrid
                  values={options.situations}
                  selected={answers.situations}
                  onToggle={(value) => toggleAnswer("situations", value)}
                />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c56d54]">
                Step 3
              </p>
              <h1 className="mt-3 text-5xl font-semibold tracking-[-0.055em]">
                What feels most difficult?
              </h1>
              <p className="mt-4 text-base leading-8 text-[#75665c]">
                No answers here are problems. They are just useful places to
                bring attention.
              </p>
              <div className="mt-8">
                <OptionGrid
                  values={options.difficulties}
                  selected={answers.difficulties}
                  onToggle={(value) => toggleAnswer("difficulties", value)}
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c56d54]">
                Step 4
              </p>
              <h1 className="mt-3 text-5xl font-semibold tracking-[-0.055em]">
                Who do you want to become?
              </h1>
              <p className="mt-4 text-base leading-8 text-[#75665c]">
                Growth is understanding yourself, then becoming more of that
                person in real moments.
              </p>
              <div className="mt-8">
                <OptionGrid
                  values={options.becoming}
                  selected={answers.becoming}
                  onToggle={(value) => toggleAnswer("becoming", value)}
                />
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2d9c8d]">
                Where to begin
              </p>
              <h1 className="mt-3 text-5xl font-semibold tracking-[-0.055em]">
                A simple starting point.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#75665c]">
                This is not a label. It just helps Ember suggest what to try
                first.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <MapSection title="Skills to build" items={growthMap.focusAreas} />
                <MapSection
                  title="Areas to work on"
                  items={growthMap.suggestedPathways}
                />
                <MapSection
                  title="Situations to practice"
                  items={growthMap.recommendedScenarioCategories}
                />
                <MapSection
                  title="Ideas to talk about"
                  items={growthMap.suggestedFuelTopics}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[#ead8c7] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="rounded-full border border-[#dfcab8] bg-white/45 px-5 py-3 text-sm font-semibold text-[#5b4b43] transition hover:bg-white/75 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(33,26,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#362a24]"
              >
                Continue
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(33,26,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#362a24]"
              >
                Go to my growth
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
