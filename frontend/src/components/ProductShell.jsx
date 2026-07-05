import {
  Compass,
  Flame,
  Lightbulb,
  MessageCircle,
  RefreshCw,
  Route,
  Sparkles,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthUser } from "../auth/authEngine";
import { useGrowthSnapshot } from "../growth/growthEngine";
import { useIntelligenceSnapshot } from "../intelligence/intelligenceEngine";
import { useOnboardingProfile } from "../onboarding/onboardingEngine";

const navItems = [
  {
    label: "My Growth",
    path: "/growth",
    icon: Route,
  },
  {
    label: "Patterns",
    path: "/compass",
    icon: Compass,
  },
  {
    label: "Practice",
    path: "/scenario",
    icon: MessageCircle,
  },
  {
    label: "Reflect",
    path: "/replay",
    icon: RefreshCw,
  },
  {
    label: "Ideas",
    path: "/knowledge",
    icon: Lightbulb,
  },
];

const fallbackGuidanceByPath = {
  scenario: {
    eyebrow: "What to do next",
    title: "Reflect on a real interaction",
    body: "After you practice, think through something that happened in real life. Ember will help you see it more kindly and clearly.",
    cta: "Reflect on a moment",
    href: "/replay",
  },
  replay: {
    eyebrow: "What to do next",
    title: "Practice a similar moment",
    body: "If this situation comes up again, try a few possible ways to handle it before you are back in the moment.",
    cta: "Practice now",
    href: "/scenario",
  },
  knowledge: {
    eyebrow: "What to do next",
    title: "Practice this idea out loud",
    body: "You found something interesting to talk about. Try saying it in a way that sounds natural to you.",
    cta: "Practice saying it",
    href: "/scenario",
  },
  growth: {
    eyebrow: "What to do next",
    title: "See what keeps showing up",
    body: "Your growth page shows what you have been practicing. Patterns helps you notice what that might mean.",
    cta: "See patterns",
    href: "/compass",
  },
  compass: {
    eyebrow: "What to do next",
    title: "Choose one small practice",
    body: "Pick one small thing to try today. It does not need to be impressive to matter.",
    cta: "Go to my growth",
    href: "/growth",
  },
};

function getDailyFocus(snapshot, profile, intelligence) {
  const weeklyFocus = intelligence?.recommendations?.weeklyFocus;

  if (weeklyFocus) {
    return {
      title: weeklyFocus.title,
      body: weeklyFocus.body,
    };
  }

  if (!snapshot.hasActivity) {
    const onboardingFocus = profile?.growthMap?.suggestedPathways?.[0];
    const onboardingCapability = profile?.growthMap?.focusAreas?.[0];

    if (onboardingFocus || onboardingCapability) {
      return {
        title: onboardingFocus ?? onboardingCapability,
        body: onboardingCapability
          ? `Begin with ${onboardingCapability.toLowerCase()} in one small, honest moment.`
          : "Let today's practice be small, human, and real.",
      };
    }

    return {
      title: "Speaking Up",
      body: "Try one honest sentence today. Small counts.",
    };
  }

  const pathway = [...snapshot.pathways].sort((a, b) => b.activity - a.activity)[0];
  const signal = [...snapshot.signals].sort((a, b) => b.activity - a.activity)[0];

  return {
    title: pathway?.activity > 0 ? pathway.title : signal?.label ?? "Presence",
    body:
      signal?.activity > 0
        ? signal.note
        : "Let today's practice be small, human, and real.",
  };
}

function getGuidance(pathname, intelligence) {
  const recommendations = intelligence?.recommendations;

  if (pathname === "/scenario" && recommendations?.suggestedReflection) {
    return {
      eyebrow: "What to do next",
      title: recommendations.suggestedReflection.title,
      body: recommendations.suggestedReflection.prompt,
      cta: "Reflect on a moment",
      href: "/replay",
    };
  }

  if (pathname === "/replay" && recommendations?.suggestedNextScenario) {
    return {
      eyebrow: "What to do next",
      title: recommendations.suggestedNextScenario.title,
      body: recommendations.suggestedNextScenario.reason,
      cta: "Practice now",
      href: "/scenario",
    };
  }

  if (pathname === "/knowledge" && recommendations?.suggestedNextScenario) {
    return {
      eyebrow: "What to do next",
      title: `Practice ${recommendations.suggestedNextScenario.title}`,
      body: "Turn today's idea into a small rehearsal that feels natural in real conversation.",
      cta: "Practice now",
      href: "/scenario",
    };
  }

  if (pathname === "/growth") {
    return fallbackGuidanceByPath.growth;
  }

  if (pathname === "/compass" && recommendations?.weeklyFocus) {
    return {
      eyebrow: "What to do next",
      title: recommendations.weeklyFocus.title,
      body: recommendations.weeklyFocus.body,
      cta: "Go to my growth",
      href: "/growth",
    };
  }

  const key = pathname.replace("/", "");
  return fallbackGuidanceByPath[key] ?? fallbackGuidanceByPath.growth;
}

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211a16] text-white shadow-[0_12px_30px_rgba(33,26,22,0.18)]">
        <Sparkles size={18} />
      </span>
      <span>
        <span className="block text-lg font-semibold tracking-[-0.03em] text-[#211a16]">
          Ember
        </span>
        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#9a8173]">
          Your growth space
        </span>
      </span>
    </Link>
  );
}

