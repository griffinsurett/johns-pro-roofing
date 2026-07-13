// src/components/HamburgerMenuDrawer.tsx
/**
 * Mobile Menu Drawer Template
 *
 * Manages open/close state for the mobile menu with a checkbox-based hamburger
 * button. The panel slides down from directly beneath the header, closes on
 * outside-click / touch / Escape, and keeps the page visible behind it.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MobileMenuItem from "@/components/LoopComponents/Menu/MobileMenuItem";
import HamburgerButton from "./HamburgerButton";

interface MobileMenuDrawerProps {
  items: any[];
  className?: string;
  hamburgerTransform?: boolean;
  closeButton?: boolean;
}

export default function MobileMenuDrawer({
  items,
  className = "",
  hamburgerTransform = true,
  closeButton = false,
}: MobileMenuDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Portal target only exists in the browser.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      // The panel is portaled to <body>, so it's outside containerRef — check
      // both the hamburger container and the panel before closing.
      const inContainer = containerRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inContainer && !inPanel) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const updateMenuTop = () => {
      // Anchor to the bottom of the bar that holds the hamburger (the logo/nav
      // row) rather than the full <header>, so the panel opens directly beneath
      // it — above the mobile action row.
      const anchor =
        containerRef.current?.closest<HTMLElement>("[data-menu-anchor]") ??
        containerRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      setMenuTop(rect.bottom);
    };

    updateMenuTop();

    window.addEventListener("resize", updateMenuTop);
    window.addEventListener("scroll", updateMenuTop, { passive: true });

    return () => {
      window.removeEventListener("resize", updateMenuTop);
      window.removeEventListener("scroll", updateMenuTop);
    };
  }, []);

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Checkbox-based Hamburger Button */}
      <HamburgerButton
        isOpen={isOpen}
        onChange={setIsOpen}
        hamburgerTransform={hamburgerTransform}
        ariaLabel={isOpen ? "Close menu" : "Open menu"}
        id="mobile-menu-toggle"
      />

      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            className={`fixed left-0 right-0 z-[55] transform transition-all duration-200 ${
              isOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
            style={{ top: `${menuTop}px` }}
            aria-hidden={!isOpen}
          >
            {/* Content-height dropdown card, directly under the header. */}
            <div className="bg-bg shadow-xl border-t border-text/10">
              {closeButton && (
                <div className="flex items-center justify-end bg-primary text-bg px-6 py-4">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-bg/90 hover:text-bg transition-colors"
                    aria-label="Close menu"
                    type="button"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <nav
                className={`${className} max-h-[70vh] overflow-y-auto py-2`}
                aria-label="Mobile navigation"
              >
                <ul className="space-y-1">
                  {items.map((item) => (
                    <MobileMenuItem
                      key={item.slug || item.id}
                      {...item}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </ul>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
