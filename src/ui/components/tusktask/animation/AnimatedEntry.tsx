import { motion, useInView } from "motion/react";
import { ReactNode, useEffect, useRef, useState } from "react";

interface AnimatedEntryProps {
  children: ReactNode;
  origin: "left" | "top" | "right" | "bottom";
  destination: "left" | "top" | "right" | "bottom";
  delay?: number; // Entrance delay
  speed?: number; // Entrance speed (duration)
  outDelay?: number; // Exit delay
  outSpeed?: number; // Exit speed (duration)
  trigger?: boolean;
  initialPosition?: number;
  className?: string;
}

type AnimationState = "hidden" | "visible" | "exit";

const AnimatedEntry: React.FC<AnimatedEntryProps> = ({
  children,
  origin,
  destination,
  delay = 0,
  speed = 0.5,
  outDelay = 0,
  outSpeed = 0.5,
  trigger,
  initialPosition = 100,
  className = "",
}) => {
  const ref = useRef(null);
  // We use the in-view hook just to know when we mount in the viewport.
  // This demo doesn't strictly depend on it but you can incorporate it if needed.
  const isInView = useInView(ref, { once: false });

  // Internal state to drive animation state
  const [animationState, setAnimationState] =
    useState<AnimationState>("hidden");

  // Utility: compute offsets for a given direction
  const getOffset = (direction: "left" | "top" | "right" | "bottom") => {
    switch (direction) {
      case "left":
        return { x: -initialPosition, y: 0 };
      case "right":
        return { x: initialPosition, y: 0 };
      case "top":
        return { x: 0, y: -initialPosition };
      case "bottom":
        return { x: 0, y: initialPosition };
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getOffset(origin);
  const exitOffset = getOffset(destination);

  const variants = {
    hidden: {
      opacity: 0,
      ...initialOffset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: speed,
        delay: delay,
      },
    },
    exit: {
      opacity: 0,
      ...exitOffset,
      transition: {
        duration: outSpeed,
        delay: outDelay,
      },
    },
  };

  // Watch the `trigger` prop to update our internal state.
  useEffect(() => {
    if (trigger) {
      // When trigger is true, animate to visible.
      setAnimationState("visible");
    } else {
      // Only switch to "exit" if we're currently visible. This prevents a jump
      // from hidden directly back to hidden.
      if (animationState === "visible") {
        setAnimationState("exit");
      }
    }
  }, [trigger, animationState]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animationState}
      variants={variants}
      className={className}
      // Once the exit animation is done, set state back to hidden.
      onAnimationComplete={(definition) => {
        if (definition === "exit") {
          setAnimationState("hidden");
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedEntry;
