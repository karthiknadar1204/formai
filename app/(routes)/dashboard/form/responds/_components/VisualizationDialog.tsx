import React, { useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalyticsView from './AnalyticsView';
import { Card, CardContent } from '@/components/ui/card';
import { FormBlockInstance } from '@/@types/form-block.type';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  visualizationOptions?: {
    type: "numeric" | "graphical";
    graphType?: string;
    questions: Array<{
      id: string;
      visualType: string;
    }>;
  };
  message?: string;
}

interface VisualizationDialogProps {
  message: Message;
  onClose: () => void;
  blocks: FormBlockInstance[];
  responses: any[];
}

// Define a type that ensures childblocks is non-undefined
interface ProcessedFormBlock extends FormBlockInstance {
  childblocks: FormBlockInstance[];
}

export const VisualizationDialog: React.FC<VisualizationDialogProps> = ({
  message,
  onClose,
  blocks = [],
  responses = []
}) => {
  const filteredBlocks = useMemo(() => {
    console.log('Blocks structure:', JSON.stringify(blocks, null, 2));
    console.log('Looking for question:', message.visualizationOptions?.questions[0]?.id);
    
    if (!blocks || !message.visualizationOptions?.questions) {
      console.log('No blocks or questions found');
      return [];
    }
    
    return blocks.map(block => {
      // Check if childblocks exists and has items
      if (Array.isArray(block.childblocks) && block.childblocks.length > 0) {
        const matchingChildren = block.childblocks.filter(child =>
          message.visualizationOptions?.questions.some(q => {
            const match = child.attributes?.label?.toLowerCase() === q.id.toLowerCase();
            console.log('Checking label match:', child.attributes?.label, 'with', q.id);
            return match;
          })
        );
        
        if (matchingChildren.length > 0) {
          return {
            ...block,
            childblocks: matchingChildren
          } as ProcessedFormBlock;
        }
      }
      
      return null;
    }).filter((block): block is ProcessedFormBlock => block !== null);
    
  }, [blocks, message.visualizationOptions]);

  if (!filteredBlocks || filteredBlocks.length === 0) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader className="flex items-center justify-between flex-row">
            <DialogTitle>Visualization Results</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">No data available for visualization</p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader className="flex items-center justify-between flex-row">
          <DialogTitle>Visualization Results</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnalyticsView
            blocks={filteredBlocks}
            responses={responses}
            visualizationType={message.visualizationOptions?.questions[0]?.visualType}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
