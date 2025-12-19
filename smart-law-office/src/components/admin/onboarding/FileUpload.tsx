"use client";

import React from "react";

interface FileUploadProps {
  id: string;
  label: string;
  fileData: string | null;
  fileName?: string | null;
  onFileChange: (
    fileData: string | null,
    fileName: string | null,
    fileSize: number
  ) => void;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  fileData,
  fileName: propFileName,
  onFileChange,
  maxSize = 5
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [localFileName, setLocalFileName] = React.useState<string | null>(
    propFileName || null
  );
  const [localFileSize, setLocalFileSize] = React.useState<number>(0);

  const displayFileName = localFileName || "Choose Image";
  const displayFileSize = localFileSize
    ? `${(localFileSize / 1024).toFixed(0)} KB`
    : "PNG, JPG. Up to 5MB";
  const isUploaded = !!fileData;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (selectedFile) {
      // Validate file size
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        setError(`File size must be less than ${maxSize}MB`);
        onFileChange(null, null, 0);
        return;
      }

      // convert file to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLocalFileName(selectedFile.name);
        setLocalFileSize(selectedFile.size);
        onFileChange(base64String, selectedFile.name, selectedFile.size);
      };
      reader.onerror = () => {
        setError("Error reading file");
        onFileChange(null, null, 0);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[${TEXT_COLOR}]">
        {label}
      </label>
      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
        <div className="flex flex-col text-sm truncate">
          <span className="font-medium text-gray-800">{displayFileName}</span>
          <span className="text-xs text-gray-500">{localFileSize}</span>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            id={id}
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            className={`px-4 py-2 text-sm rounded-lg ${
              isUploaded
                ? "bg-violet-600 text-[#374151] hover:bg-[#EAE7FF]"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {isUploaded ? "Change" : "Browse files"}
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
