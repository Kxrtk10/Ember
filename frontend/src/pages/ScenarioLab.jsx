import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, Mic, RefreshCw, Sparkles } from "lucide-react";
import {
  generateScenarioFeedback,
  useCoachGeneration,
} from "../coach/coachEngine";
import ConversationSimulator from "../components/ConversationSimulator";
import { recordGrowthEvent } from "../growth/growthEngine";
import {
  customScenarioQuestions,
  generateCustomPracticeScenario,
  loadCustomScenarios,
  saveCustomScenario,
} from "../scenarios/customScenarioEngine";

const categories = [
  {
    id: "social",
    label: "Social",
    description: "Everyday moments of connection, ease, and belonging.",
  },
  {
    id: "professional",
    label: "Professional",
    description: "Workplace conversations that ask for clarity and presence.",
  },
  {
    id: "emotional",
    label: "Emotional",
    description: "Tender moments where honesty and steadiness matter.",
  },
  {
    id: "communication",
    label: "Communication",
    description: "Expression, storytelling, speaking, and group dynamics.",
  },
];

const categoryFilters = [
  { id: "all", label: "All" },
  { id: "social", label: "Social" },
  { id: "professional", label: "Professional" },
  { id: "emotional", label: "Emotional" },
  { id: "communication", label: "Communication" },
  { id: "dating", label: "Dating" },
  { id: "friendship", label: "Friendship" },
  { id: "leadership", label: "Leadership" },
  { id: "everyday", label: "Everyday Life" },
  { id: "custom", label: "My Scenarios" },
];

