import { format } from "date-fns";

interface ResponseCellProps {
  value: any;
  type?: string;
}

export function ResponseCell({ value, type }: ResponseCellProps) {
  if (!value) return <span>-</span>;

  // Check if the value is a media URL
  const isMediaUrl = value?.startsWith('https://utfs.io') || value?.startsWith('https://uploadthing.com');
  
  if (isMediaUrl) {
    const isImage = value.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    if (isImage) {
      return (
        <img 
          src={value} 
          alt="Response media" 
          className="max-w-[100px] max-h-[100px] object-cover rounded-md"
        />
      );
    }
    return (
      <a 
        href={value} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        View File
      </a>
    );
  }

  // Handle Calendar type
  if (type === 'Calendar') {
    try {
      const date = new Date(value);
      return <span>{format(date, 'PPP')}</span>;
    } catch {
      return <span>{value}</span>;
    }
  }

  // Default case
  return <span>{value}</span>;
} 