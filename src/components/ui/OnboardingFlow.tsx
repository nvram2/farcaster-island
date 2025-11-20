"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const TOTAL_PAGES = 5;

const FEATURES = [
  {
    emoji: "🏨",
    title: "Own your space",
    description: "Buy or rent out a club or a hotel",
  },
  {
    emoji: "🤝",
    title: "Make friends",
    description: "Meet other Farcaster members and vibe",
  },
  {
    emoji: "🎉",
    title: "Throw parties",
    description: "Launch your tokens & apps in style",
  },
];

const TRIBES = [
  { icon: "💎", name: "DeFi Degens" },
  { icon: "🖼️", name: "NFT Collectors" },
  { icon: "🐸", name: "Memecoin Maxis" },
  { icon: "🔨", name: "Builder Tribe" },
  { icon: "🦁", name: "Party Animals" },
  { icon: "⚡", name: "Caster Crew" },
  { icon: "🐋", name: "Whale Watch" },
  { icon: "🚀", name: "Launch Squad" },
  { icon: "🌴", name: "Vibe Seekers" },
];

const PAGES = [
  {
    label: "",
    description: " Welcome to the party destination in the Farcasterverse",
  },
  {
    label: "",
    description: "Meet people, launch products, discover projects",
  },
  {
    label: "",
    description: "Find the crew that matches your vibe",
  },
  {
    label: "",
    description: "Claim your starter ISLAND pack",
  },
  {
    label: "",
    description: "Become an official Islander",
  },
];

