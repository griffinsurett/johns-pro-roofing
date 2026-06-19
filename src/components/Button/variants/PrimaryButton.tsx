// src/components/Button/variants/PrimaryButton.tsx
/**
 * Primary Button Variant
 *
 * Solid blue button - the default and most prominent button style.
 * Used for primary actions like form submissions, main CTAs.
 */

import { ButtonBase, type ButtonProps } from "../Button";
import { renderButtonIcon } from "../utils";

/**
 * Primary button with blue background and white text
 */
export default function PrimaryButton({
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: ButtonProps) {
  // Primary button styling
  const variantClasses =
    "bg-[var(--color-accent-red)] hover:bg-[var(--color-accent-red-hover)] !text-white shadow-[0_4px_12px_rgba(200,16,46,0.2)] hover:shadow-[0_6px_16px_rgba(200,16,46,0.35)] transition-all";

  return (
    <ButtonBase
      {...props}
      className={`${variantClasses} ${className}`}
      leftIcon={renderButtonIcon(leftIcon, props.size)}
      rightIcon={renderButtonIcon(rightIcon, props.size)}
    />
  );
}
