import SettingsClient from "./SettingsClient";

type SettingTab = "profile" | "payment" | "notifications";

export function generateStaticParams() {
  return [{ tab: "profile" }, { tab: "payment" }, { tab: "notifications" }];
}

// 1. Mark the function as async
export default async function SettingsPage({
  params
}: {
  params: Promise<{ tab: SettingTab }>; // 2. Update type to Promise
}) {
  // 3. Await the params
  const resolvedParams = await params;
  const tab = resolvedParams.tab;

  // 4. Pass the resolved 'tab' to your client component
  return <SettingsClient initialTab={tab} />;
}
