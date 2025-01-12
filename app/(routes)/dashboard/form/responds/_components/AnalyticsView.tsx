"use client";

import React, { FC, useState, useMemo } from "react";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

type Props = {
  blocks: FormBlockInstance[];
  responses: {
    formId: number;
    id: number;
    createdAt: Date;
    jsonReponse: string;
  }[];
  visualizationType?: string;
};

const AnalyticsView: FC<Props> = ({ blocks, responses, visualizationType }) => {
  const analytics = useMemo(() => {
    // Get all childblocks from all blocks
    const allChildBlocks = blocks.flatMap(block => block.childblocks || []);
    
    // Create data map for each childblock
    const dataMap = allChildBlocks.reduce((acc, childblock) => {
      if (childblock) {
        acc[childblock.id.toLowerCase()] = {
          label: childblock.attributes?.label || "No label",
          type: childblock.blockType,
          data: []
        };
      }
      return acc;
    }, {} as Record<string, { label: string; type: string; data: any[] }>);

    
    // Process responses
    responses.forEach(response => {
      try {
        const parsedResponse = JSON.parse(response.jsonReponse);
        Object.entries(parsedResponse).forEach(([questionId, answer]) => {
          const lowerId = questionId.toLowerCase();
          if (dataMap[lowerId] && answer) {
            const answerStr = String(answer);
            const existingAnswer = dataMap[lowerId].data.find(
              d => d.name === answerStr
            );
            if (existingAnswer) {
              existingAnswer.value++;
            } else {
              dataMap[lowerId].data.push({
                name: answerStr,
                value: 1
              });
            }
          }
        });
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });

    return Object.entries(dataMap)
      .filter(([_, data]) => data.data.length > 0)
      .map(([id, data]) => ({
        questionId: id,
        ...data
      }));
  }, [blocks, responses]);

  if (analytics.length === 0) {
    return <div className="text-center p-4">No data available for visualization</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {analytics.map((question) => (
          <React.Fragment key={question.questionId}>
            {(!visualizationType || visualizationType === 'bar') && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-normal">
                    {question.label} - Bar Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={question.data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {visualizationType === 'pie' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-normal">
                    {question.label} - Pie Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={question.data}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value, percent }) => 
                            `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                          }
                        >
                          {question.data.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => [
                            `Responses: ${value}`,
                            `Option: ${name}`
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Legend 
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsView;
