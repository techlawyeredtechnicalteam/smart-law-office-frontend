// import React from "react";

// export const useCountdown = (initialSeconds = 600) => {
//   const [countdown, setCountdown] = React.useState(0);
//   const countdownRef = React.useRef<number | null>(null);

//   const startCountdown = React.useCallback(
//     (seconds = initialSeconds) => {
//       // Clear any existing countdown
//       if (countdownRef.current) {
//         window.clearInterval(countdownRef.current);
//         countdownRef.current = null;
//       }

//       setCountdown(seconds);
//       countdownRef.current = window.setInterval(() => {
//         setCountdown((c) => {
//           if (c <= 1) {
//             if (countdownRef.current) {
//               window.clearInterval(countdownRef.current);
//               countdownRef.current = null;
//             }
//             return 0;
//           }
//           return c - 1;
//         });
//       }, 1000);
//     },
//     [initialSeconds]
//   );

//   const formatCountdown = React.useCallback((seconds: number): string => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   }, []);

//   // Cleanup on unmount
//   React.useEffect(() => {
//     return () => {
//       if (countdownRef.current) {
//         window.clearInterval(countdownRef.current);
//       }
//     };
//   }, []);

//   return {
//     countdown,
//     startCountdown,
//     formatCountdown,
//     formattedCountdown: formatCountdown(countdown)
//   };
// };
