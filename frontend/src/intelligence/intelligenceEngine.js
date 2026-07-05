import { useEffect, useState } from "react";
import {
  getCompassSnapshot,
  getGrowthEvents,
  getGrowthSnapshot,
} from "../growth/growthEngine";
import { getOnboardingProfile } from "../onboarding/onboardingEngine";

const scenarioRecommendations = [
  {
    title: "Leadership conversations",
    category: "Professional",
    capabilities: ["Leadership", "Communication", "Presence"],
    when: ["Networking", "Communication", "Professional Presence"],
    reason:
      "You seem interested in professional connection. Leadership conversations may help you practice guiding a moment with warmth.",
  },
  {
    title: "Expressing appreciation",
    category: "Emotional",
    capabilities: ["Empathy", "Self-Expression"],
    when: ["Empathy", "Emotional Intelligence"],
    reason:
      "You have been exploring emotionally aware situations. Appreciation can be a gentle place to practice saying what matters.",
  },
  {
    title: "Joining a group conversation",
    category: "Social",
    capabilities: ["Presence", "Communication"],
    when: ["Confidence", "Networking", "Presence"],
    reason:
      "You may benefit from a small social rep that asks for presence more than perfect timing.",
  },
  {
    title: "Difficult conversations",
    category: "Emotional",
    capabilities: ["Resilience", "Emotional Intelligence", "Communication"],
    when: ["Resilience", "Self-Expression"],
    reason:
      "You have been touching moments that involve uncertainty. This scenario can help you stay honest without becoming hard on yourself.",
  },
  {
    title: "Storytelling",
    category: "Communication",
    capabilities: ["Storytelling", "Self-Expression", "Communication"],
    when: ["Storytelling", "Curiosity"],
    reason:
      "You seem drawn toward ideas and expression. Storytelling can help turn what you notice into something shareable.",
  },
];

const reflectionRecommendations = [
  {
    title: "A moment where you wanted to say more",
    capabilities: ["Self-Expression", "Confidence"],
    when: ["Confidence", "Self-Expression"],
    prompt:
      "Replay a moment where you edited yourself down. What might your honest version have wanted to say?",
  },
  {
    title: "A conversation that felt uncertain",
    capabilities: ["Resilience", "Emotional Intelligence"],
    when: ["Resilience", "Presence"],
    prompt:
      "Reflect on a moment that felt unclear. What are three interpretations that do not blame you?",
  },
  {
    title: "A time you tried to understand someone",
    capabilities: ["Empathy", "Emotional Intelligence"],
    when: ["Empathy", "Emotional Intelligence"],
    prompt:
      "Replay a moment where you were trying to read someone well. What did you notice about them and yourself?",
  },
  {
    title: "A professional interaction that stayed with you",
    capabilities: ["Leadership", "Communication", "Presence"],
    when: ["Leadership", "Communication", "Networking"],
    prompt:
      "Reflect on a work moment where presence mattered. What helped you stay grounded?",
  },
];

const fuelRecommendations = [
  {
    title: "Why calm leadership feels different from control",
    capabilities: ["Leadership", "Presence", "Communication"],
    when: ["Leadership", "Professional Presence"],
  },
  {
    title: "How stories make ordinary experiences meaningful",
    capabilities: ["Storytelling", "Self-Expression", "Curiosity"],
    when: ["Storytelling", "Self-Expression"],
  },
  {
    title: "Why small talk is often about safety",
    capabilities: ["Networking", "Presence", "Curiosity"],
    when: ["Networking", "Confidence"],
  },
  {
    title: "How people feel understood in conversation",
    capabilities: ["Empathy", "Emotional Intelligence", "Communication"],
    when: ["Empathy", "Emotional Intelligence"],
  },
  {
    title: "Why confidence grows through small visible reps",
    capabilities: ["Confidence", "Resilience", "Self-Expression"],
    when: ["Confidence", "Resilience"],
  },
];

const weeklyFocusOptions = [
  {
    title: "Speaking Up",
    when: ["Confidence", "Self-Expression", "Communication"],
    body: "Practice one honest sentence before it feels perfectly shaped.",
  },
  {
    title: "Professional Presence",
    when: ["Leadership", "Networking", "Presence"],
    body: "Let clarity and warmth exist in the same conversation.",
  },
  {
    title: "Making New Connections",
    when: ["Networking", "Curiosity", "Confidence"],
    body: "Begin with a small question and let the moment breathe.",
  },
  {
    title: "Handling Difficult Conversations",
    when: ["Resilience", "Emotional Intelligence", "Empathy"],
    body: "Stay close to honesty without turning the moment into a verdict.",
  },
  {
    title: "Finding Your Voice",
    when: ["Self-Expression", "Storytelling", "Communication"],
    body: "Notice where your real words are quieter than they need to be.",
  },
];

