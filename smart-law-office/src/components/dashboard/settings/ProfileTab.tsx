"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { LogoutDialog } from "./LogoutDialog";

export default function ProfileTab() {
  const { user } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");

  const getInitials = (f: string, l: string) =>
    `${f[0] || ""}${l[0] || ""}`.toUpperCase();

  const userInitials = getInitials(firstName, lastName);

  const handleUpdate = () => {
    console.log("Updating profile...", { firstName, lastName, email });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      {" "}
      <div className="flex items-center space-x-4 mb-8">
        {" "}
        <Avatar className="h-20 w-20">
          <AvatarImage src="/christine-adeola-avatar.png" />{" "}
          <AvatarFallback className="bg-purple-100 text-[#7C5CFC] text-2xl font-bold">
            {userInitials}{" "}
          </AvatarFallback>{" "}
        </Avatar>{" "}
        <div className="flex space-x-3">
          {" "}
          <Button
            variant="outline"
            className="bg-[#EAE4FE] text-[#7C5CFC] hover:bg-[#DED7FF] border-none"
          >
            Upload new picture{" "}
          </Button>{" "}
          <Button variant="outline" className="text-gray-600 hover:bg-gray-100">
            Delete{" "}
          </Button>{" "}
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
      </div>{" "}
    </div>
  );
}
