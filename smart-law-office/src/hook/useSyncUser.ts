// // @/hooks/useSyncUser.ts
// import { useEffect } from "react";
// import { useAuthStore } from "@/store/authStore";
// import api from "@/app/api/api";

// export const useSyncUser = () => {
//   const { user, syncUser } = useAuthStore();

//   useEffect(() => {
//     const fetchLatestProfile = async () => {
//       try {
//         // Ping your profile endpoint
//         const res = await api.get("/profiles");
//         const serverUser = res.data.data;

//         // Update the store with fresh data from the DB
//         // This ensures the Sidebar logo is always current
//         syncUser({
//           ...serverUser,
//           // Ensure we normalize the structure for the sidebar
//           firm: {
//             name: serverUser.firmName || serverUser.firm?.name,
//             logo: serverUser.logo || serverUser.firm?.logo
//           }
//         });
//       } catch (err) {
//         console.error("User sync failed:", err);
//         // If the API says 401 Unauthorized, the cookie is dead
//       }
//     };

//     // Only sync if we don't have user data or on initial load
//     if (!user) {
//       fetchLatestProfile();
//     }
//   }, [syncUser]); // Run once on mount
// };
