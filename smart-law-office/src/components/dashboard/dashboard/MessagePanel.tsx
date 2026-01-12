import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, MessageSquare } from "lucide-react";

// Mock data for messages
const mockMessages = [
  {
    name: "Jane Francis",
    type: "Client",
    time: "7:45 PM",
    text: "Please update the status of case ID 2025-0012"
  },
  {
    name: "Ruth Ananah",
    type: "Staff",
    time: "7:45 PM",
    text: "Please update the status of case ID 2025-0012"
  }
];

export function MessagesPanel() {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-violet-600" />
          <span>Messages</span>
        </CardTitle>
        <span className="text-sm text-violet-600 font-medium cursor-pointer">
          View All
        </span>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-gray-100">
        {mockMessages.map((msg, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {/* Placeholder for user image/avatar */}
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <div className="font-medium">
                  {msg.name}{" "}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    ({msg.type})
                  </span>
                </div>
                <p className="text-sm text-gray-700">{msg.text}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400">{msg.time}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
