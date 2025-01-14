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

  useEffect(() => {
    if (isOpen) {
      const initialMessage: Message = {
        id: 'initial-message',
        content: "👋 Welcome! I can help you analyze your form responses. You can:\n\n" +
          "• Ask questions about response patterns and trends\n" +
          "• Request visualizations like pie charts or bar graphs\n" +
          "• Get statistical insights from your data\n\n" +
          "Try asking something like 'Show me a pie chart of responses' or 'What are the most common answers?'",
        role: 'assistant',
        timestamp: new Date(),
        isStreaming: true
      };
      setMessages([initialMessage]);
      
      // Simulate streaming effect
      const words = initialMessage.content.split(' ');
      let currentText = '';
      
      words.forEach((word, index) => {
        setTimeout(() => {
          currentText += (index === 0 ? '' : ' ') + word;
          setMessages([{
            ...initialMessage,
            content: currentText,
            isStreaming: index < words.length - 1
          }]);
        }, index * 50);
      });
    } else {
      setMessages([]);
    }
  }, [isOpen]);

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

    // Add loading message
    const loadingMessage: Message = {
      id: 'loading-' + Date.now(),
      content: "Thinking... 🤔",
      role: 'assistant',
      timestamp: new Date(),
      isStreaming: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Get previous messages excluding system messages and loading states
      const conversationHistory = messages
        .filter(msg => !msg.isStreaming)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId,
          message: userMessage.content,
          blocks,
          responses,
          conversationHistory // Add conversation history to the request
        })
      });

      const data = await response.json();
      
      // Remove loading message and add actual response
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      
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
      // Remove loading message in case of error too
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
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
          "fixed bottom-4 right-4 rounded-full p-3 sm:p-4 shadow-lg z-50",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Bot className="h-5 w-5 sm:h-6 sm:w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-[calc(100vw-32px)] sm:w-[400px] h-[500px] p-3 sm:p-4 shadow-xl flex flex-col z-40">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-start gap-2",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  {msg.role === 'user' ? 
                    <Bot className="h-4 w-4 sm:h-6 sm:w-6 text-primary" /> : 
                    <Bot className="h-4 w-4 sm:h-6 sm:w-6 text-secondary" />
                  }
                </div>
                <div className={cn(
                  "flex-1 max-w-[85%] sm:max-w-[80%]",
                  msg.role === 'user' ? "flex justify-end" : "flex justify-start"
                )}>
                  <div className={cn(
                    "rounded-2xl p-3 sm:p-4 text-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-gray-100 rounded-tl-none"
                  )}>
                    {msg.isStreaming ? (
                      <>
                        {msg.content}
                        <TypingIndicator className="mt-2" />
                      </>
                    ) : (
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
              className="flex-1 text-sm sm:text-base"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="px-3 sm:px-4"
            >
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

