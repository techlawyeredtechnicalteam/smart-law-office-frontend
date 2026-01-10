import SettingsClient from "./SettingsClient";

type SettingTab = "profile" | "payment" | "notifications";

export function generateStaticParams() {
  return [{ tab: "profile" }, { tab: "payment" }, { tab: "notifications" }];
}

export default function SettingsPage({
  params
}: {
  params: { tab: SettingTab };
}) {
  return <SettingsClient initialTab={params.tab} />;
}
