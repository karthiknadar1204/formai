import React from "react";
import { fetchAllResponseByFormId } from "@/actions/form.action";
import { FormBlockInstance } from "@/@types/form-block.type";
import { Separator } from "@/components/ui/separator";
import AnalyticsView from "../../_components/AnalyticsView";

const Analytics = async ({ params }: { params: { formId: string } }) => {
  const { formId } = params;
  const { form } = await fetchAllResponseByFormId(formId);

  if (!form) {
    return (
      <div className="w-full h-[50vh] flex items-center">
        Error Occurred, Refresh
      </div>
    );
  }

  const blocks = JSON.parse(form?.jsonBlocks) as FormBlockInstance[];
  const responses = form?.formResponses || [];

  return (
    <main>
      <div className="w-full pt-8">
        <div className="w-full max-w-6xl mx-auto pt-1 px-4 md:px-0">
          <div className="w-full flex items-center justify-between py-5">
            <h1 className="text-3xl font-semibold tracking-tight">
              Response Analytics
            </h1>
          </div>
          <div className="mt-10">
            <Separator className="!border-[#eee] !bg-[#eee]" />
            <AnalyticsView blocks={blocks} responses={responses} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analytics; 