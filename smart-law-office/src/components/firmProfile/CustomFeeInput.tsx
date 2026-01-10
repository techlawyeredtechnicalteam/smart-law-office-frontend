import { Label } from "@radix-ui/react-label";
import { FirmProfileData } from "@/store/firmProfileStore";
import { Input } from "../ui/input";

// sub - component (CustomFeeInput and Toggle) for Step 3
interface CustomFeeInputProps {
  customFeeAmount: number | null;
  updateFormData: (data: Partial<FirmProfileData>) => void;
}

export const CustomFeeInput: React.FC<CustomFeeInputProps> = ({
  customFeeAmount,
  updateFormData
}) => (
  <div className="pt-2 space-y-2">
    <Label
      htmlFor="customFeeAmount"
      className="text-base font-semibold text-gray-600"
    >
      Amount
    </Label>
    <div className="relative">
      <Input
        id="customFeeAmount"
        type="text"
        placeholder="E.g 20,000"
        value={customFeeAmount || ""}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9.]/g, "");
          const numValue = parseFloat(value) || 0;
          updateFormData({ customFeeAmount: numValue });
        }}
        className="pr-10"
      />
      {customFeeAmount && (
        <span className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2">
          &#8358;
        </span>
      )}
    </div>
    <p className="text-xs text-gray-500 mt-2">
      All other fees will be in line with the Legal Practitioners Remuneration
      Act 2023.
    </p>
  </div>
);
