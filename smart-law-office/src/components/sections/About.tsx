import { Check, ChevronRight, FileText, Upload } from "lucide-react";
import { Button } from "../ui/button";
import { DocumentCardMockup } from "../data/associatedDocument";

const AssociatedDocument: React.FC = () => (
  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition duration-150 hover:shadow-md backdrop-blur-md cursor-pointer">
    <FileText className="w-5 h-5 text-violet-600" />
    <div>
      <p className="text-sm font-medium text-gray-800">
        Client_Intake_form.pdf
      </p>
      <p className="text-xs text-gray-500">Sept 05,2025, 02:30 PM</p>
      <div>
        <p className="text-sm font-medium text-gray-800">
          Client_Intake_form.pdf
        </p>
        <p className="text-xs text-gray-500">Sept 05,2025, 02:30 PM</p>
      </div>
    </div>
  </div>
);

const MonthlyFinancialOverview: React.FC = () => (
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

export const AboutSection: React.FC = () => (
  <section
    id="about"
    className="pt-40 md:pt-64 lg:pt-32 pb-20 md:pb-32 bg-linear-to-b from-gray-200 via-slate-100 to-violet-100"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-y-12 lg:gap-x-24 items-center">
      {/* Left Column: Mockups */}
      <div className="relative p-4 order-2 lg:order-1 flex flex-col items-center mb-8 lg:mb-0 lg:pb-48 lg:pt-2">
        {/* Associated Documents*/}
        <DocumentCardMockup showButton={true} />

        {/* Monthly Financial Overview: Adjusted lg:top to ensure proper overlap distance */}
        <div className="relative z-0 max-w-sm w-full lg:absolute lg:top-56 lg:left-1/2 lg:-translate-x-1/4">
          <MonthlyFinancialOverview />
        </div>
      </div>

      {/* Right Column: Text */}
      <div className="order-1 lg:order-2">
        <div className="max-w-xl">
          <div className="inline-block mb-6">
            <span className="px-6 py-2 bg-violet-50 border-2 border-violet-300 rounded-full text-sm font-bold uppercase tracking-wider text-violet-400 mb-2">
              Empowering Legal Practice
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">About us</h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
            Smart Law Office combines legal expertise and technology to deliver
            a complete virtual practice solution. We help firms digitize
            operations while maintaining compliance, professionalism, and
            top-tier service delivery.
          </p>
        </div>
      </div>
    </div>
  </section>
);
