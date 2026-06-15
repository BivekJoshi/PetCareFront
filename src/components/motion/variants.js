// Shared framer-motion variants and easing for landing-page animations.

export const EASE = [0.22, 1, 0.36, 1];

// Spread `staggerParent` on a container and `staggerItem` on each child to get
// a staggered fade/scale-in as the group scrolls into view.
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};