const scenarioLibrary = {
  social: [
    {
      id: "social-attractive",
      title: "Approaching someone attractive",
      difficulty: "Intermediate",
      skills: ["Confidence", "Self-Expression"],
      context:
        "You notice someone at a bookstore who seems interesting. You want to say hello without making the moment feel loaded.",
      feeling: "Warm, grounded, low pressure",
    },
    {
      id: "social-group",
      title: "Joining a group conversation",
      difficulty: "Intermediate",
      skills: ["Presence", "Communication"],
      context:
        "A few people are laughing about a story you only partly heard. You want to join without interrupting the flow.",
      feeling: "Curious, relaxed, included",
    },
    {
      id: "social-new-city",
      title: "Making friends in a new city",
      difficulty: "Beginner",
      skills: ["Confidence", "Networking", "Curiosity"],
      context:
        "You have moved somewhere new and want to turn a casual meetup into a real friendship without seeming too eager.",
      feeling: "Open, patient, genuine",
    },
    {
      id: "social-new-people",
      title: "Meeting new people",
      difficulty: "Beginner",
      skills: ["Confidence", "Networking"],
      context:
        "You walk into a room where you know almost no one. You want to start with one approachable exchange.",
      feeling: "Simple, present, open",
    },
    {
      id: "social-compliments",
      title: "Giving compliments",
      difficulty: "Beginner",
      skills: ["Empathy", "Self-Expression"],
      context:
        "You genuinely admire something someone did. You want to say it in a way that feels sincere, not awkward.",
      feeling: "Specific, kind, natural",
    },
    {
      id: "social-jokes",
      title: "Handling jokes",
      difficulty: "Advanced",
      skills: ["Confidence", "Resilience", "Presence"],
      context:
        "A friend makes a joke at your expense. It is not cruel, but it bothers you more than you expected.",
      feeling: "Light, honest, self-respecting",
    },
  ],
  professional: [
    {
      id: "professional-networking",
      title: "Networking",
      difficulty: "Intermediate",
      skills: ["Presence", "Communication", "Networking"],
      context:
        "You are standing near a small group after a panel. Everyone seems polished, and you want to enter the conversation naturally.",
      feeling: "Clear, approachable, self-led",
    },
    {
      id: "professional-interviews",
      title: "Interviews",
      difficulty: "Intermediate",
      skills: ["Confidence", "Communication", "Presence"],
      context:
        "The interviewer asks about a project that did not go perfectly. You want to be honest without underselling yourself.",
      feeling: "Composed, reflective, direct",
    },
    {
      id: "professional-presentations",
      title: "Presentations",
      difficulty: "Advanced",
      skills: ["Confidence", "Presence", "Storytelling"],
      context:
        "You are about to present an idea to a room that includes senior people. You want to begin with calm authority.",
      feeling: "Steady, concise, prepared",
    },
    {
      id: "professional-leadership",
      title: "Leadership conversations",
      difficulty: "Advanced",
      skills: ["Leadership", "Empathy", "Communication"],
      context:
        "Someone on your team is losing momentum. You want to be supportive while still naming what needs to change.",
      feeling: "Grounded, caring, accountable",
    },
    {
      id: "professional-giving-feedback",
      title: "Giving feedback",
      difficulty: "Advanced",
      skills: ["Leadership", "Empathy", "Communication"],
      context:
        "A colleague missed expectations on a shared project. You want to be honest without making them feel cornered.",
      feeling: "Respectful, clear, useful",
    },
    {
      id: "professional-criticism",
      title: "Receiving criticism",
      difficulty: "Advanced",
      skills: ["Resilience", "Emotional Intelligence", "Presence"],
      context:
        "Someone gives you feedback that lands sharply. You feel yourself tense up, but you want to stay open.",
      feeling: "Regulated, honest, receptive",
    },
  ],
  emotional: [
    {
      id: "emotional-apologizing",
      title: "Apologizing",
      difficulty: "Intermediate",
      skills: ["Empathy", "Emotional Intelligence", "Communication"],
      context:
        "You realize your words hurt someone. You want to repair without overexplaining or asking them to comfort you.",
      feeling: "Accountable, gentle, sincere",
    },
    {
      id: "emotional-support",
      title: "Providing emotional support",
      difficulty: "Intermediate",
      skills: ["Empathy", "Emotional Intelligence"],
      context:
        "A friend shares something difficult. You want to be present without rushing to fix the feeling.",
      feeling: "Soft, patient, attentive",
    },
    {
      id: "emotional-difficult",
      title: "Difficult conversations",
      difficulty: "Advanced",
      skills: ["Resilience", "Emotional Intelligence", "Communication"],
      context:
        "You need to bring up something that has been quietly bothering you. You want to be honest without escalating.",
      feeling: "Brave, calm, compassionate",
    },
    {
      id: "emotional-appreciation",
      title: "Expressing appreciation",
      difficulty: "Beginner",
      skills: ["Empathy", "Self-Expression"],
      context:
        "Someone has meant more to you than they realize. You want to say it clearly without making the moment too heavy.",
      feeling: "Warm, specific, unguarded",
    },
    {
      id: "emotional-boundaries",
      title: "Setting boundaries",
      difficulty: "Advanced",
      skills: ["Confidence", "Self-Expression", "Resilience"],
      context:
        "Someone keeps asking for more than you can give. You want to protect your energy without becoming cold.",
      feeling: "Clear, kind, self-respecting",
    },
  ],
  communication: [
    {
      id: "communication-storytelling",
      title: "Storytelling",
      difficulty: "Intermediate",
      skills: ["Storytelling", "Self-Expression", "Communication"],
      context:
        "You want to share a personal story in a way that has shape, emotion, and a point without sounding rehearsed.",
      feeling: "Expressive, structured, alive",
    },
    {
      id: "communication-small-talk",
      title: "Small talk",
      difficulty: "Beginner",
      skills: ["Presence", "Curiosity", "Communication"],
      context:
        "You are in a casual waiting moment with someone new. You want to turn small talk into something a little more human.",
      feeling: "Easy, observant, curious",
    },
    {
      id: "communication-public-speaking",
      title: "Public speaking",
      difficulty: "Advanced",
      skills: ["Confidence", "Presence", "Storytelling"],
      context:
        "You are opening a talk and can feel your body getting loud with nerves. You want your first sentence to steady you.",
      feeling: "Grounded, spacious, clear",
    },
    {
      id: "communication-ice-breakers",
      title: "Ice breakers",
      difficulty: "Beginner",
      skills: ["Confidence", "Communication", "Curiosity"],
      context:
        "You need to start a group exercise without making it feel forced. You want people to relax quickly.",
      feeling: "Welcoming, light, inclusive",
    },
    {
      id: "communication-group-discussions",
      title: "Group discussions",
      difficulty: "Intermediate",
      skills: ["Presence", "Communication", "Leadership"],
      context:
        "Several people are speaking quickly. You have something useful to add, but you do not want to bulldoze the room.",
      feeling: "Timed, clear, collaborative",
    },
  ],
};

const difficultyStyles = {
  Beginner: "border-[#74d4c2]/35 bg-[#effdf9] text-[#247d72]",
  Intermediate: "border-[#ffc44d]/40 bg-[#fff8e4] text-[#8a6420]",
  Advanced: "border-[#ff8f70]/35 bg-[#fff1ec] text-[#a24f3d]",
};

const fallbackStyles = [
  {
    title: "Curious",
    tone: "Open and observant",
    example:
      "I noticed something interesting about that. What made you see it that way?",
  },
  {
    title: "Direct",
    tone: "Clear and grounded",
    example:
      "I wanted to say this plainly instead of waiting for the perfect wording.",
  },
  {
    title: "Playful",
    tone: "Light and human",
    example:
      "I was going to pretend I had a seamless opener, but honestly, hello felt more honest.",
  },
];

const defaultFeedback = {
  worked: [
    "You created an opening without trying to control the whole interaction.",
    "The response leaves room for the other person to participate.",
    "There is a real person behind the words, which matters more than polish.",
  ],
  improve: [
    "You could make the first sentence a little simpler so it is easier to say out loud.",
    "Try adding one specific observation or feeling to make it sound more like you.",
  ],
  alternative:
    "Another path would be to name the moment gently: 'I am trying to say this honestly instead of perfectly.' That can make the interaction feel more real and less rehearsed.",
  insight:
    "Confidence is not finding the flawless line. It is learning that you can stay present even when the line is imperfect.",
};

