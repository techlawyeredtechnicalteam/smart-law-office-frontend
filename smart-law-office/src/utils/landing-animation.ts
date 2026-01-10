import { motion, Variants } from "framer-motion";

// Utility variants for staggered entrance
const sectionStaggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Utility variants for slide-up/fade-in
const fadeInSlideUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

export { sectionStaggerContainer, fadeInSlideUp };
