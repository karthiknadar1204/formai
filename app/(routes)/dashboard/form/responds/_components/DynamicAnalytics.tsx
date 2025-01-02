"use client";

import React, { useState } from "react";
import { FormBlockInstance } from "@/@types/form-block.type";
import VisualizationSelector from "./VisualizationSelector";
import AnalyticsView from "./AnalyticsView";

type Props = {
  blocks: FormBlockInstance[];
  responses: {
    formId: number;
    id: number;
    createdAt: Date;
    jsonReponse: string;
  }[];
};

const DynamicAnalytics: React.FC<Props> = ({ blocks, responses }) => {
  const [selectedConfig, setSelectedConfig] = useState<{
    questionId: string;
    visualType: string;
  } | null>(null);

  const handleVisualizationSelect = (questionId: string, visualType: string) => {
    setSelectedConfig({ questionId, visualType });
  };

  return (
    <div className="space-y-6">
      <VisualizationSelector 
        blocks={blocks} 
        onSelect={handleVisualizationSelect} 
      />
      
      {selectedConfig && (
        <AnalyticsView 
          blocks={blocks.map(block => ({
            ...block,
            childblocks: block.childblocks?.filter(
              child => child.id === selectedConfig.questionId
            )
          }))}
          responses={responses}
          visualizationType={selectedConfig.visualType}
        />
      )}
    </div>
  );
};

export default DynamicAnalytics; 