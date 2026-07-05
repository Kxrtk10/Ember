import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  continueAsGuest,
  createAccount,
  getPostAuthPath,
  signIn,
} from "../auth/authEngine";

function AuthShell({ mode }) {
  const navigate = useNavigate();
  const isCreate = mode === "create";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
  };

  const submit = (event) => {
    event.preventDefault();

    const result = isCreate ? createAccount(form) : signIn(form);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    navigate(getPostAuthPath());
  };

  const guest = () => {
    continueAsGuest();
    navigate(getPostAuthPath());
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbf7ef] text-[#211a16]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#ffad7a]/30 blur-3xl" />
        <div className="absolute right-[-10rem] top-[14rem] h-[30rem] w-[30rem] rounded-full bg-[#72d8c5]/22 blur-3xl" />
        <div className="absolute bottom-[12rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[#9da7ff]/16 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 pt-6 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#211a16] text-white shadow-[0_12px_30px_rgba(33,26,22,0.18)]">
            <Sparkles size={18} />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-[-0.03em]">
              Ember
            </span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#9a8173]">
              A place to continue
            </span>
          </span>
        </Link>

        <Link
          to={isCreate ? "/sign-in" : "/create-account"}
          className="rounded-full border border-[#dfcab8] bg-white/45 px-4 py-2 text-sm font-semibold text-[#5b4b43] backdrop-blur transition hover:bg-white/75"
        >
          {isCreate ? "Sign In" : "Create Account"}
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ead8c7] bg-white/55 px-3 py-2 text-sm font-medium text-[#6c5c52] shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#ff8f70] shadow-[0_0_22px_rgba(255,143,112,0.85)]" />
            Guest mode stays open
          </div>
          <h1 className="max-w-4xl text-[clamp(3.3rem,8vw,7rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
            Welcome to Ember.
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-9 text-[#6c5c52]">
            Your journey deserves a place to grow.
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#75665c]">
            You are not just creating an account. You are creating a quiet place
            for your reflections and practice to continue.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/create-account"
              className="inline-flex items-center justify-center rounded-full bg-[#211a16] px-6 py-4 text-base font-semibold text-white shadow-[0_20px_50px_rgba(33,26,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#362a24]"
            >
              Create Account
            </Link>
            <Link
              to="/sign-in"
              className="inline-flex items-center justify-center rounded-full border border-[#dfcab8] bg-white/50 px-6 py-4 text-base font-semibold text-[#2f261f] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/80"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={guest}
              className="inline-flex items-center justify-center rounded-full border border-[#dfcab8] bg-white/30 px-6 py-4 text-base font-semibold text-[#67584f] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/70"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-[2rem] border border-[#ead8c7] bg-white/62 p-6 shadow-[0_24px_80px_rgba(74,51,35,0.10)] backdrop-blur-xl sm:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#c56d54]">
            {isCreate ? "Create Account" : "Sign In"}
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
            {isCreate ? "Save your journey." : "Return to your journey."}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#75665c]">
            {isCreate
              ? "Keep this simple. Ember only needs enough to help you come back."
              : "Continue from where your reflections and practice left off."}
          </p>

          <div className="mt-7 space-y-4">
            {isCreate ? (
              <label className="block">
                <span className="text-sm font-semibold text-[#5b4b43]">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="mt-2 w-full rounded-[1.15rem] border border-[#ead8c7] bg-[#fffaf2]/78 px-4 py-3 text-base outline-none transition focus:border-[#ff9b78] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,143,112,0.12)]"
                  placeholder="Your name"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-sm font-semibold text-[#5b4b43]">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="mt-2 w-full rounded-[1.15rem] border border-[#ead8c7] bg-[#fffaf2]/78 px-4 py-3 text-base outline-none transition focus:border-[#ff9b78] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,143,112,0.12)]"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-[#5b4b43]">
                Password
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                className="mt-2 w-full rounded-[1.15rem] border border-[#ead8c7] bg-[#fffaf2]/78 px-4 py-3 text-base outline-none transition focus:border-[#ff9b78] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,143,112,0.12)]"
                placeholder="Keep it memorable"
              />
            </label>
          </div>

          {message ? (
            <p className="mt-5 rounded-[1rem] border border-[#ead8c7] bg-[#fffaf2]/75 p-3 text-sm leading-6 text-[#75665c]">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#211a16] px-6 py-4 text-base font-semibold text-white shadow-[0_18px_45px_rgba(33,26,22,0.18)] transition hover:-translate-y-0.5 hover:bg-[#362a24]"
          >
            {isCreate ? "Create my Ember space" : "Continue"}
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </button>
        </form>
      </section>
    </main>
  );
}

export function CreateAccount() {
  return <AuthShell mode="create" />;
}

export function SignIn() {
  return <AuthShell mode="sign-in" />;
}
