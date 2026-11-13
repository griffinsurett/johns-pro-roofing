// src/integrations/preferences/ui/consent/components/CookieConsentBanner.tsx
/**
 * Cookie Consent Banner (Default UI)
 *
 * Initial consent prompt that appears for first-time visitors.
 * Loads eagerly on first user interaction via client:firstInteraction.
 *
 * Zest owns consent state and releases scripts after consent is granted.
 */

import { useState, useEffect, useTransition, lazy, Suspense, useCallback } from "react";
import Modal from "@/components/Modal";
import {
  useCookieSettingsRequests,
  useZestConsent,
} from "@/integrations/preferences/consent/core/hooks/useZestConsent";
import Button from "@/components/Button/Button";

const CookiePreferencesModal = lazy(() => import("./CookiePreferencesModal"));

export default function CookieConsentBanner() {
  const { decided, geoPending, acceptAll, rejectAll } = useZestConsent();
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const showBanner =
    decided === false && geoPending === false && !dismissed;

  const handleOpenSettings = useCallback(() => setShowModal(true), []);
  useCookieSettingsRequests(handleOpenSettings);

  const handleAcceptAll = () => {
    acceptAll();
    startTransition(() => {
      setDismissed(true);
    });
  };

  const handleRejectAll = () => {
    rejectAll();
    startTransition(() => {
      setDismissed(true);
    });
  };

  useEffect(() => {
    const onChange = () => setDismissed(true);
    window.addEventListener("zest:change", onChange);
    return () => window.removeEventListener("zest:change", onChange);
  }, []);

  return (
    <>
      <Modal
        isOpen={showBanner}
        onClose={() => setDismissed(true)}
        closeButton={false}
        position="bottom-left"
        className="max-w-xl w-full bg-transparent border-0 p-0 shadow-none outline-none focus:outline-none focus-visible:outline-none"
        overlayClass="bg-transparent pointer-events-none"
        allowScroll={true}
        ssr={false}
        ariaLabel="Cookie consent banner"
      >
        <div id="cookie-consent-banner" className="group text-left transition-all duration-300">
          <div className="rounded-3xl border border-text/10 bg-surface p-6 shadow-md backdrop-blur-sm">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl" role="img" aria-label="Cookie">
                  🍪
                </span>
                <p className="text-sm text-text leading-relaxed">
                  We use cookies to improve your browsing experience and for
                  marketing purposes.{" "}
                  <Button
                    variant="link"
                    onClick={handleOpenSettings}
                    type="button"
                    className="text-sm"
                  >
                    Manage preferences
                  </Button>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  onClick={handleRejectAll}
                  type="button"
                  className="text-center"
                  size="md"
                  disabled={isPending}
                >
                  Reject All
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAcceptAll}
                  className="flex-1"
                  type="button"
                  size="md"
                  disabled={isPending}
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

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
