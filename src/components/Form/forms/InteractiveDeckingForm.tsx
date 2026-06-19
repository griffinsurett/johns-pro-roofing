// src/components/Form/forms/InteractiveDeckingForm.tsx
/**
 * Interactive Decking Estimator Form
 * A premium multi-step selector for custom decking designs.
 */

import { useState } from "react";
import FormWrapper from "@/components/Form/FormWrapper";
import FormStep from "@/components/Form/step/FormStep";
import Input from "@/components/Form/inputs/Input";
import Textarea from "@/components/Form/inputs/Textarea";
import Checkbox from "@/components/Form/inputs/Checkbox";

export default function InteractiveDeckingForm() {
  const [deckStyle, setDeckStyle] = useState("single-level");
  const [material, setMaterial] = useState("composite");

  const handleSubmit = async (values: any) => {
    // Inject selected custom states
    const submissionData = {
      ...values,
      deckStyle,
      deckMaterial: material,
    };
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Decking estimate requested:", submissionData);
  };

  return (
    <div className="premium-estimator-container">
      <FormWrapper
        onSubmit={handleSubmit}
        successMessage="Thank you! We have received your decking estimate request and will reach out shortly."
        resetOnSuccess={true}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Step 1: Choose Deck Style */}
        <FormStep
          title="1. Choose Your Deck Configuration"
          description="Select the architectural style that best fits your outdoor living space."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
            {/* Single Level */}
            <div
              onClick={() => setDeckStyle("single-level")}
              className={`option-card ${deckStyle === "single-level" ? "selected" : ""}`}
            >
              <div className="option-card-icon">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 8h18M3 16h18" />
                </svg>
              </div>
              <h4 className="option-card-title">Single-Level Deck</h4>
              <p className="option-card-desc">
                Clean, low-profile layout perfect for flat yards and straightforward outdoor dining setups.
              </p>
              <div className="option-card-badge">Classic Choice</div>
            </div>

            {/* Multi-Tier */}
            <div
              onClick={() => setDeckStyle("multi-tier")}
              className={`option-card ${deckStyle === "multi-tier" ? "selected" : ""}`}
            >
              <div className="option-card-icon">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h14M10 18h12" />
                </svg>
              </div>
              <h4 className="option-card-title">Multi-Tier / Sloped</h4>
              <p className="option-card-desc">
                Elevated multi-level zones. Excellent for sloped ground, stairs, and defined living areas.
              </p>
              <div className="option-card-badge">Dynamic Layout</div>
            </div>

            {/* Wrap-Around */}
            <div
              onClick={() => setDeckStyle("wrap-around")}
              className={`option-card ${deckStyle === "wrap-around" ? "selected" : ""}`}
            >
              <div className="option-card-icon">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16h16M8 8h12M12 12h8" />
                </svg>
              </div>
              <h4 className="option-card-title">Wraparound Deck</h4>
              <p className="option-card-desc">
                Expansive layouts that flow around home corners and connect multiple entrance doors.
              </p>
              <div className="option-card-badge">Luxury & Space</div>
            </div>
          </div>
          <input type="hidden" name="deckStyle" value={deckStyle} />
        </FormStep>

        {/* Step 2: Choose Material */}
        <FormStep
          title="2. Select Decking Material"
          description="Materials determine longevity, maintenance demands, and overall aesthetic value."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-4">
            {/* Premium Composite */}
            <div
              onClick={() => setMaterial("composite")}
              className={`option-card ${material === "composite" ? "selected" : ""}`}
            >
              <div className="option-card-badge-top-right accent">Best Seller</div>
              <div className="option-card-icon">
                <svg className="w-8 h-8 text-accent-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="option-card-title">Premium Composite (Trex / TimberTech)</h4>
              <p className="option-card-desc">
                High-performance engineered boards. Zero staining or sanding, rot-proof, splinter-proof, and backed by a 25-50 year warranty.
              </p>
            </div>

            {/* Pressure-Treated Wood */}
            <div
              onClick={() => setMaterial("treated-wood")}
              className={`option-card ${material === "treated-wood" ? "selected" : ""}`}
            >
              <div className="option-card-icon">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707" />
                </svg>
              </div>
              <h4 className="option-card-title">Pressure-Treated Pine</h4>
              <p className="option-card-desc">
                The traditional decking favorite. Budget-friendly, treated to resist termites and moisture, but requires periodic sealing or staining.
              </p>
            </div>

            {/* Cedar / Natural Redwood */}
            <div
              onClick={() => setMaterial("cedar")}
              className={`option-card ${material === "cedar" ? "selected" : ""}`}
            >
              <div className="option-card-icon">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <h4 className="option-card-title">Natural Cedar or Redwood</h4>
              <p className="option-card-desc">
                Rich appearance and pleasant scent. Naturally resistant to insects and rot. Requires annual maintenance to preserve color.
              </p>
            </div>

            {/* Exotic Hardwood */}
            <div
              onClick={() => setMaterial("exotic-ipe")}
              className={`option-card ${material === "exotic-ipe" ? "selected" : ""}`}
            >
              <div className="option-card-badge-top-right">Premium Grade</div>
              <div className="option-card-icon">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z" />
                </svg>
              </div>
              <h4 className="option-card-title">Exotic Hardwood (Ipe / Cumaru)</h4>
              <p className="option-card-desc">
                Incredibly dense and heavy. Luxury grade looks, firesafe, highly resistant to scratching, and boasts a lifetime span of 40+ years.
              </p>
            </div>
          </div>
          <input type="hidden" name="deckMaterial" value={material} />
        </FormStep>

        {/* Step 3: Dimensions & Details */}
        <FormStep
          title="3. Size & Contact Information"
          description="Provide details on the size and location of your project so we can prepare your quote."
        >
          <div className="form-step-details mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                name="deckWidth"
                label="Approx. Width (ft)"
                type="number"
                placeholder="e.g. 16"
                required
                containerClassName="mb-0"
                inputClassName="w-full px-4 py-3 bg-canvas-secondary border border-border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent transition-colors"
                labelClassName="block text-sm font-semibold text-brand-navy mb-1"
              />

              <Input
                name="deckLength"
                label="Approx. Length (ft)"
                type="number"
                placeholder="e.g. 12"
                required
                containerClassName="mb-0"
                inputClassName="w-full px-4 py-3 bg-canvas-secondary border border-border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent transition-colors"
                labelClassName="block text-sm font-semibold text-brand-navy mb-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                name="fullName"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                required
                containerClassName="mb-0"
                inputClassName="w-full px-4 py-3 bg-canvas-secondary border border-border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent transition-colors"
                labelClassName="block text-sm font-semibold text-brand-navy mb-1"
              />

              <Input
                name="email"
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                containerClassName="mb-0"
                inputClassName="w-full px-4 py-3 bg-canvas-secondary border border-border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent transition-colors"
                labelClassName="block text-sm font-semibold text-brand-navy mb-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="732-555-0199"
                required
                containerClassName="mb-0"
                inputClassName="w-full px-4 py-3 bg-canvas-secondary border border-border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent transition-colors"
                labelClassName="block text-sm font-semibold text-brand-navy mb-1"
              />

              <Input
                name="zipCode"
                label="Property Zip Code"
                type="text"
                placeholder="08873"
                required
                containerClassName="mb-0"
                inputClassName="w-full px-4 py-3 bg-canvas-secondary border border-border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent transition-colors"
                labelClassName="block text-sm font-semibold text-brand-navy mb-1"
              />
            </div>

            <Textarea
              name="projectNotes"
              label="Additional Project Notes or Features (optional)"
              placeholder="E.g., Second-story height, custom railings, built-in benches, lighting features..."
              rows={4}
              containerClassName="mb-6"
              textareaClassName="w-full px-4 py-3 bg-canvas-secondary border border-border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent transition-colors resize-vertical"
              labelClassName="block text-sm font-semibold text-brand-navy mb-1"
            />

            <Checkbox
              name="consent"
              label="I consent to receive calls/texts from John's Pro Roofing LLC regarding my estimate request."
              required
              containerClassName="mb-4"
              checkboxClassName="w-4 h-4 text-brand-navy border-border rounded focus:ring-brand-navy"
              labelClassName="text-xs text-text-muted select-none cursor-pointer flex items-start gap-2"
            />
          </div>
        </FormStep>
      </FormWrapper>

      <style>{`
        .premium-estimator-container {
          background-color: var(--color-canvas-primary);
          border-radius: 20px;
          padding: 40px;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-premium);
        }

        .option-card {
          position: relative;
          background-color: var(--color-canvas-secondary);
          border: 2px solid transparent;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: var(--transition-smooth);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          height: 100%;
        }

        .option-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-border);
          box-shadow: var(--shadow-md);
        }

        .option-card.selected {
          background-color: var(--color-canvas-primary);
          border-color: var(--color-brand-navy);
          box-shadow: var(--shadow-lg);
        }

        .option-card-icon {
          color: var(--color-brand-navy);
          padding: 12px;
          background-color: var(--color-canvas-tertiary);
          border-radius: 12px;
          transition: var(--transition-smooth);
        }

        .option-card.selected .option-card-icon {
          color: var(--color-canvas-primary);
          background-color: var(--color-brand-navy);
        }

        .option-card-title {
          font-family: var(--font-family-headings);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-brand-navy);
        }

        .option-card-desc {
          font-size: 14px;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .option-card-badge {
          margin-top: auto;
          font-size: 11px;
          font-weight: 600;
          color: var(--color-text-muted);
          background-color: var(--color-canvas-tertiary);
          padding: 4px 10px;
          border-radius: 20px;
        }

        .option-card.selected .option-card-badge {
          color: var(--color-canvas-primary);
          background-color: var(--color-accent-red);
        }

        .option-card-badge-top-right {
          position: absolute;
          top: -12px;
          right: 16px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          background-color: var(--color-brand-navy);
          color: var(--color-canvas-primary);
          border-radius: 20px;
        }

        .option-card-badge-top-right.accent {
          background-color: var(--color-accent-red);
        }

        @media (max-width: 768px) {
          .premium-estimator-container {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
