// Triggers a browser fownload for a base 64 file string

export const handleDownload = (
  base64Data: string | undefined,
  fileName: string
) => {
  if (!base64Data) {
    console.error("No file data available to download");
    return;
  }

  try {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
