"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import {
  UserRound,
  Mail,
  MessageCircle,
  Hash,
  GraduationCap,
  CalendarDays,
  Link2,
  ImageIcon,
  CreditCard,
  MessageSquare,
  Copy,
  Check,
  Terminal,
  ArrowRight,
  Loader2,
} from "lucide-react";

// ---------- Fonts ----------
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

// ---------- Types ----------
type RegisterFormValues = {
  name: string;
  email: string;
  roll: string;
  department: string;
  session: string;
  number: string;
  facebook?: string;
  linkedin?: string;
  photo?: string;
  transactionId: string;
  message: string;
};

const DEPARTMENTS = [
  "CSE",
  "EEE",
  "ICE",
  "EECE",
  "CE",
  "Architecture",
  "URP",
  "Math",
  "Physics",
  "Pharmacy",
  "Chemistry",
  "Statistics",
  "BBA",
  "THM",
  "Economics",
  "Bangla",
  "SW",
  "English",
  "P-Ad",
  "History",
  "GE",
];

const BKASH_NUMBER = "01788613169";

// Small floating code glyphs scattered across the hero — a nod to the
// club's programming/skill-development focus. Purely decorative, gated
// behind prefers-reduced-motion via the .animate-float class below.
const FLOATING_GLYPHS = [
  { symbol: "</>", top: "12%", left: "8%", size: "text-lg", delay: "0s" },
  { symbol: "{ }", top: "68%", left: "5%", size: "text-xl", delay: "1.2s" },
  { symbol: "01", top: "20%", left: "88%", size: "text-sm", delay: "0.6s" },
  { symbol: ";", top: "78%", left: "90%", size: "text-2xl", delay: "1.8s" },
  { symbol: "( )", top: "45%", left: "94%", size: "text-base", delay: "2.4s" },
  { symbol: "#!", top: "85%", left: "20%", size: "text-sm", delay: "0.3s" },
];