export function OnboardingFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const actionLabel = useMemo(() => {
    if (currentPage === TOTAL_PAGES) {
      return "Start exploring";
    }
    if (currentPage === 3) {
      return selectedTribe ? "Continue" : "Choose a tribe";
    }
    if (currentPage === 4) {
      return "Claim reward";
    }
    return "Continue";
  }, [currentPage, selectedTribe]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), TOTAL_PAGES));
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage === 3 && !selectedTribe) {
      return;
    }
    if (currentPage < TOTAL_PAGES) {
      goToPage(currentPage + 1);
    } else {
      setCompletionMessage("Woo hoo! Great to have you at the Island! Lets Party! 🎊");
      goToPage(1);
      setSelectedTribe(null);
      setRewardAmount(0);
    }
  }, [currentPage, goToPage, selectedTribe]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  useEffect(() => {
    if (currentPage !== 4) {
      return;
    }

    let frame: number;
    const target = 10;
    const duration = 1500;
    const start = performance.now();

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setRewardAmount(Math.round(progress * target));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [currentPage]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextPage();
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        prevPage();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextPage, prevPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = 0;

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.changedTouches[0]?.screenX ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const endX = event.changedTouches[0]?.screenX ?? 0;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextPage();
        } else {
          prevPage();
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [nextPage, prevPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="flex flex-col space-y-4">
            <div className="text-center space-y-2">
              <p className="text-2xl font-extrabold text-[#1A535C]">Welcome to Farcaster Island! 🏝️</p>
              <p className="text-sm text-[#1A535Cc4]">Your party destination in the Farcasterverse</p>
            </div>
            <div className="space-y-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white px-4 py-3 text-center shadow-[0_8px_30px_rgba(26,83,92,0.12)] transition-transform active:scale-[0.98]"
                >
                  <div className="text-4xl animate-bounce-slow mb-2">{feature.emoji}</div>
                  <h3 className="text-sm font-semibold text-[#1A535C]">{feature.title}</h3>
                  <p className="text-xs text-[#1A535Cc9]">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center text-center space-y-6 py-6">
            <p className="text-2xl font-bold text-[#1A535C]">Welcome to the Island! 🌴</p>
            <div className="text-[5rem] animate-float-slow">🏝️</div>
            <p className="text-base leading-relaxed text-[#1A535C] max-w-xs">
              Farcaster Island is about meeting people, throwing parties for launches and discovering projects on Farcaster.
            </p>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-2xl font-bold text-[#1A535C]">Choose your Tribe</p>
              <p className="text-sm text-[#1A535Cc4]">
                Tribes are groups of people who have a lot in common! Select one that matches yours and start partying with your tribe.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TRIBES.map((tribe) => {
                const isSelected = tribe.name === selectedTribe;
                return (
                  <button
                    key={tribe.name}
                    type="button"
                    onClick={() => setSelectedTribe(tribe.name)}
                    className={`rounded-2xl border-2 px-2 py-3 text-center transition-all ${
                      isSelected
                        ? "border-[#FF6B9D] bg-white shadow-[0_10px_30px_rgba(255,107,157,0.35)] scale-[1.03]"
                        : "border-transparent bg-white shadow-[0_6px_18px_rgba(26,83,92,0.16)] active:scale-95"
                    }`}
                  >
                    <div className="text-3xl mb-1">{tribe.icon}</div>
                    <p className="text-[11px] font-semibold text-[#1A535C] leading-tight">{tribe.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center text-center space-y-4 py-6">
            <p className="text-2xl font-bold text-[#1A535C]">Welcome Gift! 🎁</p>
            <p className="text-sm text-[#1A535Cc4]">Here's your starter pack to begin your island journey</p>
            <div className="relative w-full max-w-xs rounded-[32px] bg-white px-6 py-10 shadow-[0_15px_40px_rgba(26,83,92,0.18)]">
              <div className="absolute -top-8 -right-4 text-5xl animate-spin-slow">🪙</div>
              <p className="text-[72px] font-black text-[#FF6B9D] leading-none">{rewardAmount}</p>
              <p className="text-2xl font-bold tracking-[0.3em] text-[#4ECDC4]">ISLAND</p>
            </div>
          </div>
        );
      case 5:
      default:
        return (
          <div className="flex flex-col items-center text-center space-y-4 py-6">
            <p className="text-2xl font-extrabold text-[#1A535C]">You're an Islander now! 🎊</p>
            <div className="text-[5rem] animate-pulse-slow">🏆</div>
            <p className="text-base text-[#1A535Cc4] max-w-sm">
              You're ready to explore, make friends, and throw epic parties!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="relative mx-auto max-w-md rounded-[34px] bg-gradient-to-br from-[#4ECDC4] via-[#1A535C] to-[#12333a] p-1">
        <div ref={containerRef} className="relative overflow-hidden rounded-[32px] bg-[#F7FFF7] min-h-[520px] flex flex-col">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="wave wave-one" />
            <div className="wave wave-two" />
            <div className="wave wave-three" />
          </div>

          <div className="relative z-10 flex flex-col flex-1 space-y-4 px-5 pt-6 pb-4">
            <div className="flex justify-between items-center text-xs uppercase tracking-wide text-[#1A535C] font-semibold">
              <span>{PAGES[currentPage - 1]?.label}</span>
              <span>{PAGES[currentPage - 1]?.description}</span>
            </div>
            <div className="flex-1">{renderPage()}</div>
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
                  <span
                    key={`dot-${index}`}
                    className={`h-2 rounded-full transition-all ${
                      currentPage === index + 1 ? "w-8 bg-[#FF6B9D]" : "w-2 bg-[#1A535C66]"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex-1 rounded-2xl border border-[#1A535C33] bg-white py-3 text-sm font-semibold text-[#1A535C] shadow-sm transition hover:border-[#1A535C80] disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextPage}
                  disabled={currentPage === 3 && !selectedTribe}
                  className="flex-1 rounded-2xl bg-[#FF6B9D] py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(255,107,157,0.35)] transition hover:bg-[#ff588f] disabled:opacity-40"
                >
                  {actionLabel}
                </button>
              </div>
              {selectedTribe && currentPage === 3 && (
                <p className="text-center text-xs font-semibold text-[#FF6B9D]">
                  You're joining the {selectedTribe}!
                </p>
              )}
              {completionMessage && (
                <div className="rounded-2xl bg-white/80 px-4 py-3 text-center text-xs font-semibold text-[#1A535C] shadow-sm">
                  {completionMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 120px;
          background-size: 50% 120px;
          opacity: 0.35;
          animation: wave 18s linear infinite;
        }

        .wave-one {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,60 Q300,0 600,60 T1200,60 L1200,120 L0,120 Z' fill='%234ECDC4' opacity='0.4'/%3E%3C/svg%3E");
        }

        .wave-two {
          animation-duration: 22s;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,60 Q300,100 600,60 T1200,60 L1200,120 L0,120 Z' fill='%23FFE66D' opacity='0.3'/%3E%3C/svg%3E");
        }

        .wave-three {
          animation-duration: 26s;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,60 Q300,80 600,60 T1200,60 L1200,120 L0,120 Z' fill='%23FF6B9D' opacity='0.2'/%3E%3C/svg%3E");
        }

        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2.2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2.4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 2.5s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </div>
  );
}