function NavItem({ item, compact = false }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
          compact ? "shrink-0" : "w-full"
        } ${
          isActive
            ? "bg-[#211a16] text-white shadow-[0_14px_34px_rgba(33,26,22,0.16)]"
            : "text-[#67584f] hover:bg-white/70 hover:text-[#211a16]"
        }`
      }
    >
      <Icon size={17} />
      {item.label}
    </NavLink>
  );
}

function DailyFocusCard({ focus }) {
  return (
    <section className="rounded-[1.5rem] border border-[#ead8c7] bg-[#fffaf2]/72 p-4 shadow-[0_16px_45px_rgba(74,51,35,0.07)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#211a16] text-[#ffc44d]">
        <Flame size={18} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
        Today
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-[#211a16]">
        {focus.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#75665c]">{focus.body}</p>
    </section>
  );
}

function AccountCard({ user }) {
  return (
    <section className="mb-4 rounded-[1.5rem] border border-[#ead8c7] bg-white/55 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
        {user ? "Saved space" : "Guest mode"}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#211a16]">
        {user ? user.name : "Continue freely"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#75665c]">
        {user
          ? "Your Ember space is ready when you return."
          : "You can use Ember without an account. Save your space when you are ready."}
      </p>
      {!user ? (
        <Link
          to="/create-account"
          className="mt-4 inline-flex rounded-full bg-[#211a16] px-4 py-2 text-sm font-semibold text-white"
        >
          Save my space
        </Link>
      ) : null}
    </section>
  );
}

function ContextualGuidance({ guidance }) {
  return (
    <section className="relative z-20 mx-auto max-w-6xl px-5 pb-12 sm:px-6 lg:pb-16">
      <div className="rounded-[2rem] border border-[#ead8c7] bg-[#fffaf2]/78 p-5 shadow-[0_20px_65px_rgba(74,51,35,0.08)] backdrop-blur-xl sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c56d54]">
            {guidance.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-[#211a16]">
            {guidance.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#67584f]">
            {guidance.body}
          </p>
        </div>
        <Link
          to={guidance.href}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#211a16] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(33,26,22,0.16)] transition hover:-translate-y-0.5 hover:bg-[#362a24] sm:mt-0"
        >
          {guidance.cta}
        </Link>
      </div>
    </section>
  );
}

export default function ProductShell({ children }) {
  const location = useLocation();
  const user = useAuthUser();
  const snapshot = useGrowthSnapshot();
  const intelligence = useIntelligenceSnapshot();
  const profile = useOnboardingProfile();
  const focus = getDailyFocus(snapshot, profile, intelligence);
  const guidance = getGuidance(location.pathname, intelligence);

  return (
    <div className="min-h-screen bg-[#fbf7ef]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-[#ead8c7] bg-[#fffaf2]/78 p-5 shadow-[18px_0_70px_rgba(74,51,35,0.08)] backdrop-blur-2xl lg:flex lg:flex-col">
        <BrandMark />

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        <div className="mt-auto">
          <AccountCard user={user} />
          <DailyFocusCard focus={focus} />
        </div>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#ead8c7] bg-[#fffaf2]/84 px-4 py-3 shadow-[0_12px_40px_rgba(74,51,35,0.08)] backdrop-blur-2xl lg:hidden">
        <div className="mb-3 flex items-center justify-between gap-4">
          <BrandMark />
          <Link
            to={user ? "/growth" : "/create-account"}
            className="rounded-full bg-[#211a16] px-4 py-2 text-sm font-semibold text-white"
          >
            {user ? "Saved" : "Save"}
          </Link>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} compact />
          ))}
        </nav>
      </header>

      <div className="lg:pl-72">
        <div className="pt-28 lg:pt-0">{children}</div>
        <ContextualGuidance guidance={guidance} />
      </div>
    </div>
  );
}
