"use client";

import { useAuthStore } from "@/store/authStore"; 
import { Settings, LogOut, User, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";

// Helper component for the header icons
export function ButtonIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition cursor-pointer"
      aria-label="Action button"
      onClick={() => console.log("Settings button clicked")}
    >
      {icon}
    </button>
  );
}

export default function SettingsDropdown() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/role");
  };

  const handleGoToSettings = () => {
    router.push("/admin/settings/profile");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonIcon icon={<Settings size={20} />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-white border border-gray-200 rounded-md shadow-lg p-1"
        align="end"
        sideOffset={5}
        style={{ zIndex: 9999 }}
      >
        <DropdownMenuLabel className="font-bold text-violet-700">
          {user?.firstName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Settings Group */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleGoToSettings}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Change Password clicked")}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout Action */}
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
