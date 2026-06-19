// src/integrations/preferences/consent/ui/CookieConsentBanner.tsx
/**
 * Cookie Consent Banner (Default UI)
 *
 * Initial consent prompt that appears for first-time visitors.
 * Renders as a fixed bottom card directly in the layout flow,
 * avoiding portal scroll-lock or backdrop issues.
 */

import { useState, useEffect, useTransition, lazy, Suspense } from "react";
import { useCookieStorage } from "@/hooks/useCookieStorage";
import { enableConsentedScripts } from "@/integrations/preferences/consent/core/scripts/scriptManager";
import type { CookieConsent } from "@/integrations/preferences/consent/core/types";
import Button from "@/components/Button/Button";

const CookiePreferencesModal = lazy(() => import("./CookiePreferencesModal"));

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { setCookie } = useCookieStorage();

  useEffect(() => {
    // Check if consent already exists (returning user)
    if (document.cookie.includes("cookie-consent=")) {
      // Enable consented scripts for returning users
      enableConsentedScripts();
      return;
    }

    // New user - show banner
    setShowBanner(true);
  }, []);

  const handleAcceptAll = () => {
    const consent: CookieConsent = {
      necessary: true,
      functional: true,
      performance: true,
      targeting: true,
      timestamp: Date.now(),
    };

    // Save consent
    setCookie("cookie-consent", JSON.stringify(consent), { expires: 365 });

    // Enable all consented scripts immediately
    enableConsentedScripts();

    // Dispatch custom event for cross-tab/component sync
    window.dispatchEvent(new Event("consent-changed"));

    startTransition(() => {
      setShowBanner(false);
    });
  };

  const handleRejectAll = () => {
    const consent: CookieConsent = {
      necessary: true,
      functional: false,
      performance: false,
      targeting: false,
      timestamp: Date.now(),
    };

    // Save minimal consent
    setCookie("cookie-consent", JSON.stringify(consent), { expires: 365 });

    // Enable only necessary scripts (if any)
    enableConsentedScripts();

    // Dispatch custom event
    window.dispatchEvent(new Event("consent-changed"));

    startTransition(() => {
      setShowBanner(false);
    });
  };

  const handleOpenSettings = () => {
    startTransition(() => {
      setShowModal(true);
    });
  };

  if (!showBanner) {
    return showModal ? (
      <Suspense fallback={null}>
        <CookiePreferencesModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </Suspense>
    ) : null;
  }

  return (
    <>
      <div
        id="cookie-consent-banner"
        className="fixed bottom-6 left-6 z-[9999] max-w-[440px] w-[calc(100%-3rem)] transition-all duration-300 animate-slide-up"
      >
        <div className="rounded-2xl border border-text/10 bg-surface/95 p-6 shadow-2xl backdrop-blur-md flex flex-col gap-5 text-left">
          <div className="flex items-start gap-4">
            <span className="text-3xl shrink-0 select-none" role="img" aria-label="Cookie">
              🍪
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-semibold text-heading text-base leading-snug">Cookie Preferences</h3>
              <p className="text-sm text-text/80 leading-relaxed">
                We use cookies to improve your browsing experience and for marketing purposes. You can customize your settings or accept them all.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 mt-1 border-t border-text/5 pt-4">
            <div className="flex flex-col sm:flex-row gap-2.5 w-full">
              <Button
                variant="primary"
                onClick={handleAcceptAll}
                type="button"
                size="sm"
                disabled={isPending}
                className="w-full sm:flex-1 justify-center px-4 py-2.5 text-sm order-1 sm:order-2"
              >
                Accept All
              </Button>
              <Button
                variant="secondary"
                onClick={handleRejectAll}
                type="button"
                size="sm"
                disabled={isPending}
                className="w-full sm:flex-1 justify-center px-4 py-2.5 text-sm order-2 sm:order-1"
              >
                Reject
              </Button>
            </div>
            <div className="flex justify-center w-full">
              <Button
                variant="link"
                onClick={handleOpenSettings}
                type="button"
                className="text-xs font-semibold text-text/60 hover:text-text hover:underline py-1"
              >
                Manage preferences
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Suspense fallback={null}>
          <CookiePreferencesModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </Suspense>
      )}
    </>
  );
}
