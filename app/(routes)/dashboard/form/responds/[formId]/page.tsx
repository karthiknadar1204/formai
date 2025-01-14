import React from "react";
import { fetchAllResponseByFormId } from "@/actions/form.action";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Button } from "@/components/ui/button";
import { Link, FileJson, BarChart, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AllReponds from "../_components/AllReponds";
import ChatPanel from "../_components/ChatPanel";
import ViewJsonButton from "../_components/ViewJsonButton";

const Responds = async ({ params }: { params: { formId: string } }) => {
  const { formId } = params;
  const { form } = await fetchAllResponseByFormId(formId);

  if (!form) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-3xl font-semibold text-gray-400">Error Occurred</div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const blocks = JSON.parse(form?.jsonBlocks) as FormBlockInstance[];
  const responses = form?.formResponses || [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full pt-4 sm:pt-8">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 sm:py-6">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Responses
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                Total submissions: {responses?.length}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <ViewJsonButton responses={responses} blocks={blocks} />
              
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/public/submit-form/${formId}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full sm:w-auto"
              >
                <Button
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 
                    hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg 
                    hover:shadow-xl transition-all duration-200 flex items-center 
                    justify-center gap-2 px-4 sm:px-6"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Form</span>
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <Separator className="mb-4 sm:mb-6 bg-gray-100" />
            <AllReponds blocks={blocks} responses={responses} />
          </div>
        </div>
      </div>
      <ChatPanel formId={formId} blocks={blocks} responses={responses} />
    </main>
  );
};

export default Responds;

