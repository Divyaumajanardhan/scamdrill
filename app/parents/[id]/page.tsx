"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DRILLS, SCAM_TYPE_LABELS, getDrill, renderMessage, type Drill } from "@/content/drills";

type Parent = {
  id: string;
  display_name: string;
  language: "en" | "kn";
  consent_status: "pending" | "accepted" | "declined";
  consent_token: string;
};

type Send = {
  id: string;
  drill_key: string;
  token: string;
  status: "created" | "clicked" | "passed" | "replied" | "ignored";
  result: "pass" | "fail" | "pending";
  lesson_completed_at: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<Send["status"], string> = {
  created: "Waiting for result",
  clicked: "Clicked the link ✗",
  replied: "Replied to it ✗",
  passed: "Spotted it ✓",
  ignored: "Ignored it ✓",
};

export default function ParentPage() {
  return (
    <Suspense fallback={null}>
      <ParentContent />
    </Suspense>
  );
}

function ParentContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [parent, setParent] = useState<Parent | null>(null);
  const [sends, setSends] = useState<Send[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState<{ drill: Drill; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: p } = await supabase
      .from("parents")
      .select("id, display_name, language, consent_status, consent_token")
      .eq("id", id)
      .maybeSingle();
    const { data: s } = await supabase
      .from("drill_sends")
      .select("id, drill_key, token, status, result, lesson_completed_at, created_at")
      .eq("parent_id", id)
      .order("created_at", { ascending: false });
    setParent(p as Parent | null);
    setSends((s as Send[]) ?? []);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function createDrill(drill: Drill) {
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !parent) return;

    const { data, error } = await supabase
      .from("drill_sends")
      .insert({ initiator_id: user.id, parent_id: parent.id, drill_key: drill.key })
      .select("token")
      .single();

    if (error) {
      setError(error.message);
      return;
    }
    const link = `${window.location.origin}/d/${data.token}`;
    setCurrent({ drill, message: renderMessage(drill, link, data.token) });
    setCopied(false);
    load();
  }

  async function copy() {
    if (!current) return;
    await navigator.clipboard.writeText(current.message);
    setCopied(true);
  }

  async function markOutcome(sendId: string, outcome: "passed" | "replied" | "ignored") {
    const supabase = createClient();
    const { error } = await supabase.rpc("mark_outcome", { p_send_id: sendId, p_outcome: outcome });
    if (error) setError(error.message);
    load();
  }

  async function removeParent() {
    if (!parent) return;
    const supabase = createClient();
    await supabase.from("parents").delete().eq("id", parent.id);
    router.push("/dashboard");
    router.refresh();
  }

  if (loading) return <Shell><p className="text-slate-500">Loading...</p></Shell>;
  if (!parent) return <Shell><p className="text-slate-700">Not found.</p></Shell>;

  if (parent.consent_status !== "accepted") {
    const link = typeof window !== "undefined" ? `${window.location.origin}/c/${parent.consent_token}` : "";
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-slate-900">{parent.display_name}</h1>
        <p className="mt-2 text-slate-700">
          {parent.consent_status === "pending"
            ? "Waiting for consent. No drills can be sent until they say yes. Send them this link again:"
            : "They declined. No drills can be sent."}
        </p>
        {parent.consent_status === "pending" && (
          <p className="mt-3 break-all rounded-lg bg-slate-100 p-3 text-sm text-slate-800">{link}</p>
        )}
        <button onClick={removeParent} className="mt-6 text-sm text-red-600 underline">
          Remove {parent.display_name}
        </button>
      </Shell>
    );
  }

  const types = Object.keys(SCAM_TYPE_LABELS) as (keyof typeof SCAM_TYPE_LABELS)[];

  return (
    <Shell>
      <h1 className="text-2xl font-bold text-slate-900">{parent.display_name}</h1>
      <p className="mt-1 text-sm text-slate-600">
        Lessons in {parent.language === "kn" ? "Kannada" : "English"} · consent given
      </p>

      {current ? (
        <div className="mt-6 rounded-xl border-2 border-slate-900 p-4">
          <p className="text-sm font-semibold text-slate-900">Your drill is ready: {current.drill.label}</p>
          <div className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-sm text-slate-800">
            {current.message}
          </div>
          <button onClick={copy} className="mt-3 w-full rounded-lg bg-slate-900 py-2 font-medium text-white">
            {copied ? "Copied ✓" : "Copy message"}
          </button>
          <p className="mt-3 text-xs text-slate-600">
            Paste it into WhatsApp and send it to {parent.display_name} from your own phone. Don't warn them first.
            Come back here later and mark what happened.
          </p>
          <button onClick={() => setCurrent(null)} className="mt-2 text-sm text-slate-600 underline">
            Close
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900">Pick a drill to send</h2>
          {types.map((type) => (
            <div key={type} className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {SCAM_TYPE_LABELS[type]}
              </p>
              <div className="mt-2 space-y-2">
                {DRILLS.filter((d) => d.type === type).map((d) => (
                  <button
                    key={d.key}
                    onClick={() => createDrill(d)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left text-sm text-slate-800 hover:border-slate-900"
                  >
                    {d.label}
                    <span className="ml-2 text-xs text-slate-500">{d.difficulty === 1 ? "Easy" : "Harder"}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <h2 className="mt-10 text-lg font-semibold text-slate-900">Past drills</h2>
      {sends.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">None yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {sends.map((s) => (
            <li key={s.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-900">{getDrill(s.drill_key)?.label ?? s.drill_key}</p>
              <p className="mt-1 text-xs text-slate-600">
                {new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ·{" "}
                <span className={s.result === "pass" ? "text-green-700" : s.result === "fail" ? "text-red-600" : ""}>
                  {STATUS_LABEL[s.status]}
                </span>
                {s.lesson_completed_at && " · lesson completed"}
              </p>
              {s.status !== "clicked" && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(["passed", "replied", "ignored"] as const).map((o) => (
                    <button
                      key={o}
                      onClick={() => markOutcome(s.id, o)}
                      className={`rounded-lg border px-2 py-1 text-xs ${
                        s.status === o ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 text-slate-700"
                      }`}
                    >
                      {o === "passed" ? "Spotted it" : o === "replied" ? "Replied" : "Ignored"}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <button onClick={removeParent} className="mt-10 text-sm text-red-600 underline">
        Remove {parent.display_name} and delete their data
      </button>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <Link href="/dashboard" className="text-sm text-slate-600 underline">← Back</Link>
        <div className="mt-4">{children}</div>
      </div>
    </main>
  );
}