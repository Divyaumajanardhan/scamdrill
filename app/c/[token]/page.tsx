"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Consent = {
  display_name: string;
  language: "en" | "kn";
  consent_status: "pending" | "accepted" | "declined";
  initiator_hint: string;
};

const TEXT = {
  en: {
    title: "Practise spotting phone scams",
    hello: "Hi {name},",
    intro:
      "Your family member ({who}) would like to send you occasional practice scam messages, so you can learn to spot real ones.",
    points: [
      "The messages are completely safe. They use made-up company names.",
      "If you tap a practice link, you will only see a short 60-second lesson.",
      "We never ask for OTPs, passwords, bank details or money.",
      "Your family member will see whether you spotted the practice message.",
      "You can stop at any time and delete your data.",
    ],
    accept: "Yes, I agree",
    decline: "No, thank you",
    accepted: "Thank you! You may get a practice message in the coming days. Remember: never share an OTP or pay through a link.",
    declined: "No problem. No practice messages will be sent to you.",
    del: "Delete my data",
    deleted: "Your data has been deleted.",
    notFound: "This link is not valid or has been removed.",
  },
  kn: {
    title: "ಫೋನ್ ಮೋಸಗಳನ್ನು ಗುರುತಿಸುವ ಅಭ್ಯಾಸ",
    hello: "ನಮಸ್ಕಾರ {name},",
    intro:
      "ನಿಜವಾದ ಮೋಸದ ಮೆಸೇಜ್‌ಗಳನ್ನು ಗುರುತಿಸಲು ಕಲಿಯುವಂತೆ, ನಿಮ್ಮ ಕುಟುಂಬದವರು ({who}) ಆಗಾಗ ಅಭ್ಯಾಸದ ಮೆಸೇಜ್‌ಗಳನ್ನು ಕಳಿಸಲು ಬಯಸುತ್ತಾರೆ.",
    points: [
      "ಈ ಮೆಸೇಜ್‌ಗಳು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ. ಕಾಲ್ಪನಿಕ ಕಂಪನಿ ಹೆಸರುಗಳನ್ನು ಬಳಸುತ್ತವೆ.",
      "ಅಭ್ಯಾಸದ ಲಿಂಕ್ ಒತ್ತಿದರೆ, 60 ಸೆಕೆಂಡ್‌ನ ಒಂದು ಚಿಕ್ಕ ಪಾಠ ಮಾತ್ರ ಕಾಣುತ್ತದೆ.",
      "ನಾವು ಎಂದಿಗೂ OTP, ಪಾಸ್‌ವರ್ಡ್, ಬ್ಯಾಂಕ್ ವಿವರ ಅಥವಾ ಹಣ ಕೇಳುವುದಿಲ್ಲ.",
      "ನೀವು ಅಭ್ಯಾಸದ ಮೆಸೇಜ್ ಗುರುತಿಸಿದಿರಾ ಎಂದು ನಿಮ್ಮ ಕುಟುಂಬದವರು ನೋಡಬಹುದು.",
      "ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ನಿಲ್ಲಿಸಿ, ನಿಮ್ಮ ಮಾಹಿತಿ ಅಳಿಸಬಹುದು.",
    ],
    accept: "ಹೌದು, ನನಗೆ ಒಪ್ಪಿಗೆ ಇದೆ",
    decline: "ಬೇಡ, ಧನ್ಯವಾದಗಳು",
    accepted: "ಧನ್ಯವಾದಗಳು! ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ನಿಮಗೆ ಅಭ್ಯಾಸದ ಮೆಸೇಜ್ ಬರಬಹುದು. ನೆನಪಿಡಿ: OTP ಯಾರಿಗೂ ಹೇಳಬೇಡಿ, ಲಿಂಕ್ ಮೂಲಕ ಹಣ ಕಟ್ಟಬೇಡಿ.",
    declined: "ಪರವಾಗಿಲ್ಲ. ನಿಮಗೆ ಯಾವುದೇ ಅಭ್ಯಾಸದ ಮೆಸೇಜ್ ಕಳಿಸಲಾಗುವುದಿಲ್ಲ.",
    del: "ನನ್ನ ಮಾಹಿತಿ ಅಳಿಸಿ",
    deleted: "ನಿಮ್ಮ ಮಾಹಿತಿ ಅಳಿಸಲಾಗಿದೆ.",
    notFound: "ಈ ಲಿಂಕ್ ಮಾನ್ಯವಾಗಿಲ್ಲ ಅಥವಾ ತೆಗೆದುಹಾಕಲಾಗಿದೆ.",
  },
};

export default function ConsentPage() {
  return (
    <Suspense fallback={null}>
      <ConsentContent />
    </Suspense>
  );
}

function ConsentContent() {
  const { token } = useParams<{ token: string }>();
  const [info, setInfo] = useState<Consent | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "notfound" | "deleted">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.rpc("get_consent", { p_token: token }).then(({ data }) => {
      if (data && data.length > 0) {
        setInfo(data[0] as Consent);
        setState("ready");
      } else {
        setState("notfound");
      }
    });
  }, [token]);

  async function respond(accept: boolean) {
    setBusy(true);
    const supabase = createClient();
    const { data } = await supabase.rpc("respond_consent", { p_token: token, p_accept: accept });
    if (info && data) setInfo({ ...info, consent_status: data });
    setBusy(false);
  }

  async function deleteData() {
    setBusy(true);
    const supabase = createClient();
    await supabase.rpc("parent_delete_by_token", { p_token: token });
    setState("deleted");
    setBusy(false);
  }

  const t = TEXT[info?.language ?? "en"];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        {state === "loading" && <p className="text-slate-500">Loading...</p>}
        {state === "notfound" && <p className="text-slate-700">{t.notFound}</p>}
        {state === "deleted" && <p className="text-slate-700">{t.deleted}</p>}

        {state === "ready" && info && (
          <>
            <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
            <p className="mt-4 text-slate-800">{t.hello.replace("{name}", info.display_name)}</p>
            <p className="mt-2 text-slate-700">{t.intro.replace("{who}", info.initiator_hint)}</p>

            <ul className="mt-4 space-y-2">
              {t.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-slate-700">
                  <span className="text-green-600">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            {info.consent_status === "pending" ? (
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => respond(true)}
                  disabled={busy}
                  className="w-full rounded-lg bg-green-700 py-3 font-medium text-white disabled:opacity-50"
                >
                  {t.accept}
                </button>
                <button
                  onClick={() => respond(false)}
                  disabled={busy}
                  className="w-full rounded-lg border border-slate-300 py-3 font-medium text-slate-700 disabled:opacity-50"
                >
                  {t.decline}
                </button>
              </div>
            ) : (
              <p className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-900">
                {info.consent_status === "accepted" ? t.accepted : t.declined}
              </p>
            )}

            <button
              onClick={deleteData}
              disabled={busy}
              className="mt-6 w-full text-center text-sm text-slate-500 underline"
            >
              {t.del}
            </button>
          </>
        )}
      </div>
    </main>
  );
}