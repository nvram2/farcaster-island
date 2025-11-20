"use client";

import { OnboardingFlow } from "../OnboardingFlow";

/**
 * HomeTab component now renders the interactive onboarding
 * flow that mirrors the Farcaster Island design prototype.
 */
export function HomeTab() {
  return (
    <div className="flex items-center justify-center px-4 py-6">
      <OnboardingFlow />
    </div>
  );
}