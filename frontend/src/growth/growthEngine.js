import { useEffect, useState } from "react";

const STORAGE_KEY = "ember.growth.events.v1";
const UPDATE_EVENT = "ember:growth-updated";

export const capabilities = [
  "Confidence",
  "Empathy",
  "Presence",
  "Leadership",
  "Communication",
  "Resilience",
  "Curiosity",
  "Networking",
  "Storytelling",
  "Emotional Intelligence",
  "Self-Expression",
];

const capabilityNotes = {
  Confidence: "Showing up before you feel fully ready",
  Empathy: "Noticing what another person might be carrying",
  Presence: "Staying with the moment instead of rushing away",
  Leadership: "Practicing clarity without becoming forceful",
  Communication: "Finding words that feel simple and true",
  Resilience: "Recovering after awkwardness or uncertainty",
  Curiosity: "Asking instead of assuming",
  Networking: "Creating connection without performing",
  Storytelling: "Turning experience into something shareable",
  "Emotional Intelligence": "Understanding the feeling beneath the moment",
  "Self-Expression": "Letting more of your real voice come through",
};

export const growthPathways = [
  {
    title: "Finding Your Voice",
    capabilities: ["Self-Expression", "Confidence", "Communication"],
    description: "Expressing what you mean without editing yourself away.",
  },
  {
    title: "Speaking Up",
    capabilities: ["Confidence", "Presence", "Communication"],
    description: "Entering the room with your perspective intact.",
  },
  {
    title: "Meeting New People",
    capabilities: ["Networking", "Confidence", "Curiosity"],
    description: "Starting small moments of connection with less pressure.",
  },
  {
    title: "Leading Conversations",
    capabilities: ["Leadership", "Presence", "Communication"],
    description: "Guiding a conversation while staying open and human.",
  },
  {
    title: "Handling Difficult Conversations",
    capabilities: ["Resilience", "Empathy", "Emotional Intelligence"],
    description: "Being honest without losing warmth or self-respect.",
  },
  {
    title: "Professional Presence",
    capabilities: ["Presence", "Leadership", "Networking"],
    description: "Sounding composed without becoming performative.",
  },
  {
    title: "Emotional Intelligence",
    capabilities: ["Empathy", "Resilience", "Emotional Intelligence"],
    description: "Noticing what is happening inside and between people.",
  },
  {
    title: "Storytelling",
    capabilities: ["Storytelling", "Communication", "Self-Expression"],
    description: "Making ideas, memories, and perspectives easier to share.",
  },
];

const sourceLabels = {
  scenario: "Practiced",
  replay: "Reflected",
  fuel: "Saved idea",
};

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

export function getGrowthEvents() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedEvents = safeParse(window.localStorage.getItem(STORAGE_KEY), []);
  return Array.isArray(storedEvents) ? storedEvents : [];
}

function saveGrowthEvents(events) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function recordGrowthEvent(event) {
  const normalizedCapabilities = [...new Set(event.capabilities ?? [])].filter(
    (capability) => capabilities.includes(capability),
  );

  if (normalizedCapabilities.length === 0) {
    return getGrowthSnapshot();
  }

  const nextEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    source: event.source,
    type: sourceLabels[event.source] ?? event.type ?? "Growth Moment",
    title: event.title,
    capabilities: normalizedCapabilities,
    createdAt: new Date().toISOString(),
  };

  const nextEvents = [nextEvent, ...getGrowthEvents()].slice(0, 100);
  saveGrowthEvents(nextEvents);
  return getGrowthSnapshot(nextEvents);
}

export function getGrowthSnapshot(events = getGrowthEvents()) {
  const totals = capabilities.reduce((accumulator, capability) => {
    accumulator[capability] = 0;
    return accumulator;
  }, {});

  events.forEach((event) => {
    event.capabilities?.forEach((capability) => {
      if (capability in totals) {
        totals[capability] += 1;
      }
    });
  });

  const strongestSignal = Math.max(1, ...Object.values(totals));
  const signals = capabilities.map((capability) => ({
    label: capability,
    activity: totals[capability],
    value: Math.max(8, Math.round((totals[capability] / strongestSignal) * 100)),
    note: capabilityNotes[capability],
  }));

  const pathways = growthPathways.map((pathway) => {
    const activity = pathway.capabilities.reduce(
      (total, capability) => total + totals[capability],
      0,
    );

    return {
      ...pathway,
      activity,
      value: Math.min(
        100,
        Math.max(
          8,
          Math.round((activity / Math.max(1, strongestSignal * 2)) * 100),
        ),
      ),
    };
  });

  return {
    events,
    signals,
    pathways,
    recentMoments: events.slice(0, 6),
    insights: buildInsights(totals, events),
    becoming: buildBecoming(totals),
    hasActivity: events.length > 0,
  };
}

