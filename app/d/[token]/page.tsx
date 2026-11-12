"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getDrill, LESSON_UI, type Drill, type Lang } from "@/content/drills";

export default function LessonPage() {
  return (
    <Suspense fallback={null}>
      <LessonContent />
    </Suspense>
  );
}

function LessonContent() {
  const { token } = useParams<{ token: string }>();
  const [drill, setDrill] = useState<Drill | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [name, setName] = useState("");
  const [state, setState] = useState<"loading" | "ready" | "done" | "notfound" | "deleted">("loading");
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return; // record the click only once
    recorded.current = true;

    const supabase = createClient();
    supabase.rpc("record_click", { p_token: token }).then(({ data }) => {
      const row = data?.[0];
      const d = row ? getDrill(row.drill_key) : undefined;
      if (!row || !d) {
        setState("notfound");
        return;
      }
      setDrill(d);
      setLang(row.language);
      setName(row.display_name);
      setState(row.lesson_completed ? "done" : "ready");
    });
  }, [token]);

  async function finish() {
    const supabase = createClient();
    await supabase.rpc("complete_lesson", { p_token: token });
    setState("done");
  }

  async function deleteData() {
    const supabase = createClient();
    await supabase.rpc("parent_delete_by_token", { p_token: token });
    setState("deleted");
  }

  const ui = LESSON_UI[lang];
  const lesson = drill?.lesson[lang];

  return (
    <main className="min-h-screen bg-amber-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        {state === "loading" && <p className="text-slate-500">...</p>}
        {state === "notfound" && <p className="text-slate-700">This link is no longer active.</p>}
        {state === "deleted" && <p className="text-slate-700">Your data has been deleted. No more practice messages.</p>}

        {(state === "ready" || state === "done") && lesson && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-3xl">🛡️</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{ui.hello.replace("{name}", name)}</p>
            <p className="mt-2 text-slate-700">{ui.intro}</p>

            <h1 className="mt-6 text-xl font-bold text-slate-900">{lesson.title}</h1>

            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-red-700">{ui.flagsHeading}</h2>
            <ol className="mt-2 space-y-3">
              {lesson.flags.map((f, i) => (
                <li key={i} className="flex gap-3 rounded-lg bg-red-50 p-3 text-slate-800">
                  <span className="font-bold text-red-700">{i + 1}</span>
                  <span>{f}</span>
                </li>
              ))}
            </ol>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-green-700">{ui.ruleHeading}</h2>
            <p className="mt-2 rounded-lg bg-green-50 p-4 text-lg font-semibold text-green-900">{lesson.rule}</p>

            <p className="mt-6 text-sm text-slate-600">{ui.close}</p>

            {state === "ready" ? (
              <button onClick={finish} className="mt-6 w-full rounded-lg bg-green-700 py-3 text-lg font-medium text-white">
                {ui.doneButton}
              </button>
            ) : (
              <p className="mt-6 rounded-lg bg-green-100 p-4 text-center font-medium text-green-900">{ui.doneMessage}</p>
            )}

            <button onClick={deleteData} className="mt-6 w-full text-center text-xs text-slate-500 underline">
              {ui.deleteLink}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}