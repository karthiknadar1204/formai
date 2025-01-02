import { Button } from "@/components/ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ChevronRight, Wand2 } from 'lucide-react';
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="w-full max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
            <span className="block">Create Forms with AI</span>
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Powered by Formify
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Design beautiful, intelligent forms in seconds. Let our AI do the heavy lifting while you focus on what matters most.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button className="h-12 px-8 text-lg font-semibold" asChild>
              <RegisterLink>
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </RegisterLink>
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 text-lg font-semibold text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-2xl transform -skew-y-6 sm:skew-y-0 sm:-rotate-3 sm:rounded-3xl"></div>
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            <Image
              src="/hero.jpeg"
              alt="Formify AI Form Builder"
              width={1920}
              height={800}
              className="w-full h-[400px] object-cover object-center"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "AI-Powered Design", icon: Wand2, description: "Let our AI suggest the best form layouts and question types based on your needs." },
            { title: "Instant Creation", icon: ChevronRight, description: "Create complex forms in seconds, not hours. Save time and boost productivity." },
            { title: "Smart Analytics", icon: ChevronRight, description: "Gain insights from responses with our built-in AI-driven analytics." },
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
