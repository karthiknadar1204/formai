import React, { Suspense } from "react";
import { fetchAllForms, fetchFormStats } from "@/actions/form.action";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import CreateForm from "./_components/CreateForm";
import FormItem from "./_components/_common/FormItem";
import StatsCards from "./_components/StatsCards";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* {FORM STATS} */}
        <section className="stats-section w-full">
          <div className="w-full flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <CreateForm />
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-200">
            <StatsListWrap />
          </div>
        </section>

        <div className="my-12">
          <Separator className="!border-gray-200" />
        </div>

        {/* {ALL FORM} */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              All Forms
            </h2>
            <div className="flex items-center gap-4">
              {/* Add filters/sort options here if needed */}
            </div>
          </div>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Suspense
              fallback={
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-white rounded-xl p-8 shadow-md border border-gray-200 animate-pulse">
                      <Loader size="3rem" className="animate-spin mx-auto text-gray-300" />
                    </div>
                  ))}
                </div>
              }
            >
              <FormList />
            </Suspense>
          </div>
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
      <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
        <p className="text-2xl font-bold text-gray-900 mb-3">No forms created yet</p>
        <p className="text-base text-gray-600">Create your first form to get started</p>
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