const countCapabilities = (events, onboardingProfile) => {
  const counts = {};

  events.forEach((event) => {
    event.capabilities?.forEach((capability) => {
      counts[capability] = (counts[capability] ?? 0) + 1;
    });
  });

  onboardingProfile?.growthMap?.focusAreas?.forEach((capability) => {
    counts[capability] = (counts[capability] ?? 0) + 1;
  });

  return counts;
};

const rankedCapabilities = (counts) =>
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([capability]) => capability);

const chooseByAffinity = (items, interests, fallbackIndex = 0) => {
  const match = items
    .map((item) => ({
      item,
      weight: item.when.filter((capability) => interests.includes(capability)).length,
    }))
    .sort((a, b) => b.weight - a.weight)[0];

  return match?.weight > 0 ? match.item : items[fallbackIndex];
};

export function getIntelligenceSnapshot() {
  const onboardingProfile = getOnboardingProfile();
  const events = getGrowthEvents();
  const growth = getGrowthSnapshot(events);
  const compass = getCompassSnapshot(events);
  const counts = countCapabilities(events, onboardingProfile);
  const interests = rankedCapabilities(counts);

  const scenarioHistory = events.filter((event) => event.source === "scenario");
  const reflectionHistory = events.filter((event) => event.source === "replay");
  const savedTopics = events.filter((event) => event.source === "fuel");

  const suggestedNextScenario = chooseByAffinity(scenarioRecommendations, interests);
  const suggestedReflection = chooseByAffinity(reflectionRecommendations, interests);
  const suggestedConversationFuel = chooseByAffinity(fuelRecommendations, interests);
  const weeklyFocus = chooseByAffinity(weeklyFocusOptions, interests);

  return {
    inputs: {
      onboardingProfile,
      growthSignals: growth.signals,
      growthPathways: growth.pathways,
      scenarioHistory,
      reflectionHistory,
      savedTopics,
      compassThemes: compass.currentThemes,
    },
    recommendations: {
      suggestedNextScenario,
      suggestedReflection,
      suggestedConversationFuel,
      weeklyFocus,
      growthNarrative: buildGrowthNarrative({
        interests,
        events,
        compass,
        onboardingProfile,
      }),
    },
    meta: {
      generatedAt: new Date().toISOString(),
      mode: "deterministic-v1",
      readyForAi: true,
    },
  };
}

function buildGrowthNarrative({ interests, events, compass, onboardingProfile }) {
  if (events.length === 0 && !onboardingProfile) {
    return [
      "Ember will begin adapting as you complete onboarding and create your first practice moments.",
      "Your recommendations will stay gentle: patterns, invitations, and next steps.",
    ];
  }

  const primary = interests[0] ?? onboardingProfile?.growthMap?.focusAreas?.[0];
  const secondary = interests[1] ?? onboardingProfile?.growthMap?.focusAreas?.[1];
  const narratives = [];

  if (primary) {
    narratives.push(
      `You seem to be becoming more attentive to ${primary.toLowerCase()}.`,
    );
  }

  if (secondary) {
    narratives.push(
      `You have also been exploring ${secondary.toLowerCase()} as part of your growth pattern.`,
    );
  }

  if (compass.exploring.length > 0) {
    narratives.push(
      `Recent activity suggests you are circling themes like ${compass.exploring
        .slice(0, 2)
        .join(" and ")}.`,
    );
  }

  return narratives.length > 0
    ? narratives
    : ["You are beginning to create a personal pattern Ember can learn from."];
}

export function useIntelligenceSnapshot() {
  const [snapshot, setSnapshot] = useState(() => getIntelligenceSnapshot());

  useEffect(() => {
    const refresh = () => setSnapshot(getIntelligenceSnapshot());

    window.addEventListener("ember:growth-updated", refresh);
    window.addEventListener("ember:onboarding-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("ember:growth-updated", refresh);
      window.removeEventListener("ember:onboarding-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return snapshot;
}
