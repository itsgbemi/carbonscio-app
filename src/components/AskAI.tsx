import React from 'react';
import { Sparkles, ExternalLink, MessageSquare } from 'lucide-react';

export default function AskAI() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-6">
        <div className="inline-block p-4 bg-brutal-yellow border-4 border-black shadow-brutal mb-4">
          <Sparkles size={48} className="animate-pulse" />
        </div>
        <h2 className="text-6xl font-black uppercase tracking-tighter">Ask Carbonscio AI</h2>
        <p className="text-2xl font-bold max-w-2xl mx-auto italic">
          "Our AI is smarter than you, but it's also much more disappointed in your lifestyle choices."
        </p>
      </div>

      <div className="brutal-card bg-white space-y-8">
        <div className="space-y-4">
          <h3 className="text-3xl font-black uppercase flex items-center gap-3">
            <MessageSquare /> What can it do?
          </h3>
          <ul className="space-y-3 font-bold text-lg list-none">
            <li className="flex items-start gap-2">
              <span className="text-brutal-pink">▶</span> Explain why your 15-minute shower is killing the polar bears.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brutal-pink">▶</span> Calculate how many burgers it takes to melt a glacier.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brutal-pink">▶</span> Give you actual scientific answers, but with more attitude.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brutal-pink">▶</span> Roast your specific climate questions with surgical precision.
            </li>
          </ul>
        </div>

        <div className="p-8 border-4 border-black bg-brutal-blue/10">
          <p className="font-bold text-xl mb-8">
            Ready to be intellectually humbled? Our dedicated AI interface is waiting for you at the link below. 
            Bring your thickest skin and your most pressing climate queries.
          </p>
          
          <a
            href="https://carbonscio-ai.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn-primary text-2xl py-6 flex items-center justify-center gap-4 w-full"
          >
            Go to Carbonscio AI <ExternalLink size={32} />
          </a>
        </div>

        <p className="text-center font-black text-sm uppercase text-gray-400">
          Warning: May cause existential dread and/or sudden urge to plant a forest.
        </p>
      </div>
    </div>
  );
}
