import Image from "next/image";

interface RoleCardProps {
  title: string;
  description: string;
  iconSrc: string;
  role: string;
  activeColor: string;
  onClick: () => void;
}
export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  iconSrc,
  role,
  activeColor,
  onClick
}) => (
  <div
    onClick={onClick}
    className={`relative cursor-pointer p-8 sm:p-10 bg-violet-50 rounded-3xl shadow-xl transition-all duration-300 transform hover:scale-[0.98] flex flex-col items-center text-center max-w-sm w-full`}
  >
    {/* placeholder for the top right radio buttion */}
    <div
      className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center`}
    >
      <div className="w-2 h-2 rounded-full bg-white"></div>
    </div>

    {/* Placeholder for Image Icon */}
    <div className="relative w-20 h-20 mb-6">
      <Image src={iconSrc} alt={title} fill className="object-contain" />
    </div>
    <h3
      className={`text-xl font-bold mt-4 mb-2 ${
        activeColor === "blue" ? "text-violet-700" : "text-[#7C3AED]"
      }`}
    >
      {title}
    </h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);
