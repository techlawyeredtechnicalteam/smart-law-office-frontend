// "use client";

// import { useAuthStore } from "@/store/authStore";
// import React from "react";
// import { userName } from "../dashboard/admin/Sidebar";
// import { Bell, Calendar, ChevronDown, Menu, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import SettingsDropdown from "../dashboard/settings/Settings";

// type HeaderProps = {
//   toggleDrawer: () => void;
// };

// const Header: React.FC<HeaderProps> = ({ toggleDrawer }) => {
//   const { user } = useAuthStore();
//   const userNameValue = userName(user);
//   const today = new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//     day: "numeric",
//     month: "long"
//   });
//   const time = new Date().toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true
//   });

//   return (
//     <header className="flex items-center justify-between p-4 bg-white shadow-md sticky top-0 z-20 border-b">
//       {/* Left Section */}
//       <div className="flex items-center">
//         <button
//           type="button"
//           aria-label="Mobile Menu Toggle"
//           onClick={toggleDrawer}
//           className="p-2 mr-4 rounded-lg hover:bg-gray-100 transition lg:hidden"
//         >
//           <Menu className="w-6 h-6 text-gray-700" />
//         </button>
//         <div className="md:hidden lg:block">
//           <h2 className="text-lg font-semibold text-gray-700">
//             Welcome back, {userNameValue}
//           </h2>
//         </div>
//       </div>

//       {/* Center Section */}
//       <div className="items-center space-x-4 grow max-w-max mx-4 hidden md:flex">
//         <Calendar className="w-4 h-4 text-gray-500" />
//         <span className="text-sm text-gray-600">{today}</span>
//         <span className="text-sm text-gray-600">{time}</span>

//         {/* Search bar */}
//         <div className="relative grow">
//           <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
//           <input
//             type="text"
//             placeholder="Search cases, clients, document..."
//             className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-violet-500 focus:border-violet-500 text-sm"
//           />
//         </div>
//       </div>

//       {/* Right sections  */}
//       <div className="flex items-center space-x-3">
//         <button
//           type="button"
//           className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
//           aria-label="Notification"
//         >
//           <Bell className="w-6 h-6" />
//         </button>
//         <SettingsDropdown />
//         <div className="relative group">
//           <Button>
//             Create
//             <ChevronDown className="w-4 h-4 ml-2" />
//           </Button>
//           <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl hidden group-hover:block z-30">
//             <a
//               href="#"
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             >
//               New Client
//             </a>
//             <a
//               href="#"
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             >
//               Assign Case
//             </a>
//             <a
//               href="#"
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             >
//               Upload Document
//             </a>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
// export default Header;
