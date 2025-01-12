"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TypingIndicator } from "./TypingIndicator";
import { VisualizationDialog } from "./VisualizationDialog";
import { FormBlockInstance } from "@/@types/form-block.type";

interface ChatPanelProps {
  formId: string;
  blocks: FormBlockInstance[];
  responses: {
    formId: number;
    id: number;
    createdAt: Date;
    jsonReponse: string;
  }[];
}

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
}

export const ChatPanel = ({ formId, blocks, responses }: ChatPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('ChatPanel blocks:', blocks);
  }, [blocks]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          message: userMessage.content,
          blocks,
          responses
        })
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.type === 'text'? data.response.message : (data.response.message || "I'll show you the visualisation for that."),
        role: 'assistant',
        timestamp: new Date(),
        visualizationOptions: data.response.type === 'visualization' ? {
          type: data.response.visualizationOptions.type,
          questions: Array.isArray(data.response.visualizationOptions.questions) 
            ? data.response.visualizationOptions.questions 
            : [data.response.visualizationOptions.questions]
        } : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisualizationClick = (msg: Message) => {
    console.log("Clicked message:", msg);
    if (msg.visualizationOptions?.questions) {
      const questions = Array.isArray(msg.visualizationOptions.questions)
        ? msg.visualizationOptions.questions
        : [msg.visualizationOptions.questions];
        
      setActiveVisualization({
        ...msg,
        visualizationOptions: {
          ...msg.visualizationOptions,
          questions
        }
      });
    } else {
      console.warn("No visualization options in message:", msg);
    }
  };

  return (
    <>
      <Button
        size="icon"
        className={cn(
          "fixed bottom-4 right-4 rounded-full p-4 shadow-lg",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-[400px] h-[500px] p-4 shadow-xl flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
            {messages.map(msg => (
              <div key={msg.id} className="flex items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  {msg.role === 'user' ? 
                    <Bot className="h-6 w-6 text-primary" /> : 
                    <Bot className="h-6 w-6 text-secondary" />
                  }
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-sm">
                    {msg.type === 'text' ? msg.message : (
                      <>
                        {msg.content}
                        {msg.visualizationOptions && (
                          <div 
                            className="mt-2 p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => handleVisualizationClick(msg)}
                          >
                            <div className="flex items-center justify-between">
                              <span>View Visualization</span>
                              <Maximize2 className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your form responses..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !message.trim()}>
              Send
            </Button>
          </form>
        </Card>
      )}

      {activeVisualization && blocks && blocks.length > 0 && (
        <VisualizationDialog
          message={activeVisualization}
          onClose={() => setActiveVisualization(null)}
          blocks={blocks}
          responses={responses}
        />
      )}
    </>
  );
};

export default ChatPanel;