// ---------- Error parsing ----------
// Backend (Zod) can respond with a few different shapes depending on the
// error handler: a raw ZodError issues array, { errorSources: [...] },
// { errors: [...] }, or a plain { message }. This tries all of them so the
// toast always shows the *real* validation message instead of a generic one.
function extractErrorMessage(result: unknown, fallback: string): string {
  if (!result || typeof result !== "object") return fallback;

  const responseBody = result as Record<string, unknown>;

  const issues =
    (Array.isArray(responseBody.errorSources) && responseBody.errorSources) ||
    (Array.isArray(responseBody.errors) && responseBody.errors) ||
    (Array.isArray(responseBody.issues) && responseBody.issues) ||
    (Array.isArray(result) ? (result as unknown[]) : null);

  if (issues && issues.length > 0) {
    const messages = issues
      .map((issue) => {
        const i = issue as { path?: (string | number)[]; message?: string };
        const field = i.path?.[i.path.length - 1];
        return field ? `${field}: ${i.message}` : i.message;
      })
      .filter(Boolean);
    if (messages.length > 0) return messages.join("\n");
  }

  if (typeof responseBody.message === "string") return responseBody.message;

  return fallback;
}

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      roll: "",
      department: "",
      session: "",
      number: "",
      facebook: "",
      linkedin: "",
      photo: "",
      transactionId: "",
      message: "",
    },
  });

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      toast.success("Number copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(`Couldn't copy automatically — number is ${BKASH_NUMBER}`);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitting(true);
    try {
      // Build the payload and drop optional fields entirely when left empty,
      // instead of sending "" (which fails backend url-format validation).
      const payload: Record<string, unknown> = {
        ...data,
        roll: data.roll.trim(),
      };

      if (!data.linkedin?.trim()) delete payload.linkedin;
      if (!data.photo?.trim()) delete payload.photo;

      const res = await fetch(
        `https://solver-green-server-production.up.railway.app/api/v1/user/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          extractErrorMessage(result, "Registration failed. Please try again.")
        );
      }

      toast.success("Registration successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "https://solvergreen.com";
      }, 1200);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message, { style: { whiteSpace: "pre-line" } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${display.variable} ${mono.variable} ${body.variable} min-h-screen bg-[#F4F7F3] px-3 py-8 sm:px-6 sm:py-14 lg:py-20`}
      style={{ fontFamily: "var(--font-body), ui-sans-serif, system-ui, sans-serif" }}
    >
      <Toaster position="top-center" richColors closeButton />
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .animate-float { animation: sg-float 6s ease-in-out infinite; }
          .animate-blink { animation: sg-blink 1.1s step-start infinite; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-float, .animate-blink { animation: none; }
        }
        .animate-fade-up { animation: sg-fade-up 0.7s ease-out both; }
        @keyframes sg-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(6deg); }
        }
        @keyframes sg-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes sg-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .font-display { font-family: var(--font-display), ui-sans-serif, system-ui, sans-serif; }
        .font-mono-brand { font-family: var(--font-mono), ui-monospace, SFMono-Regular, monospace; }
      `}</style>

      <div className="mx-auto w-full max-w-xl lg:max-w-6xl">
        {/* ---------------- Hero / terminal header ---------------- */}
        <div className="animate-fade-up relative overflow-hidden rounded-3xl bg-[#0E2B1C] px-6 py-10 text-center sm:px-10 sm:py-14">
          {/* floating code glyphs */}
          {FLOATING_GLYPHS.map((g, idx) => (
            <span
              key={idx}
              aria-hidden
              className={`font-mono-brand animate-float pointer-events-none absolute select-none text-[#C99A44]/25 ${g.size}`}
              style={{ top: g.top, left: g.left, animationDelay: g.delay }}
            >
              {g.symbol}
            </span>
          ))}

          {/* subtle dot-grid backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg sm:h-20 sm:w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/sg-logo.png"
                alt="Solver Green logo"
                className="h-11 w-11 object-contain sm:h-14 sm:w-14"
              />
            </div>

            <div className="font-mono-brand mt-5 flex items-center justify-center gap-2 text-[11px] tracking-[0.25em] text-[#C99A44] sm:text-xs">
              <Terminal className="h-3.5 w-3.5" />
              SOLVER GREEN — SKILL DEVELOPMENT CLUB
            </div>

            <h1 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              Recruitment 7.0
            </h1>

            <p className="font-mono-brand mt-3 text-sm text-white/70 sm:text-base">
              &gt; reserve_your_seat
              <span className="animate-blink text-[#3FAE73]">_</span>
            </p>
          </div>
        </div>

        {/* ---------------- Form card ---------------- */}
        <div className="animate-fade-up relative z-10 -mt-6 rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_20px_40px_-12px_rgba(14,43,28,0.18)] sm:-mt-8 sm:p-8 lg:p-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 lg:gap-x-8"
          >
            {/* ---- Section: About you ---- */}
            <SectionLabel text="about_you" />

            <div className="sm:col-span-2">
              <Field
                label="Full name (As per Academic Records) *"
                error={errors.name?.message}
              >
                <IconInput icon={UserRound} hasError={!!errors.name}>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="Enter your full name"
                    className={inputClass(!!errors.name)}
                  />
                </IconInput>
              </Field>
            </div>

            <Field label="Email *" error={errors.email?.message}>
              <IconInput icon={Mail} hasError={!!errors.email}>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                  type="email"
                  placeholder="aziz@example.com"
                  className={inputClass(!!errors.email)}
                />
              </IconInput>
            </Field>

            <Field label="Whatsapp number *" error={errors.number?.message}>
              <IconInput icon={MessageCircle} hasError={!!errors.number}>
                <input
                  {...register("number", {
                    required: "Whatsapp number is required",
                    pattern: {
                      value: /^01[3-9]\d{8}$/,
                      message:
                        "Enter a valid Bangladeshi number, e.g. 01312345678",
                    },
                  })}
                  type="tel"
                  placeholder="Enter a valid Bangladeshi Whatsapp number"
                  className={inputClass(!!errors.number)}
                />
              </IconInput>
            </Field>

            {/* ---- Section: Academic details ---- */}
            <SectionLabel text="academic_details" />

            <Field label="(Roll Number. Ex: 230626) / (Batch Number. Ex: 18) *" error={errors.roll?.message}>
              <IconInput icon={Hash} hasError={!!errors.roll}>
                <input
                  {...register("roll", { required: "Roll/Batch Number is required", })}
                  type="text"
                  placeholder="Enter your Roll/Batch number"
                  className={`${inputClass(!!errors.roll)} font-mono-brand`}
                />
              </IconInput>
            </Field>

            <Field label="Department *" error={errors.department?.message}>
              <IconInput icon={GraduationCap} hasError={!!errors.department}>
                <select
                  {...register("department", { required: "Select a department" })}
                  defaultValue=""
                  className={inputClass(!!errors.department)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </IconInput>
            </Field>

            <div className="sm:col-span-2 lg:col-span-1">
              <Field label="Session *" error={errors.session?.message}>
                <IconInput icon={CalendarDays} hasError={!!errors.session}>
                  <input
                    {...register("session", { required: "Session is required" })}
                    type="text"
                    placeholder="2022-23"
                    className={inputClass(!!errors.session)}
                  />
                </IconInput>
              </Field>
            </div>

            {/* ---- Section: Social links ---- */}
            <SectionLabel text="social_links" />

            <Field label="Facebook profile " error={errors.facebook?.message}>
              <IconInput icon={Link2} hasError={!!errors.facebook}>
                <input
                  {...register("facebook", {
                    required: "Facebook profile link is required",
                  })}
                  type="url"
                  placeholder="https://facebook.com/mxaziz10"
                  className={inputClass(!!errors.facebook)}
                />
              </IconInput>
            </Field>

            <Field
              label="LinkedIn profile (optional)"
              error={errors.linkedin?.message}
            >
              <IconInput icon={Link2} hasError={!!errors.linkedin}>
                <input
                  {...register("linkedin")}
                  type="url"
                  placeholder="https://linkedin.com/in/mxaziz"
                  className={inputClass(!!errors.linkedin)}
                />
              </IconInput>
            </Field>

            <Field label="Photo URL (optional)" error={errors.photo?.message}>
              <IconInput icon={ImageIcon} hasError={!!errors.photo}>
                <input
                  {...register("photo")}
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className={inputClass(!!errors.photo)}
                />
              </IconInput>
            </Field>

            {/* ---- Section: Payment ---- */}
            <SectionLabel text="payment" />

            <div className="sm:col-span-2">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
                {/* Payment instructions — terminal-style receipt */}
                <div className="lg:col-span-2">
                  <div className="font-mono-brand h-full rounded-xl bg-[#0E2B1C] p-4 text-[13px] text-white/90 sm:p-5">
                    <div className="flex items-center gap-2 text-[#3FAE73]">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>send_money --amount=200tk</span>
                    </div>
                    <div className="my-3 h-px bg-white/10" />
                    <dl className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <dt className="text-white/50">method</dt>
                        <dd className="text-right text-white/90">
                          bKash / Nagad
                          <br />
                          (Personal)
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-white/50">number</dt>
                        <dd className="flex items-center gap-1.5 text-white">
                          {BKASH_NUMBER}
                          <button
                            type="button"
                            onClick={handleCopyNumber}
                            aria-label="Copy bKash/Nagad number"
                            className="rounded-md p-1 text-white/60 transition hover:bg-white/10 hover:text-[#3FAE73]"
                          >
                            {copied ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <dt className="text-white/50">reference</dt>
                        <dd className="text-right text-white/90">
                          &lt;name&gt;&lt;roll&gt;
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 border-t border-dashed border-white/15 pt-3 text-[11px] leading-relaxed text-white/50">
                      e.g. reference: <span className="text-[#C99A44]">aziz230626</span>
                      <br />
                      Paste the Transaction ID you receive on the right →
                    </p>
                  </div>
                </div>

                {/* Transaction ID input */}
                <div className="flex lg:col-span-3">
                  <div className="w-full self-stretch">
                    <Field
                      label="Transaction ID / ID Number *"
                      error={errors.transactionId?.message}
                    >
                      <IconInput icon={CreditCard} hasError={!!errors.transactionId}>
                        <input
                          {...register("transactionId", {
                            required: "Transaction ID or ID Number is required",
                          })}
                          type="text"
                          placeholder="TXN123587"
                          className={`${inputClass(!!errors.transactionId)} font-mono-brand`}
                        />
                      </IconInput>
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Section: Message ---- */}
            <SectionLabel text="your_message" />

            <div className="sm:col-span-2">
              <Field
                label="Why do you want to join Solver Green ?"
                error={errors.message?.message}
              >
                <IconInput icon={MessageSquare} hasError={!!errors.message} align="top">
                  <textarea
                    {...register("message", {
                      required: "Please add a short message",
                    })}
                    rows={3}
                    placeholder="Tell us about your interest in Solver Green..."
                    className={`${inputClass(!!errors.message)} resize-none`}
                  />
                </IconInput>
              </Field>
            </div>

            {/* ---- Submit ---- */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F7A4D] py-4 text-[15px] font-medium text-white shadow-[0_10px_24px_-8px_rgba(31,122,77,0.55)] transition hover:bg-[#186640] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-[#6B7280]">
                We&apos;ll confirm your seat by email once your payment is verified.
              </p>
              <p className="mt-3 text-center text-xs text-[#6B7280]">
                Developed by <a href="https://www.facebook.com/mxaziz10" target="_blank" rel="noopener noreferrer" className="text-[#1F7A4D] hover:underline">
                  Muhammad Aziz
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------- Small building blocks ----------
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="sm:col-span-2">
      <div className="font-mono-brand flex items-center gap-2 text-[11px] tracking-wide text-[#1F7A4D]">
        <span className="text-[#C99A44]">{'//'}</span>
        {text}
        <span className="h-px flex-1 bg-[#E4EAE3]" />
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#374151]">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function IconInput({
  icon: Icon,
  hasError,
  align = "center",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  hasError: boolean;
  align?: "center" | "top";
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span
        className={`pointer-events-none absolute left-3 ${
          align === "top" ? "top-3" : "top-1/2 -translate-y-1/2"
        } text-[#9CA3AF] ${hasError ? "text-red-400" : ""}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-[#F9FAFB] py-2.5 pl-10 pr-3.5 text-sm text-[#151A23] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#1F7A4D] focus:bg-white focus:ring-2 focus:ring-[#1F7A4D]/15 ${
    hasError ? "border-red-400" : "border-[#E5E7EB]"
  }`;
}