"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AddParentPage() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<"en" | "kn">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consentLink, setConsentLink] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Please sign in again.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("parents")
      .insert({ initiator_id: user.id, display_name: name.trim(), language })
      .select("consent_token")
      .single();

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setConsentLink(`${window.location.origin}/c/${data.consent_token}`);
  }

  const message =
    language === "kn"
      ? `ನಮಸ್ಕಾರ ${name}, ಫೋನ್ ಮೋಸಗಳನ್ನು ಗುರುತಿಸಲು ಅಭ್ಯಾಸ ಮಾಡಲು ScamDrill ಬಳಸಲು ನಾನು ಬಯಸುತ್ತೇನೆ. ದಯವಿಟ್ಟು ಈ ಲಿಂಕ್ ತೆರೆದು ಒಪ್ಪಿಗೆ ನೀಡಿ: ${consentLink}`
      : `Hi ${name}, I'd like us to practise spotting phone scams together using ScamDrill. Please open this link and say yes if you're okay with it: ${consentLink}`;

  async function copy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8">
        <Link href="/dashboard" className="text-sm text-slate-600 underline">← Back</Link>

        {!consentLink ? (
          <>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Add a parent</h1>
            <p className="mt-1 text-sm text-slate-600">
              They will get a consent link first. No drill can be sent until they say yes.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">What do you call them?</label>
                <input
                  required
                  maxLength={40}
                  placeholder="e.g. Amma, Appa, Ajji"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Lesson language</label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {(["en", "kn"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLanguage(l)}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        language === l
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 text-slate-700"
                      }`}
                    >
                      {l === "en" ? "English" : "ಕನ್ನಡ (Kannada)"}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 py-2 font-medium text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : "Create consent link"}
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Ask {name} for consent</h1>
            <p className="mt-1 text-sm text-slate-600">
              Copy this message and send it to them on WhatsApp from your own phone.
            </p>

            <div className="mt-6 whitespace-pre-wrap rounded-lg bg-slate-100 p-4 text-sm text-slate-800">
              {message}
            </div>

            <button
              onClick={copy}
              className="mt-4 w-full rounded-lg bg-slate-900 py-2 font-medium text-white"
            >
              {copied ? "Copied ✓" : "Copy message"}
            </button>
            <Link
              href="/dashboard"
              className="mt-3 block text-center text-sm text-slate-600 underline"
            >
              Done, back to dashboard
            </Link>
          </>
        )}
      </div>
    </main>
  );
}