import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-6">Could not find the requested resource</p>
      <Button asChild variant="outline">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  );
} 