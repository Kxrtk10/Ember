/* global process */

const DEFAULT_MODEL = "gemini-1.5-flash";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta";

const responseSchemas = {
  scenario: {
    whatWorked: [],
    alternativeApproaches: [],
    questionsToConsider: [],
    communicationSuggestions: [],
    differentStyles: [],
    growthInsight: "",
    safetyNote: "",
  },
  replay: {
    possibleInterpretations: [],
    gentleObservations: [],
    perspectiveShifts: [],
    reflectiveQuestions: [],
    growthInsight: "",
    safetyNote: "",
  },
  fuel: {
    topic: "",
    perspectives: [],
    conversationStarters: [],
    followUpQuestions: [],
    safetyNote: "",
  },
  compass: {
    narratives: [],
    invitations: [],
    safetyNote: "",
  },
  customScenario: {
    scenario: {
      title: "",
      categoryId: "",
      categoryLabel: "",
      difficulty: "",
      skills: [],
      context: "",
      description: "",
      setting: "",
      participants: "",
      emotionalContext: "",
      starterPrompt: "",
      feeling: "",
      recommendedPersonalities: [],
      followUpPossibilities: [],
    },
    safetyNote: "",
  },
  simulationTurn: {
    role: "assistant",
    content: "",
    emotionalState: "",
    safetyNote: "",
  },
  simulationReflection: {
    observations: [],
    nextTry: "",
    safetyNote: "",
  },
};

const sleep = (duration) =>
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });

function getApiKey() {
  return (
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
    process.env.GOOGLE_API_KEY
  );
}

function getModelName() {
  return process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

function compactJson(value, fallback = {}) {
  try {
    return JSON.stringify(value ?? fallback, null, 2);
  } catch {
    return JSON.stringify(fallback, null, 2);
  }
}

function extractJson(text = "") {
  const withoutFence = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return JSON.");
  }

  return JSON.parse(withoutFence.slice(start, end + 1));
}

function normalizeList(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((item) => typeof item === "string" && item.trim().length > 0);
}

function normalizePerspectives(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      label: String(item?.label ?? "Perspective"),
      text: String(item?.text ?? ""),
    }))
    .filter((item) => item.text.trim().length > 0);
}

function normalizeStyles(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => ({
      label: String(item?.label ?? "Style"),
      response: String(item?.response ?? ""),
    }))
    .filter((item) => item.response.trim().length > 0);
}

