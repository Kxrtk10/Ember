const CACHE_KEY = "ember.coach.gemini.cache.v1";
const CACHE_LIMIT = 30;
const CACHE_TTL = 1000 * 60 * 60 * 6;
const COACH_ENDPOINT = "/api/coach";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const stableStringify = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
};

const hashString = (value) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
};

const getCache = () => {
  if (typeof window === "undefined") {
    return {};
  }

  return safeParse(window.sessionStorage.getItem(CACHE_KEY), {});
};

const setCache = (cache) => {
  if (typeof window === "undefined") {
    return;
  }

  const entries = Object.entries(cache)
    .sort((a, b) => b[1].createdAt - a[1].createdAt)
    .slice(0, CACHE_LIMIT);

  window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
};

const getCacheKey = ({ surface, input, context }) =>
  hashString(
    stableStringify({
      surface,
      input,
      onboarding: context?.onboardingProfile?.growthMap,
      recentActivity: context?.activity?.all?.slice?.(0, 10) ?? [],
      themes: context?.compass?.currentThemes,
    }),
  );

async function requestCoachGeneration({ surface, input, context, safetyPrinciples }) {
  const cacheKey = getCacheKey({ surface, input, context });
  const cache = getCache();
  const cached = cache[cacheKey];

  if (cached && Date.now() - cached.createdAt < CACHE_TTL) {
    return { ...cached.data, cached: true };
  }

  const response = await fetch(COACH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      surface,
      input,
      context,
      safetyPrinciples,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? "AI guidance is unavailable right now.");
  }

  cache[cacheKey] = {
    createdAt: Date.now(),
    data: payload.data,
  };
  setCache(cache);

  return payload.data;
}

export const geminiCoachProvider = {
  id: "gemini",
  label: "Gemini",
  mode: "llm",
  async: true,

  generateScenarioFeedback({ scenario, userResponse, context, safetyPrinciples }) {
    return requestCoachGeneration({
      surface: "scenario",
      input: { scenario, userResponse },
      context,
      safetyPrinciples,
    });
  },

  generateReplayReflection({ userReflection, emotions, context, safetyPrinciples }) {
    return requestCoachGeneration({
      surface: "replay",
      input: { userReflection, emotions },
      context,
      safetyPrinciples,
    });
  },

  generateConversationFuel({ topic, interests, context, safetyPrinciples }) {
    return requestCoachGeneration({
      surface: "fuel",
      input: { topic, interests },
      context,
      safetyPrinciples,
    });
  },

  generateCompassNarrative({ context, safetyPrinciples }) {
    return requestCoachGeneration({
      surface: "compass",
      input: {},
      context,
      safetyPrinciples,
    });
  },

  generateCustomScenario({ answers, context, safetyPrinciples }) {
    return requestCoachGeneration({
      surface: "customScenario",
      input: { answers },
      context,
      safetyPrinciples,
    });
  },

  generateSimulationTurn({
    scenario,
    turns,
    personality,
    difficulty,
    context,
    safetyPrinciples,
  }) {
    return requestCoachGeneration({
      surface: "simulationTurn",
      input: { scenario, turns, personality, difficulty },
      context,
      safetyPrinciples,
    });
  },

  generateSimulationReflection({
    scenario,
    turns,
    personality,
    difficulty,
    context,
    safetyPrinciples,
  }) {
    return requestCoachGeneration({
      surface: "simulationReflection",
      input: { scenario, turns, personality, difficulty },
      context,
      safetyPrinciples,
    });
  },
};
