// src/integrations/preferences/ui/consent/components/OptOutButton.tsx
/**
 * CCPA Opt-Out Button — rejects every non-essential cookie category through
 * Zest, confirms, then reloads so blocked scripts are gone. Uses the site's
 * primary Button so it matches the buttons beside it.
 */

import { useState } from "react";
import Button from "@/components/Button/Button";

export default function OptOutButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleOptOut = () => {
    (window as any).Zest?.rejectAll?.();
    setShowConfirmation(true);
    setTimeout(() => window.location.reload(), 1500);
  };

  if (showConfirmation) {
    return (
      <p className="m-0 font-semibold text-heading" role="status">
        You've opted out. Non-essential cookies are off. Reloading…
      </p>
    );
  }

  return (
    <Button variant="primary" type="button" onClick={handleOptOut}>
      Opt out of data sharing
    </Button>
  );
}
