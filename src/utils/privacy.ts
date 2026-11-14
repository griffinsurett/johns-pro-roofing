// src/utils/privacy.ts
/**
 * What the site actually uses, for the legal pages: the outside services a
 * visitor's data can reach, and what the site stores in their browser.
 *
 * The privacy policy, cookie policy, California section and terms all render
 * from these lists (ContentRenderer → PolicyListVariant), so they can't drift
 * from the code. Services that only run when configured (Google Tag Manager,
 * OneSignal) appear only while their env IDs are set, the same switch that
 * loads them. Adding a new third party means adding it here, in the same
 * change as its AGENTS.md allowlist row and CSP entry.
 */

const env = import.meta.env;
const has = (...keys: string[]) => keys.every((k) => Boolean(String(env[k] ?? "").trim()));

export interface PolicyItem {
  id: string;
  title: string;
  /** What it does and what it receives, in plain language. */
  description: string;
  /** Short facts shown under the description (type, duration, category). */
  details?: string[];
  /** The provider's own privacy policy. */
  link?: string;
}

interface ServiceEntry extends PolicyItem {
  active: boolean;
}

const SERVICES: ServiceEntry[] = [
  {
    id: "vercel",
    title: "Vercel (website hosting)",
    description:
      "Hosts and delivers this website. Like any web server, it receives your IP address and browser details with each page request, kept in short-lived server logs for security and reliability.",
    link: "https://vercel.com/legal/privacy-policy",
    active: true,
  },
  {
    id: "vercel-analytics",
    title: "Vercel Web Analytics and Speed Insights",
    description:
      "Count page visits and measure how fast pages load. They use no cookies, don't identify you, and don't follow you to other websites.",
    link: "https://vercel.com/docs/analytics/privacy-policy",
    active: true,
  },
  {
    id: "formspree",
    title: "Formspree (forms)",
    description:
      "Delivers the forms you send us (your name, phone, email, message, project details and the page you sent it from) to our inbox.",
    link: "https://formspree.io/legal/privacy-policy/",
    active: has("PUBLIC_FORMSPREE_ID") || has("PUBLIC_FORMSPREE_QUOTE_ID") || has("PUBLIC_FORMSPREE_CONTACT_ID"),
  },
  {
    id: "google-fonts",
    title: "Google Fonts",
    description:
      "Supplies the typefaces on our homepage. Your browser downloads them from Google, which receives your IP address.",
    link: "https://policies.google.com/privacy",
    active: true,
  },
  // Translation is OFF (not in this client's package). Uncomment with the
  // translation scripts and CSP hosts.
  // {
  //   id: "google-translate",
  //   title: "Google Translate",
  //   description:
  //     "Only if you choose a language and your browser can't translate the page itself. Your browser then loads Google's translation tool, which receives the page text and your IP address.",
  //   details: ["Category: Functionality"],
  //   link: "https://policies.google.com/privacy",
  //   active: true,
  // },
  {
    id: "google-tag-manager",
    title: "Google Tag Manager / Google Analytics",
    description: "Measures how visitors use the site, only if you allow analytics cookies.",
    details: ["Category: Analytics"],
    link: "https://policies.google.com/privacy",
    active: has("PUBLIC_GTM_ID"),
  },
  {
    id: "onesignal",
    title: "OneSignal (web push notifications)",
    description: "Sends browser notifications, only if you subscribe to them.",
    details: ["Category: Functionality"],
    link: "https://onesignal.com/privacy_policy",
    active: has("PUBLIC_ONESIGNAL_APP_ID", "PUBLIC_ONESIGNAL_SAFARI_WEB_ID"),
  },
];

const STORAGE: PolicyItem[] = [
  {
    id: "zest_consent",
    title: "zest_consent",
    description: "Remembers your cookie choices so we don't ask again.",
    details: ["Cookie", "Kept for 1 year", "Strictly necessary"],
  },
  // Translation is OFF: no language preference is stored.
  // {
  //   id: "user-language",
  //   title: "user-language",
  //   description: "Remembers the language you picked.",
  //   details: ["Browser storage", "Kept until you clear it", "Functionality"],
  // },
  {
    id: "user-a11y-prefs",
    title: "user-a11y-prefs",
    description: "Remembers your accessibility settings (text size, contrast and similar).",
    details: ["Browser storage", "Kept until you clear it", "Functionality"],
  },
  // Translation is OFF: Google Translate never sets this.
  // {
  //   id: "googtrans",
  //   title: "googtrans",
  //   description: "Set only if you use Google Translate, to keep the page in your language.",
  //   details: ["Cookie", "Session", "Functionality"],
  // },
];

const strip = ({ active, ...item }: ServiceEntry): PolicyItem => item;

/** Outside services the site uses right now. */
export const getSiteServices = (): PolicyItem[] => SERVICES.filter((s) => s.active).map(strip);

/** Cookies and browser storage the site sets. */
export const getSiteStorage = (): PolicyItem[] => STORAGE;

/** True while any configured service sets analytics or advertising cookies. */
export const usesTrackingCookies = (): boolean => SERVICES.some((s) => s.active && s.id === "google-tag-manager");
