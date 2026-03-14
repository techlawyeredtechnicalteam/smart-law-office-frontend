"use client";

import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2, LogOut, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { LogoutDialog } from "./LogoutDialog";
import { deleteFirmProfile, editFirmProfile } from "@/app/api/firmProfile.api";
import { toast } from "sonner";
import { DeleteAccountModal } from "./DeleteAccount";
import { getProfile } from "@/app/api/profile.api";

export default function ProfileTab() {
  const { logout, updateUserLogo } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        const data = res.data;
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");
        setLogo(data.firm?.logo || data.logo || null);
      } catch (err) {
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setLogo(base64String);
      updateUserLogo(base64String);

      try {
        await editFirmProfile({ logo: base64String });
        toast.success("Logo updated successfully");
      } catch (error) {
        toast.error("Failed to save logo to server");
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = async () => {
    setLogo(null);
    updateUserLogo("");
    await editFirmProfile({ logo: null });
  };

  const handleUpdate = async () => {
    try {
      const payload = { firstName, lastName, email, logo };
      await editFirmProfile(payload);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const confirmDeleteAccount = async () => {
    try {
      await deleteFirmProfile();
      toast.success("Logo deleted successfully");
      logout();
    } catch (error) {
      toast.error("Failed to delete logo. Please try again.");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-purple-600" />
      </div>
    );
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      {" "}
      <div className="flex items-center space-x-4 mb-8">
        {" "}
        <Avatar className="h-20 w-20">
          <AvatarImage src={logo || ""} className="object-cover" />
          <AvatarFallback className="bg-purple-100 text-[#7C5CFC] text-2xl font-bold">
            {firstName?.[0]}
            {lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        {""}
        <div className="flex space-x-3">
          {/* Hidden Input */}
          <input
            aria-label="File Upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="bg-[#EAE4FE] text-[#7C5CFC] hover:bg-[#DED7FF] border-none"
          >
            Upload new picture
          </Button>

          <Button
            variant="outline"
            onClick={removeLogo}
            className="text-gray-600 hover:bg-gray-100 border-gray-200"
          >
            Delete
          </Button>
        </div>{" "}
      </div>{" "}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Basic Details
      </h3>{" "}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* First Name */}{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="firstName" className="text-xs text-gray-500">
            First name{" "}
          </Label>{" "}
          <div className="relative">
            {" "}
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pr-10 border-gray-300 focus-visible:ring-[#7C5CFC]"
            />{" "}
            <Edit
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />{" "}
          </div>{" "}
        </div>
        {/* Last Name */}{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="lastName" className="text-xs text-gray-500">
            Last name{" "}
          </Label>{" "}
          <div className="relative">
            {" "}
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="pr-10 border-gray-300 focus-visible:ring-[#7C5CFC]"
            />{" "}
            <Edit
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />{" "}
          </div>{" "}
        </div>
        {/* Email Address */}{" "}
        <div className="space-y-2">
          {" "}
          <Label htmlFor="email" className="text-xs text-gray-500">
            Email Address{" "}
          </Label>{" "}
          <div className="flex items-center space-x-2">
            {" "}
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="grow border-gray-300 focus-visible:ring-[#7C5CFC]"
            />{" "}
            <Button
              type="submit"
              onClick={handleUpdate}
              className="bg-[#EAE4FE] text-[#7C5CFC] hover:bg-[#DED7FF] font-semibold"
            >
              Update{" "}
            </Button>{" "}
          </div>{" "}
        </div>{" "}
      </form>
      <hr className="my-8 border-gray-100" />{" "}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Account security
      </h3>{" "}
      <div className="space-y-4">
        {/* Log out button wrapped in the dialog trigger */}{" "}
        <LogoutDialog>
          {" "}
          <div className="flex items-center space-x-3 cursor-pointer hover:text-[#7C5CFC] transition-colors">
            {" "}
            <LogOut
              size={20}
              className="text-gray-500 group-hover:text-[#7C5CFC]"
            />
            <span className="text-sm font-medium">Log out</span>{" "}
          </div>{" "}
        </LogoutDialog>{" "}
        <div
          onClick={() => setIsDeleteModalOpen(true)}
          className="flex items-center space-x-3 cursor-pointer text-red-500 hover:text-red-700 transition-colors w-fit group"
        >
          <Trash2
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-bold tracking-tight">
            Delete Account
          </span>
        </div>
        <DeleteAccountModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteAccount}
        />
      </div>{" "}
    </div>
  );
}
