import { FileText, MoreHorizontal, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const getFileIcon = (fileName: string = "") => {
  // Defensive check for undefined/null
  const isPdf = fileName?.toLowerCase().endsWith(".pdf");

  return (
    <div
      className={`p-2 rounded-lg ${isPdf ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
    >
      <FileText size={20} />
    </div>
  );
};

export const CaseDocuments = ({
  documents = [], // Default to empty array
  onUpload
}: {
  documents: any[];
  onUpload: () => void;
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Associated Documents</h3>
        <Button
          onClick={onUpload}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
        >
          <Plus size={18} /> Upload New
        </Button>
      </div>

      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-xl text-gray-400">
            No documents uploaded yet.
          </div>
        ) : (
          documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
            >
              <div className="flex items-center gap-4">
                {getFileIcon(doc.name)}
                <div className="max-w-[200px] md:max-w-md">
                  <p
                    className="font-semibold text-sm truncate"
                    title={doc.name}
                  >
                    {doc.name || "Untitled Document"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {doc.date || "Unknown Date"}{" "}
                    {doc.time ? `• ${doc.time}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <Button variant="ghost" size="icon">
                  <MoreHorizontal size={20} className="text-gray-400" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// import { FileText, FileVideo, MoreHorizontal, Plus } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const getFileIcon = (fileName: string) => {
//   if (fileName.endsWith(".pdf"))
//     return (
//       <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
//         <FileText size={20} />
//       </div>
//     );
//   return (
//     <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
//       <FileText size={20} />
//     </div>
//   );
// };

// export const CaseDocuments = ({
//   documents,
//   onUpload
// }: {
//   documents: any[];
//   onUpload: () => void;
// }) => {
//   return (
//     <div className="bg-white rounded-xl p-6 shadow-sm border mt-6">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="font-bold text-lg">Associated Documents</h3>
//         <Button
//           onClick={onUpload}
//           className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
//         >
//           <Plus size={18} /> Upload New
//         </Button>
//       </div>

//       <div className="space-y-4">
//         {documents.map((doc, index) => (
//           <div
//             key={index}
//             className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
//           >
//             <div className="flex items-center gap-4">
//               {getFileIcon(doc.name)}
//               <div>
//                 <p className="font-semibold text-sm">{doc.name}</p>
//                 <p className="text-xs text-gray-400">
//                   {doc.date}, {doc.time || "02:30 PM"}
//                 </p>
//               </div>
//             </div>
//             <Button variant="ghost" size="icon">
//               <MoreHorizontal size={20} className="text-gray-400" />
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
