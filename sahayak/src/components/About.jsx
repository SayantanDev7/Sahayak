import React from 'react';
import { Play } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 flex flex-col md:flex-row gap-16 px-4 font-sans items-center">
      <div className="w-full md:w-1/2">
        <h2 className="text-4xl text-[#1a5f42] font-extrabold mb-6">About</h2>
        <div className="text-gray-700 space-y-4 mb-8 text-lg">
          <p>
            Sahayak is a visionary national platform designed to bring government schemes directly to the citizens. We bridge the gap between policy and public by providing a simplified, one-stop portal for all government benefits.
          </p>
          <p>
            Our intelligent recommendation system analyzes user profiles and suggests the most relevant schemes, ensuring that everyone gets the support they rightfully deserve without navigating complex bureaucracies.
          </p>
          <p>
            With an aim to digitally empower every citizen, Sahayak stands as a beacon of transparency, accessibility, and proactive governance.
          </p>
        </div>
        <button className="bg-[#213b7e] hover:bg-[#152759] transition-colors text-white px-8 py-3 rounded font-medium shadow">
          View More &rarr;
        </button>
      </div>
      
      <div className="w-full md:w-1/2">
        <div className="bg-[#5ebd7f] rounded-xl w-full aspect-video flex items-center justify-center shadow-lg cursor-pointer hover:bg-[#4ea86e] transition-colors group">
          <div className="bg-white/30 p-4 rounded-full group-hover:scale-110 transition-transform">
            <Play fill="white" size={64} className="text-white ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
