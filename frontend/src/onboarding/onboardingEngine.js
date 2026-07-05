import { useEffect, useState } from "react";

const STORAGE_KEY = "ember.onboarding.profile.v1";
const UPDATE_EVENT = "ember:onboarding-updated";

const capabilityMap = {
  confidence: ["Confidence"],
  overthink: ["Resilience", "Emotional Intelligence"],
  friends: ["Networking", "Empathy"],
  networking: ["Networking", "Communication"],
  leadership: ["Leadership", "Communication"],
  approaching: ["Confidence", "Self-Expression"],
  work: ["Communication", "Professional Presence"],
  judgment: ["Confidence", "Resilience"],
  listener: ["Empathy", "Presence"],
  listening: ["Empathy", "Presence"],
  stories: ["Storytelling", "Self-Expression"],
  storyteller: ["Storytelling", "Self-Expression"],
  speaking: ["Confidence", "Presence"],
  support: ["Empathy", "Emotional Intelligence"],
  quick: ["Presence", "Communication"],
  say: ["Communication", "Self-Expression"],
  confidently: ["Confidence"],
  starting: ["Confidence", "Networking"],
  keeping: ["Communication", "Presence"],
  awkward: ["Resilience", "Presence"],
  opinions: ["Self-Expression", "Confidence"],
  criticism: ["Resilience", "Emotional Intelligence"],
  myself: ["Self-Expression"],
  expressive: ["Self-Expression"],
  confident: ["Confidence"],
  curious: ["Curiosity"],
  comfortable: ["Confidence", "Presence"],
  empathetic: ["Empathy"],
  resilient: ["Resilience"],
  influential: ["Leadership", "Communication"],
  communicator: ["Communication"],
  leader: ["Leadership"],
};

const pathwayMap = {
  Confidence: "Speaking Up",
  Empathy: "Emotional Intelligence",
  Presence: "Professional Presence",
  Leadership: "Leading Conversations",
  Communication: "Finding Your Voice",
  Resilience: "Handling Difficult Conversations",
  Curiosity: "Meeting New People",
  Networking: "Meeting New People",
  Storytelling: "Storytelling",
  "Emotional Intelligence": "Emotional Intelligence",
  "Self-Expression": "Finding Your Voice",
  "Professional Presence": "Professional Presence",
};

const scenarioCategoryMap = {
  "Meeting new people": "Social",
  "Joining group conversations": "Social",
  Dating: "Social",
  Networking: "Professional",
  Interviews: "Professional",
  Presentations: "Professional",
  Leadership: "Professional",
  Conflict: "Emotional",
  "Difficult conversations": "Emotional",
  "Emotional support": "Emotional",
  "Making friends": "Social",
  "Professional communication": "Professional",
  "Public speaking": "Communication",
  "Quick thinking": "Communication",
};

const fuelTopicMap = {
  Storytelling: "How stories make ordinary experiences meaningful",
  Leadership: "Why calm leadership feels different from control",
  Networking: "Why small talk is often about safety",
  Empathy: "How people feel understood in conversation",
  "Emotional Intelligence": "Why awkward moments feel bigger than they are",
  Confidence: "Why confidence grows through small visible reps",
  Communication: "How questions change the direction of a conversation",
};

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

export function getOnboardingProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  return safeParse(window.localStorage.getItem(STORAGE_KEY), null);
}

export function saveOnboardingProfile(answers) {
  if (typeof window === "undefined") {
    return null;
  }

  const profile = {
    answers,
    growthMap: generateGrowthMap(answers),
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(UPDATE_EVENT));
  return profile;
}

export function generateGrowthMap(answers) {
  const capabilityCounts = {};
  const allInputs = [
    ...(answers.reasons ?? []),
    ...(answers.situations ?? []),
    ...(answers.difficulties ?? []),
    ...(answers.becoming ?? []),
  ];

  allInputs.forEach((item) => {
    const normalized = item.toLowerCase();

    Object.entries(capabilityMap).forEach(([keyword, capabilities]) => {
      if (normalized.includes(keyword)) {
        capabilities.forEach((capability) => {
          capabilityCounts[capability] = (capabilityCounts[capability] ?? 0) + 1;
        });
      }
    });
  });

  if (Object.keys(capabilityCounts).length === 0) {
    capabilityCounts.Confidence = 1;
    capabilityCounts.Communication = 1;
    capabilityCounts.Presence = 1;
  }

  const focusAreas = Object.entries(capabilityCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([capability]) => capability)
    .slice(0, 5);

  const suggestedPathways = [
    ...new Set(focusAreas.map((capability) => pathwayMap[capability]).filter(Boolean)),
  ].slice(0, 4);

  const recommendedScenarioCategories = [
    ...new Set(
      (answers.situations ?? [])
        .map((situation) => scenarioCategoryMap[situation])
        .filter(Boolean),
    ),
  ].slice(0, 4);

  const suggestedFuelTopics = [
    ...new Set(focusAreas.map((capability) => fuelTopicMap[capability]).filter(Boolean)),
  ].slice(0, 4);

  return {
    focusAreas,
    suggestedPathways,
    recommendedScenarioCategories:
      recommendedScenarioCategories.length > 0
        ? recommendedScenarioCategories
        : ["Social", "Communication"],
    suggestedFuelTopics:
      suggestedFuelTopics.length > 0
        ? suggestedFuelTopics
        : ["Why confidence grows through small visible reps"],
  };
}

export function useOnboardingProfile() {
  const [profile, setProfile] = useState(() => getOnboardingProfile());

  useEffect(() => {
    const refresh = () => setProfile(getOnboardingProfile());

    window.addEventListener(UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return profile;
}
