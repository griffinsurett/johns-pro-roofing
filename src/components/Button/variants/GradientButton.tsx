// src/components/Button/variants/GradientButton.tsx
/**
 * Gradient Button Variant
 *
 * Brand blue (logo navy) gradient background with white text.
 * Used for prominent CTAs that should carry the brand gradient.
 */

import { ButtonBase, type ButtonProps } from "../Button";
import { renderButtonIcon } from "../utils";

export default function GradientButton({
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses =
    "bg-brand-gradient !text-white shadow-[0_4px_14px_rgba(0,28,77,0.35)] hover:shadow-[0_6px_20px_rgba(0,28,77,0.5)] hover:brightness-110 transition-all";

  return (
    <ButtonBase
      {...props}
      className={`${variantClasses} ${className}`}
      leftIcon={renderButtonIcon(leftIcon, props.size)}
      rightIcon={renderButtonIcon(rightIcon, props.size)}
    />
  );
}
