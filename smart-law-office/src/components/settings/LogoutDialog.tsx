"use client";

import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/shared/ui/dialog";
import { Button } from "@/components/shared/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface LogoutDialogProps {
  children: React.ReactNode;
}

export function LogoutDialog({ children }: LogoutDialogProps) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>{" "}
      <DialogContent className="sm:max-w-md p-8 rounded-xl shadow-2xl bg-white">
        {" "}
        <div className="flex flex-col items-center space-y-4">
          {" "}
          <div className="p-4 bg-gray-100 rounded-full">
            <LogOut size={40} className="text-[#7C5CFC]" />{" "}
          </div>{" "}
          <DialogTitle className="text-xl font-bold text-gray-800">
            Log Out{" "}
          </DialogTitle>{" "}
          <p className="text-sm text-gray-500 text-center">
            You can always log back in at anytime.{" "}
          </p>{" "}
        </div>{" "}
        <DialogFooter className="sm:justify-between flex-row pt-6">
          {" "}
          <Button
            type="button"
            variant="outline"
            className="w-1/2 mr-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel{" "}
          </Button>{" "}
          <Button
            type="button"
            onClick={handleLogout}
            className="w-1/2 ml-2 bg-[#7C5CFC] hover:bg-[#6B46C1] text-white"
          >
            Log out{" "}
          </Button>{" "}
        </DialogFooter>{" "}
      </DialogContent>{" "}
    </Dialog>
  );
}
