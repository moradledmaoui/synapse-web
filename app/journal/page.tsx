"use client";
import BottomNav from "../components/BottomNav";
export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="bg-white border-b-2 border-black px-5 flex items-center justify-between py-3">
        <div className="font-mono text-sm font-bold text-black">
          SYNAPSE <span className="text-gray-400 font-normal">Journal</span>
        </div>
      </div>
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Page en construction...</div>
      </div>
      <BottomNav />
    </div>
  );
}
