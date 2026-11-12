// ScamDrill drill library — 8 drills across 4 scam types.
// Ethics: fictional brands only (SwiftParcel, National Bank of Bharat, Bharat Cyber Safety Bureau,
// TaskBuddy, Lucky Bharat Mega Draw). Links only ever open the lesson page. Nothing is collected.
// Kannada text: get a native speaker to proofread before beta (Days 8–14 ethics review).

export type Lang = 'en' | 'kn';
export type ScamType = 'courier' | 'bank_kyc' | 'digital_arrest' | 'job_lottery';

export interface Lesson {
  title: string;
  flags: [string, string, string];
  rule: string;
}

export interface Drill {
  key: string;
  type: ScamType;
  label: string;        // shown to the student when picking
  difficulty: 1 | 2;    // 1 = obvious, 2 = subtler
  message: string;      // {link} and {ref} are filled in by renderMessage()
  lesson: Record<Lang, Lesson>;
}

export const SCAM_TYPE_LABELS: Record<ScamType, string> = {
  courier: 'Courier / customs fee',
  bank_kyc: 'Bank KYC / rewards',
  digital_arrest: 'Fake police "digital arrest"',
  job_lottery: 'Job / lottery',
};

// Shared lesson-page copy. {name} = parent's display name.
export const LESSON_UI: Record<Lang, {
  hello: string; intro: string; flagsHeading: string; ruleHeading: string;
  close: string; doneButton: string; doneMessage: string; deleteLink: string;
}> = {
  en: {
    hello: 'Hi {name},',
    intro:
      "Don't worry — this was a practice message sent by your family member, with your permission. " +
      'Nothing was collected and no money was taken. Real scammers send messages just like this. ' +
      "Here's how to spot one in 60 seconds.",
    flagsHeading: '3 warning signs in this message',
    ruleHeading: 'Your one rule',
    close:
      'Many smart people click messages like this — scammers do this as a full-time job. ' +
      "If a real one comes: don't click, don't pay, and tell your family. " +
      'If money is ever lost, call 1930 immediately.',
    doneButton: 'I understand',
    doneMessage: 'Well done! You now know more about this scam than most people.',
    deleteLink: 'Stop practice drills and delete my data',
  },
  kn: {
    hello: 'ನಮಸ್ಕಾರ {name},',
    intro:
      'ಚಿಂತಿಸಬೇಡಿ — ಇದು ನಿಮ್ಮ ಒಪ್ಪಿಗೆಯೊಂದಿಗೆ ನಿಮ್ಮ ಕುಟುಂಬದವರು ಕಳಿಸಿದ ಅಭ್ಯಾಸದ ಮೆಸೇಜ್. ' +
      'ನಿಮ್ಮಿಂದ ಯಾವುದೇ ಮಾಹಿತಿ ಅಥವಾ ಹಣ ತೆಗೆದುಕೊಂಡಿಲ್ಲ. ನಿಜವಾದ ಮೋಸಗಾರರು ಇದೇ ರೀತಿಯ ಮೆಸೇಜ್ ಕಳಿಸುತ್ತಾರೆ. ' +
      '60 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಅದನ್ನು ಗುರುತಿಸುವುದು ಹೇಗೆ ಎಂದು ನೋಡೋಣ.',
    flagsHeading: 'ಈ ಮೆಸೇಜ್‌ನಲ್ಲಿದ್ದ 3 ಎಚ್ಚರಿಕೆಯ ಸೂಚನೆಗಳು',
    ruleHeading: 'ನೆನಪಿಡಬೇಕಾದ ಒಂದು ನಿಯಮ',
    close:
      'ಎಷ್ಟೋ ಬುದ್ಧಿವಂತರೂ ಇಂತಹ ಮೆಸೇಜ್ ಕ್ಲಿಕ್ ಮಾಡುತ್ತಾರೆ — ಮೋಸಗಾರರು ಇದನ್ನೇ ಪೂರ್ಣ ಸಮಯದ ಕೆಲಸವಾಗಿ ಮಾಡುತ್ತಾರೆ. ' +
      'ನಿಜವಾದ ಮೆಸೇಜ್ ಬಂದರೆ: ಕ್ಲಿಕ್ ಮಾಡಬೇಡಿ, ಹಣ ಕಟ್ಟಬೇಡಿ, ಕುಟುಂಬದವರಿಗೆ ತಿಳಿಸಿ. ' +
      'ಹಣ ಕಳೆದುಕೊಂಡರೆ ತಕ್ಷಣ 1930 ಗೆ ಕರೆ ಮಾಡಿ.',
    doneButton: 'ನನಗೆ ಅರ್ಥವಾಯಿತು',
    doneMessage: 'ಶಭಾಷ್! ಈ ಮೋಸದ ಬಗ್ಗೆ ಈಗ ನಿಮಗೆ ಹೆಚ್ಚಿನವರಿಗಿಂತ ಹೆಚ್ಚು ಗೊತ್ತಿದೆ.',
    deleteLink: 'ಅಭ್ಯಾಸದ ಮೆಸೇಜ್‌ಗಳನ್ನು ನಿಲ್ಲಿಸಿ ಮತ್ತು ನನ್ನ ಮಾಹಿತಿ ಅಳಿಸಿ',
  },
};

