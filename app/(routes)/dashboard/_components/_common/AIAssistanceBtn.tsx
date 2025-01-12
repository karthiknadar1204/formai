"use client";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useBuilder } from "@/context/builder-provider";
import { toast } from "@/hooks/use-toast";
import { AIChatSession } from "@/lib/google-ai";
import { generateUniqueId } from "@/lib/helper";
import { generateFormQuestionPrompt } from "@/lib/prompts";
import { Loader, Sparkles } from "lucide-react";
import React, { useState } from "react";

const AIAssistanceBtn = () => {
  const { formData, blockLayouts, setBlockLayouts } = useBuilder();
  const [userRequest, setUserRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  const isPublished = formData?.published;

  const GenerateFormQuestionsWithAI = async () => {
    if (!userRequest) {
      toast({
        title: "Please enter a request",
      });
      return;
    }
    try {
      setLoading(true);
      const formName = formData?.name || "";
      const formDescription = formData?.description || "";

      const PROMPT = generateFormQuestionPrompt(
        userRequest,
        formName,
        formDescription,
        blockLayouts
      );

      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = await result.response.text();
      const parsedResponse = JSON?.parse(responseText);
      const actionType = parsedResponse.actionType;
      const generatedBlocks = parsedResponse.blocks;
      const addUniqueIdToGeneratedBlocks = addUniqueIds(generatedBlocks);

      setBlockLayouts((prevBlocks) => {
        if (actionType === "addQuestions") {
          return [...prevBlocks, ...addUniqueIdToGeneratedBlocks];
        } else if (actionType === "createForm") {
          return [...addUniqueIdToGeneratedBlocks];
        } else {
          console.warn(`Unhandled actionType: ${actionType}`);
          return prevBlocks;
        }
      });
      setIsOpen(false);
      setUserRequest("");
    } catch (error) {
      console.log(error, "error");
      toast({
        title: "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  function addUniqueIds(blocks: FormBlockInstance[]) {
    blocks.forEach((block) => {
      block.id = generateUniqueId();
      block?.childblocks?.forEach((child) => {
        child.id = generateUniqueId();
      });
    });
    return blocks;
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className="rounded-full bg-gradient-to-r from-sky-50 to-sky-100 
            hover:from-sky-100 hover:to-sky-200 transition-all duration-300
            border border-sky-200 shadow-lg p-4"
            aria-label="AI assistance"
          >
            <Sparkles className="w-7 h-7 text-sky-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          forceMount
          align="start"
          side="right"
        >
          <div className="flex flex-col w-[420px] bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-sky-50 to-sky-100 px-6 py-4 border-b border-sky-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">AI Form Assistant</h3>
              </div>
            </div>

            <div className="p-6">
              <Textarea
                value={userRequest}
                rows={4}
                readOnly={isPublished}
                className="w-full rounded-lg border-sky-200 bg-sky-50/30 
                focus:border-sky-400 focus:ring focus:ring-sky-200 focus:ring-opacity-50
                placeholder:text-gray-400 text-gray-700 transition-all duration-200"
                placeholder="Describe the form or questions you want to generate with AI..."
                spellCheck="false"
                onChange={(e) => setUserRequest(e.target.value)}
              />

              <div className="flex justify-between items-center mt-4">
                <button
                  className="text-sky-600 hover:text-sky-700 font-medium text-sm 
                  transition-colors duration-200 focus:outline-none focus:ring-2 
                  focus:ring-sky-500 focus:ring-offset-2 rounded-md px-2 py-1"
                  onClick={() => setShow(!show)}
                >
                  {show ? "Hide tips" : "Show tips"}
                </button>

                <Button
                  type="button"
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 
                  rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                  disabled={loading || isPublished}
                  onClick={GenerateFormQuestionsWithAI}
                >
                  <Sparkles className="w-4 h-4" />
                  Generate
                  {loading && <Loader size="14" className="animate-spin" />}
                </Button>
              </div>

              {show && (
                <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50/50 p-4">
                  <h4 className="font-medium text-gray-800 mb-3">Tips for best results:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500">•</span>
                      Specify the type of form (e.g., hotel booking, event registration)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500">•</span>
                      List required information (email, name, preferences)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500">•</span>
                      Indicate preferred tone (formal, casual, friendly)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500">•</span>
                      Mention desired number of questions
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default AIAssistanceBtn;