import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Pause, RotateCcw, Sparkles } from "lucide-react";
import {
  createInitialTurns,
  createTurnId,
  generateSimulatorReflection,
  generateSimulatorTurn,
  simulatorDifficultyLevels,
  simulatorPersonalities,
} from "../simulator/conversationEngine";

function OptionCard({ title, description, active, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[1.15rem] border p-3 text-left transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? "border-[#211a16] bg-[#211a16] text-white shadow-[0_16px_38px_rgba(33,26,22,0.16)]"
          : "border-[#ead8c7] bg-white/58 text-[#67584f] hover:bg-white/88"
      }`}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className={`mt-1 text-xs leading-5 ${active ? "text-white/62" : "text-[#8b776b]"}`}>
        {description}
      </p>
    </button>
  );
}

function SimulatorSetup({
  personalityId,
  difficultyId,
  onPersonalityChange,
  onDifficultyChange,
  disabled,
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#211a16]">
              Who do you want to practice with?
            </p>
            <p className="mt-1 text-sm leading-6 text-[#75665c]">
              Pick the kind of person this moment should feel like.
            </p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {simulatorPersonalities.map((personality) => (
            <OptionCard
              key={personality.id}
              title={personality.label}
              description={personality.description}
              active={personality.id === personalityId}
              disabled={disabled}
              onClick={() => onPersonalityChange(personality.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#211a16]">
          How challenging should it be?
        </p>
        <p className="mt-1 text-sm leading-6 text-[#75665c]">
          Start gentle, or make it closer to real life.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {simulatorDifficultyLevels.map((difficulty) => (
            <OptionCard
              key={difficulty.id}
              title={difficulty.label}
              description={difficulty.description}
              active={difficulty.id === difficultyId}
              disabled={disabled}
              onClick={() => onDifficultyChange(difficulty.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ConversationBubble({ turn }) {
  const isUser = turn.role === "user";

  return (
    <article
      className={`animate-[ember-fade-up_320ms_ease-out] flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`max-w-[min(42rem,90%)] ${isUser ? "text-right" : "text-left"}`}>
        <p
          className={`mb-1 px-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${
            isUser ? "text-[#9a8173]" : "text-[#c56d54]"
          }`}
        >
          {isUser ? "You" : "Other person"}
        </p>
        <div
          className={`rounded-[1.45rem] px-5 py-4 shadow-sm ${
            isUser
              ? "bg-[#211a16] text-white"
              : "border border-[#ead8c7] bg-white/76 text-[#3d312b]"
          }`}
        >
          <p className="whitespace-pre-wrap text-base leading-8">{turn.content}</p>
        </div>
      </div>
    </article>
  );
}

function ThinkingBubble({ status }) {
  if (status !== "loading") return null;

  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#ead8c7] bg-white/70 px-4 py-2 text-sm font-semibold text-[#75665c]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff8f70]" />
        They are taking a second...
      </div>
    </div>
  );
}

