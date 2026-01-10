import { CheckCircle } from "lucide-react";
import SignUpFormClient from "@/components/auth/client/SignUpForm";

const SignUpFormPage = () => {
  return (
    <div className="max-w-xl mx-auto ">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold mb-2">Welcome to</h1>
        <h2 className="text-3xl font-bold text-[#7C3AED] mb-6">
          Smart Law Office
        </h2>
      </header>

      {/* Role */}
      <div className="flex items-center text-lg font-medium text-gray-800 mb-6">
        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
        As a Client
      </div>

      {/* SignUpForm Admin */}
      <SignUpFormClient />
    </div>
  );
};
export default SignUpFormPage;
