import {
  generateCustomScenario,
  generateCustomScenarioAsync,
} from "../coach/coachEngine";

const STORAGE_KEY = "ember.customScenarios.v1";

export const customScenarioQuestions = [
  {
    id: "upcoming",
    question: "What's coming up that you'd like to practice?",
    placeholder: "A conversation with my manager about taking on more responsibility...",
  },
  {
    id: "people",
    question: "Who is involved?",
    placeholder: "My manager, a close friend, someone I just met...",
  },
  {
    id: "difficult",
    question: "What feels difficult about it?",
    placeholder: "I don't want to sound defensive, but I also want to be clear...",
  },
  {
    id: "hope",
    question: "What are you hoping happens?",
    placeholder: "I want us to understand each other and leave things less tense...",
  },
  {
    id: "extra",
    question: "Is there anything else I should know?",
    placeholder: "Tone, timing, background, or anything that would help Ember understand.",
    optional: true,
  },
];

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const createScenarioId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const cleanList = (value, fallback = []) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim().length > 0)
    : fallback;

export function normalizeCustomScenario(scenario = {}) {
  const title = String(scenario.title ?? "My real-life conversation").trim();
  const context = String(
    scenario.context ??
      scenario.description ??
      "A personal conversation the user wants to practice.",
  ).trim();

  return {
    id: scenario.id ?? `custom-${createScenarioId()}`,
    title,
    difficulty: ["Beginner", "Intermediate", "Advanced"].includes(
      scenario.difficulty,
    )
      ? scenario.difficulty
      : "Intermediate",
    skills: cleanList(scenario.skills, ["Communication", "Presence"]).slice(
      0,
      4,
    ),
    context,
    feeling: String(scenario.feeling ?? "Honest, steady, human").trim(),
    categoryId: "custom",
    categoryLabel: "My Scenarios",
    description: String(scenario.description ?? context).trim(),
    setting: String(scenario.setting ?? "").trim(),
    participants: String(scenario.participants ?? "").trim(),
    emotionalContext: String(scenario.emotionalContext ?? "").trim(),
    starterPrompt: String(
      scenario.starterPrompt ?? "Start with what you might naturally say.",
    ).trim(),
    recommendedPersonalities: cleanList(scenario.recommendedPersonalities),
    followUpPossibilities: cleanList(scenario.followUpPossibilities),
    source: "custom",
    createdAt: scenario.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function loadCustomScenarios() {
  if (typeof window === "undefined") return [];

  return safeParse(window.localStorage.getItem(STORAGE_KEY), []).map(
    normalizeCustomScenario,
  );
}

export function saveCustomScenario(scenario) {
  if (typeof window === "undefined") return normalizeCustomScenario(scenario);

  const normalized = normalizeCustomScenario(scenario);
  const existing = loadCustomScenarios();
  const withoutDuplicate = existing.filter((item) => item.id !== normalized.id);
  const next = [normalized, ...withoutDuplicate].slice(0, 40);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("ember:custom-scenarios-updated"));

  return normalized;
}

export async function generateCustomPracticeScenario(answers) {
  const fallback = generateCustomScenario({ answers });

  try {
    const generated = await generateCustomScenarioAsync({ answers });
    return normalizeCustomScenario(generated.scenario);
  } catch {
    return normalizeCustomScenario(fallback.scenario);
  }
}