const getScenariosForCategory = (categoryId) =>
  scenarioLibrary[categoryId].map((scenario) => ({
    ...scenario,
    categoryId,
    categoryLabel: categories.find((category) => category.id === categoryId)
      .label,
  }));

const getAllScenarios = (customScenarios = []) => [
  ...categories.flatMap((category) => getScenariosForCategory(category.id)),
  ...customScenarios,
];

const scenarioMatchesFilter = (scenario, filterId) => {
  const title = scenario.title.toLowerCase();
  const text = `${scenario.title} ${scenario.context} ${scenario.skills.join(
    " ",
  )}`.toLowerCase();

  if (filterId === "all") return true;
  if (filterId === "custom") return scenario.categoryId === "custom";
  if (scenario.categoryId === filterId) return true;
  if (filterId === "dating") return title.includes("attractive");
  if (filterId === "friendship") {
    return /friend|group|compliment|joke|support|appreciation/.test(text);
  }
  if (filterId === "leadership") {
    return /leadership|feedback|presentation|executive|professional/.test(text);
  }
  if (filterId === "everyday") {
    return /small talk|meeting new|compliment|joke|ice breaker|group/.test(text);
  }

  return false;
};

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
};

function SectionHeader({ totalScenarios }) {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-4 pb-4 pt-8 sm:px-6 sm:pb-5 sm:pt-10">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ead8c7] bg-white/60 px-3 py-2 text-sm font-medium text-[#6c5c52] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#74d4c2] shadow-[0_0_22px_rgba(116,212,194,0.85)]" />
            {totalScenarios} real-life moments to practice
          </div>
          <h1 className="text-[clamp(3.25rem,8vw,6.75rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-[#211a16]">
            Practice
          </h1>
        </div>
        <p className="max-w-xl text-lg leading-8 text-[#6c5c52]">
          Pick a moment, say what you would naturally say, then see a few ways
          the conversation could open up.
        </p>
      </div>
    </section>
  );
}

