"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  formId: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ formId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

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
        body: JSON.stringify({ formId, message: userMessage.content }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        className={cn(
          "fixed bottom-4 right-4 rounded-full p-4 shadow-lg",
          isOpen && "bg-red-500 hover:bg-red-600",
          !isOpen && "bg-primary hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-[400px] h-[500px] p-4 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Chat with AI Assistant</h3>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2">
            {messages.map(msg => (
              <div key={msg.id} className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  {msg.role === 'user' ? <Bot className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-secondary" />}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-sm">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your form responses..."
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </Card>
      )}
    </>
  );
};

export default ChatPanel;

