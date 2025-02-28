import Image from "next/image";
import { FileIcon } from "lucide-react";

interface ResponseCellProps {
  value: string;
  type?: string;
}

export function ResponseCell({ value, type }: ResponseCellProps) {
  // Check if the value is a media URL (image or PDF)
  const isMediaUrl = value?.startsWith('https://utfs.io') || value?.startsWith('https://uploadthing.com');
  
  if (!isMediaUrl) {
    return <span className="text-sm text-gray-700">{value}</span>;
  }

  const isPDF = value?.toLowerCase().endsWith('.pdf');

  if (isPDF) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <FileIcon className="w-4 h-4" />
        <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
          View PDF
        </a>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="w-12 h-12 relative rounded-md overflow-hidden border border-gray-200">
        <Image
          src={value}
          alt="Uploaded image"
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
      <a 
        href={value} 
        target="_blank" 
        rel="noopener noreferrer"
        className="hidden group-hover:block absolute top-0 left-0 w-full h-full bg-black/50 text-white text-xs 
          flex items-center justify-center rounded-md"
      >
        View
      </a>
    </div>
  );
} 