import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";

export const SidebarLink: React.FC<{
  icon: React.ReactNode;
  text: string;
  active?: boolean;
}> = ({ icon, text, active = false }) => (
  <Link
    href="#"
    className={`flex items-center space-x-3 p-3 rounded-xl transition duration-150 ${
      active
        ? "bg-violet-700 text-shadow-md"
        : "text-violet-200 hover:bg-violet-600"
    }`}
  >
    <span className="font-medium text-sm"> {text}</span>
  </Link>
);

export const StatCard: React.FC<{
  title: string;
  value: string;
  subtext: string;
  color: string;
}> = ({ title, value, subtext, color }) => (
  <div className="p-4 bg-gray-50 rounded-xl border-gray-200 minw-[120px]">
    <p className="text-xs font-medium text-gray-500">{title}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 mt-1">{subtext}</p>
  </div>
);

export const TableRow: React.FC<{
  id: string;
  client: string;
  type: string;
  status: string;
  date: string;
  notes: string;
  time: string;
}> = ({ id, client, type, status, date, time, notes }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 text-sm">
    <td className="py-3 px-4 font-semibold text-gray-800">{id}</td>
    <td className="py-3 px-4 text-gray-600">{client}</td>
    <td className="py-3 px-4 text-gray-600">{type}</td>
    <td className="py-3 px-4 ">
      <span
        className={`text-xs font-medium px-3 py-1 rounded-full ${
          status === "Scheduled"
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {status}
      </span>
    </td>
    <td className="py-3 px-4 text-gray-600">
      <span className="block">{date}</span>
      <span className="text-xs text-gray-400">{time}</span>
    </td>
    <td className="py-3 px-4 text-gray-600 max-w-[200px] truncate">{notes}</td>
    <td className="py-3 px-4 text-gray-400">
      <Edit size={16} />
    </td>
  </tr>
);
