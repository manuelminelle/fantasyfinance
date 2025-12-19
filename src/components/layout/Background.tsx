import { motion, useReducedMotion } from "framer-motion";

export default function Background() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 surface-grid" />
      <motion.div
        className="absolute -top-48 right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(42,122,255,0.35),_transparent_65%)] blur-3xl"
        {...(!reduceMotion && {
          animate: { y: [0, 30, 0], opacity: [0.6, 0.9, 0.6] },
          transition: { duration: 16, repeat: Infinity, ease: "easeInOut" },
        })}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[-8%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,_rgba(0,214,173,0.3),_transparent_65%)] blur-3xl"
        {...(!reduceMotion && {
          animate: { y: [0, -40, 0], opacity: [0.5, 0.8, 0.5] },
          transition: { duration: 18, repeat: Infinity, ease: "easeInOut" },
        })}
      />
      <motion.div
        className="absolute top-[35%] left-[25%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.35),_transparent_60%)] blur-2xl"
        {...(!reduceMotion && {
          animate: { x: [0, 40, 0], opacity: [0.4, 0.7, 0.4] },
          transition: { duration: 14, repeat: Infinity, ease: "easeInOut" },
        })}
      />
    </div>
  );
}