export const DRILLS: Drill[] = [
  // ---------- Courier / customs ----------
  {
    key: 'courier-customs-fee',
    type: 'courier',
    label: 'SwiftParcel: pay ₹49 customs fee',
    difficulty: 1,
    message:
      'SwiftParcel: Your international parcel SP{ref} is on hold at customs. ' +
      'Pay a clearance fee of Rs 49 within 24 hours or it will be returned to sender: {link}',
    lesson: {
      en: {
        title: 'The fake customs fee',
        flags: [
          "A small, urgent fee (₹49) for a parcel you weren't expecting.",
          "The link is not the courier's official app or website.",
          'Deadline pressure: "within 24 hours or it will be returned".',
        ],
        rule: 'Never pay any fee through a link in a message. Check deliveries only in the official app you ordered from.',
      },
      kn: {
        title: 'ನಕಲಿ ಕಸ್ಟಮ್ಸ್ ಶುಲ್ಕ',
        flags: [
          'ನೀವು ನಿರೀಕ್ಷಿಸದ ಪಾರ್ಸೆಲ್‌ಗೆ ಸಣ್ಣ ಶುಲ್ಕ (₹49) ತಕ್ಷಣ ಕಟ್ಟಲು ಕೇಳುತ್ತಿದೆ.',
          'ಲಿಂಕ್ ಕೊರಿಯರ್ ಕಂಪನಿಯ ಅಧಿಕೃತ ಆ್ಯಪ್ ಅಥವಾ ವೆಬ್‌ಸೈಟ್ ಅಲ್ಲ.',
          '"24 ಗಂಟೆಯೊಳಗೆ ಕಟ್ಟದಿದ್ದರೆ ವಾಪಸ್" ಎಂದು ಆತುರಪಡಿಸುತ್ತಿದೆ.',
        ],
        rule: 'ಮೆಸೇಜ್‌ನಲ್ಲಿ ಬಂದ ಲಿಂಕ್ ಮೂಲಕ ಎಂದಿಗೂ ಹಣ ಕಟ್ಟಬೇಡಿ. ನೀವು ಆರ್ಡರ್ ಮಾಡಿದ ಅಧಿಕೃತ ಆ್ಯಪ್‌ನಲ್ಲಿ ಮಾತ್ರ ಪರಿಶೀಲಿಸಿ.',
      },
    },
  },
  {
    key: 'courier-address-update',
    type: 'courier',
    label: 'SwiftParcel: update address or parcel returns',
    difficulty: 2,
    message:
      'SwiftParcel: Delivery attempt failed for parcel SP{ref} due to an incomplete address. ' +
      'Update your address within 12 hrs to avoid return: {link}',
    lesson: {
      en: {
        title: 'The "failed delivery" trick',
        flags: [
          "You weren't expecting a parcel, yet it plays on your fear of missing one.",
          'No name and no order details you recognise — the same text goes to thousands.',
          'A short deadline (12 hours) to rush you.',
        ],
        rule: "If you didn't order it, ignore it. For real orders, check only inside the shopping app you used.",
      },
      kn: {
        title: '"ಡೆಲಿವರಿ ವಿಫಲ" ಮೋಸ',
        flags: [
          'ನೀವು ಯಾವುದೇ ಪಾರ್ಸೆಲ್ ನಿರೀಕ್ಷಿಸುತ್ತಿರಲಿಲ್ಲ, ಆದರೂ "ತಪ್ಪಿಹೋಗುತ್ತದೆ" ಎಂಬ ಭಯ ಹುಟ್ಟಿಸುತ್ತದೆ.',
          'ನಿಮ್ಮ ಹೆಸರು ಅಥವಾ ನಿಮಗೆ ಗೊತ್ತಿರುವ ಆರ್ಡರ್ ವಿವರ ಇಲ್ಲ — ಸಾವಿರಾರು ಜನರಿಗೆ ಇದೇ ಮೆಸೇಜ್ ಹೋಗುತ್ತದೆ.',
          '12 ಗಂಟೆಯ ಗಡುವು ಕೊಟ್ಟು ಆತುರಪಡಿಸುತ್ತಿದೆ.',
        ],
        rule: 'ನೀವು ಆರ್ಡರ್ ಮಾಡಿಲ್ಲದಿದ್ದರೆ ನಿರ್ಲಕ್ಷಿಸಿ. ನಿಜವಾದ ಆರ್ಡರ್‌ಗಳನ್ನು ನೀವು ಖರೀದಿಸಿದ ಆ್ಯಪ್‌ನಲ್ಲಿ ಮಾತ್ರ ಪರಿಶೀಲಿಸಿ.',
      },
    },
  },

  // ---------- Bank KYC / rewards ----------
  {
    key: 'bank-kyc-block',
    type: 'bank_kyc',
    label: 'National Bank of Bharat: KYC pending, account blocked today',
    difficulty: 1,
    message:
      'Dear Customer, your National Bank of Bharat account will be BLOCKED today due to pending KYC. ' +
      'Update your KYC now to avoid suspension: {link}',
    lesson: {
      en: {
        title: 'The fake KYC block',
        flags: [
          'A threat that your account will be blocked today.',
          'No bank asks you to update KYC through a link in SMS or WhatsApp.',
          '"Dear Customer" — your real bank knows your name.',
        ],
        rule: 'For anything about your bank, visit the branch or call the number printed on your passbook or card — never a number or link from a message.',
      },
      kn: {
        title: 'ನಕಲಿ KYC ಬ್ಲಾಕ್',
        flags: [
          '"ಇಂದೇ ಖಾತೆ ಬ್ಲಾಕ್ ಆಗುತ್ತದೆ" ಎಂಬ ಬೆದರಿಕೆ.',
          'ಯಾವ ಬ್ಯಾಂಕೂ SMS ಅಥವಾ ವಾಟ್ಸಾಪ್ ಲಿಂಕ್ ಮೂಲಕ KYC ಅಪ್‌ಡೇಟ್ ಮಾಡಲು ಕೇಳುವುದಿಲ್ಲ.',
          '"Dear Customer" — ನಿಮ್ಮ ನಿಜವಾದ ಬ್ಯಾಂಕ್‌ಗೆ ನಿಮ್ಮ ಹೆಸರು ಗೊತ್ತಿರುತ್ತದೆ.',
        ],
        rule: 'ಬ್ಯಾಂಕ್ ವಿಷಯಕ್ಕೆ ಶಾಖೆಗೆ ಹೋಗಿ ಅಥವಾ ಪಾಸ್‌ಬುಕ್/ಕಾರ್ಡ್ ಮೇಲೆ ಇರುವ ನಂಬರ್‌ಗೆ ಕರೆ ಮಾಡಿ — ಮೆಸೇಜ್‌ನಲ್ಲಿರುವ ನಂಬರ್ ಅಥವಾ ಲಿಂಕ್ ಬಳಸಬೇಡಿ.',
      },
    },
  },
  {
    key: 'bank-reward-points',
    type: 'bank_kyc',
    label: 'National Bank of Bharat: ₹4,850 reward points expire tonight',
    difficulty: 2,
    message:
      'National Bank of Bharat: Your 4,850 reward points (worth Rs 4,850) expire tonight. ' +
      'Redeem directly to your account now: {link}',
    lesson: {
      en: {
        title: 'The expiring reward points',
        flags: [
          'A free-money offer that "expires tonight".',
          'Banks give rewards inside their own app, not through a link in a message.',
          "The website name in the link is not your bank's.",
        ],
        rule: "Free money that needs a fast click is never free. Check rewards only inside your bank's official app.",
      },
      kn: {
        title: 'ಮುಗಿಯುತ್ತಿರುವ ರಿವಾರ್ಡ್ ಪಾಯಿಂಟ್ಸ್',
        flags: [
          '"ಇಂದು ರಾತ್ರಿಯೇ ಮುಗಿಯುತ್ತದೆ" ಎನ್ನುವ ಉಚಿತ ಹಣದ ಆಮಿಷ.',
          'ಬ್ಯಾಂಕ್‌ಗಳು ರಿವಾರ್ಡ್‌ಗಳನ್ನು ತಮ್ಮದೇ ಆ್ಯಪ್‌ನಲ್ಲಿ ಕೊಡುತ್ತವೆ, ಮೆಸೇಜ್ ಲಿಂಕ್ ಮೂಲಕ ಅಲ್ಲ.',
          'ಲಿಂಕ್‌ನಲ್ಲಿರುವ ವೆಬ್‌ಸೈಟ್ ಹೆಸರು ನಿಮ್ಮ ಬ್ಯಾಂಕಿನದ್ದಲ್ಲ.',
        ],
        rule: 'ಬೇಗ ಕ್ಲಿಕ್ ಮಾಡಿ ಎನ್ನುವ ಉಚಿತ ಹಣ ಎಂದಿಗೂ ಉಚಿತವಲ್ಲ. ರಿವಾರ್ಡ್‌ಗಳನ್ನು ಬ್ಯಾಂಕಿನ ಅಧಿಕೃತ ಆ್ಯಪ್‌ನಲ್ಲಿ ಮಾತ್ರ ನೋಡಿ.',
      },
    },
  },

  // ---------- Fake police "digital arrest" ----------
  {
    key: 'arrest-case-notice',
    type: 'digital_arrest',
    label: 'Bharat Cyber Safety Bureau: case filed, respond in 2 hours',
    difficulty: 1,
    message:
      'NOTICE from Bharat Cyber Safety Bureau: A complaint has been registered against your mobile number ' +
      'for illegal activity. Case No. BCSB/{ref}. View your case and respond within 2 hours to avoid arrest: {link}',
    lesson: {
      en: {
        title: 'The fake "digital arrest" notice',
        flags: [
          'A threat of arrest to scare you into acting without thinking.',
          'Police never send case notices or arrest warrants through a WhatsApp or SMS link.',
          'A 2-hour deadline — and usually a demand to keep it secret from family.',
        ],
        rule: 'There is no such thing as a "digital arrest". Ignore it or hang up, and tell your family immediately.',
      },
      kn: {
        title: 'ನಕಲಿ "ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್" ನೋಟಿಸ್',
        flags: [
          'ಬಂಧನದ ಬೆದರಿಕೆ ಹಾಕಿ, ಯೋಚಿಸದೆ ಕೆಲಸ ಮಾಡುವಂತೆ ಹೆದರಿಸುತ್ತದೆ.',
          'ಪೊಲೀಸರು ಕೇಸ್ ನೋಟಿಸ್ ಅಥವಾ ಬಂಧನ ವಾರಂಟ್ ಅನ್ನು ವಾಟ್ಸಾಪ್ ಅಥವಾ SMS ಲಿಂಕ್ ಮೂಲಕ ಕಳಿಸುವುದಿಲ್ಲ.',
          '2 ಗಂಟೆಯ ಗಡುವು — ಸಾಮಾನ್ಯವಾಗಿ ಕುಟುಂಬದವರಿಗೆ ಹೇಳಬಾರದು ಎಂದೂ ಒತ್ತಡ ಹಾಕುತ್ತಾರೆ.',
        ],
        rule: '"ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್" ಎಂಬುದೇ ಇಲ್ಲ. ನಿರ್ಲಕ್ಷಿಸಿ ಅಥವಾ ಕರೆ ಕಟ್ ಮಾಡಿ, ತಕ್ಷಣ ಕುಟುಂಬದವರಿಗೆ ತಿಳಿಸಿ.',
      },
    },
  },
  {
    key: 'arrest-parcel-video',
    type: 'digital_arrest',
    label: 'Seized parcel in your name, join video statement',
    difficulty: 2,
    message:
      'SwiftParcel International: A parcel booked in your name (Ref SP{ref}) contains illegal items and has been seized. ' +
      'Your case is transferred to the Bharat Cyber Safety Bureau. Join the video statement now to clear your name: {link}',
    lesson: {
      en: {
        title: 'The seized-parcel video call',
        flags: [
          'It claims a parcel you never sent contains illegal items.',
          'It pushes you onto a "video statement" — officials never take statements on a video call.',
          'Fear plus urgency: "clear your name now".',
        ],
        rule: 'Never join a video call with anyone claiming to be police or an officer. Disconnect and call family, or 1930.',
      },
      kn: {
        title: 'ಜಪ್ತಿ ಮಾಡಿದ ಪಾರ್ಸೆಲ್ ವಿಡಿಯೋ ಕಾಲ್',
        flags: [
          'ನೀವು ಎಂದೂ ಕಳಿಸದ ಪಾರ್ಸೆಲ್‌ನಲ್ಲಿ ಅಕ್ರಮ ವಸ್ತುಗಳಿವೆ ಎಂದು ಹೇಳುತ್ತದೆ.',
          '"ವಿಡಿಯೋ ಹೇಳಿಕೆ" ನೀಡಲು ಒತ್ತಾಯಿಸುತ್ತದೆ — ಅಧಿಕಾರಿಗಳು ವಿಡಿಯೋ ಕಾಲ್‌ನಲ್ಲಿ ಹೇಳಿಕೆ ಪಡೆಯುವುದಿಲ್ಲ.',
          '"ಈಗಲೇ ನಿಮ್ಮ ಹೆಸರು ಸರಿಪಡಿಸಿಕೊಳ್ಳಿ" ಎಂದು ಭಯ ಮತ್ತು ಆತುರ ಹುಟ್ಟಿಸುತ್ತದೆ.',
        ],
        rule: 'ಪೊಲೀಸ್ ಅಥವಾ ಅಧಿಕಾರಿ ಎಂದು ಹೇಳಿಕೊಳ್ಳುವ ಯಾರೊಂದಿಗೂ ವಿಡಿಯೋ ಕಾಲ್‌ಗೆ ಸೇರಬೇಡಿ. ಕರೆ ಕಟ್ ಮಾಡಿ, ಕುಟುಂಬದವರಿಗೆ ಅಥವಾ 1930 ಗೆ ಕರೆ ಮಾಡಿ.',
      },
    },
  },

  // ---------- Job / lottery ----------
  {
    key: 'job-like-videos',
    type: 'job_lottery',
    label: 'TaskBuddy: earn ₹3,000/day liking videos',
    difficulty: 2,
    message:
      'Hi! TaskBuddy is hiring part-time from home. Earn Rs 3,000–8,000 daily just by liking videos ' +
      'and rating hotels. No experience needed. Limited seats, register now: {link}',
    lesson: {
      en: {
        title: 'The easy part-time job',
        flags: [
          'Huge pay for very easy work.',
          'An unknown company contacted you first — you never applied.',
          '"Limited seats" to rush you. Later they ask for a "deposit" to unlock bigger tasks.',
        ],
        rule: 'A real job never asks you to pay money to earn money.',
      },
      kn: {
        title: 'ಸುಲಭದ ಪಾರ್ಟ್-ಟೈಮ್ ಕೆಲಸ',
        flags: [
          'ತುಂಬಾ ಸುಲಭದ ಕೆಲಸಕ್ಕೆ ಬಹಳ ದೊಡ್ಡ ಸಂಬಳ.',
          'ನೀವು ಅರ್ಜಿ ಹಾಕದಿದ್ದರೂ ಗೊತ್ತಿಲ್ಲದ ಕಂಪನಿ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಿದೆ.',
          '"ಸೀಮಿತ ಸೀಟುಗಳು" ಎಂದು ಆತುರಪಡಿಸುತ್ತದೆ. ಮುಂದೆ ದೊಡ್ಡ ಕೆಲಸಕ್ಕಾಗಿ "ಡೆಪಾಸಿಟ್" ಕೇಳುತ್ತಾರೆ.',
        ],
        rule: 'ನಿಜವಾದ ಕೆಲಸ, ಹಣ ಗಳಿಸಲು ಮೊದಲು ನೀವೇ ಹಣ ಕಟ್ಟಲು ಎಂದಿಗೂ ಕೇಳುವುದಿಲ್ಲ.',
      },
    },
  },
  {
    key: 'lottery-processing-fee',
    type: 'job_lottery',
    label: 'Lucky Bharat Mega Draw: won ₹25 lakh, pay fee',
    difficulty: 1,
    message:
      'Congratulations! Your mobile number has won Rs 25,00,000 in the Lucky Bharat Mega Draw 2026 (Ticket LB{ref}). ' +
      'Claim your prize by paying a small processing fee of Rs 2,500: {link}',
    lesson: {
      en: {
        title: 'The lottery you never entered',
        flags: [
          'You "won" a lottery you never entered.',
          'You must pay a "fee" to receive prize money.',
          'Too good to be true — a huge amount for doing nothing.',
        ],
        rule: 'If you have to pay to receive money, it is a scam. Always.',
      },
      kn: {
        title: 'ನೀವು ಭಾಗವಹಿಸದ ಲಾಟರಿ',
        flags: [
          'ನೀವು ಎಂದೂ ಭಾಗವಹಿಸದ ಲಾಟರಿಯಲ್ಲಿ "ಗೆದ್ದಿದ್ದೀರಿ" ಎನ್ನುತ್ತದೆ.',
          'ಬಹುಮಾನದ ಹಣ ಪಡೆಯಲು "ಶುಲ್ಕ" ಕಟ್ಟಬೇಕು ಎನ್ನುತ್ತದೆ.',
          'ನಂಬಲು ಅಸಾಧ್ಯವಾದಷ್ಟು ಒಳ್ಳೆಯದು — ಏನೂ ಮಾಡದೆ ದೊಡ್ಡ ಮೊತ್ತ.',
        ],
        rule: 'ಹಣ ಪಡೆಯಲು ನೀವೇ ಹಣ ಕಟ್ಟಬೇಕೆಂದರೆ, ಅದು ಖಂಡಿತ ಮೋಸ. ಯಾವಾಗಲೂ.',
      },
    },
  },
];

export function getDrill(key: string): Drill | undefined {
  return DRILLS.find((d) => d.key === key);
}

/** Fill {link} and {ref}. ref is derived from the token so it stays stable per send. */
export function renderMessage(drill: Drill, link: string, token: string): string {
  const ref = (parseInt(token.slice(0, 8), 16) % 9_000_000 + 1_000_000).toString();
  return drill.message.replace('{link}', link).replace('{ref}', ref);
}
