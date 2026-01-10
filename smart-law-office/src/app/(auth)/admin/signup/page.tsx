import { CheckCircle } from "lucide-react";
import SignUpFormAdmin from "@/components/auth/admin/SignupForm";

const SignUpFormPage = () => {
  return (
    <div className="max-w-xl mx-auto py-10">
      {/* New Header Section */}
      <header className="space-y-2">
        <h1 className="text-3xl font-light">
          Welcome to <br />
          <span className="text-3xl font-bold text-[#7C3AED]">
            Smart Law Office
          </span>
        </h1>
        <div className="flex items-center text-lg font-medium text-gray-700">
          <CheckCircle className="w-5 h-5 mr-2 text-[#7C3AED]" />
          As a Firm/Counsel
        </div>
      </header>
      {/* SignUpForm Admin */}
      <SignUpFormAdmin />
    </div>
  );
};
export default SignUpFormPage;
