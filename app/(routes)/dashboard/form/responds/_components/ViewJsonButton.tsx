"use client";

import { Button } from "@/components/ui/button";
import { FormBlockInstance } from "@/@types/form-block.type";
import { FileJson } from "lucide-react";
import * as XLSX from "xlsx";

interface ViewJsonButtonProps {
  responses: {
    id: number;
    formId: number;
    createdAt: Date;
    jsonReponse: string;
  }[];
  blocks: FormBlockInstance[];
}

const ViewJsonButton = ({ responses, blocks }: ViewJsonButtonProps) => {
  const handleViewJson = () => {
    const formattedResponses = responses.map((response) => {
      const parsedResponse = JSON.parse(response.jsonReponse);
      return {
        id: response.id,
        submittedAt: new Date(response.createdAt).toLocaleString(),
        ...Object.entries(parsedResponse).reduce((acc, [key, value]) => {
          const question = blocks
            .flatMap((block) => block.childblocks || [])
            .find((childblock) => childblock?.id === key)?.attributes?.label || "Unknown Question";
          
          acc[question] = value;
          return acc;
        }, {} as Record<string, any>)
      };
    });

    // Create Excel workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedResponses);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Form Responses");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, `form_responses_${new Date().toISOString()}.xlsx`);
  };

  return (
    <Button
      onClick={handleViewJson}
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileJson className="w-4 h-4" />
      Export to Excel
    </Button>
  );
};

export default ViewJsonButton;