"use client";

import React, { useState, useEffect } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatPanelProps {
  formId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ formId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const fullWelcomeText = "Hi there! Ask me anything about your form responses. I can help you analyze patterns, summarize feedback, or answer specific questions.";

  useEffect(() => {
    if (isOpen) {
      setWelcomeText("");
      let index = 0;
      const intervalId = setInterval(() => {
        if (index < fullWelcomeText.length) {
          setWelcomeText((prev) => prev + fullWelcomeText[index]);
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, 30); // Adjust speed of typing here

      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement chat functionality
    setMessage("");
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
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-sm">
                  {welcomeText}
                  {welcomeText.length < fullWelcomeText.length && "▋"}
                </div>
              </div>
            </div>
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
