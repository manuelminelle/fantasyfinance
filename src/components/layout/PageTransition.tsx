import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const baseTransition = { duration: 0.35, ease: "easeOut" } as const;

export default function PageTransition({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={baseTransition}
    >
      {children}
    </motion.div>
  );
}
