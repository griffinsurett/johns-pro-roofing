// src/integrations/preferences/ui/consent/components/CookiePreferencesButton.tsx
import { memo } from "react";
import { requestCookieSettings } from "@/integrations/preferences/consent/core/hooks/useZestConsent";
import Button from "@/components/Button/Button";


function CookiePreferencesButton({ className }: { className?: string }) {

  return (
    <>
      <Button
        variant="link"
        className={className}
        size="sm"
        onClick={requestCookieSettings}
        aria-label="Manage cookie preferences"
        rightIcon="lucide:settings"
      >
        Your Privacy Choices
      </Button>
    </>
  );
}

export default memo(CookiePreferencesButton);
