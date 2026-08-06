"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Search,
  Phone,
  Mail,
  Hash,
  GraduationCap,
  CalendarDays,
  ExternalLink,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Users,
  ChevronDown,
  ChevronUp,
  SearchX,
  RefreshCw,
  UserRound,
} from "lucide-react";

// ---------- Types ----------
type Member = {
  id: number;
  name: string;
  email: string;
  roll: string;
  department: string;
  session: string;
  number: string;
  facebook?: string | null;
  linkedin?: string | null;
  photo?: string | null;
  transactionId: string;
  message: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  meta: { total: number; page: number; limit: number };
  data: Member[];
};

const API_URL = "https://solver-green-server-production.up.railway.app/api/v1/user/";

type StatusFilter = "all" | "verified" | "pending";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMembers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        const result: ApiResponse | null = await res.json().catch(() => null);

        if (!res.ok || !result?.success) {
          throw new Error(result?.message || "Failed to load registered members.");
        }

        setMembers(result.data ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof Error ? err.message : "Something went wrong while loading members.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
    return () => controller.abort();
  }, [reloadKey]);

  const { verifiedCount, pendingCount } = useMemo(() => {
    return {
      verifiedCount: members.filter((m) => m.isVerified).length,
      pendingCount: members.filter((m) => !m.isVerified).length,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    const digits = search.replace(/\D/g, "");
    const nameQuery = search.trim().toLowerCase();

    return members.filter((m) => {
      const matchesNumber = digits.length > 0 && m.number.replace(/\D/g, "").includes(digits);
      const matchesName = nameQuery.length > 0 && m.name.toLowerCase().includes(nameQuery);
      const matchesSearch = search.trim() === "" || matchesNumber || matchesName;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && m.isVerified) ||
        (statusFilter === "pending" && !m.isVerified);

      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const handleVerify = async (id: number) => {
    try {
      setLoadingId(id);

      const res = await fetch(`${API_URL}${id}/verify`, {
        method: "PATCH",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Verification failed");
      }

      toast.success("User verified successfully");

      setMembers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                isVerified: true,
              }
            : user
        )
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F3] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      {/* ---------------- Header ---------------- */}
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#1F7A4D]">
            <Users className="h-4 w-4" />
            <span className="font-mono-brand text-[11px] tracking-[0.2em]">
              REGISTERED MEMBERS
            </span>
          </div>
          <h1 className="font-display mt-1.5 text-2xl font-semibold text-[#101913] sm:text-3xl">
            All Members
          </h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Everyone who has submitted a registration for Recruitment 7.0.
          </p>
        </div>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-2">
          <StatChip label="Total" value={members.length} tone="neutral" />
          <StatChip label="Verified" value={verifiedCount} tone="verified" />
          <StatChip label="Pending" value={pendingCount} tone="pending" />
        </div>
      </div>

      {/* ---------------- Search + filter bar ---------------- */}
      <div className="sticky top-0 z-10 mb-6 flex flex-col gap-3 rounded-2xl border border-[#E4EAE3] bg-white/90 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by phone number or name..."
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] py-2.5 pl-10 pr-3.5 text-sm text-[#151A23] outline-none transition placeholder:text-[#9CA3AF] focus:border-[#1F7A4D] focus:bg-white focus:ring-2 focus:ring-[#1F7A4D]/15"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <FilterPill
            label="All"
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <FilterPill
            label="Verified"
            active={statusFilter === "verified"}
            onClick={() => setStatusFilter("verified")}
          />
          <FilterPill
            label="Pending"
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          />
        </div>
      </div>

      {/* ---------------- Content ---------------- */}
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <ErrorState message={error} onRetry={() => setReloadKey((k) => k + 1)} />
      ) : filteredMembers.length === 0 ? (
        <EmptyState hasQuery={search.trim() !== "" || statusFilter !== "all"} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onVerify={handleVerify}
              isLoading={loadingId === member.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------- Member card ----------------
function MemberCard({ member, onVerify, isLoading }: { member: Member; onVerify: (id: number) => void; isLoading: boolean; }) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const initials = member.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const formattedDate = new Date(member.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(member.number);
      setCopied(true);
      toast.success("Number copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error(`Couldn't copy — number is ${member.number}`);
    }
  };

  const isLongMessage = member.message.length > 110;

  return (
    <div className="flex flex-col rounded-2xl border border-[#E4EAE3] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:shadow-[0_12px_28px_-10px_rgba(14,43,28,0.18)]">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0E2B1C] text-sm font-semibold">
            {member.photo && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.photo}
                alt={member.name}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              initials || <UserRound className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-[#101913]">
              {member.name}
            </p>
            <p className="truncate text-xs text-[#6B7280]">{member.email}</p>
          </div>
        </div>

        <button
          onClick={() => onVerify(member.id)}
          disabled={isLoading || member.isVerified}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-medium transition disabled:opacity-50 ${
            member.isVerified
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-[#fae5b9] text-black px-2.5 py-1 font-medium"
          }`}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : member.isVerified ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <CheckCircle2 className="h-3 w-3" />
          )}
          {member.isVerified ? "Verified" : "Verify"}
        </button>
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge icon={GraduationCap} text={member.department} />
        <Badge icon={CalendarDays} text={member.session} />
        <Badge icon={Hash} text={`Roll: ${member.roll}`} />
      </div>

      <div className="my-4 h-px bg-[#E4EAE3]" />

      {/* Contact rows */}
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center justify-between gap-2">
          <a
            href={`tel:${member.number}`}
            className="flex min-w-0 items-center gap-2 text-[#374151] transition hover:text-[#1F7A4D]"
          >
            <Phone className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <span className="truncate">{member.number}</span>
          </a>
          <button
            type="button"
            onClick={handleCopyNumber}
            aria-label="Copy phone number"
            className="shrink-0 rounded-md p-1 text-[#9CA3AF] transition hover:bg-[#F4F7F3] hover:text-[#1F7A4D]"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {member.facebook && (
          <a
            href={member.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#374151] transition hover:text-[#1F7A4D]"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <span className="truncate">Facebook profile</span>
          </a>
        )}

        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#374151] transition hover:text-[#1F7A4D]"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <span className="truncate">LinkedIn profile</span>
          </a>
        )}

        <a
          href={`mailto:${member.email}`}
          className="flex items-center gap-2 text-[#374151] transition hover:text-[#1F7A4D]"
        >
          <Mail className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
          <span className="truncate">{member.email}</span>
        </a>

        <div className="flex items-center gap-2 text-[#374151]">
          <CreditCard className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
          <span className="font-mono-brand truncate">
            {member.transactionId}
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="mt-4 rounded-xl bg-[#F9FAFB] p-3">
        <p
          className={`text-xs leading-relaxed text-[#4B5563] ${expanded ? "" : "line-clamp-2"}`}
        >
          {member.message}
        </p>
        {isLongMessage && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-[#1F7A4D]"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Read more <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <p className="mt-4 text-[11px] text-[#9CA3AF]">
        Registered on {formattedDate}
      </p>
    </div>
  );
}

// ---------------- Small building blocks ----------------
function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "verified" | "pending";
}) {
  const toneClass =
    tone === "verified"
      ? "bg-[#1F7A4D]/10 text-[#1F7A4D]"
      : tone === "pending"
        ? "bg-[#C99A44]/15 text-[#8A6A2E]"
        : "bg-[#0E2B1C]/5 text-[#101913]";

  return (
    <div className={`flex items-center gap-2 rounded-xl px-3.5 py-2 ${toneClass}`}>
      <span className="text-lg font-semibold leading-none">{value}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-[#1F7A4D] text-white"
          : "bg-[#F4F7F3] text-[#374151] hover:bg-[#E4EAE3]"
      }`}
    >
      {label}
    </button>
  );
}

function Badge({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#F4F7F3] px-2.5 py-1 text-[11px] font-medium text-[#374151]">
      <Icon className="h-3 w-3 text-[#9CA3AF]" />
      {text}
    </span>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-[#E4EAE3] bg-white p-5"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#E4EAE3]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/3 rounded bg-[#E4EAE3]" />
              <div className="h-2.5 w-1/2 rounded bg-[#E4EAE3]" />
            </div>
          </div>
          <div className="mt-4 h-2.5 w-full rounded bg-[#E4EAE3]" />
          <div className="mt-2 h-2.5 w-5/6 rounded bg-[#E4EAE3]" />
          <div className="mt-2 h-2.5 w-2/3 rounded bg-[#E4EAE3]" />
          <div className="mt-4 h-16 w-full rounded-xl bg-[#F4F7F3]" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E4EAE3] bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-medium text-[#101913]">Couldn&apos;t load members</p>
      <p className="mt-1 max-w-sm text-xs text-[#6B7280]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 flex items-center gap-2 rounded-xl bg-[#1F7A4D] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#186640]"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4EAE3] bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F4F7F3] text-[#9CA3AF]">
        {hasQuery ? <SearchX className="h-6 w-6" /> : <Loader2 className="h-6 w-6" />}
      </div>
      <p className="mt-4 text-sm font-medium text-[#101913]">
        {hasQuery ? "No members match your search" : "No registrations yet"}
      </p>
      <p className="mt-1 max-w-sm text-xs text-[#6B7280]">
        {hasQuery
          ? "Try a different phone number or name, or clear the filters."
          : "New registrations will show up here as soon as people sign up."}
      </p>
    </div>
  );
}
