"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import ProfileTab from "@/components/dashboard/settings/ProfileTab";
import PaymentTab from "@/components/dashboard/settings/PaymentTab";
import NotificationTab from "@/components/dashboard/settings/NotificationTab";

type SettingTab = "profile" | "payment" | "notifications";

const formatTabName = (tab: SettingTab) => {
  return tab
    .split("")
    .map((char, i) => (i === 0 ? char.toUpperCase() : char))
    .join("")
    .replace("notifications", "Notifications")
    .replace("payment", "Payment method")
    .replace("profile", "My Profile");
};

export default function SettingsClient({
  initialTab
}: {
  initialTab: SettingTab;
}) {
  const router = useRouter();
  const currentTab: SettingTab = initialTab || "profile";

  const handleTabChange = (value: string) => {
    router.push(`/settings/${value}`);
  };

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="bg-transparent h-auto p-0 border-b border-gray-200 justify-start space-x-2">
          {(["profile", "payment", "notifications"] as SettingTab[]).map(
            (t) => (
              <TabsTrigger
                key={t}
                value={t}
                className={`text-base font-semibold pb-3 transition-colors ${
                  currentTab === t
                    ? "text-[#7C5CFC] border-b-2 border-[#7C5CFC]"
                    : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                } rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#7C5CFC] data-[state=active]:border-[#7C5CFC]`}
              >
                {formatTabName(t)}
              </TabsTrigger>
            )
          )}
        </TabsList>
        <div className="mt-8">
          <TabsContent value="profile" className="mt-0">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="payment" className="mt-0">
            <PaymentTab />
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <NotificationTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
