// "use client";

// import { useFirmProfileStore } from "@/store/firmProfileStore";
// import { useEffect } from "react";

// export function SessionManager({ children }: { children: React.ReactNode }) {
//   const checkAndResetStep = useFirmProfileStore(
//     (state) => state.checkAndResetStep
//   );

//   useEffect(() => {
//     // Check session on mount
//     checkAndResetStep();

//     // Optional: Check periodically while user is on the page
//     const interval = setInterval(() => {
//       checkAndResetStep();
//     }, 60000); // Check every minute

//     return () => clearInterval(interval);
//   }, [checkAndResetStep]);

//   return <>{children}</>;
// }
