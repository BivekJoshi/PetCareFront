/**
 * Motion vocabulary for the owner app.
 *
 * Everything animated in this shell pulls its timing from here, so the rail,
 * the panels, the aside and the page transitions feel like one system rather
 * than a pile of independently-tuned easings.
 *
 * Two curves only:
 * - SPRING for anything the pointer drives (the active-nav indicator, hover
 *   lifts) — it should feel physical and interruptible.
 * - EASE for anything time-driven (reveals, page changes) — a standard
 *   "decelerate" curve, calm and predictable.
 */

export const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.7 };
export const EASE = [0.22, 1, 0.36, 1];

// Content arriving: a short rise + fade. `i` staggers a list without needing a
// parent variant, matching the `fade` helper already used in OwnerHome.
export const rise = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.34, ease: EASE },
  }),
};

// Parent/child pair for lists that should cascade rather than pop in together.
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

export const staggerChild = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

// Rail flyouts (search, notifications): slide out from behind the rail.
export const panelSlide = {
  hidden: { x: -24, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.26, ease: EASE } },
  exit: { x: -24, opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

export const backdropFade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Route changes. Deliberately small — a big slide on every navigation gets
// tiring in an app you use daily.
export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.14, ease: "easeIn" } },
};

// Shared layoutId for the pill that tracks the active destination. One string
// per surface — the rail and the phone tab bar must not share an id, or the
// pill will try to fly between them when both are mounted mid-resize.
export const RAIL_PILL = "owner-rail-active-pill";
export const TABBAR_PILL = "owner-tabbar-active-pill";
