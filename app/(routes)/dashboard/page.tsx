import React, { Suspense } from "react";
import { fetchAllForms, fetchFormStats } from "@/actions/form.action";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import CreateForm from "./_components/CreateForm";
import FormItem from "./_components/_common/FormItem";
import StatsCards from "./_components/StatsCards";

const Dashboard = () => {
  return (
    <div className="w-full pt-8">
      <div className="w-full max-w-6xl mx-auto px-2 md:px-0 pt-1">
        {/* {FORM STATS} */}
        <section className="stats-section w-full">
          <div className="w-full flex items-center justify-between py-5">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <CreateForm />
          </div>
          <StatsListWrap />
        </section>
        <div className="mt-10">
          <Separator className="!border-[#eee] !bg-[#eee]" />
        </div>
        {/* {ALL FORM} */}

        <section className="w-full pt-7 pb-10">
          <div
            className="w-full flex 
          items-center mb-4"
          >
            <h5
              className="text-xl
             font-semibold
             tracking-tight
             "
            >
              All Forms
            </h5>
          </div>

          <div
            className="grid gap-4  grid-cols-2
           md:grid-cols-5
           lg:grid-cols-3
           xl:grid-cols-5
           "
          >
            <Suspense
              fallback={[1, 2, 3, 4].map((item) => (
                <Loader size="3rem" className="animate-spin" />
              ))}
            >
              <FormList />
            </Suspense>
          </div>

          {/* <div className="flex items-center justify-center">
            No form created
          </div> */}
        </section>
      </div>
    </div>
  );
};

async function StatsListWrap() {
  const stats = await fetchFormStats();
  return <StatsCards loading={false} data={stats} />;
}

async function FormList() {
  const { form } = await fetchAllForms();
  
  if (!form?.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-10 text-muted-foreground">
        <p className="text-lg">No forms created yet</p>
        <p className="text-sm">Create your first form to get started</p>
      </div>
    );
  }

  return (
    <>
      {form?.map((form) => (
        <FormItem
          key={form.id}
          id={form.id}
          formId={form.formId}
          name={form.name}
          published={form.published}
          createdAt={form.createdAt}
          responses={form.responses}
          views={form.views}
          backgroundColor={form.settings.backgroundColor}
        />
      ))}
    </>
  );
}

export default Dashboard;