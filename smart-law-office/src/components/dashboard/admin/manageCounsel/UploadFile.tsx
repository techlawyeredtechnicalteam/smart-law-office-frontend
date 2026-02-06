import { Button } from "@/components/ui/button";

interface FileUploadProps {
  label: string;
  onChange: (fileName: string | null) => void;
  file: string | null;
}
export const UploadFile: React.FC<FileUploadProps> = ({
  label,
  onChange,
  file
}) => (
  <div className="space-y-2">
    <label>{label}</label>
    <div className="flex items-center space-x-2">
      <div className="flex-1 p-2 border rounded-md bg-gray-50 text-sm truncate">
        {file || "PNG, JPG. Up to 5MB"}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const fileName = prompt("Enter file name (e.g., 'certificate.png'):");
          onChange(fileName);
        }}
      >
        Browse files
      </Button>
    </div>
  </div>
);
