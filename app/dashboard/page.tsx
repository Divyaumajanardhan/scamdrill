import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Suspense fallback={<p className="text-slate-500">Loading...</p>}>
          <Dashboard />
        </Suspense>
      </div>
    </main>
  );
}

async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: stats } = await supabase.from("initiator_stats").select("*").maybeSingle();
  const { data: parents } = await supabase
    .from("parent_stats")
    .select("*")
    .order("display_name");

  const tiles = [
    { label: "Drills sent", value: stats?.drills_sent ?? 0 },
    { label: "Passed", value: stats?.passed ?? 0 },
    { label: "Failed", value: stats?.failed ?? 0 },
    { label: "Lessons completed", value: stats?.lessons_completed ?? 0 },
  ];

  const nextDue = stats?.next_drill_due ? new Date(stats.next_drill_due) : null;

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Your results</h1>
      <p className="mt-1 text-sm text-slate-600">Signed in as {user.email}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-3xl font-bold text-slate-900">{t.value}</p>
            <p className="mt-1 text-xs text-slate-600">{t.label}</p>
          </div>
        ))}
      </div>

      {nextDue && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          {nextDue <= new Date()
            ? "Time for the next drill!"
            : `Next drill due on ${nextDue.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Family members</h2>
        <Link href="/parents/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          + Add parent
        </Link>
      </div>

      {!parents || parents.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
          No one added yet. Add a parent to send their first practice drill.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {parents.map((p) => (
            <li key={p.parent_id}>
              <Link
                href={`/parents/${p.parent_id}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{p.display_name}</p>
                  <p className="text-xs text-slate-600">
                    {p.consent_status === "accepted"
                      ? `${p.drills_sent} drills · ${p.passed} passed · ${p.failed} failed`
                      : p.consent_status === "pending"
                      ? "Waiting for consent"
                      : "Declined"}
                  </p>
                </div>
                <span className="text-slate-400">›</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}