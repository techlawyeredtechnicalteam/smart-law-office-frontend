import { Copy } from "lucide-react";
import { toast } from "sonner";

export const PaymentDetails = ({ bankInfo }: { bankInfo: any }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Account number copied!");
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border mt-6">
      <h3 className="font-bold text-lg mb-4">Payment Details</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">Bank Name</span>
          <span className="text-sm font-medium">
            {bankInfo.bankName || "United Bank for Africa"}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-sm text-gray-500">Account Name</span>
          <span className="text-sm font-medium">
            {bankInfo.accountName || "Smart Law Office"}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-gray-500">Account Number</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {bankInfo.accountNumber || "3231324233"}
            </span>
            <button
              aria-label="Account Number button"
              onClick={() =>
                copyToClipboard(bankInfo.accountNumber || "3231324233")
              }
              className="text-gray-400 hover:text-purple-600 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
