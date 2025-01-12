"use client";

import React, { useState } from "react";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  blocks: FormBlockInstance[];
  onSelect: (questionId: string, visualType: string) => void;
};

const VISUALIZATION_TYPES = [
  { id: 'pie', label: 'Pie Chart', supportedTypes: ['RadioSelect', 'StarRating', 'Select'] },
  { id: 'bar', label: 'Bar Chart', supportedTypes: ['RadioSelect', 'StarRating', 'Select'] },
  { id: 'line', label: 'Line Chart', supportedTypes: ['TextField', 'TextArea', 'NumberField', 'EmailField'] },
  { id: 'area', label: 'Area Chart', supportedTypes: ['TextField', 'TextArea', 'NumberField', 'EmailField'] },
  { id: 'radar', label: 'Radar Chart', supportedTypes: ['RadioSelect', 'StarRating', 'Select'] },
  { id: 'funnel', label: 'Funnel Chart', supportedTypes: ['RadioSelect', 'StarRating', 'Select'] }
];

const VisualizationSelector: React.FC<Props> = ({ blocks, onSelect }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [selectedVisualization, setSelectedVisualization] = useState<string>("");

  const questions = blocks.flatMap((block) => block.childblocks || [])
    .filter(block => block?.attributes?.label);

  const getAvailableVisualizations = (blockType: string) => {
    return VISUALIZATION_TYPES.filter(type => 
      type.supportedTypes.includes(blockType)
    );
  };

  const handleSubmit = () => {
    if (selectedQuestion && selectedVisualization) {
      onSelect(selectedQuestion, selectedVisualization);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Visualization Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Question</label>
            <Select
              value={selectedQuestion}
              onValueChange={(value) => {
                setSelectedQuestion(value);
                setSelectedVisualization(""); // Reset visualization when question changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a question" />
              </SelectTrigger>
              <SelectContent>
                {questions.map((question) => (
                  <SelectItem key={question.id} value={question.id}>
                    {question.attributes?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedQuestion && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Visualization</label>
              <Select
                value={selectedVisualization}
                onValueChange={setSelectedVisualization}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose visualization type" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableVisualizations(
                    questions.find(q => q.id === selectedQuestion)?.blockType || ""
                  ).map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-end">
            <Button 
              onClick={handleSubmit}
              disabled={!selectedQuestion || !selectedVisualization}
              className="w-full"
            >
              Generate Visualization
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualizationSelector; 