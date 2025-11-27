import {
  Bell,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Folder,
  Heart,
  Lock,
  MessageSquare,
  Search,
  Shield
} from "lucide-react";
import React from "react";
import { SidebarLink, StatCard, TableRow } from "./DashboardComponent";
import { Button } from "../ui/button";

const HeroDashboard: React.FC = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto -mb-48 md:-mb-24 lg:-mb-12 p-2 sm:p-4 perspecttive-1000">
      {/* Contantainer with shadow and sliite 3D perspective */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-violet-900/50 overflow-hidden lg:flex transform scale-[0.7] sm:scale-75 md:scale-90 lg:scale-100 transition-transform duration-500 ease-in-out">
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 bg-violet-800 p-6 hidden sm:block">
          <div className="flex items-center space-x-2 mb-8">
            <Briefcase className="text-white w-6 h-6" />
            <span className="text-white text-lg font-bold">
              Smart Law Office
            </span>
          </div>
          <div className="mb-8 p-3 bg-violet-700/50 rounded-xl flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-violet-800 font-bold text-lg">C</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Christine Adesso
              </p>
              <p className="text-xs text-violet-200">View Profile</p>
            </div>
            <ChevronDown className="w-4 h-4 text-violet-200 ml-auto" />
          </div>

          <nav className="space-y-2">
            <SidebarLink
              icon={<Folder className="w-5 h-5" />}
              text="Overview"
              active
            />
            <SidebarLink
              icon={<Heart className="w-5 h-5" />}
              text="Case management"
            />
            <SidebarLink
              icon={<DollarSign className="w-5 h-5" />}
              text="Billing & Payment"
            />
            <SidebarLink
              icon={<MessageSquare className="w-5 h-5" />}
              text="Communications"
            />
            <div className="pt-4 border-t border-violet-700 mt-4">
              <SidebarLink
                icon={<Shield className="w-5 h-5" />}
                text="Support"
              />
            </div>
          </nav>

          <div className="mt-12 space-y-2 text-violet-200 text-xs">
            <a
              href="#"
              className="flex items-center space-x-2 hover:text-white"
            >
              <Lock className="w-4 h-4" />
              <span>Privacy Policy</span>
            </a>
            <a
              href="#"
              className="flex items-center space-x-2 hover:text-white"
            >
              <FileText className="w-4 h-4" />
              <span>Terms and Conditions</span>
            </a>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-6 lg:p-8 bg-gray-50">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-gray-500 hidden sm:block">
                Welcome back,{" "}
                <span className="font-semibold text-gray-800">Christine</span>
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Monday, 8th November 2025</span>
                <Clock className="w-4 h-4 ml-4 mr-2" />
                <span>10:00 AM</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-violet-500 focus:border-violet-500 w-40"
                />
              </div>
              <Bell className="w-5 h-5 text-gray-400 hover:text-violet-600 cursor-pointer" />
              <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold">
                C
              </div>
            </div>
          </div>

          {/* Case Management Overview */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Case Management
              </h2>
              <Button
                variant="default"
                className="py-2 px-4 text-sm hidden sm:flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Create</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <StatCard
                title="Total Cases"
                value="84"
                subtext="+0.7% since last month"
                color="text-violet-600"
              />
              <StatCard
                title="Completed cases"
                value="56"
                subtext="+4 in last 30 days"
                color="text-green-600"
              />
              <StatCard
                title="Pending Cases"
                value="28"
                subtext="-3 due to deadline approaching"
                color="text-orange-600"
              />
              <StatCard
                title="Total Meeting Hours"
                value="335"
                subtext="+55 hours in last 30 days"
                color="text-blue-600"
              />
            </div>
          </div>

          {/* Consultations Table */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Consultations
              </h3>
              <a
                href="#"
                className="text-sm text-violet-600 font-medium flex items-center"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50">
                    <th className="py-3 px-4 text-left">Consultation ID</th>
                    <th className="py-3 px-4 text-left">Client Name</th>
                    <th className="py-3 px-4 text-left">Case Type</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Meeting</th>
                    <th className="py-3 px-4 text-left">Notes</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <TableRow
                    id="#2025-0022"
                    client="Amara Sullivan"
                    type="Family Law"
                    status="Scheduled"
                    date="2025-09-11"
                    time="09:00 AM"
                    notes="Consultation for Divorce proceedings."
                  />
                  <TableRow
                    id="#2025-0021"
                    client="Derrick Bankole"
                    type="Property Law"
                    status="Scheduled"
                    date="2025-09-11"
                    time="10:00 AM"
                    notes="Review Needed"
                  />
                  <TableRow
                    id="#2025-0020"
                    client="Jared Chukwunale"
                    type="Real Estate"
                    status="Scheduled"
                    date="2025-09-11"
                    time="11:00 AM"
                    notes="Property Dispute Resolution"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Cases Table */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Cases</h3>
              <a
                href="#"
                className="text-sm text-violet-600 font-medium flex items-center"
              >
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
            <div className="overflow-x-auto max-h-48">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50">
                    <th className="py-3 px-4 text-left">Case ID</th>
                    <th className="py-3 px-4 text-left">Client Name</th>
                    <th className="py-3 px-4 text-left">Case Type</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Document</th>
                    <th className="py-3 px-4 text-left">Notes</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <TableRow
                    id="#2025-0012"
                    client="Amara Sullivan"
                    type="Family Law"
                    status="Scheduled"
                    date="Payment_invc.pdf"
                    time="-"
                    notes="Consultation for divorce proceedings"
                  />
                  <TableRow
                    id="#2025-0011"
                    client="Tayo Adesina"
                    type="Corporate"
                    status="Pending"
                    date="NDA_doc.pdf"
                    time="-"
                    notes="Contract drafting review"
                  />
                  <TableRow
                    id="#2025-0010"
                    client="Emeka Obiora"
                    type="Criminal"
                    status="Completed"
                    date="Court_summary.pdf"
                    time="-"
                    notes="Sentencing review"
                  />
                  <TableRow
                    id="#2025-0009"
                    client="Nneka Udo"
                    type="IP Law"
                    status="Scheduled"
                    date="Trademark_app.pdf"
                    time="-"
                    notes="Trademark application filing"
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
