import Link from "next/link";

const steps = [
  { n: "1", title: "Add a parent", text: "They get a consent link first. Nothing happens until they say yes." },
  { n: "2", title: "Send a practice scam", text: "Pick one of 8 safe drills and forward it from your own phone." },
  { n: "3", title: "They learn in 60 seconds", text: "If they tap the link, a kind lesson shows 3 red flags and one rule." },
  { n: "4", title: "Repeat every week", text: "See who spotted it, then send the next drill in 7 days." },
];

const promises = [
  "Made-up brands only, never real banks, couriers or police",
  "Never asks for OTPs, passwords, card numbers or money",
  "Lessons in English and ಕನ್ನಡ, respectful and never shaming",
  "Parents can stop and delete their data at any time",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">ScamDrill</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">A fire drill for scams.</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          Spam blockers stop known numbers, but scammers change numbers every day. ScamDrill helps your parents
          practise spotting fake courier, KYC, &ldquo;digital arrest&rdquo; and lottery messages, safely and with their consent.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login" className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white">
            Start for free
          </Link>
          <a href="#how" className="px-6 py-3 font-medium text-slate-700 underline">
            How it works
          </a>
        </div>
      </section>

      <section id="how" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800">
                  {s.n}
                </p>
                <p className="mt-3 font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold">Our promises</h2>
          <ul className="mx-auto mt-6 max-w-xl space-y-3">
            {promises.map((p) => (
              <li key={p} className="flex gap-3 text-slate-700">
                <span className="text-green-600">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href="/login" className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white">
              Protect your parents
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        ScamDrill is a student project from PES University. Lost money to a real scam? Call 1930 or visit
        cybercrime.gov.in.
      </footer>
    </main>
  );
}
