"use client";

import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

// Helper component for a single notification setting row
const NotificationRow = ({
  label,
  isChecked,
  onCheckedChange
}: {
  label: string;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-3">
        <p className="text-sm font-normal text-gray-700">{label}</p>   {" "}
    <Switch
      checked={isChecked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-[#7C5CFC] data-[state=unchecked]:bg-gray-300"
    />
     {" "}
  </div>
);

// Helper component for a single data privacy row
const DataPrivacyRow = ({
  name,
  role,
  access,
  onAccessChange
}: {
  name: string;
  role: string;
  access: "Full access" | "View only";
  onAccessChange: (newAccess: "Full access" | "View only") => void;
}) => (
  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
    {" "}
    <div className="flex items-center space-x-3">
      {" "}
      <Avatar className="h-10 w-10">
        {" "}
        <AvatarImage
          src={`/avatar-${name.toLowerCase().replace(" ", "-")}.png`}
        />{" "}
        <AvatarFallback className="bg-purple-100 text-[#7C5CFC]">
          {name[0]}{" "}
        </AvatarFallback>{" "}
      </Avatar>{" "}
      <div>
        <p className="text-sm font-semibold">{name}</p>{" "}
        <p className="text-xs text-gray-500">{role}</p>{" "}
      </div>{" "}
    </div>
    <span className="text-sm font-medium text-gray-500">{access}</span>{" "}
    {/* The image just shows the access, for this mockup we will just display it */}{" "}
  </div>
);

export default function NotificationsTab() {
  // State for all the switches
  const [pushSettings, setPushSettings] = useState({
    comments: true,
    chatMessages: true,
    reminders: false,
    popUpNotification: false,
    newClientRequest: true,
    newConsultationRequest: false
  });

  const [allowDownloads, setAllowDownloads] = useState(false);

  const handlePushChange = (
    key: keyof typeof pushSettings,
    checked: boolean
  ) => {
    setPushSettings((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Push Notifications Section */}{" "}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Push notifications{" "}
      </h3>{" "}
      <div className="border border-[#7C5CFC] rounded-lg p-4 mb-8">
        {" "}
        <NotificationRow
          label="Comments"
          isChecked={pushSettings.comments}
          onCheckedChange={(c) => handlePushChange("comments", c)}
        />{" "}
        <NotificationRow
          label="Chat messages"
          isChecked={pushSettings.chatMessages}
          onCheckedChange={(c) => handlePushChange("chatMessages", c)}
        />{" "}
        <NotificationRow
          label="Reminders"
          isChecked={pushSettings.reminders}
          onCheckedChange={(c) => handlePushChange("reminders", c)}
        />{" "}
        <NotificationRow
          label="Pop-up notification"
          isChecked={pushSettings.popUpNotification}
          onCheckedChange={(c) => handlePushChange("popUpNotification", c)}
        />{" "}
        <NotificationRow
          label="New client request"
          isChecked={pushSettings.newClientRequest}
          onCheckedChange={(c) => handlePushChange("newClientRequest", c)}
        />{" "}
        <NotificationRow
          label="New consultation request"
          isChecked={pushSettings.newConsultationRequest}
          onCheckedChange={(c) => handlePushChange("newConsultationRequest", c)}
        />{" "}
      </div>
      {/* Data & Privacy Section */}{" "}
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Data & Privacy{" "}
      </h3>{" "}
      <div className="space-y-4">
        {" "}
        <div className="flex items-center justify-between py-3">
          {" "}
          <p className="text-sm font-normal text-gray-700">
            Allow downloads
          </p> {" "}
          <Switch
            checked={allowDownloads}
            onCheckedChange={setAllowDownloads}
            className="data-[state=checked]:bg-[#7C5CFC] data-[state=unchecked]:bg-gray-300"
          />{" "}
        </div>{" "}
        <DataPrivacyRow
          name="Christine Adeola"
          role="Counsel"
          access="Full access"
          onAccessChange={() => console.log("Christine access changed")}
        />{" "}
        <DataPrivacyRow
          name="Jane Francis"
          role="Counsel"
          access="View only"
          onAccessChange={() => console.log("Jane access changed")}
        />{" "}
      </div>{" "}
    </div>
  );
}
