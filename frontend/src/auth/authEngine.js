import {
  getCompassSnapshot,
  getGrowthEvents,
  getGrowthSnapshot,
} from "../growth/growthEngine";
import { getOnboardingProfile } from "../onboarding/onboardingEngine";
import { useEffect, useState } from "react";

const USERS_KEY = "ember.auth.users.v1";
const SESSION_KEY = "ember.auth.session.v1";
const UPDATE_EVENT = "ember:auth-updated";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const readUsers = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const users = safeParse(window.localStorage.getItem(USERS_KEY), []);
  return Array.isArray(users) ? users : [];
};

const writeUsers = (users) => {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

const getSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return safeParse(window.localStorage.getItem(SESSION_KEY), null);
};

const setSession = (session) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(UPDATE_EVENT));
};

export function getAuthUser() {
  const session = getSession();

  if (!session?.userId) {
    return null;
  }

  return readUsers().find((user) => user.id === session.userId) ?? null;
}

export function createJourneySnapshot() {
  const onboardingProfile = getOnboardingProfile();
  const growthEvents = getGrowthEvents();
  const growthSnapshot = getGrowthSnapshot(growthEvents);
  const compassSnapshot = getCompassSnapshot(growthEvents);

  return {
    onboardingProfile,
    growthSignals: growthSnapshot.signals,
    compassInsights: {
      currentThemes: compassSnapshot.currentThemes,
      exploring: compassSnapshot.exploring,
      strengths: compassSnapshot.strengths,
      opportunities: compassSnapshot.opportunities,
    },
    scenarioActivity: growthEvents.filter((event) => event.source === "scenario"),
    reflections: growthEvents.filter((event) => event.source === "replay"),
    savedFuelTopics: growthEvents.filter((event) => event.source === "fuel"),
    growthEvents,
    capturedAt: new Date().toISOString(),
  };
}

export function createAccount({ name, email, password }) {
  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail || !password) {
    return {
      ok: false,
      message: "A name, email, and password are enough to create your place in Ember.",
    };
  }

  const users = readUsers();
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return {
      ok: false,
      message: "That email already has an Ember space. You can sign in instead.",
    };
  }

  const user = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: trimmedName,
    email: normalizedEmail,
    mockCredential: password,
    createdAt: new Date().toISOString(),
    lastSignedInAt: new Date().toISOString(),
    mode: "account",
    emberData: createJourneySnapshot(),
  };

  writeUsers([user, ...users]);
  setSession({ userId: user.id, mode: "account" });

  return { ok: true, user };
}

export function signIn({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find(
    (candidate) =>
      candidate.email === normalizedEmail && candidate.mockCredential === password,
  );

  if (!user) {
    return {
      ok: false,
      message: "We could not find that Ember space. Check the email and password gently.",
    };
  }

  const updatedUser = {
    ...user,
    lastSignedInAt: new Date().toISOString(),
    emberData: {
      ...user.emberData,
      ...createJourneySnapshot(),
    },
  };
  writeUsers(users.map((candidate) => (candidate.id === user.id ? updatedUser : candidate)));
  setSession({ userId: user.id, mode: "account" });

  return { ok: true, user: updatedUser };
}

export function continueAsGuest() {
  setSession({ userId: null, mode: "guest" });
}

export function getPostAuthPath() {
  return getOnboardingProfile() ? "/growth" : "/onboarding";
}

export function useAuthUser() {
  const [user, setUser] = useState(() => getAuthUser());

  useEffect(() => {
    const refresh = () => setUser(getAuthUser());

    window.addEventListener(UPDATE_EVENT, refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener(UPDATE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return user;
}
