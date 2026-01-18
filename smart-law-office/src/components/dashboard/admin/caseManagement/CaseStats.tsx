import { Card } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Clock, Briefcase } from "lucide-react";

export const CaseStats = ({ stats }: { stats: any }) => {
  const statItems = [
    {
      label: "Total Cases",
      value: stats.total,
      change: "0%",
      icon: Briefcase,
      color: "text-red-500"
    },
    {
      label: "Completed cases",
      value: stats.completed,
      change: "0%",
      icon: Briefcase,
      color: "text-green-500"
    },
    {
      label: "Pending Cases",
      value: stats.pending,
      sub: "0 deadlines approaching",
      icon: Briefcase,
      color: "text-yellow-500"
    },
    {
      label: "Total Meeting Hours",
      value: `${stats.meetingHours} minutes`,
      change: "0%",
      icon: Clock,
      color: "text-green-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, i) => (
        <Card key={i} className="p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{item.label}</p>
          <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
          <div className="flex items-center mt-2 text-xs">
            {item.change && (
              <span className={`flex items-center ${item.color} mr-2`}>
                {item.change.startsWith("+") ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {item.change}
              </span>
            )}
            <span className="text-gray-400">
              {item.sub || "since last month"}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};
