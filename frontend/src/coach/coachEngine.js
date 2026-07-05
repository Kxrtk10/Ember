import { useEffect, useState } from "react";
import {
  getCompassSnapshot,
  getGrowthEvents,
  getGrowthSnapshot,
} from "../growth/growthEngine";
import { getIntelligenceSnapshot } from "../intelligence/intelligenceEngine";
import { getOnboardingProfile } from "../onboarding/onboardingEngine";
import { geminiCoachProvider } from "./geminiProvider";

export const COACH_PROVIDER_MOCK = "mock";
export const COACH_PROVIDER_GEMINI = "gemini";

export const coachSafetyPrinciples = [
  "Never diagnose, grade, rank, or compare the user.",
  "Never present one response as the correct answer.",
  "Use exploratory language: might, may, could, one possible interpretation.",
  "Support reflection and growth without positioning Ember as therapy.",
];

const UPDATE_EVENTS = [
  "ember:growth-updated",
  "ember:onboarding-updated",
  "storage",
];

const defaultScenario = {
  title: "Conversation practice",
  context: "A moment where the user wants to communicate with more presence.",
  skills: ["Communication", "Presence"],
  feeling: "Grounded, honest, human",
};

const fallbackInterests = ["Communication", "Confidence", "Presence"];

const sentenceCase = (value = "") =>
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;

const asList = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const normalizeResponse = (response = "") => response.trim();

const getPrimaryInterests = (context) => {
  const onboardingFocus = asList(
    context?.onboardingProfile?.growthMap?.focusAreas,
  );
  const activeSignals = asList(context?.growth?.signals)
    .filter((signal) => signal.activity > 0)
    .sort((a, b) => b.activity - a.activity)
    .map((signal) => signal.label);
  const intelligenceFocus = [
    context?.intelligence?.recommendations?.weeklyFocus?.title,
  ].filter(Boolean);

  return [
    ...new Set([...activeSignals, ...onboardingFocus, ...intelligenceFocus]),
  ].slice(0, 5);
};

const chooseInterest = (context, fallback = "Communication") =>
  getPrimaryInterests(context)[0] ?? fallback;

const capabilityPhrase = (capabilities = []) => {
  const visible = asList(capabilities);

  if (visible.length === 0) {
    return "presence and communication";
  }

  if (visible.length === 1) {
    return visible[0].toLowerCase();
  }

  return `${visible[0].toLowerCase()} and ${visible[1].toLowerCase()}`;
};

const compactAnswer = (value, fallback = "") =>
  normalizeResponse(value).length > 0 ? normalizeResponse(value) : fallback;

const buildCustomScenarioTitle = (answers = {}) => {
  const upcoming = compactAnswer(answers.upcoming, "a real conversation");

  if (upcoming.length <= 52) {
    return upcoming[0]?.toUpperCase()
      ? `${upcoming[0].toUpperCase()}${upcoming.slice(1)}`
      : "My conversation";
  }

  return "My real-life conversation";
};

const inferCustomDifficulty = (answers = {}) => {
  const text = Object.values(answers).join(" ").toLowerCase();

  if (/conflict|angry|criticism|boundary|difficult|argument|upset/.test(text)) {
    return "Advanced";
  }

  if (/nervous|judg|boss|manager|date|interview|presentation/.test(text)) {
    return "Intermediate";
  }

  return "Beginner";
};

const inferCustomSkills = (answers = {}, context) => {
  const text = Object.values(answers).join(" ").toLowerCase();
  const skills = [];

  if (/friend|support|listen|emotion|upset|care/.test(text)) {
    skills.push("Empathy");
  }
  if (/work|boss|manager|interview|client|professional/.test(text)) {
    skills.push("Professional Presence");
  }
  if (/lead|feedback|team|boundary|conflict/.test(text)) {
    skills.push("Leadership");
  }
  if (/nervous|confidence|approach|judg|date|speak/.test(text)) {
    skills.push("Confidence");
  }

  return [...new Set([...skills, "Communication", chooseInterest(context)])].slice(
    0,
    3,
  );
};

