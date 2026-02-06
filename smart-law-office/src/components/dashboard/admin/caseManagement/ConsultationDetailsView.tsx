import { Button } from "@/components/ui/button";
import useConsultationStore from "@/store/consultationStore";
import { toast } from "sonner";

export const ConsultationDetailsView = ({ consult }: { consult: any }) => {
  // const { promoteToCase } = useConsultationStore();

  const handlePromotion = async () => {};

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Consultation Details</h2>
        <Button
          onClick={handlePromotion}
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none"
        >
          Convert to Case
        </Button>
      </div>

      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-md mb-6">
        <div>
          <p className="text-xs text-gray-500">Consultation ID</p>
          <p className="font-semibold">{consult.id}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Client name</p>
          <p className="font-semibold">{consult.clientName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
            Scheduled
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-500">Date</p>
          <p className="font-semibold">{consult.date}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Time</p>
          <p className="font-semibold">{consult.time}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Platform</p>
          <p className="font-semibold">{consult.platform}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold">Notes</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{consult.notes}</p>

        <h3 className="font-bold pt-4">Payment Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Bank Name</span>
            <span>United Bank for Africa</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Account Name</span>
            <span>Smart Law Office</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account Number</span>
            <span>3231324233</span>
          </div>
        </div>
      </div>
    </div>
  );
};
