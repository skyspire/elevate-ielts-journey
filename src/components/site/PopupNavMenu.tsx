import { useState } from "react";
import {
  X,
  Menu,
  ArrowLeft,
  LayoutDashboard,
  Home,
  BookOpen,
  MessageCircle,
  UserCircle,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { DustParticles } from "@/components/site/DustParticles";
import { SparkleShimmer } from "@/components/site/SparkleShimmer";

/**
 * PopupNavMenu — shared chrome for fullscreen sample-answer popups.
 *
 * Renders:
 *   • A red circular close button (top-right, above the hamburger)
 *   • A dark circular hamburger trigger that opens a vertical dropdown
 *     with Back / Modules / Speaking / Dashboard / Account / Help / Home
 *   • A dim+blur backdrop behind the menu while it's open
 *
 * Lifted from FollowUpReader so every sample popup (Writing T1/T2,
 * Speaking, Predictions, Recent Exams) shares the same nav chrome.
 */
export type PopupNavMenuProps = {
  onClose: () => void;
};

export function PopupNavMenu({ onClose }: PopupNavMenuProps) {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const go = (fn: () => void) => () => {
    setNavOpen(false);
    onClose();
    fn();
  };

  const navItems = [
    { label: "Back", icon: ArrowLeft, onClick: () => { setNavOpen(false); onClose(); } },
    { label: "Speaking", icon: MessageCircle, onClick: go(() => navigate({ to: "/sample-answers", search: { selected: "speaking" } as never })) },
    { label: "Modules", icon: BookOpen, onClick: go(() => navigate({ to: "/sample-answers" })) },
    { label: "Dashboard", icon: LayoutDashboard, onClick: go(() => navigate({ to: "/dashboard" })) },
    { label: "Account", icon: UserCircle, onClick: go(() => navigate({ to: "/dashboard" })) },
    { label: "Help", icon: HelpCircle, onClick: go(() => navigate({ to: "/faq" })) },
    { label: "Home", icon: Home, onClick: go(() => navigate({ to: "/" })) },
  ];

  return (
    <>
      {/* Ambient dust particles rising from bottom (behind popup card) */}
      <DustParticles />
      {/* Dim + blur backdrop behind the menu (above sheet, below buttons) */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={() => setNavOpen(false)}
        className="absolute inset-0 z-[115] cursor-default"
        style={{
          backgroundColor: navOpen ? "rgba(5, 8, 18, 0.62)" : "rgba(5, 8, 18, 0)",
          backdropFilter: navOpen ? "blur(8px) saturate(1.05)" : "blur(0px)",
          WebkitBackdropFilter: navOpen ? "blur(8px) saturate(1.05)" : "blur(0px)",
          opacity: navOpen ? 1 : 0,
          pointerEvents: navOpen ? "auto" : "none",
          transition:
            "background-color 260ms ease, backdrop-filter 260ms ease, -webkit-backdrop-filter 260ms ease, opacity 220ms ease",
        }}
      />
      <div className="absolute right-6 top-6 z-[120] flex flex-col items-end gap-3 sm:right-8 sm:top-8">
        {/* Red close popup button — sits above the hamburger */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: "rgba(220, 38, 38, 0.92)" }}
        >
          <X className="h-5 w-5" strokeWidth={2.4} />
        </button>
        {/* Hamburger trigger */}
        <button
          type="button"
          onClick={() => setNavOpen((v) => !v)}
          aria-label={navOpen ? "Close menu" : "Open menu"}
          aria-expanded={navOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: navOpen ? "rgba(220, 38, 38, 0.92)" : "rgba(15, 23, 42, 0.9)",
            transform: navOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition:
              "transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 220ms ease",
          }}
        >
          {navOpen ? <X className="h-5 w-5" strokeWidth={2.4} /> : <Menu className="h-5 w-5" strokeWidth={2.4} />}
        </button>
        {/* Vertical dropdown list */}
        <div
          role="menu"
          aria-hidden={!navOpen}
          className="flex w-56 flex-col overflow-hidden rounded-2xl p-2 shadow-2xl"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.94)",
            backdropFilter: "blur(14px) saturate(1.2)",
            WebkitBackdropFilter: "blur(14px) saturate(1.2)",
            border: "1px solid rgba(255,255,255,0.08)",
            opacity: navOpen ? 1 : 0,
            transform: navOpen ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
            transformOrigin: "top right",
            pointerEvents: navOpen ? "auto" : "none",
            transition:
              "opacity 220ms ease, transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={item.onClick}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-white/90 transition-all hover:bg-white/10 hover:text-white"
                style={{
                  opacity: navOpen ? 1 : 0,
                  transform: navOpen ? "translateX(0)" : "translateX(8px)",
                  transition:
                    "opacity 220ms ease, transform 280ms ease, background-color 180ms ease",
                  transitionDelay: navOpen ? `${80 + idx * 30}ms` : "0ms",
                }}
              >
                <span
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <Icon className="h-[16px] w-[16px]" strokeWidth={2.2} />
                </span>
                <span
                  style={{
                    fontFamily:
                      '"Nunito", "Quicksand", ui-rounded, system-ui, sans-serif',
                    fontWeight: 600,
                    fontSize: 14,
                    letterSpacing: "-0.005em",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
