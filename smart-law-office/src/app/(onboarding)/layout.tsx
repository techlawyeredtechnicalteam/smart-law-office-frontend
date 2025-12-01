// import { Briefcase, DollarSign, Settings, Users } from "lucide-react";
// import { usePathname } from "next/navigation";
// import React from "react";

// const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
//   // const pathname = usePathname()

//   // step 6 full screen
//   // if (pathname === '/welcome') {
//   //   return <div className='min-h-screen'>{ children}</div>
//   // }

//   // Split-screen layout for Step 1 tp 5
//   return (
//     <div className="min-h-screen flex font-sans">
//       {/* Left pane Form */}
//       <div className="flex-1 bg-white flex items-center justify-center min-h-screen p-4 sm:p-8 lg:p-0 relative">
//         <div className="w-full max-w-xl p-8">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-[#7C3AED]">
//               Create Your Law Firm Profile
//             </h1>
//             {/* <p className='text-sm text-gray-50 mt-2'>Step {step} of { totalSteps}</p> */}
//           </div>
//           {children}
//         </div>
//       </div>

//       {/* Right Pane */}
//       <div className="hidden lg:block lg:w-1/2 min-h-screen bg-[#7C3AED]">
//         <div className="flex flex-col items-center h-full p-16 text-white text-center">
//           {/* Content can be customized per step if needed, but keeping it static for now */}
//           <Settings className="w-20 h-20 mb-8 opacity-90" />
//           <h3 className="text-4xl font-extrabold mb-4">
//             Setup Your Smart Office
//           </h3>
//           <p className="text-xl opacity-80 mb-10">
//             A quick 5-step process to bring your law firm into the digital era.
//           </p>
//           <div className="flex space-x-4 text-sm font-medium">
//             <span className="flex items-center">
//               <Briefcase className="w-4 h-4 mr-1" /> Profile
//             </span>
//             <span className="flex items-center">
//               <Users className="w-4 h-4 mr-1" /> Counsel
//             </span>
//             <span className="flex items-center">
//               <DollarSign className="w-4 h-4 mr-1" /> Fees
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnboardingLayout;

// // const PRIMARY_COLOR = 'AED'; // Violet/Purple from the design
// // const SECONDARY_BG = '#F5F3FF'; // Light background color for hover/selected
// // const TEXT_COLOR = '#374151'; // Dark gray text