export function getCompassSnapshot(events = getGrowthEvents()) {
  const growth = getGrowthSnapshot(events);
  const activeSignals = growth.signals
    .filter((signal) => signal.activity > 0)
    .sort((a, b) => b.activity - a.activity);
  const activePathways = growth.pathways
    .filter((pathway) => pathway.activity > 0)
    .sort((a, b) => b.activity - a.activity);
  const quietPathways = growth.pathways
    .filter((pathway) => pathway.activity === 0)
    .slice(0, 3);

  return {
    ...growth,
    currentThemes: buildCurrentThemes(activeSignals, activePathways),
    exploring: buildExploring(events, activePathways),
    strengths: buildStrengths(activeSignals, activePathways, events),
    opportunities: buildOpportunities(activeSignals, quietPathways, events),
    reflection:
      events.length > 0
        ? "Growth rarely feels dramatic while it is happening. You may be making more progress than you realize."
        : "Small conversations often create meaningful change. This page will become clearer as you practice.",
  };
}

function buildCurrentThemes(activeSignals, activePathways) {
  const signalThemes = activeSignals.slice(0, 4).map((signal) => ({
    title: signal.label,
    detail: signal.note,
  }));
  const pathwayThemes = activePathways.slice(0, 2).map((pathway) => ({
    title: pathway.title,
    detail: pathway.description,
  }));

  return [...signalThemes, ...pathwayThemes].slice(0, 5);
}

function buildExploring(events, activePathways) {
  const titleThemes = events
    .map((event) => inferExplorationTheme(event.title))
    .filter(Boolean);
  const pathwayThemes = activePathways.slice(0, 4).map((pathway) => pathway.title);
  const uniqueThemes = [...new Set([...titleThemes, ...pathwayThemes])];

  return uniqueThemes.slice(0, 6);
}

function inferExplorationTheme(title = "") {
  const normalized = title.toLowerCase();

  if (normalized.includes("network")) return "Networking";
  if (normalized.includes("friend") || normalized.includes("people")) {
    return "Making Friends";
  }
  if (
    normalized.includes("difficult") ||
    normalized.includes("criticism") ||
    normalized.includes("argument")
  ) {
    return "Difficult Conversations";
  }
  if (normalized.includes("public") || normalized.includes("presentation")) {
    return "Public Speaking";
  }
  if (normalized.includes("leader")) return "Leadership";
  if (normalized.includes("story")) return "Storytelling";
  if (normalized.includes("compliment") || normalized.includes("appreciation")) {
    return "Appreciation";
  }

  return title;
}

function buildStrengths(activeSignals, activePathways, events) {
  if (events.length === 0) {
    return [
      "Your strengths will become easier to see after a few practice moments.",
      "The first few activities are enough to begin forming a gentle pattern.",
    ];
  }

  const [topSignal] = activeSignals;
  const hasEmpathy = activeSignals.some((signal) => signal.label === "Empathy");
  const hasCommunication = activeSignals.some(
    (signal) => signal.label === "Communication",
  );
  const hasScenarioPractice = events.some((event) => event.source === "scenario");

  return [
    topSignal
      ? `You often spend time with ${topSignal.label.toLowerCase()}.`
      : "You are beginning to create a pattern Ember can reflect back.",
    hasEmpathy
      ? "You often engage with situations that ask for empathy and emotional awareness."
      : "You are practicing the skill of noticing what a moment is asking from you.",
    hasCommunication
      ? "You consistently practice communication under uncertainty."
      : "You are building a wider view of what growth can look like.",
    hasScenarioPractice || activePathways.length > 1
      ? "You appear comfortable exploring different approaches instead of searching for perfect answers."
      : "Your next few practices will show which strengths are beginning to repeat.",
  ];
}

