import { Briefcase } from "lucide-react";
import React from "react";
import { TbDashboard } from "react-icons/tb";

const StaffDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-20 bg-purple-50 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
      {/* Icon */}
      <TbDashboard className="h-16 w-16 text-purple-600 mb-4" />
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-3">Dashboard</h2>
      {/* Descritption */}
      <p className="text-gray-500 mb-8 max-w-sm">
        No activity recorded. Start adding cases, documents, or tasks and your
        dashboard will update in real time.
      </p>
    </div>
  );
};

export default StaffDashboard;
