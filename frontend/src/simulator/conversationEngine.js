import {
  generateSimulationReflectionAsync,
  generateSimulationTurnAsync,
} from "../coach/coachEngine";

export const simulatorPersonalities = [
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm, receptive, and easy to talk to.",
    behavior:
      "Responds with warmth, gives the user room, and usually offers a gentle follow-up.",
  },
  {
    id: "reserved",
    label: "Reserved",
    description: "Quiet, thoughtful, and slower to open up.",
    behavior:
      "Uses shorter replies, needs more patience, and does not reveal everything quickly.",
  },
  {
    id: "busy",
    label: "Busy",
    description: "Pressed for time, but willing to listen.",
    behavior:
      "Keeps replies brief, may be distracted, and asks the user to get to the point.",
  },
  {
    id: "professional",
    label: "Professional",
    description: "Clear, respectful, and focused on what matters.",
    behavior:
      "Stays composed, names outcomes, and keeps the conversation practical.",
  },
  {
    id: "curious",
    label: "Curious",
    description: "Interested, engaged, and likely to ask questions.",
    behavior:
      "Asks follow-ups, notices details, and becomes more engaged when the user is specific.",
  },
  {
    id: "confident",
    label: "Confident",
    description: "Direct, composed, and comfortable with clarity.",
    behavior:
      "Responds directly, does not over-reassure, and expects the user to be clear.",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Light, warm, and quick to soften the moment.",
    behavior:
      "Uses light humor, changes energy quickly, and may avoid heaviness at first.",
  },
  {
    id: "shy",
    label: "Shy",
    description: "Gentle, a little hesitant, and sincere.",
    behavior:
      "Opens slowly, may answer softly, and responds well to patience.",
  },
  {
    id: "supportive",
    label: "Supportive",
    description: "Kind, steady, and emotionally generous.",
    behavior:
      "Affirms honestly, listens closely, and helps the conversation feel safe.",
  },
  {
    id: "direct",
    label: "Direct",
    description: "Plainspoken, honest, and not overly delicate.",
    behavior:
      "Gets to the point, asks clear questions, and may challenge vague wording.",
  },
  {
    id: "logical",
    label: "Logical",
    description: "Reasoned, precise, and focused on what makes sense.",
    behavior:
      "Looks for specifics, may miss emotional hints, and responds to clear reasoning.",
  },
  {
    id: "expressive",
    label: "Emotionally expressive",
    description: "Open, reactive, and easy to read.",
    behavior:
      "Shows feelings more visibly, reacts in the moment, and may shift tone quickly.",
  },
];

export const simulatorDifficultyLevels = [
  {
    id: "comfort",
    label: "Comfort Zone",
    description: "A gentle version where the other person gives you room.",
    behavior:
      "Be receptive, patient, and low-friction. Offer openings without making them perfect.",
  },
  {
    id: "easy",
    label: "Easy",
    description: "Mostly warm, with a little real-life awkwardness.",
    behavior:
      "Be friendly but not ideal. Include small pauses or brief replies sometimes.",
  },
  {
    id: "balanced",
    label: "Balanced",
    description: "A realistic conversation where things could go either way.",
    behavior:
      "Mix openness and uncertainty. Sometimes ask questions, sometimes need more from the user.",
  },
  {
    id: "realistic",
    label: "Realistic",
    description: "More like real life, with distractions and uneven rhythm.",
    behavior:
      "Occasionally misunderstand, respond briefly, get distracted, or change topics naturally.",
  },
  {
    id: "difficult",
    label: "Difficult",
    description: "The other person may be guarded, rushed, or skeptical.",
    behavior:
      "Create friction without cruelty. Be less immediately receptive and require clarity.",
  },
  {
    id: "unpredictable",
    label: "Unpredictable",
    description: "The conversation may shift in surprising ways.",
    behavior:
      "Vary pacing, tone, topic, and interest. Include occasional silence, misunderstanding, or sudden curiosity.",
  },
];

const mockReplies = {
  friendly: [
    "Hi. That's kind of you to say. What made you want to come over?",
    "I like that you said it simply. Tell me a little more.",
    "That feels easy to respond to. Where were you hoping the conversation would go?",
  ],
  reserved: [
    "Oh. Hi. I hear you. What did you mean by that?",
    "I'm listening. I just need a second to think.",
    "That makes sense. Can you say a little more?",
  ],
  busy: [
    "I only have a minute, but go ahead.",
    "Okay, quick version. What's the main thing?",
    "I can keep talking if we stay focused. What matters most here?",
  ],
  curious: [
    "That's interesting. What made you think of it that way?",
    "Can I ask what you were hoping would happen?",
    "I want to understand. What felt important about this moment?",
  ],
  confident: [
    "I appreciate the clarity. Tell me what you want me to know.",
    "Good, keep going. What's your honest read on it?",
    "That lands. What would you like to do next?",
  ],
  shy: [
    "Oh, hi. I'm a little caught off guard, but that's nice.",
    "I think I understand. I'm just not always quick with words.",
    "Thanks for being patient. Can you say that another way?",
  ],
  playful: [
    "Well, that was smoother than most openers. What's up?",
    "Okay, brave start. I respect it. Continue.",
    "You're doing fine. What's the next sentence?",
  ],
  professional: [
    "Thanks for raising that. What outcome are you hoping for?",
    "I understand. Let's keep this clear and useful.",
    "That is a fair point. What would help move this forward?",
  ],
  supportive: [
    "I'm glad you said that. Take your time.",
    "That sounds like it mattered to you. What part feels most important?",
    "I appreciate how you're trying to say this carefully.",
  ],
  direct: [
    "Okay. What are you asking for specifically?",
    "I hear you, but I need the plain version.",
    "That helps. What do you want to happen next?",
  ],
  logical: [
    "What makes you think that is the main issue?",
    "Can you give me a concrete example?",
    "That tracks. I am trying to understand the sequence.",
  ],
  expressive: [
    "Oh, wow. I did not realize that was how it landed.",
    "That actually means a lot to hear. Wait, tell me more.",
    "I feel a little surprised, but I am listening.",
  ],
};

