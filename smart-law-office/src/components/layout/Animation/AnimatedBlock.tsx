// "use client";

// import { motion, useScroll, useTransform } from "framer-motion";
// import React, { useRef } from "react";
// import { WhyChooseUsBlockProps } from "../WhyChooseUsSection";

// interface AnimatedBlockProps extends WhyChooseUsBlockProps {
//   scrollStart: number;
//   scrollEnd: number;
//   children: React.ReactNode;
// }

// const AnimatedBlock: React.FC<AnimatedBlockProps> = ({
//   scrollStart,
//   scrollEnd,
//   children,
//   ...blockProps
// }) => {
//   const containerRef = useRef(null);
//   const { scrollYProgress } = useScroll({ target: containerRef });
//   // map the section's scroll progress
//   const opacity = useTransform(
//     scrollYProgress,
//     [scrollStart, (scrollStart + scrollEnd) / 2, scrollEnd],
//     [0, 1, 0]
//   );

//   return (
//     <motion.div
//       ref={containerRef}
//       style={{ opacity }}
//       className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16"
//     >
//       {children}
//     </motion.div>
//   );
// };