function ReflectionCard({ reflection }) {
  if (!reflection) return null;

  const labels = [
    "What kept it moving",
    "Where curiosity helped",
    "What could open it further",
    "One thing to notice",
  ];

  return (
    <section className="animate-[ember-fade-up_420ms_ease-out] rounded-[1.6rem] bg-[#211a16] p-5 text-white shadow-[0_20px_55px_rgba(33,26,22,0.14)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ffc44d]">
        Reflection
      </p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
        What this practice showed
      </h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {reflection.observations.map((item, index) => (
          <div
            key={item}
            className="rounded-[1.2rem] border border-white/10 bg-white/[0.06] p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/42">
              {labels[index] ?? "Something worth noticing"}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/76">{item}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-[1.2rem] bg-white p-4 text-sm font-semibold leading-6 text-[#211a16]">
        {reflection.nextTry}
      </p>
    </section>
  );
}

export default function ConversationSimulator({
  scenario,
  initialUserResponse,
  enabled,
}) {
  const [personalityId, setPersonalityId] = useState("friendly");
  const [difficultyId, setDifficultyId] = useState("balanced");
  const [turns, setTurns] = useState(() => createInitialTurns(initialUserResponse));
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("idle");
  const [reflection, setReflection] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        setTurns(createInitialTurns(initialUserResponse));
        setDraft("");
        setStatus("idle");
        setReflection(null);
        setHasStarted(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [initialUserResponse, scenario.id]);

  const canSend = draft.trim().length > 0 && status !== "loading";
  const canReflect = hasStarted && status !== "loading" && status !== "reflecting";
  const selectedPersonality = useMemo(
    () =>
      simulatorPersonalities.find(
        (personality) => personality.id === personalityId,
      ) ?? simulatorPersonalities[0],
    [personalityId],
  );
  const selectedDifficulty = useMemo(
    () =>
      simulatorDifficultyLevels.find(
        (difficulty) => difficulty.id === difficultyId,
      ) ?? simulatorDifficultyLevels[2],
    [difficultyId],
  );

  const requestAssistantTurn = async (nextTurns = turns) => {
    setStatus("loading");
    setReflection(null);
    const assistantTurn = await generateSimulatorTurn({
      scenario,
      turns: nextTurns,
      personalityId,
      difficultyId,
    });
    setTurns([...nextTurns, assistantTurn]);
    setStatus("ready");
  };

  const startSimulation = async () => {
    setHasStarted(true);
    await requestAssistantTurn(turns);
  };

  const sendReply = async () => {
    if (!canSend) return;

    const userTurn = {
      id: createTurnId(),
      role: "user",
      content: draft.trim(),
      createdAt: new Date().toISOString(),
    };
    const nextTurns = [...turns, userTurn];
    setDraft("");
    setTurns(nextTurns);
    await requestAssistantTurn(nextTurns);
  };

  const endSimulation = async () => {
    if (!canReflect) return;

    setStatus("reflecting");
    const nextReflection = await generateSimulatorReflection({
      scenario,
      turns,
      personalityId,
      difficultyId,
    });
    setReflection(nextReflection);
    setStatus("ready");
  };

  const resetSimulation = () => {
    setTurns(createInitialTurns(initialUserResponse));
    setDraft("");
    setStatus("idle");
    setReflection(null);
    setHasStarted(false);
  };

  if (!enabled) return null;

  return (
    <section className="animate-[ember-fade-up_500ms_ease-out] rounded-[2rem] border border-[#ead8c7] bg-[#fffaf2]/76 p-5 shadow-[0_24px_80px_rgba(74,51,35,0.09)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2d9c8d]">
            Continue the Conversation
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16] sm:text-4xl">
            Let's see how this moment might unfold.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#75665c]">
            This is a rehearsal room. Try a reply, notice what happens, and end
            whenever you have enough to reflect on.
          </p>
        </div>
        <button
          type="button"
          onClick={resetSimulation}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-[#dfcab8] bg-white/65 px-4 py-2.5 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      <SimulatorSetup
        personalityId={personalityId}
        difficultyId={difficultyId}
        onPersonalityChange={setPersonalityId}
        onDifficultyChange={setDifficultyId}
        disabled={hasStarted}
      />

      <div className="mt-5 rounded-[1.6rem] border border-[#ead8c7] bg-white/42 p-4 sm:p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 border-b border-[#ead8c7]/70 pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c56d54]">
              Rehearsal room
            </p>
            <p className="mt-1 text-sm font-semibold text-[#211a16]">
              {selectedPersonality.label} person - {selectedDifficulty.label}
            </p>
          </div>
          {hasStarted ? (
            <button
              type="button"
              onClick={endSimulation}
              disabled={!canReflect}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-[#dfcab8] bg-white/70 px-4 py-2.5 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Pause size={15} />
              {status === "reflecting" ? "Reflecting..." : "End and reflect"}
            </button>
          ) : null}
        </div>

        <div className="min-h-[16rem] space-y-5">
          {turns.map((turn) => (
            <ConversationBubble key={turn.id} turn={turn} />
          ))}
          <ThinkingBubble status={status} />
        </div>

        {!hasStarted ? (
          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={startSimulation}
              disabled={turns.length === 0 || status === "loading"}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(33,26,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#362a24] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Begin this moment
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Reply as yourself..."
              className="min-h-32 resize-none rounded-[1.25rem] border border-[#ead8c7] bg-white/82 p-4 text-base leading-7 text-[#211a16] outline-none transition placeholder:text-[#b09a8b] focus:border-[#ff9b78] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,143,112,0.12)]"
            />
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={sendReply}
                disabled={!canSend}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#211a16] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(33,26,22,0.16)] transition hover:-translate-y-0.5 hover:bg-[#362a24] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Reply
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={endSimulation}
                disabled={!canReflect}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dfcab8] bg-white/65 px-5 py-3 text-sm font-semibold text-[#3d312b] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Sparkles size={16} />
                Reflect
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <ReflectionCard reflection={reflection} />
      </div>
    </section>
  );
}
