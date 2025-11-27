import React from "react";

const FeatureCard: React.FC<{
  number: number;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <div className="bg-violet-50 p-8 rounded-2xl shadow-xl flex flex-col h-full text-left">
    <div className="w-10 h-10 flex items-center justify-center border-solid rounded-sm border-2 border-violet-300 text-violet-700 text-lg font-bold mb-4 shadow-md">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-violet-700 mb-3">{title}</h3>
    <p className="text-black text-base grow">{description}</p>
  </div>
);

export const FeaturesSection: React.FC = () => (
  <section
    id="features"
    className="pt-40 md:pt-64 lg:pt-32 pb-20 md:pb-32 bg-linear-to-b from-gray-200 via-slate-100 to-violet-100"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center">
      <div className="inline-block mb-6">
        <span className="px-4 py-2 bg-violet-100 border-2 border-violet-300 rounded-full text-sm uppercase tracking-wider text-black mb-2">
          What you gain
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold mb-2 text-black tracking-widest">
        Features
      </h2>
      <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        A unified platform that empowers law firm to manage operations, counsels
        to work efficiently, and clients to access legal services with ease
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          number={1}
          title="As Client"
          description="Manage consultations, documents, case updates, and payments, all from your personalized client dashboard."
        />
        <FeatureCard
          number={2}
          title="As Counsel"
          description="Manage assigned cases, notes, documents, and communication in one secure, counsel dashboard."
        />
        <FeatureCard
          number={3}
          title="As Law Firm"
          description="Set up your smart law office, customise your brand, onboard counsel, and manage all cases and clients from one unified workspace."
        />
      </div>
    </div>
  </section>
);
