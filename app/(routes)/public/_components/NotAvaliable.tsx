import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import React from "react";

const NotAvaliable = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-sky-100">
      <div className="max-w-md w-full mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="p-4 bg-sky-100 rounded-full">
            <Frown size="64" className="text-sky-600" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              This Form is No Longer Available
            </h2>
            <p className="text-gray-600">
              The form you're trying to access has been deactivated or removed.
            </p>
          </div>

          <Button 
            className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 
            hover:to-sky-800 text-white shadow-lg hover:shadow-xl transition-all 
            duration-200 min-w-[200px] rounded-full py-6"
          >
            Learn More
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-600 mb-1">Powered by</p>
        <h5 className="font-black text-2xl bg-gradient-to-r from-sky-600 to-sky-800 
        bg-clip-text text-transparent">
          Formify
        </h5>
      </div>
    </div>
  );
};

export default NotAvaliable;