// /components/dashboard/comms/CommsEmptyState.tsx
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCommsStore } from "@/store/adminCommsStore";

const CommsEmptyState = () => {
  const setView = useCommsStore((state) => state.setView);

  // For demonstration, clicking "Send a message" moves to the dashboard view
  const handleSendMessage = () => {
    setView("dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl text-center shadow-lg max-w-lg mx-auto min-h-[500px]">
      <MessageSquare className="h-16 w-16 text-violet-600 mb-4" />
      <h2 className="text-2xl font-semibold mb-3">Communications</h2>
      <p className="text-gray-800 mb-6 max-w-sm">
        Messages from clients and team members will appear here once you start a
        conversation.
      </p>
      <Button
        onClick={handleSendMessage}
        className="bg-violet-600 hover:bg-violet-700"
      >
        Send a message
      </Button>
    </div>
  );
};

export default CommsEmptyState;
