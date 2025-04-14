import { motion, useInView } from "motion/react";
import { ReactNode, useRef } from "react";

interface AnimatedEntryProps {
  children: ReactNode;
  origin: "left" | "top" | "right" | "bottom";
  delay?: number;
  speed?: number;
  trigger?: boolean;
}

const AnimatedEntry: React.FC<AnimatedEntryProps> = ({
  children,
  origin,
  delay = 0,
  speed = 0.5,
  trigger,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  // Define initial positions based on origin
  const variants = {
    hidden: {
      opacity: 0,
      x: origin === "left" ? -100 : origin === "right" ? 100 : 0,
      y: origin === "top" ? -100 : origin === "bottom" ? 100 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: speed,
        delay,
      },
    },
  };

  // Determine if animation should play
  const shouldAnimate = trigger !== undefined ? trigger : isInView;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedEntry;
