// src/components/Button/variants/PhoneOutlineButton.tsx
/**
 * Phone Outline Button Variant
 *
 * The phone number in white text inside a white border — for dark / photo
 * backgrounds (e.g. the hero). Shows a phone icon before the number; pass the
 * number as children and a `tel:` href.
 */

import { ButtonBase, type ButtonProps } from "../Button";
import { renderButtonIcon } from "../utils";

export default function PhoneOutlineButton({
  leftIcon,
  rightIcon,
  className = "",
  ...props
}: ButtonProps) {
  const variantClasses =
    "bg-transparent text-white border-2 border-white hover:bg-white/12 font-bold tracking-wide transition-all";

  return (
    <ButtonBase
      {...props}
      className={`${variantClasses} ${className}`}
      leftIcon={renderButtonIcon(leftIcon ?? "fa6:phone", props.size)}
      rightIcon={renderButtonIcon(rightIcon, props.size)}
    />
  );
}
