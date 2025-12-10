import React from "react";

export const Footer: React.FC = () => (
  <footer className="bg-violet-500 pt-16 pb-8 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-violet-800 pb-12">
        {/* Logo & Contact */}
        <div className="col-span-2 lg:col-span-2 space-y-3">
          <div className="text-xl font-bold tracking-widest">Logo</div>
          <p className="text-lg font-semibold">Smart Law Office</p>
          <p className="text-sm text-violet-200">+234 908 809 9848</p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h5 className="font-semibold uppercase text-violet-300 text-sm mb-4">
            Links
          </h5>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" className="hover:text-violet-400 transition">
                About
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-violet-400 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-400 transition">
                Resources
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-violet-400 transition">
                Pricing
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Information */}
        <div className="space-y-3">
          <h5 className="font-semibold uppercase text-violet-300 text-sm mb-4">
            Legal Information
          </h5>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-violet-400 transition">
                Privacy policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-400 transition">
                Terms of service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-400 transition">
                Contact us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="pt-8 text-center md:text-left">
        <p className="text-xs text-violet-200">
          © Smart Law Office. All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
);