function buildOpportunities(activeSignals, quietPathways, events) {
  if (events.length === 0) {
    return [
      "Try one practice, one reflection, or one conversation idea. Ember will use that to guide you more clearly.",
      "You might begin with a moment that feels small enough to try honestly.",
    ];
  }

  const topSignal = activeSignals[0]?.label;
  const quietPathway = quietPathways[0]?.title;
  const sourceCounts = events.reduce((accumulator, event) => {
    accumulator[event.source] = (accumulator[event.source] ?? 0) + 1;
    return accumulator;
  }, {});
  const invitations = [];

  if (topSignal && quietPathway) {
    invitations.push(
      `You have spent meaningful time with ${topSignal.toLowerCase()}; ${quietPathway.toLowerCase()} may be a useful next direction to explore.`,
    );
  }

  if ((sourceCounts.scenario ?? 0) > (sourceCounts.replay ?? 0) + 1) {
    invitations.push(
      "You often practice situations. Reflecting on a real moment may help you understand yourself more clearly.",
    );
  }

  if ((sourceCounts.fuel ?? 0) === 0) {
    invitations.push(
      "A conversation idea could give you something interesting to bring into your next interaction.",
    );
  }

  if ((sourceCounts.scenario ?? 0) === 0) {
    invitations.push(
      "Practice may help you turn reflection into something you can try next time.",
    );
  }

  return invitations.slice(0, 3);
}

function buildInsights(totals, events) {
  if (events.length === 0) {
    return [
      "Ember will show clearer patterns as you practice.",
      "Every practice, reflection, and saved idea helps Ember understand what matters to you.",
    ];
  }

  const sortedCapabilities = Object.entries(totals)
    .filter(([, total]) => total > 0)
    .sort((a, b) => b[1] - a[1]);
  if (sortedCapabilities.length === 0) {
    return [
      "Ember is beginning to notice what you are practicing.",
      "As you use Ember, your next steps will become clearer.",
    ];
  }

  const [topCapability] = sortedCapabilities[0];
  const [, secondCapability] = sortedCapabilities[1] ?? [];
  const sources = events.reduce((accumulator, event) => {
    accumulator[event.source] = (accumulator[event.source] ?? 0) + 1;
    return accumulator;
  }, {});
  const topSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0]?.[0];

  return [
    `You have spent a lot of time practicing ${topCapability.toLowerCase()}.`,
    secondCapability
      ? `${secondCapability} is starting to appear as a companion pattern.`
      : "Your next few moments will make your growth pattern clearer.",
    sourceInsight(topSource),
  ];
}

function sourceInsight(source) {
  if (source === "scenario") {
    return "Practice is becoming one of your main ways to grow.";
  }

  if (source === "replay") {
    return "Your reflections suggest you are turning social uncertainty into clearer self-understanding.";
  }

  if (source === "fuel") {
    return "Conversation ideas are helping you build more curiosity and perspective.";
  }

  return "Your activity is beginning to form a personal growth pattern.";
}

function buildBecoming(totals) {
  const active = new Set(
    Object.entries(totals)
      .filter(([, total]) => total > 0)
      .map(([capability]) => capability),
  );

  const statements = [
    active.has("Networking") || active.has("Confidence")
      ? "More comfortable starting conversations."
      : "More willing to begin with small, honest steps.",
    active.has("Self-Expression") || active.has("Communication")
      ? "More willing to express opinions."
      : "More able to notice what you want to say.",
    active.has("Resilience")
      ? "More comfortable being imperfect."
      : "More patient with the moments that feel unfinished.",
    active.has("Presence")
      ? "Less dependent on perfect replies."
      : "More aware that presence matters more than performance.",
  ];

  return statements;
}

export function useGrowthSnapshot() {
  const [snapshot, setSnapshot] = useState(() => getGrowthSnapshot());

  useEffect(() => {
    const refresh = () => setSnapshot(getGrowthSnapshot());

    window.addEventListener(UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return snapshot;
}

export function useCompassSnapshot() {
  const [snapshot, setSnapshot] = useState(() => getCompassSnapshot());

  useEffect(() => {
    const refresh = () => setSnapshot(getCompassSnapshot());

    window.addEventListener(UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return snapshot;
}
