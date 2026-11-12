# ScamDrill — a fire drill for scams

**Live:** https://scamdrill.vercel.app

Spam blockers stop known numbers, but scammers change numbers daily. ScamDrill changes behaviour instead: a student (with their parent's consent) sends a safe, simulated scam message. If the parent taps the link, they see a 60-second, non-shaming lesson in English or Kannada with 3 red flags and one rule. The student sees the results and is nudged to send the next drill in 7 days.

## Features
- **Consent first:** the parent accepts on a consent page before any drill can be created (enforced by a database trigger, not just the UI)
- **Drill library:** 8 drills across 4 Indian scam types (courier/customs fee, bank KYC, "digital arrest", job/lottery), using fictional brands only
- **Tracking links:** each drill gets a unique link; a tap records a fail and opens the lesson
- **Bilingual lessons:** English and Kannada
- **Results dashboard:** drills sent, passed, failed, lessons completed, next drill due
- **Data control:** parents can stop and delete their data from any page; students can remove a parent

## Key product decisions
| Decision | Why |
| --- | --- |
| Student forwards the message from their own phone, no WhatsApp/SMS API | Avoids TRAI DLT registration, approval delays, and ban risk for scam-like content |
| Email + password, no magic link | Magic links broke when opened on a different device; free-tier email was capped at ~2/hour |
| Fictional brands only | Never imitate real banks, couriers, police or government |
| Never collect OTPs, passwords, card numbers or money | Links open only a lesson page with no input fields |
| Neutral link-preview title | So the WhatsApp preview doesn't give the drill away |

## Ethics rules
1. Parent consents first.  2. Fictional brands only.  3. Nothing sensitive is ever collected.  4. Lessons are respectful, never shaming.  5. Minimal data and easy delete.

## Tech
Next.js 16 (App Router) · Supabase (Postgres, Auth, Row Level Security, security-definer RPCs) · Tailwind CSS · Vercel

## Success metrics (6-week targets)
100 initiators · 150 parents enrolled · 400 drills · 70% lesson completion · 50% of failed parents pass the next drill · 40% send a second drill within 14 days

*A PES University product-management portfolio project.*