export function getCoachContextSnapshot() {
  const events = getGrowthEvents();
  const onboardingProfile = getOnboardingProfile();
  const growth = getGrowthSnapshot(events);
  const compass = getCompassSnapshot(events);
  const intelligence = getIntelligenceSnapshot();

  return {
    onboardingProfile,
    growth,
    compass,
    intelligence,
    activity: {
      all: events,
      scenarios: events.filter((event) => event.source === "scenario"),
      reflections: events.filter((event) => event.source === "replay"),
      fuel: events.filter((event) => event.source === "fuel"),
    },
    meta: {
      generatedAt: new Date().toISOString(),
      mode: "coach-foundation-v1",
    },
  };
}

const mockCoachProvider = {
  id: COACH_PROVIDER_MOCK,
  label: "Ember Mock Coach",
  mode: "deterministic",

  generateScenarioFeedback({ scenario = defaultScenario, userResponse = "", context }) {
    const response = normalizeResponse(userResponse);
    const skills = asList(scenario.skills);
    const primarySkill = skills[0] ?? chooseInterest(context);
    const secondarySkill = skills[1] ?? "Presence";

    return {
      provider: COACH_PROVIDER_MOCK,
      mode: "mock-ai-ready",
      whatWorked:
        response.length > 0
          ? [
              "You gave the moment a real starting point instead of waiting for perfect wording.",
              `The response creates room for ${capabilityPhrase(skills)} without trying to control the whole interaction.`,
              "There is enough openness here for the other person to participate.",
            ]
          : [
              "Even pausing to imagine the moment is a useful rehearsal.",
              `This scenario is a good place to practice ${primarySkill.toLowerCase()} without treating the first line as a performance.`,
              "You can begin with something simple and let the exchange become more human from there.",
            ],
      alternativeApproaches: [
        `You might consider a quieter version that names the moment: "I wanted to say this plainly instead of waiting for the perfect words."`,
        `Another possible path is to lead with curiosity: "Can I ask what made you think about it that way?"`,
        `If you want a lighter tone, you could make the pressure visible without apologizing for it.`,
      ],
      questionsToConsider: [
        "Which version sounds like something you would actually say out loud?",
        "Where could you make the sentence simpler so your body can keep up with it?",
        `What would ${secondarySkill.toLowerCase()} look like in this moment if you did not need to impress anyone?`,
      ],
      differentStyles: [
        {
          label: "Curious",
          response: "I noticed something interesting there. What made that stand out to you?",
        },
        {
          label: "Direct",
          response: "I wanted to say this directly because it felt worth naming.",
        },
        {
          label: "Warm",
          response: "I am not trying to make this perfect. I just wanted to be honest for a second.",
        },
      ],
      growthInsight:
        "Confidence is not finding the flawless line. It is learning that you can stay present while the line is still becoming yours.",
      safetyNote:
        "This is exploratory feedback, not a verdict on the right thing to say.",
    };
  },

  generateReplayReflection({ userReflection = "", emotions = [], context }) {
    const reflection = normalizeResponse(userReflection);
    const selectedEmotions = asList(emotions);
    const emotionPhrase =
      selectedEmotions.length > 0
        ? selectedEmotions.join(" and ").toLowerCase()
        : "unclear";
    const focus = chooseInterest(context, "Emotional Intelligence");

    return {
      provider: COACH_PROVIDER_MOCK,
      mode: "mock-ai-ready",
      possibleInterpretations: [
        "One possible interpretation is that the interaction had an awkward or uncertain moment, not that the entire connection went badly.",
        "The other person may have been managing their own attention, nerves, timing, or context in ways you could not fully see.",
        reflection.length > 0
          ? "It may be worth separating what happened from the story your mind built around it afterward."
          : "Once you add more detail, Ember can help separate the moment from the self-criticism around it.",
      ],
      thingsOverlooked: [
        "You may be overlooking the parts where you stayed engaged, cared, listened, or tried to repair the rhythm.",
        `Feeling ${emotionPhrase} is information about your experience, not proof that you failed socially.`,
        "Most people remember the overall tone of an interaction more than one uneven sentence.",
      ],
      reflectiveQuestions: [
        "What is the kindest accurate explanation for what happened?",
        "What would you tell a friend who described the same moment?",
        `How might this moment connect to your current growth around ${focus.toLowerCase()}?`,
      ],
      growthInsight:
        "It may be worth exploring how quickly one uncomfortable detail becomes a larger verdict. That is often where reflection can soften self-criticism.",
      safetyNote:
        "This reflection is not therapy or diagnosis. It offers possible interpretations to consider.",
    };
  },

  generateConversationFuel({ topic = "", interests = [], context }) {
    const activeInterests = [
      ...new Set([...asList(interests), ...getPrimaryInterests(context)]),
    ];
    const primary = activeInterests[0] ?? fallbackInterests[0];
    const usefulTopic =
      topic ||
      context?.intelligence?.recommendations?.suggestedConversationFuel?.title ||
      "Why small moments can change the feel of a conversation";

    return {
      provider: COACH_PROVIDER_MOCK,
      mode: "mock-ai-ready",
      topic: usefulTopic,
      perspectives: [
        {
          label: "Human",
          text: `One way to see this: ${primary.toLowerCase()} often grows through ordinary moments, not dramatic breakthroughs.`,
        },
        {
          label: "Social",
          text: "People often connect around the meaning beneath a topic more than the topic itself.",
        },
        {
          label: "Personal",
          text: "A good conversation can begin with a small honest observation and become deeper only if the moment invites it.",
        },
      ],
      conversationStarters: [
        `What is something small that changed how you see ${primary.toLowerCase()}?`,
        "Do you think people become more confident through insight or repetition?",
        "What is a conversation you still think about for a surprisingly good reason?",
        "When do you feel most like yourself around other people?",
      ],
      followUpQuestions: [
        "What made that stand out to you?",
        "Has that changed over time?",
        "What do you think most people misunderstand about it?",
      ],
      safetyNote:
        "Conversation Fuel is inspiration for real connection, not a script to steer people.",
    };
  },

  generateCompassNarrative({ context }) {
    const interests = getPrimaryInterests(context);
    const themes = asList(context?.compass?.currentThemes).map(
      (theme) => theme.title,
    );
    const primary = interests[0] ?? themes[0] ?? "self-understanding";
    const secondary = interests[1] ?? themes[1] ?? "presence";

    return {
      provider: COACH_PROVIDER_MOCK,
      mode: "mock-ai-ready",
      narratives: [
        `You seem increasingly interested in ${primary.toLowerCase()} as part of your growth.`,
        `You have also been circling ${secondary.toLowerCase()}, which may be becoming a useful companion theme.`,
        "You appear willing to explore uncertainty without needing every moment to become a final judgment.",
      ],
      invitations: [
        `You might consider one small practice that makes ${primary.toLowerCase()} visible this week.`,
        "It may be worth noticing where you are already becoming more patient with imperfect conversations.",
      ],
      safetyNote:
        "Compass narratives are reflective patterns, not fixed conclusions about who you are.",
    };
  },

  generateCustomScenario({ answers = {}, context }) {
    const title = buildCustomScenarioTitle(answers);
    const people = compactAnswer(answers.people, "the other person");
    const hardPart = compactAnswer(
      answers.difficult,
      "finding words that feel honest and calm",
    );
    const hope = compactAnswer(
      answers.hope,
      "leaving the conversation feeling a little clearer",
    );
    const extra = compactAnswer(answers.extra, "There may be details you can add later.");
    const skills = inferCustomSkills(answers, context);

    return {
      provider: COACH_PROVIDER_MOCK,
      mode: "mock-custom-scenario",
      scenario: {
        id: `custom-${Date.now()}`,
        title,
        categoryId: "custom",
        categoryLabel: "My Scenarios",
        difficulty: inferCustomDifficulty(answers),
        skills,
        context: `You are preparing for ${title.toLowerCase()} with ${people}. What feels difficult is ${hardPart}. You are hoping for ${hope}. ${extra}`,
        description: `A personal practice moment about ${title.toLowerCase()}.`,
        setting: compactAnswer(answers.upcoming, "A real-life conversation"),
        participants: people,
        emotionalContext: hardPart,
        starterPrompt: "Start with the words you might actually say.",
        feeling: "Honest, steady, human",
        recommendedPersonalities: ["friendly", "reserved", "direct"],
        followUpPossibilities: [
          "Ask one simple follow-up question.",
          "Name what you are hoping for without forcing an outcome.",
          "Pause and check whether the other person understood you.",
        ],
        source: "custom",
        createdAt: new Date().toISOString(),
      },
      safetyNote:
        "This scenario uses neutral assumptions and is meant for respectful practice.",
    };
  },

  generateSimulationTurn({
    scenario = defaultScenario,
    turns = [],
    personality,
    difficulty,
  }) {
    const lastUserTurn = [...turns].reverse().find((turn) => turn.role === "user");
    const turnCount = turns.filter((turn) => turn.role === "assistant").length;
    const personalityLabel = personality?.label ?? "Friendly";
    const difficultyLabel = difficulty?.label ?? "Balanced";
    const responses = {
      Friendly: [
        "Hey, I appreciate you saying that. What made you want to bring it up?",
        "That makes sense. I like that you were direct about it.",
        "I'm glad you said something. Where do you want to take the conversation from here?",
      ],
      Reserved: [
        "Oh. I hear you. What did you mean by that?",
        "I need a second, but I'm listening.",
        "That's useful to know. Can you say a little more?",
      ],
      Busy: [
        "I only have a minute, but go ahead.",
        "Okay, quick version. What's the main thing?",
        "I can keep talking if we stay focused. What matters most here?",
      ],
      Curious: [
        "That's interesting. What made you think of it that way?",
        "Can I ask what you were hoping would happen?",
        "I want to understand. What felt important about this moment?",
      ],
      Confident: [
        "I appreciate the clarity. Tell me what you want me to know.",
        "Good, keep going. What's your honest read on it?",
        "That lands. What would you like to do next?",
      ],
      Shy: [
        "Oh, hi. I'm a little caught off guard, but that's nice.",
        "I think I understand. I'm just not always quick with words.",
        "Thanks for being patient. Can you say that another way?",
      ],
      Playful: [
        "Well, that was smoother than most openers. What's up?",
        "Okay, brave start. I respect it. Continue.",
        "You're doing fine. What's the next sentence?",
      ],
      Professional: [
        "Thanks for raising that. What outcome are you hoping for?",
        "I understand. Let's keep this clear and useful.",
        "That is a fair point. What would help move this forward?",
      ],
      Supportive: [
        "I'm glad you said that. Take your time.",
        "That sounds like it mattered to you. What part feels most important?",
        "I appreciate how carefully you're trying to say this.",
      ],
      Direct: [
        "Okay. What are you asking for specifically?",
        "I hear you, but I need the plain version.",
        "That helps. What do you want to happen next?",
      ],
      Logical: [
        "What makes you think that is the main issue?",
        "Can you give me a concrete example?",
        "That tracks. I am trying to understand the sequence.",
      ],
      "Emotionally expressive": [
        "Oh, wow. I did not realize that was how it landed.",
        "That actually means a lot to hear. Wait, tell me more.",
        "I feel a little surprised, but I am listening.",
      ],
    };
    const options = responses[personalityLabel] ?? responses.Friendly;
    const difficultyResponses = {
      "Comfort Zone": "Mm, I am with you. Go on.",
      Easy: "I think I follow. Maybe say that one more way?",
      Balanced: "Maybe. I am not totally sure I understand yet.",
      Realistic: "Sorry, I got distracted for a second. What was the main thing?",
      Difficult: "I hear you, but I am not convinced yet.",
      Unpredictable:
        "Wait, that reminds me of something else. Did you mean this personally?",
    };
    const content =
      turnCount % 3 === 1
        ? difficultyResponses[difficultyLabel]
        : options[turnCount % options.length] ??
          `I hear you. ${lastUserTurn?.content ? "Can you say a little more about that?" : "How would you like to begin?"}`;

    return {
      provider: COACH_PROVIDER_MOCK,
      mode: "mock-simulation",
      role: "assistant",
      content,
      emotionalState: `${personalityLabel.toLowerCase()}, ${difficultyLabel.toLowerCase()}`,
      safetyNote: "This is a practice simulation, not a prediction.",
      scenarioTitle: scenario.title,
    };
  },

  generateSimulationReflection({ turns = [], personality, difficulty }) {
    const userTurns = turns.filter((turn) => turn.role === "user");
    const askedQuestion = userTurns.some((turn) => turn.content.includes("?"));
    const personalityLabel = personality?.label ?? "Friendly";
    const difficultyLabel = difficulty?.label ?? "Balanced";

    return {
      provider: COACH_PROVIDER_MOCK,
      mode: "mock-simulation",
      observations: [
        "You kept the exchange moving by staying in the conversation instead of trying to make every line perfect.",
        askedQuestion
          ? "Curiosity helped open the discussion and gave the other person somewhere to go."
          : "A simple question might have opened the conversation a little further.",
        `You practiced with a ${personalityLabel.toLowerCase()} person in a ${difficultyLabel.toLowerCase()} version of the moment, which builds range without turning this into a test.`,
      ],
      nextTry:
        "Next time, try adding one short question after your main point and see how the conversation changes.",
      safetyNote: "This is reflection, not a grade.",
    };
  },
};