export const createTurnId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function getSimulatorPersonality(personalityId) {
  return (
    simulatorPersonalities.find((personality) => personality.id === personalityId) ??
    simulatorPersonalities[0]
  );
}

export function getSimulatorDifficulty(difficultyId) {
  return (
    simulatorDifficultyLevels.find(
      (difficulty) => difficulty.id === difficultyId,
    ) ?? simulatorDifficultyLevels[2]
  );
}

export function createInitialTurns(userResponse) {
  const trimmed = userResponse.trim();

  return trimmed
    ? [
        {
          id: createTurnId(),
          role: "user",
          content: trimmed,
          createdAt: new Date().toISOString(),
        },
      ]
    : [];
}

function createMockTurn({ turns, personality, difficulty }) {
  const replies = mockReplies[personality.id] ?? mockReplies.friendly;
  const assistantTurns = turns.filter((turn) => turn.role === "assistant");
  const userTurns = turns.filter((turn) => turn.role === "user");
  const lastUser = userTurns.at(-1)?.content ?? "";
  const turnIndex = assistantTurns.length;
  const frictionByDifficulty = {
    comfort: ["Mm, I'm with you. Go on."],
    easy: ["I think I follow. Maybe say that one more way?"],
    balanced: ["Maybe. I am not totally sure I understand yet."],
    realistic: ["Sorry, I got distracted for a second. What was the main thing?"],
    difficult: ["I hear you, but I am not convinced yet."],
    unpredictable: ["Wait, that reminds me of something else. Did you mean this personally?"],
  };
  const rhythm = [
    replies[turnIndex % replies.length],
    frictionByDifficulty[difficulty.id]?.[0],
    lastUser.includes("?")
      ? "That's a fair question. I need a second with it."
      : "Can I ask what you mean by that?",
  ].filter(Boolean);
  const content = rhythm[turnIndex % rhythm.length];

  return {
    id: createTurnId(),
    role: "assistant",
    content,
    provider: "mock",
    emotionalState: `${personality.label}, ${difficulty.label}`,
    createdAt: new Date().toISOString(),
  };
}

export async function generateSimulatorTurn({
  scenario,
  turns,
  personalityId,
  difficultyId,
}) {
  const personality = getSimulatorPersonality(personalityId);
  const difficulty = getSimulatorDifficulty(difficultyId);

  try {
    const turn = await generateSimulationTurnAsync({
      scenario,
      turns,
      personality,
      difficulty,
    });

    if (!turn?.content) {
      throw new Error("Empty simulator turn.");
    }

    return {
      id: createTurnId(),
      role: "assistant",
      content: turn.content,
      provider: turn.provider,
      createdAt: new Date().toISOString(),
    };
  } catch {
    return createMockTurn({ turns, personality, difficulty });
  }
}

export async function generateSimulatorReflection({
  scenario,
  turns,
  personalityId,
  difficultyId,
}) {
  const personality = getSimulatorPersonality(personalityId);
  const difficulty = getSimulatorDifficulty(difficultyId);

  try {
    const reflection = await generateSimulationReflectionAsync({
      scenario,
      turns,
      personality,
      difficulty,
    });

    if (!reflection?.observations?.length) {
      throw new Error("Empty simulator reflection.");
    }

    return reflection;
  } catch {
    const askedQuestion = turns
      .filter((turn) => turn.role === "user")
      .some((turn) => turn.content.includes("?"));

    return {
      provider: "mock",
      mode: "mock-simulation",
      observations: [
        "You kept the exchange moving by staying with the moment.",
        askedQuestion
          ? "Curiosity helped because it gave the other person something easy to respond to."
          : "Another simple question might have opened the conversation a little further.",
        `Practicing with a ${personality.label.toLowerCase()} person at a ${difficulty.label.toLowerCase()} pace can help you build range without changing your voice.`,
      ],
      nextTry:
        "Next time, try one short follow-up question after your main point.",
      safetyNote: "This is practice, not a grade.",
    };
  }
}
