"use client";

import React from "react";
import { Button } from "../ui/button";

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
  accept?: string;
  fileTypeInfo?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  id,
  label,
  fileData,
  fileName: propFileName,
  onFileChange,
  maxSize = 5,
  accept = "image/*,.pdf",
  fileTypeInfo = `PNG, JPG, PDF. Up to ${maxSize}MB`
}) => {
  const [error, setError] = React.useState<string | null>(null);
  const [localFileName, setLocalFileName] = React.useState<string | null>(
    propFileName || null
  );
  // store file size locally for display
  const [localFileSize, setLocalFileSize] = React.useState<number>(0);

  const displayFileName = localFileName || "Choose file";

  const displayFileSize =
    localFileSize > 0
      ? localFileSize > 1024 * 1024
        ? `${(localFileSize / 1024).toFixed(1)} KB`
        : `${(localFileSize / (1024 * 1024)).toFixed(1)} MB`
      : fileTypeInfo;

  const isUploaded = !!fileData;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (selectedFile) {
      // validate file type based on the 'accept prop
      const acceptedTypes = accept
        .split(",")
        .map((m) => m.trim().toLowerCase());
      let isValidType = false;

      // Handle wildcards in image types
      if (
        accept.includes("image/*") &&
        selectedFile.type.startsWith("image/")
      ) {
        isValidType = true;
      } else if (
        acceptedTypes.includes(selectedFile.type.toLowerCase()) ||
        acceptedTypes.includes(
          `.${selectedFile.name.split(".").pop()?.toLowerCase()}`
        )
      ) {
        // Handle specific types
        isValidType = true;
      }

      if (!isValidType && !accept.includes("*/*")) {
        setError(`Invalid file type. Only ${accept} files are allowed.`);
        onFileChange(null, null, 0);
        e.target.value = "";
      }

      // Validate file size
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        setError(`File size must be less than ${maxSize}MB`);
        onFileChange(null, null, 0);
        e.target.value = ""; // Reset File input
        return;
      }

      // convert file to base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLocalFileName(selectedFile.name);
        setLocalFileSize(selectedFile.size);
        // pass the base 64 string, name, and size to the parent component
        onFileChange(base64String, selectedFile.name, selectedFile.size);
      };
      reader.onerror = () => {
        setError("Error reading file");
        onFileChange(null, null, 0);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // if file input is cleared
      setLocalFileName(null);
      setLocalFileSize(0);
      onFileChange(null, null, 0);
    }
  };

  // Logic to remove file
  const removeFile = () => {
    setLocalFileName(null);
    setLocalFileSize(0);
    setError(null);
    onFileChange(null, null, 0);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[${TEXT_COLOR}]">
        {label}
      </label>
      <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
        <div className="flex flex-col text-sm truncate">
          <span className="font-medium text-gray-800">{displayFileName}</span>
          <span className="text-xs text-gray-500">{displayFileSize}</span>
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            id={id}
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            className={`px-4 py-2 text-sm rounded-lg ${
              isUploaded
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {isUploaded ? "Change" : "Browse files"}
            {isUploaded && (
              <Button
                variant="ghost"
                onClick={removeFile}
                className="ml-2 p-1 h-auto text-red-500 hover:text-red-700"
              >
                &times;
              </Button>
            )}
          </div>
        </label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