const providerRegistry = {
  [COACH_PROVIDER_MOCK]: mockCoachProvider,
  [COACH_PROVIDER_GEMINI]: geminiCoachProvider,
};

export function registerCoachProvider(provider) {
  if (!provider?.id) {
    throw new Error("Coach providers must include a stable id.");
  }

  providerRegistry[provider.id] = provider;
  return providerRegistry[provider.id];
}

export function getCoachProvider(providerId = COACH_PROVIDER_MOCK) {
  return providerRegistry[providerId] ?? providerRegistry[COACH_PROVIDER_MOCK];
}

export function generateScenarioFeedback(input = {}, providerId) {
  const provider = getCoachProvider(providerId);
  return provider.generateScenarioFeedback({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
  });
}

export function generateReplayReflection(input = {}, providerId) {
  const provider = getCoachProvider(providerId);
  return provider.generateReplayReflection({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
  });
}

export function generateConversationFuel(input = {}, providerId) {
  const provider = getCoachProvider(providerId);
  return provider.generateConversationFuel({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
  });
}

export function generateCompassNarrative(input = {}, providerId) {
  const provider = getCoachProvider(providerId);
  return provider.generateCompassNarrative({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
  });
}

export function generateCustomScenario(input = {}, providerId) {
  const provider = getCoachProvider(providerId);
  return provider.generateCustomScenario({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
  });
}

