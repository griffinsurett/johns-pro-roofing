// src/components/Button/variants/PhoneButton.tsx
/**
 * Phone Button Variant
 *
 * Plain-text phone link — a phone icon followed by the number (no "Call Us"
 * label). Pass the number as children and a `tel:` href.
 *
 * Tone:
 *   - "white" (default) → for dark/photo backgrounds (the hero)
 *   - "blue"            → brand navy, for light backgrounds (the header)
 */

import { ButtonBase, type ButtonProps } from "../Button";
import { renderButtonIcon } from "../utils";

type PhoneButtonProps = ButtonProps & { tone?: "white" | "blue" };

export default function PhoneButton({
  leftIcon,
  rightIcon,
  className = "",
  tone = "white",
  ...props
}: PhoneButtonProps) {
  // Plain text, no background/border. Just a colored, bold phone number.
  const toneClasses =
    tone === "blue"
      ? "text-primary hover:text-primary/70"
      : "text-white hover:text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]";

  const variantClasses = `!p-0 bg-transparent border-0 shadow-none font-bold tracking-wide transition-colors ${toneClasses}`;

  return (
    <ButtonBase
      {...props}
      className={`${variantClasses} ${className}`}
      leftIcon={renderButtonIcon(leftIcon ?? "fa6:phone", props.size)}
      rightIcon={renderButtonIcon(rightIcon, props.size)}
    />
  );
}
