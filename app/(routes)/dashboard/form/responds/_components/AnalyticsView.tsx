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

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9FA8DA'];

type Props = {
  blocks: FormBlockInstance[];
  responses: {
    formId: number;
    id: number;
    createdAt: Date;
    jsonReponse: string;
  }[];
};

const AnalyticsView: FC<Props> = ({ blocks, responses }) => {
  const analytics = useMemo(() => {
    const childblockMap = blocks
      .flatMap((block) => block.childblocks || [])
      .reduce((acc, childblock) => {
        if (childblock) {
          acc[childblock.id] = {
            label: childblock?.attributes?.label || "No label",
            type: childblock?.blockType,
            data: []
          };
        }
        return acc;
      }, {} as Record<string, { label: string; type: string; data: any[] }>);

    responses.forEach(response => {
      const parsedResponse = JSON.parse(response.jsonReponse);
      Object.entries(parsedResponse).forEach(([questionId, answer]) => {
        if (childblockMap[questionId]) {
          const existingAnswer = childblockMap[questionId].data.find(
            d => d.name === answer
          );
          if (existingAnswer) {
            existingAnswer.value++;
          } else {
            childblockMap[questionId].data.push({
              name: answer as string,
              value: 1
            });
          }
        }
      });
    });

    return Object.entries(childblockMap).map(([id, data]) => ({
      questionId: id,
      ...data,
    }));
  }, [blocks, responses]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analytics.map((question) => (
          <React.Fragment key={question.questionId}>
            {/* Bar Chart Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-normal">
                  {question.label} - Bar Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={question.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-normal">
                  {question.label} - Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={question.data}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({name, percent}) => 
                          `${name}: ${(percent * 100).toFixed(0)}%`
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
                        formatter={(value) => [value, 'Responses']}
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-muted-foreground">Total Responses</p>
                    <p className="text-lg font-bold">
                      {question.data.reduce((acc, curr) => acc + curr.value, 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Unique Answers</p>
                    <p className="text-lg font-bold">{question.data.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsView;