export async function generateScenarioFeedbackAsync(
  input = {},
  providerId = COACH_PROVIDER_GEMINI,
) {
  const provider = getCoachProvider(providerId);
  return provider.generateScenarioFeedback({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
    safetyPrinciples: coachSafetyPrinciples,
  });
}

export async function generateReplayReflectionAsync(
  input = {},
  providerId = COACH_PROVIDER_GEMINI,
) {
  const provider = getCoachProvider(providerId);
  return provider.generateReplayReflection({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
    safetyPrinciples: coachSafetyPrinciples,
  });
}

export async function generateConversationFuelAsync(
  input = {},
  providerId = COACH_PROVIDER_GEMINI,
) {
  const provider = getCoachProvider(providerId);
  return provider.generateConversationFuel({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
    safetyPrinciples: coachSafetyPrinciples,
  });
}

export async function generateCompassNarrativeAsync(
  input = {},
  providerId = COACH_PROVIDER_GEMINI,
) {
  const provider = getCoachProvider(providerId);
  return provider.generateCompassNarrative({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
    safetyPrinciples: coachSafetyPrinciples,
  });
}

export async function generateCustomScenarioAsync(
  input = {},
  providerId = COACH_PROVIDER_GEMINI,
) {
  const provider = getCoachProvider(providerId);
  return provider.generateCustomScenario({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
    safetyPrinciples: coachSafetyPrinciples,
  });
}