function normalizeOutput(surface, output) {
  if (surface === "scenario") {
    return {
      provider: "gemini",
      mode: "llm",
      whatWorked: normalizeList(output.whatWorked),
      alternativeApproaches: normalizeList(output.alternativeApproaches),
      questionsToConsider: normalizeList(output.questionsToConsider),
      communicationSuggestions: normalizeList(output.communicationSuggestions),
      differentStyles: normalizeStyles(output.differentStyles),
      growthInsight: String(output.growthInsight ?? ""),
      safetyNote: String(output.safetyNote ?? ""),
    };
  }

  if (surface === "replay") {
    return {
      provider: "gemini",
      mode: "llm",
      possibleInterpretations: normalizeList(output.possibleInterpretations),
      thingsOverlooked: normalizeList(output.gentleObservations),
      perspectiveShifts: normalizeList(output.perspectiveShifts),
      reflectiveQuestions: normalizeList(output.reflectiveQuestions),
      growthInsight: String(output.growthInsight ?? ""),
      safetyNote: String(output.safetyNote ?? ""),
    };
  }

  if (surface === "fuel") {
    return {
      provider: "gemini",
      mode: "llm",
      topic: String(output.topic ?? ""),
      perspectives: normalizePerspectives(output.perspectives),
      conversationStarters: normalizeList(output.conversationStarters),
      followUpQuestions: normalizeList(output.followUpQuestions),
      safetyNote: String(output.safetyNote ?? ""),
    };
  }

  if (surface === "simulationTurn") {
    return {
      provider: "gemini",
      mode: "llm-simulation",
      role: "assistant",
      content: String(output.content ?? ""),
      emotionalState: String(output.emotionalState ?? ""),
      safetyNote: String(output.safetyNote ?? ""),
    };
  }

  if (surface === "simulationReflection") {
    return {
      provider: "gemini",
      mode: "llm-simulation",
      observations: normalizeList(output.observations),
      nextTry: String(output.nextTry ?? ""),
      safetyNote: String(output.safetyNote ?? ""),
    };
  }

  if (surface === "customScenario") {
    const scenario = output.scenario ?? {};

    return {
      provider: "gemini",
      mode: "llm-custom-scenario",
      scenario: {
        title: String(scenario.title ?? "My real-life conversation"),
        categoryId: String(scenario.categoryId ?? "custom"),
        categoryLabel: String(scenario.categoryLabel ?? "My Scenarios"),
        difficulty: String(scenario.difficulty ?? "Intermediate"),
        skills: normalizeList(scenario.skills, ["Communication", "Presence"]).slice(
          0,
          4,
        ),
        context: String(scenario.context ?? scenario.description ?? ""),
        description: String(scenario.description ?? ""),
        setting: String(scenario.setting ?? ""),
        participants: String(scenario.participants ?? ""),
        emotionalContext: String(scenario.emotionalContext ?? ""),
        starterPrompt: String(
          scenario.starterPrompt ?? "Start with what you might naturally say.",
        ),
        feeling: String(scenario.feeling ?? "Honest, steady, human"),
        recommendedPersonalities: normalizeList(scenario.recommendedPersonalities),
        followUpPossibilities: normalizeList(scenario.followUpPossibilities),
      },
      safetyNote: String(output.safetyNote ?? ""),
    };
  }

  return {
    provider: "gemini",
    mode: "llm",
    narratives: normalizeList(output.narratives),
    invitations: normalizeList(output.invitations),
    safetyNote: String(output.safetyNote ?? ""),
  };
}

