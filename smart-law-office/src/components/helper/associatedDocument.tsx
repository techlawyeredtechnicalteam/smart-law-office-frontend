import { ChevronRight, FileText, Upload } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface DocumentCardMockupProps {
  showButton?: boolean;
}
export const DocumentCardMockup: React.FC<DocumentCardMockupProps> = ({
  showButton = true
}) => (
  <div className="p-6 bg-white/10 rounded-xl shadow-2xl border border-white/50 min-w-[300px] backdrop-blur-sm text-left">
    <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-4 flex items-center justify-between">
      <span>Associated Documents</span>

      {showButton && (
        <Button
          variant="default"
          className="p-2 h-auto text-xs font-normal text-white flex items-center bg-violet-600 hover:bg-violet-700"
        >
          <Upload className="w-3 h-3 mr-1" /> Upload New
        </Button>
      )}
    </h3>

    {/* List Container */}
    <div className="space-y-4 bg-white p-3 rounded-lg">
      {/* Document Item 1 */}
      <div className="flex items-start space-x-3 group cursor-pointer">
        {/* Icon with its own small background */}
        <div className="p-2 bg-violet-100/50 rounded-lg shrink-0">
          <FileText className="w-5 h-5 text-violet-600" />
        </div>
        {/* Text Content */}
        <div className="grow min-w-0">
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-gray-900 truncate pr-2">
              Client_intake_form.pdf
            </p>
            <span className="text-gray-400 text-xs leading-5">...</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Sept. 05, 2025, 02:30 PM
          </p>
        </div>
      </div>

      {/* Document Item 2 */}
      <div className="flex items-start space-x-3 group cursor-pointer">
        {/* Icon with its own small background */}
        <div className="p-2 bg-violet-100/50 rounded-lg shrink-0">
          <FileText className="w-5 h-5 text-violet-600" />
        </div>
        {/* Text Content */}
        <div className="grow min-w-0">
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-gray-900 truncate pr-2">
              Previous case notes.docx
            </p>
            <span className="text-gray-400 text-xs leading-5">...</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Sept. 05, 2025, 02:30 PM
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const MonthlyFinancialOverview: React.FC = () => (
  <div className="p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h4 className="text-sm font-semibold text-gray-800">
        Monthly Financial Overview
      </h4>
      <a
        href="#"
        className="text-xs text-violet-600 font-medium flex items-center"
      >
        Generate Report <ChevronRight className="w-3 h-3 ml-1" />
      </a>
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-2">₦44,000</p>
    <p className="text-xs text-green-500 mb-6">▲ 2.5% in the last 6 months</p>

    <div className="flex justify-between space-x-4 h-24 items-end">
      <div className="text-center">
        <div className="h-16 w-8 bg-violet-200 rounded-lg mx-auto"></div>
        <p className="text-xs text-gray-500 mt-2">Jan</p>
      </div>
      <div className="text-center">
        <div className="h-12 w-8 bg-violet-200 rounded-lg mx-auto"></div>
        <p className="text-xs text-gray-500 mt-2">Feb</p>
      </div>
      <div className="text-center">
        <div className="h-20 w-8 bg-violet-600 rounded-lg mx-auto shadow-lg"></div>
        <p className="text-xs text-gray-500 mt-2">Mar</p>
      </div>
    </div>
  </div>
);
