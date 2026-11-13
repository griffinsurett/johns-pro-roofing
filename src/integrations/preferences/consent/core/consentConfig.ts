export type ConsentCategory =
  | "essential"
  | "functional"
  | "analytics"
  | "marketing";

export interface ConsentCategoryInfo {
  id: ConsentCategory;
  title: string;
  description: string;
  required?: boolean;
}

export const CONSENT_CATEGORIES: ConsentCategoryInfo[] = [
  {
    id: "essential",
    title: "Strictly Necessary",
    description:
      "Essential for security, network management, accessibility, and the core operation of this website.",
    required: true,
  },
  {
    id: "functional",
    title: "Functionality",
    description:
      "Remembers choices such as your language, theme, and accessibility preferences.",
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Lets us count visits and traffic sources so we can measure and improve the website.",
  },
  {
    id: "marketing",
    title: "Advertising",
    description:
      "Allows advertising partners to measure campaigns and provide more relevant advertising.",
  },
];

/**
 * US mode: opt-out instead of opt-in, for sites serving US visitors.
 *
 * - true: no consent banner. Zest records acceptance and runs tracking, and
 *   visitors opt out through the footer's "Do Not Sell or Share My Personal
 *   Information" link (the privacy policy's opt-out) or "Your Privacy
 *   Choices". A Global Privacy Control / Do Not Track signal counts as an
 *   opt-out (respectDNT + dntBehavior "reject").
 * - false: opt-in for everyone. The banner asks before any non-essential
 *   cookie or tracker runs.
 *
 * It is a fixed setting, not a location lookup: this site is static, so there
 * is no server route to read the visitor's country. ZestEngine turns it into
 * Zest's own "notice" (opt-out) experience, resolved instantly in the page.
 */
export const US_MODE = true;

export const zestConfig = {
  usMode: US_MODE,
  mode: "safe",
  respectDNT: true,
  dntBehavior: "reject",
  consentModeGoogle: true,
  expiration: 365,
  patterns: {
    functional: [
      "^user-language$",
      "^googtrans$",
      "^lang",
      "^locale",
      "^theme",
      "^preferences",
      "^ui_",
    ],
  },
} as const;