function DifficultyBadge({ difficulty }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold ${difficultyStyles[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

function SkillTags({ skills, compact = false }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <span
          key={skill}
          className={`rounded-full border border-[#ead8c7] bg-[#fffaf2]/75 font-semibold text-[#75665c] ${
            compact ? "px-2 py-0.5 text-[0.66rem]" : "px-2.5 py-1 text-[0.72rem]"
          }`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function MomentCard({ scenario, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(scenario.id)}
      className={`group min-h-[13rem] rounded-[1.35rem] border p-4 text-left transition duration-300 hover:-translate-y-1 ${
        selected
          ? "border-[#211a16] bg-white shadow-[0_20px_55px_rgba(74,51,35,0.13)]"
          : "border-[#ead8c7]/70 bg-white/52 hover:border-[#dfcab8] hover:bg-white/82 hover:shadow-[0_16px_45px_rgba(74,51,35,0.08)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={scenario.difficulty} />
          <span className="rounded-full border border-[#ead8c7] bg-[#fffaf2]/80 px-2.5 py-1 text-[0.68rem] font-semibold text-[#8c7668]">
            {scenario.categoryLabel}
          </span>
        </div>
        <span
          className={`mt-1 h-2.5 w-2.5 rounded-full transition ${
            selected
              ? "bg-[#ff8f70] shadow-[0_0_18px_rgba(255,143,112,0.9)]"
              : "bg-[#dfcab8] group-hover:bg-[#ffad7a]"
          }`}
        />
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-0.035em] text-[#211a16]">
        {scenario.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#75665c]">
        {scenario.context}
      </p>
      <div className="mt-4">
        <SkillTags skills={scenario.skills.slice(0, 3)} compact />
      </div>
      <p className="mt-3 text-xs font-semibold text-[#9a8173]">
        Aim for: {scenario.feeling}
      </p>
    </button>
  );
}

function OwnSituationCard({ onStart }) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="group relative overflow-hidden rounded-[1.5rem] border border-[#ead8c7] bg-white/68 p-5 text-left shadow-[0_18px_55px_rgba(74,51,35,0.08)] transition duration-300 hover:-translate-y-1 hover:bg-white"
    >
      <div className="absolute right-[-3rem] top-[-4rem] h-32 w-32 rounded-full bg-[#ff8f70]/20 blur-3xl" />
      <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
            Practice My Own Situation
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#211a16]">
            Tell Ember what's coming up.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#75665c]">
            Tell Ember what's coming up, and we'll build a practice session
            together.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#211a16] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(33,26,22,0.16)] transition group-hover:translate-x-1">
          Start
          <ArrowRight size={16} />
        </span>
      </div>
    </button>
  );
}

function CustomScenarioBuilder({
  answers,
  currentStep,
  generatedScenario,
  generationStatus,
  onAnswer,
  onBack,
  onCancel,
  onContinue,
  onEdit,
  onRegenerate,
  onSave,
  onStartPractice,
}) {
  const question = customScenarioQuestions[currentStep];
  const progress = generatedScenario
    ? customScenarioQuestions.length
    : currentStep + 1;

  if (generatedScenario) {
    return (
      <section className="animate-[ember-fade-up_420ms_ease-out] rounded-[2rem] border border-[#ead8c7] bg-white/70 p-5 shadow-[0_24px_75px_rgba(74,51,35,0.09)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
              This is what we'll practice together
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16]">
              {generatedScenario.title}
            </h2>
          </div>
          <DifficultyBadge difficulty={generatedScenario.difficulty} />
        </div>

        <p className="mt-4 max-w-4xl text-base leading-8 text-[#67584f]">
          {generatedScenario.context}
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.2rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c56d54]">
              People
            </p>
            <p className="mt-2 text-sm leading-6 text-[#67584f]">
              {generatedScenario.participants || "The person involved"}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c56d54]">
              Practice
            </p>
            <div className="mt-2">
              <SkillTags skills={generatedScenario.skills} compact />
            </div>
          </div>
          <div className="rounded-[1.2rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c56d54]">
              Aim for
            </p>
            <p className="mt-2 text-sm leading-6 text-[#67584f]">
              {generatedScenario.feeling}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full border border-[#dfcab8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            disabled={generationStatus === "loading"}
            className="rounded-full border border-[#dfcab8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generationStatus === "loading" ? "Regenerating..." : "Regenerate"}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-full border border-[#dfcab8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onStartPractice}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(33,26,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#362a24]"
          >
            Start Practice
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="animate-[ember-fade-up_420ms_ease-out] rounded-[2rem] border border-[#ead8c7] bg-white/70 p-5 shadow-[0_24px_75px_rgba(74,51,35,0.09)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
            Practice My Own Situation
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16]">
            {question.question}
          </h2>
        </div>
        <p className="rounded-full bg-[#fffaf2] px-3 py-1.5 text-xs font-semibold text-[#8c7668]">
          {progress} of {customScenarioQuestions.length}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#ead8c7]/55">
        <div
          className="h-full rounded-full bg-[#211a16] transition-all duration-500"
          style={{
            width: `${(progress / customScenarioQuestions.length) * 100}%`,
          }}
        />
      </div>

      <textarea
        value={answers[question.id] ?? ""}
        onChange={(event) => onAnswer(question.id, event.target.value)}
        placeholder={question.placeholder}
        className="mt-5 min-h-56 w-full resize-none rounded-[1.5rem] border border-[#ead8c7] bg-[#fffaf2]/76 p-5 text-lg leading-8 text-[#211a16] outline-none transition placeholder:text-[#b09a8b] focus:border-[#ff9b78] focus:bg-white focus:shadow-[0_0_0_5px_rgba(255,143,112,0.12)]"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="w-fit rounded-full border border-[#dfcab8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white"
        >
          Cancel
        </button>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            disabled={currentStep === 0}
            className="rounded-full border border-[#dfcab8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => onContinue({ skip: true })}
            className="rounded-full border border-[#dfcab8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => onContinue({ skip: false })}
            disabled={
              generationStatus === "loading" ||
              (!question.optional &&
                !answers[question.id]?.trim() &&
                currentStep === 0)
            }
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(33,26,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#362a24] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {generationStatus === "loading" ? "Building..." : "Continue"}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function MomentChooser({
  activeFilter,
  filteredScenarios,
  onFilterSelect,
  onScenarioSelect,
  onChangeScenario,
  onStartCustom,
  selectedScenario,
  selectedScenarioId,
  savedScenarios,
}) {
  if (selectedScenario) {
    return (
      <section className="animate-[ember-fade-up_360ms_ease-out] rounded-[1.5rem] border border-[#ead8c7] bg-white/64 p-4 shadow-[0_18px_55px_rgba(74,51,35,0.07)] backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c56d54]">
              Practicing now
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#211a16]">
                {selectedScenario.title}
              </h2>
              <DifficultyBadge difficulty={selectedScenario.difficulty} />
              <span className="rounded-full border border-[#ead8c7] bg-[#fffaf2]/80 px-2.5 py-1 text-[0.68rem] font-semibold text-[#8c7668]">
                {selectedScenario.categoryLabel}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onChangeScenario}
            className="inline-flex w-fit items-center justify-center rounded-full border border-[#dfcab8] bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#3d312b] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Change moment
          </button>
        </div>
      </section>
    );
  }

  const hasFilter = Boolean(activeFilter);

  return (
    <section className="rounded-[2rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4 shadow-[0_24px_75px_rgba(74,51,35,0.08)] backdrop-blur-xl transition-all duration-500 sm:p-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
            Choose a moment
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16] sm:text-4xl">
            What do you want to practice?
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#75665c]">
          Start with something close to real life. You can switch moments any
          time.
        </p>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {categoryFilters.map((filter) => {
          const selected = filter.id === activeFilter;

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterSelect(filter.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 ${
                selected
                  ? "bg-[#211a16] text-white shadow-[0_14px_34px_rgba(33,26,22,0.16)]"
                  : "border border-[#ead8c7] bg-white/62 text-[#67584f] hover:bg-white"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <OwnSituationCard onStart={onStartCustom} />
      </div>

      {hasFilter ? (
        <div className="mt-3 animate-[ember-fade-up_420ms_ease-out]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#75665c]">
              {filteredScenarios.length} moments in{" "}
              {categoryFilters.find((filter) => filter.id === activeFilter)?.label}
            </p>
            <p className="hidden text-sm text-[#9a8173] sm:block">
              Choose one to begin.
            </p>
          </div>
          <div className="grid max-h-[31rem] gap-3 overflow-y-auto pr-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredScenarios.map((scenario) => (
              <MomentCard
                key={scenario.id}
                scenario={scenario}
                selected={scenario.id === selectedScenarioId}
                onSelect={onScenarioSelect}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {savedScenarios.length > 0 ? (
            <div className="mt-4 animate-[ember-fade-up_420ms_ease-out]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#75665c]">
                  My Scenarios
                </p>
                <p className="hidden text-sm text-[#9a8173] sm:block">
                  Saved moments you can practice again.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {savedScenarios.slice(0, 3).map((scenario) => (
                  <MomentCard
                    key={scenario.id}
                    scenario={scenario}
                    selected={scenario.id === selectedScenarioId}
                    onSelect={onScenarioSelect}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-[1.35rem] border border-dashed border-[#dfcab8] bg-white/38 p-5 text-center text-sm font-semibold leading-6 text-[#75665c]">
              Choose a category to see a focused set of practice moments.
            </div>
          )}
        </>
      )}
    </section>
  );
}

function SelectedScenario({ scenario }) {
  if (!scenario) return null;

  return (
    <article className="animate-[ember-fade-up_420ms_ease-out] relative overflow-hidden rounded-[1.75rem] border border-[#ead8c7] bg-white/64 p-5 shadow-[0_20px_65px_rgba(74,51,35,0.08)] backdrop-blur-xl sm:p-6">
      <div className="absolute right-[-5rem] top-[-6rem] h-48 w-48 rounded-full bg-[#ff8f70]/14 blur-3xl" />
      <div className="absolute bottom-[-5rem] left-[25%] h-44 w-44 rounded-full bg-[#74d4c2]/12 blur-3xl" />

      <div className="relative grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-end">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#211a16] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white">
              Selected moment
            </span>
            <DifficultyBadge difficulty={scenario.difficulty} />
            <span className="rounded-full border border-[#ead8c7] bg-[#fffaf2]/70 px-3 py-1.5 text-xs font-semibold text-[#75665c]">
              {scenario.categoryLabel}
            </span>
          </div>
          <h2 className="max-w-4xl text-3xl font-semibold leading-[1.04] tracking-[-0.045em] text-[#211a16] sm:text-4xl">
            {scenario.title}
          </h2>
          <p className="mt-3 max-w-4xl text-base leading-8 text-[#67584f]">
            {scenario.context}
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c56d54]">
            Desired feeling
          </p>
          <p className="mt-2 text-lg font-semibold leading-7 text-[#211a16]">
            {scenario.feeling}
          </p>
          <div className="mt-4">
            <SkillTags skills={scenario.skills} compact />
          </div>
        </div>
      </div>
    </article>
  );
}

function ResponseComposer({
  value,
  onChange,
  onGetFeedback,
  onSpeak,
  isListening,
  speechMessage,
  canSubmit,
  status,
}) {
  return (
    <section className="animate-[ember-fade-up_480ms_ease-out] rounded-[2.1rem] border border-[#ead8c7] bg-[#fffaf2]/78 p-5 shadow-[0_26px_90px_rgba(74,51,35,0.11)] backdrop-blur-xl sm:p-6 lg:p-7">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <label
            htmlFor="scenario-response"
            className="text-3xl font-semibold tracking-[-0.045em] text-[#211a16] sm:text-4xl"
          >
            What would you say?
          </label>
          <p className="mt-2 text-sm leading-6 text-[#75665c]">
            Say what you'd naturally say.
          </p>
        </div>
        <span className="w-fit rounded-full bg-white/68 px-3 py-1.5 text-xs font-semibold text-[#9a8173]">
          It does not need to be perfect
        </span>
      </div>

      <textarea
        id="scenario-response"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Start with the words that come to mind..."
        className="min-h-[22rem] w-full resize-none rounded-[1.65rem] border border-[#ead8c7] bg-white/86 p-6 text-lg leading-8 text-[#211a16] shadow-inner outline-none transition duration-300 placeholder:text-[#b09a8b] focus:border-[#ff9b78] focus:bg-white focus:shadow-[0_0_0_5px_rgba(255,143,112,0.12)] lg:min-h-[28rem]"
      />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-6 text-sm font-medium text-[#75665c]">
          {speechMessage}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onSpeak}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold shadow-sm transition duration-300 hover:-translate-y-0.5 ${
              isListening
                ? "border-[#ff8f70]/40 bg-[#fff1ec] text-[#a24f3d]"
                : "border-[#dfcab8] bg-white/70 text-[#3d312b] hover:bg-white"
            }`}
          >
            <Mic size={17} />
            {isListening ? "Listening..." : "Speak Instead"}
          </button>
          <button
            type="button"
            onClick={onGetFeedback}
            disabled={!canSubmit || status === "loading"}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(33,26,22,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#362a24] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
          >
            {status === "loading" ? "Thinking..." : "Get Feedback"}
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

function FeedbackRow({ icon, title, children }) {
  return (
    <div className="grid gap-3 border-t border-[#ead8c7]/70 py-5 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[13rem_1fr]">
      <h3 className="flex items-center gap-2 text-base font-semibold text-[#211a16]">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1ec] text-[#c56d54]">
          {icon}
        </span>
        {title}
      </h3>
      <div className="text-base leading-8 text-[#67584f]">{children}</div>
    </div>
  );
}

function FeedbackPanel({ coachFeedback = defaultFeedback, error, status, visible }) {
  if (!visible) return null;

  const worked = coachFeedback.whatWorked ?? coachFeedback.worked;
  const questions = coachFeedback.questionsToConsider ?? coachFeedback.improve;
  const alternatives =
    coachFeedback.alternativeApproaches ??
    (coachFeedback.alternative ? [coachFeedback.alternative] : []);
  const suggestions = coachFeedback.communicationSuggestions ?? [];
  const insight = coachFeedback.growthInsight ?? coachFeedback.insight;

  return (
    <section className="animate-[ember-fade-up_500ms_ease-out] rounded-[2rem] border border-[#ead8c7] bg-white/72 p-5 shadow-[0_24px_75px_rgba(74,51,35,0.09)] backdrop-blur-xl sm:p-6 lg:p-7">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
            Ember's thoughts
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16]">
            A few things to notice
          </h2>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#effdf9] px-3 py-1.5 text-xs font-semibold text-[#247d72]">
          <Sparkles size={14} />
          Options, not a verdict
        </span>
      </div>

      {status === "loading" ? (
        <p className="mb-5 rounded-[1.25rem] bg-[#fffaf2]/85 p-4 text-sm font-semibold leading-6 text-[#67584f]">
          Ember is reading your response and shaping gentle feedback.
        </p>
      ) : null}

      {error ? (
        <p className="mb-5 rounded-[1.25rem] bg-[#fff7ed]/90 p-4 text-sm font-semibold leading-6 text-[#75665c]">
          Live AI is not available right now, so Ember is showing a calm
          fallback.
        </p>
      ) : null}

      <div className="rounded-[1.5rem] border border-[#ead8c7]/80 bg-[#fffaf2]/46 p-5">
        <FeedbackRow icon={<Check size={16} />} title="What already feels natural">
          <div className="space-y-2">
            {worked.slice(0, 3).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </FeedbackRow>

        <FeedbackRow icon={<Sparkles size={16} />} title="One thing worth trying">
          <p>{suggestions[0] ?? questions[0] ?? alternatives[0]}</p>
        </FeedbackRow>

        <FeedbackRow icon={<ArrowRight size={16} />} title="How this could continue">
          <p>{alternatives[0]}</p>
        </FeedbackRow>

        <FeedbackRow icon={<Sparkles size={16} />} title="Small takeaway">
          <p>{insight}</p>
        </FeedbackRow>
      </div>
    </section>
  );
}

function ApproachCard({ approach }) {
  return (
    <article className="rounded-[1.35rem] border border-[#ead8c7] bg-white/58 p-5 shadow-[0_16px_45px_rgba(74,51,35,0.06)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/78">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c56d54]">
        {approach.tone}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#211a16]">
        {approach.title}
      </h3>
      <p className="mt-4 text-base leading-7 text-[#67584f]">
        {approach.example}
      </p>
    </article>
  );
}

function DifferentApproaches({ coachFeedback, visible }) {
  if (!visible) return null;

  const styles =
    coachFeedback?.differentStyles?.length > 0
      ? coachFeedback.differentStyles.map((style) => ({
          title: style.label,
          tone: "Another possible tone",
          example: style.response,
        }))
      : fallbackStyles;

  return (
    <section className="rounded-[2rem] border border-[#ead8c7] bg-white/48 p-5 shadow-[0_18px_55px_rgba(74,51,35,0.06)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c56d54]">
            Different ways to try it
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16]">
            Keep the version that sounds like you.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#75665c]">
          These are optional sparks, not scripts.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {styles.map((approach) => (
          <ApproachCard
            key={`${approach.title}-${approach.example}`}
            approach={approach}
          />
        ))}
      </div>
    </section>
  );
}

function NextActions({ onNext }) {
  return (
    <section className="rounded-[2rem] border border-[#ead8c7] bg-[#211a16] p-5 text-white shadow-[0_22px_70px_rgba(33,26,22,0.16)] sm:p-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
            What to do next
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">
            Try another moment when you are ready.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">
            Practice works best when it feels low pressure. One small attempt is
            enough.
          </p>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="group inline-flex w-fit items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-semibold text-[#211a16] shadow-sm transition duration-300 hover:-translate-y-0.5"
        >
          <RefreshCw size={18} className="transition group-hover:rotate-45" />
          Practice another situation
        </button>
      </div>
    </section>
  );
}

export default function ScenarioLab() {
  const [savedScenarios, setSavedScenarios] = useState(() =>
    loadCustomScenarios(),
  );
  const allScenarios = useMemo(
    () => getAllScenarios(savedScenarios),
    [savedScenarios],
  );
  const totalScenarios = allScenarios.length;
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [response, setResponse] = useState("");
  const [feedbackRequested, setFeedbackRequested] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechMessage, setSpeechMessage] = useState("");
  const [customBuilderOpen, setCustomBuilderOpen] = useState(false);
  const [customStep, setCustomStep] = useState(0);
  const [customAnswers, setCustomAnswers] = useState({});
  const [generatedScenario, setGeneratedScenario] = useState(null);
  const [customStatus, setCustomStatus] = useState("idle");

  useEffect(() => {
    const refreshSavedScenarios = () => {
      setSavedScenarios(loadCustomScenarios());
    };

    window.addEventListener(
      "ember:custom-scenarios-updated",
      refreshSavedScenarios,
    );
    window.addEventListener("storage", refreshSavedScenarios);

    return () => {
      window.removeEventListener(
        "ember:custom-scenarios-updated",
        refreshSavedScenarios,
      );
      window.removeEventListener("storage", refreshSavedScenarios);
    };
  }, []);

  const filteredScenarios = useMemo(
    () =>
      allScenarios.filter((scenario) =>
        scenarioMatchesFilter(scenario, activeFilter),
      ),
    [activeFilter, allScenarios],
  );

  const selectedScenario = useMemo(
    () =>
      allScenarios.find((scenario) => scenario.id === selectedScenarioId) ??
      null,
    [allScenarios, selectedScenarioId],
  );

  const selectedScenarioNumber = selectedScenario
    ? filteredScenarios.findIndex((scenario) => scenario.id === selectedScenario.id)
    : -1;

  const resetPractice = () => {
    setResponse("");
    setFeedbackRequested(false);
    setSpeechMessage("");
  };

  const resetCustomBuilder = () => {
    setCustomBuilderOpen(false);
    setCustomStep(0);
    setCustomAnswers({});
    setGeneratedScenario(null);
    setCustomStatus("idle");
  };

  const selectFilter = (filterId) => {
    setActiveFilter(filterId);
    setSelectedScenarioId("");
    setCustomBuilderOpen(false);
    resetPractice();
  };

  const selectScenario = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    setCustomBuilderOpen(false);
    resetPractice();
  };

  const changeScenario = () => {
    setSelectedScenarioId("");
    resetPractice();
  };

  const startCustomBuilder = () => {
    setSelectedScenarioId("");
    setActiveFilter("");
    setCustomBuilderOpen(true);
    setGeneratedScenario(null);
    resetPractice();
  };

  const updateCustomAnswer = (questionId, value) => {
    setCustomAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  };

  const buildGeneratedScenario = async (answers = customAnswers) => {
    setCustomStatus("loading");
    const scenario = await generateCustomPracticeScenario(answers);
    setGeneratedScenario(scenario);
    setCustomStatus("ready");
  };

  const continueCustomBuilder = async () => {
    if (customStep < customScenarioQuestions.length - 1) {
      setCustomStep((current) => current + 1);
      return;
    }

    await buildGeneratedScenario();
  };

  const saveGeneratedScenario = () => {
    if (!generatedScenario) return null;

    const saved = saveCustomScenario(generatedScenario);
    setSavedScenarios(loadCustomScenarios());
    setGeneratedScenario(saved);
    return saved;
  };

  const startGeneratedPractice = () => {
    const saved = saveGeneratedScenario() ?? generatedScenario;

    if (!saved) return;

    setSelectedScenarioId(saved.id);
    setActiveFilter("custom");
    resetCustomBuilder();
    resetPractice();
  };

  const nextScenario = () => {
    if (selectedScenario) {
      recordGrowthEvent({
        source: "scenario",
        title: selectedScenario.title,
        capabilities: selectedScenario.skills,
      });
    }

    const scenarioPool = filteredScenarios.length > 0 ? filteredScenarios : allScenarios;
    const currentIndex = scenarioPool.findIndex(
      (scenario) => scenario.id === selectedScenario?.id,
    );
    const nextIndex =
      selectedScenarioNumber >= 0
        ? (selectedScenarioNumber + 1) % Math.max(filteredScenarios.length, 1)
        : currentIndex >= 0
          ? (currentIndex + 1) % Math.max(scenarioPool.length, 1)
        : 0;

    setSelectedScenarioId(
      (filteredScenarios.length > 0 ? filteredScenarios : scenarioPool)[nextIndex]
        ?.id ?? "",
    );
    resetPractice();
  };

  const startSpeech = () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setSpeechMessage("Speech input is not available in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechMessage("Listening. Say it naturally.");
    };

    recognition.onerror = () => {
      setIsListening(false);
      setSpeechMessage("Speech input stopped. You can still type your response.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript)
        .filter(Boolean)
        .join(" ");

      if (transcript) {
        setResponse((current) => `${current}${current ? " " : ""}${transcript}`);
        setFeedbackRequested(false);
        setSpeechMessage("Added your spoken response.");
      }
    };

    recognition.start();
  };

  const fallbackFeedback = useMemo(
    () =>
      selectedScenario
        ? generateScenarioFeedback({
            scenario: selectedScenario,
            userResponse: response,
          })
        : defaultFeedback,
    [response, selectedScenario],
  );

  const coachInput = useMemo(
    () => ({
      scenario: selectedScenario,
      userResponse: response,
    }),
    [response, selectedScenario],
  );

  const {
    data: coachFeedback,
    error: coachError,
    status: coachStatus,
  } = useCoachGeneration({
    surface: "scenario",
    input: coachInput,
    fallback: fallbackFeedback,
    enabled:
      Boolean(selectedScenario) &&
      feedbackRequested &&
      response.trim().length > 0,
  });

  const canSubmit = Boolean(selectedScenario) && response.trim().length > 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211a16]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#ffad7a]/24 blur-3xl" />
        <div className="absolute right-[-10rem] top-[13rem] h-[30rem] w-[30rem] rounded-full bg-[#72d8c5]/20 blur-3xl" />
        <div className="absolute bottom-[8rem] left-[20%] h-[24rem] w-[24rem] rounded-full bg-[#9da7ff]/12 blur-3xl" />
      </div>

      <SectionHeader totalScenarios={totalScenarios} />

      <section className="relative z-10 mx-auto max-w-7xl space-y-5 px-4 pb-20 sm:px-6">
        <MomentChooser
          activeFilter={activeFilter}
          filteredScenarios={filteredScenarios}
          onFilterSelect={selectFilter}
          onScenarioSelect={selectScenario}
          onChangeScenario={changeScenario}
          onStartCustom={startCustomBuilder}
          selectedScenario={selectedScenario}
          selectedScenarioId={selectedScenarioId}
          savedScenarios={savedScenarios}
        />

        {customBuilderOpen ? (
          <CustomScenarioBuilder
            answers={customAnswers}
            currentStep={customStep}
            generatedScenario={generatedScenario}
            generationStatus={customStatus}
            onAnswer={updateCustomAnswer}
            onBack={() => setCustomStep((current) => Math.max(current - 1, 0))}
            onCancel={resetCustomBuilder}
            onContinue={continueCustomBuilder}
            onEdit={() => {
              setGeneratedScenario(null);
              setCustomStatus("idle");
            }}
            onRegenerate={() => buildGeneratedScenario()}
            onSave={saveGeneratedScenario}
            onStartPractice={startGeneratedPractice}
          />
        ) : null}

        {selectedScenario ? (
          <>
            <SelectedScenario scenario={selectedScenario} />
            <ResponseComposer
              value={response}
              onChange={(value) => {
                setResponse(value);
                setFeedbackRequested(false);
              }}
              onGetFeedback={() => setFeedbackRequested(true)}
              onSpeak={startSpeech}
              isListening={isListening}
              speechMessage={speechMessage}
              canSubmit={canSubmit}
              status={coachStatus}
            />
            <FeedbackPanel
              coachFeedback={coachFeedback}
              error={coachError}
              status={coachStatus}
              visible={feedbackRequested}
            />
            <DifferentApproaches
              coachFeedback={coachFeedback}
              visible={feedbackRequested}
            />
            <ConversationSimulator
              scenario={selectedScenario}
              initialUserResponse={response}
              enabled={feedbackRequested && response.trim().length > 0}
            />
            {feedbackRequested ? <NextActions onNext={nextScenario} /> : null}
          </>
        ) : null}
      </section>
    </main>
  );
}