export async function generateSimulationTurnAsync(
  input = {},
  providerId = COACH_PROVIDER_GEMINI,
) {
  const provider = getCoachProvider(providerId);
  return provider.generateSimulationTurn({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
    safetyPrinciples: coachSafetyPrinciples,
  });
}

export async function generateSimulationReflectionAsync(
  input = {},
  providerId = COACH_PROVIDER_GEMINI,
) {
  const provider = getCoachProvider(providerId);
  return provider.generateSimulationReflection({
    ...input,
    context: input.context ?? getCoachContextSnapshot(),
    safetyPrinciples: coachSafetyPrinciples,
  });
}

const asyncGenerators = {
  scenario: generateScenarioFeedbackAsync,
  replay: generateReplayReflectionAsync,
  fuel: generateConversationFuelAsync,
  compass: generateCompassNarrativeAsync,
  customScenario: generateCustomScenarioAsync,
};

export function useCoachGeneration({
  surface,
  input,
  fallback,
  enabled = true,
  provider = COACH_PROVIDER_GEMINI,
}) {
  const [state, setState] = useState({
    data: fallback,
    error: null,
    status: enabled ? "loading" : "idle",
  });

  useEffect(() => {
    let cancelled = false;
    const generate = asyncGenerators[surface];

    if (!enabled || !generate) {
      return () => {
        cancelled = true;
      };
    }

    Promise.resolve().then(() => {
      if (!cancelled) {
        setState((current) => ({
          data: current.data ?? fallback,
          error: null,
          status: "loading",
        }));
      }
    });

    generate(input, provider)
      .then((data) => {
        if (!cancelled) {
          setState({ data, error: null, status: "ready" });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            data: fallback,
            error: error?.message ?? "AI guidance is unavailable right now.",
            status: "error",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, fallback, input, provider, surface]);

  return enabled ? state : { data: fallback, error: null, status: "idle" };
}

export function buildCoachRequest({
  surface,
  input,
  provider = COACH_PROVIDER_MOCK,
}) {
  return {
    surface,
    provider,
    input,
    context: getCoachContextSnapshot(),
    safetyPrinciples: coachSafetyPrinciples,
    requestedAt: new Date().toISOString(),
  };
}

export function useCoachContextSnapshot() {
  const [snapshot, setSnapshot] = useState(() => getCoachContextSnapshot());

  useEffect(() => {
    const refresh = () => setSnapshot(getCoachContextSnapshot());

    UPDATE_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, refresh);
    });

    return () => {
      UPDATE_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, refresh);
      });
    };
  }, []);

  return snapshot;
}

export function getCoachCapabilitySummary(context = getCoachContextSnapshot()) {
  const interests = getPrimaryInterests(context);
  const primary = interests[0] ?? fallbackInterests[0];

  return {
    primary: sentenceCase(primary),
    interests: interests.length > 0 ? interests : fallbackInterests,
    recentActivity: context.activity.all.length,
    readyForProviderIntegration: true,
  };
}
