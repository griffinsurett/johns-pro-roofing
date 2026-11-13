// src/components/Form/inputs/ConsentCheckbox.tsx
/**
 * ConsentCheckbox — the required opt-in every form on the site carries:
 * privacy policy agreement plus consent to be contacted by phone, text or
 * email (TCPA). One component so the wording is identical everywhere and a
 * form can't ship without it. Works in Astro forms and React forms alike.
 *
 * Submits as `privacy` ("on" → true in FormWrapper).
 *
 * The Privacy Policy link reads as part of the sentence: same font, size,
 * case and color as the text around it, just underlined.
 */
import Checkbox from "@/components/Form/inputs/Checkbox";

interface ConsentCheckboxProps {
  containerClassName?: string;
}

export default function ConsentCheckbox({
  containerClassName = "mb-6",
}: ConsentCheckboxProps) {
  return (
    <Checkbox name="privacy" required containerClassName={containerClassName}>
      I have read and agree to the{" "}
      <a
        href="/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="[color:inherit] [font:inherit] normal-case tracking-normal underline underline-offset-2 hover:opacity-80"
      >
        Privacy Policy
      </a>
      , and consent to John's Pro Roofing LLC contacting me by phone, text, or
      email about my request. Consent is not a condition of purchase. Message
      and data rates may apply; reply STOP to opt out.
    </Checkbox>
  );
}