function buildSurfacePrompt({ surface, input, context, safetyPrinciples }) {
  const base = `
You are Ember, a warm reflection and growth companion.
You are not a therapist, diagnostician, grader, or chatbot.
Never provide a single correct answer.
Never diagnose, manipulate, rank, compare, shame, or speak with certainty about another person's intent.
Use plain English a smart teenager could understand.
Use gentle phrases like "you might consider", "one possible interpretation", and "it may be worth noticing".
Return only valid JSON. No markdown.

Safety principles:
${compactJson(safetyPrinciples, [])}

User context:
${compactJson(context, {})}

Input:
${compactJson(input, {})}
`;

  if (surface === "scenario") {
    return `${base}
Task: Generate supportive Practice feedback.
Include:
- whatWorked: 3 short observations
- alternativeApproaches: 3 different ways to respond
- questionsToConsider: 3 reflective questions
- communicationSuggestions: 2 practical suggestions
- differentStyles: 3 objects with label and response
- growthInsight: one warm sentence
- safetyNote: one sentence saying this is exploration, not the correct answer

JSON shape:
${compactJson(responseSchemas.scenario)}
`;
  }

  if (surface === "replay") {
    return `${base}
Task: Help the user reflect on a past interaction without judgment.
Include:
- possibleInterpretations: 3 possibilities
- gentleObservations: 3 things they may be missing
- perspectiveShifts: 2 softer ways to see the moment
- reflectiveQuestions: 3 questions worth thinking about
- growthInsight: one warm sentence
- safetyNote: one sentence saying this is not therapy or diagnosis

JSON shape:
${compactJson(responseSchemas.replay)}
`;
  }

  if (surface === "fuel") {
    return `${base}
Task: Generate conversation ideas based on the user's interests.
Include:
- topic
- perspectives: 3 objects with label and text
- conversationStarters: 4 natural questions
- followUpQuestions: 3 short follow-up questions
- safetyNote: one sentence saying these are invitations, not scripts

JSON shape:
${compactJson(responseSchemas.fuel)}
`;
  }

  if (surface === "simulationTurn") {
    return `${base}
Task: Continue a realistic practice conversation as the AI Character.
This is not entertainment roleplay. It is a safe rehearsal for a real-life moment.
Use the chosen personality, difficulty level, scenario, growth context, and full conversation history.
Respond as the other person only.
Keep the reply natural and human. Use varied pacing: sometimes one short sentence, sometimes 2-3 sentences, sometimes a question.
The character may pause, ask a question, misunderstand, be briefly distracted, become interested, respond briefly, or shift topics if the difficulty invites it.
Remember facts, earlier questions, the user's tone, and what has already been said.
Do not repeat information unnecessarily.
Do not coach, explain, grade, or mention Ember.
Do not resolve the whole conversation too quickly.
Avoid giving the user a perfect conversational opportunity every turn.

JSON shape:
${compactJson(responseSchemas.simulationTurn)}
`;
  }

  if (surface === "simulationReflection") {
    return `${base}
Task: Reflect on the completed practice conversation.
Do not grade, score, rank, or say correct/incorrect.
Include:
- observations: 4 gentle observations covering moments that kept the conversation moving, places curiosity helped, and moments where another approach might have opened the conversation further
- nextTry: one simple thing worth trying next time
- safetyNote: one sentence saying this is practice, not a verdict

JSON shape:
${compactJson(responseSchemas.simulationReflection)}
`;
  }

  if (surface === "customScenario") {
    return `${base}
Task: Turn the user's answers into a complete Ember Practice scenario.
The scenario should feel like a realistic, respectful rehearsal for a real-life conversation.
Make reasonable neutral assumptions only when details are missing.
Do not invent dangerous, manipulative, coercive, or harmful details.
If conflict is involved, encourage respectful communication and emotional steadiness.
The scenario must work like a built-in Ember scenario.

Use:
- categoryId: custom
- categoryLabel: My Scenarios
- difficulty: Beginner, Intermediate, or Advanced
- skills: 2-4 items such as Confidence, Empathy, Presence, Leadership, Communication, Resilience, Curiosity, Self-Expression, Professional Presence
- recommendedPersonalities: 2-4 ids from friendly, reserved, busy, professional, curious, confident, playful, shy, supportive, direct, logical, expressive

JSON shape:
${compactJson(responseSchemas.customScenario)}
`;
  }

  return `${base}
Task: Generate a warm Patterns narrative from the user's growth history.
Include:
- narratives: 3 short personalized observations
- invitations: 2 gentle next-step invitations
- safetyNote: one sentence saying these are patterns, not fixed conclusions

JSON shape:
${compactJson(responseSchemas.compass)}
`;
}

export function createGeminiClient({
  apiKey = getApiKey(),
  model = getModelName(),
} = {}) {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY.");
  }

  const generate = async ({ prompt, retries = 2 }) => {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await fetch(
          `${GEMINI_ENDPOINT}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.55,
                topP: 0.9,
                maxOutputTokens: 1400,
                responseMimeType: "application/json",
              },
            }),
          },
        );

        if (!response.ok) {
          const detail = await response.text();
          throw new Error(`Gemini request failed: ${response.status} ${detail}`);
        }

        const payload = await response.json();
        return payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      } catch (error) {
        lastError = error;

        if (attempt < retries) {
          await sleep(350 * (attempt + 1));
        }
      }
    }

    throw lastError;
  };

  return { generate, model, provider: "gemini" };
}

export async function generateWithGemini({ surface, input, context, safetyPrinciples }) {
  const client = createGeminiClient();
  const prompt = buildSurfacePrompt({ surface, input, context, safetyPrinciples });
  const text = await client.generate({ prompt });
  const parsed = extractJson(text);

  return normalizeOutput(surface, parsed);
}
