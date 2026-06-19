/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FORMSPREE_ID?: string;
  readonly PUBLIC_FORMSPREE_CONTACT_ID?: string;
  readonly PUBLIC_FORMSPREE_QUOTE_ID?: string;
  readonly PUBLIC_GOOGLE_TRANSLATE_KEY?: string;
  readonly PUBLIC_ONESIGNAL_APP_ID?: string;
  readonly PUBLIC_ONESIGNAL_SAFARI_WEB_ID?: string;
  readonly PUBLIC_ONESIGNAL_NOTIFY_BUTTON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
