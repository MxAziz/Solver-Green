"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

// ---------- Types ----------
type RegisterFormValues = {
  name: string;
  email: string;
  roll: number;
  department: string;
  session: string;
  number: string;
  facebook: string;
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

// ---------- Error parsing ----------
// Backend (Zod) can respond with a few different shapes depending on the
// error handler: a raw ZodError issues array, { errorSources: [...] },
// { errors: [...] }, or a plain { message }. This tries all of them so the
// toast always shows the *real* validation message instead of a generic one.
function extractErrorMessage(result: unknown, fallback: string): string {
  if (!result || typeof result !== "object") return fallback;

  const body = result as Record<string, unknown>;

  const issues =
    (Array.isArray(body.errorSources) && body.errorSources) ||
    (Array.isArray(body.errors) && body.errors) ||
    (Array.isArray(body.issues) && body.issues) ||
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

  if (typeof body.message === "string") return body.message;

  return fallback;
}

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const backendUrl = process.env.SERVER_BASE_URL || "http://localhost:5000/api/v1";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
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

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitting(true);
    try {
      // Build the payload and drop optional fields entirely when left empty,
      // instead of sending "" (which fails backend url-format validation).
      const payload: Record<string, unknown> = {
        ...data,
        roll: Number(data.roll),
      };

      if (!data.linkedin?.trim()) delete payload.linkedin;
      if (!data.photo?.trim()) delete payload.photo;

      const res = await fetch(`${backendUrl}/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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
    <div className="min-h-screen bg-[#F7F7F8] rounded-2xl px-2 py-6 sm:px-6 sm:py-12 lg:py-20">
      <Toaster position="top-center" richColors closeButton />

      <div className="mx-auto w-full max-w-2xl lg:max-w-6xl">
        <div className="mb-6 text-center sm:mb-8 lg:mb-10">
          {/* image */}
          <span className="font-mono text-[9px] lg:text-[11px] tracking-[0.2em] text-[#5B4CE0]">
            RECRUITMENT 7.0 REGISTRATION
          </span>
          <h1 className="mt-2 font-serif text-2xl font-semibold text-[#151A23] sm:text-3xl lg:text-4xl">
            Reserve your seat
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7280] lg:text-base">
            Fill in your details below to complete your registration.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.06),0_8px_24px_-4px_rgba(16,24,40,0.08)] sm:p-8 lg:p-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6 lg:gap-x-8"
          >
            {/* Name */}
            <div className="sm:col-span-2">
              <Field label="Full name (As per Academic Records) *" error={errors.name?.message}>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  placeholder="Enter your full name"
                  className={inputClass(!!errors.name)}
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email *" error={errors.email?.message}>
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
            </Field>

            {/* Phone */}
            <Field label="Phone number *" error={errors.number?.message}>
              <input
                {...register("number", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^01[3-9]\d{8}$/,
                    message: "Enter a valid Bangladeshi number, e.g. 01312345678",
                  },
                })}
                type="tel"
                placeholder="01312345678"
                className={inputClass(!!errors.number)}
              />
            </Field>

            {/* Roll */}
            <Field label="Roll *" error={errors.roll?.message}>
              <input
                {...register("roll", {
                  required: "Roll is required",
                  valueAsNumber: true,
                  validate: (v) => !Number.isNaN(v) || "Roll must be a number",
                })}
                type="number"
                placeholder="Enter your Roll number"
                className={`${inputClass(!!errors.roll)} font-mono`}
              />
            </Field>

            {/* Department */}
            <Field label="Department *" error={errors.department?.message}>
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
            </Field>

            {/* Session */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Field label="Session *" error={errors.session?.message}>
                <input
                  {...register("session", { required: "Session is required" })}
                  type="text"
                  placeholder="2022-23"
                  className={inputClass(!!errors.session)}
                />
              </Field>
            </div>

            {/* Facebook */}
            <Field label="Facebook profile *" error={errors.facebook?.message}>
              <input
                {...register("facebook", {
                  required: "Facebook profile link is required",
                })}
                type="url"
                placeholder="https://facebook.com/mxaziz10"
                className={inputClass(!!errors.facebook)}
              />
            </Field>

            {/* LinkedIn */}
            <Field label="LinkedIn profile (optional)" error={errors.linkedin?.message}>
              <input
                {...register("linkedin")}
                type="url"
                placeholder="https://linkedin.com/in/mxaziz"
                className={inputClass(!!errors.linkedin)}
              />
            </Field>

            {/* Photo */}
            <Field label="Photo URL (optional)" error={errors.photo?.message}>
              <input
                {...register("photo")}
                type="url"
                placeholder="https://example.com/photo.jpg"
                className={inputClass(!!errors.photo)}
              />
            </Field>

            {/* Transaction ID */}
            <Field label="Transaction ID / ID Number *" error={errors.transactionId?.message}>
              <input
                {...register("transactionId", {
                  required: "Transaction ID or ID Number is required",
                })}
                type="text"
                placeholder="TXN123587"
                className={`${inputClass(!!errors.transactionId)} font-mono`}
              />
            </Field>

            {/* Message */}
            <div className="sm:col-span-2">
              <Field label="Why do you want to join Solver Green ?" error={errors.message?.message}>
                <textarea
                  {...register("message", { required: "Please add a short message" })}
                  rows={3}
                  placeholder="Tell us about your interest in Solver Green"
                  className={`${inputClass(!!errors.message)} resize-none`}
                />
              </Field>
            </div>

            {/* Submit */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-lg bg-[#298c65] py-4 text-md font-medium text-white transition hover:bg-[#217a58] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Registering..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------- Small building blocks ----------
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

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-[#F9FAFB] px-3.5 py-2.5 text-sm text-[#151A23] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#4C3AE3] focus:bg-white focus:ring-2 focus:ring-[#4C3AE3]/15 ${
    hasError ? "border-red-400" : "border-[#E5E7EB]"
  }`;
}