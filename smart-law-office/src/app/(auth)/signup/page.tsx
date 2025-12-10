import { CheckCircle } from "lucide-react";
import SignUpFormAdmin from "@/components/auth/signup-admin/SignupForm";

const SignUpFormPage = () => {
  return (
    <div className="flex flex-col h-full p-8 lg:p-16">
      <h1 className="text-3xl font-semibold mb-2">Welcome to</h1>
      <h2 className="text-3xl font-bold text-[#7C3AED] mb-6">
        Smart Law Office
      </h2>

      {/* Role */}
      <div className="flex items-center text-lg font-medium text-gray-800 mb-6">
        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
        As a Law Firm/Counsel
      </div>

      {/* SignUpForm Admin */}
      <SignUpFormAdmin />
    </div>
  );
};
export default SignUpFormPage;
