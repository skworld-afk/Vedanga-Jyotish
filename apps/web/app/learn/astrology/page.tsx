"use client";

import React, { useState } from "react";
import Link from "next/link";

import IntroMeaning from "./intro-meaning.mdx";
import IntroKarma from "./intro-karma.mdx";
import OriginsVedas from "./origins-vedas.mdx";
import OriginsEpics from "./origins-epics.mdx";
import TextsBphs from "./texts-bphs.mdx";
import TextsSurya from "./texts-surya.mdx";
import SkandhasOverview from "./skandhas-overview.mdx";
import JatakaElements from "./jataka-elements.mdx";

type SubTopic = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type Topic = {
  id: string;
  title: string;
  subtitle: string;
  subTopics: SubTopic[];
};

const LEARN_MODULES: Topic[] = [
  {
    id: "intro",
    title: "Introduction & Definition",
    subtitle: "The Science of Light & Karma",
    subTopics: [
      {
        id: "intro-meaning",
        title: "Meaning of Jyotiṣa",
        content: (
          <div className="space-y-8 animate-in fade-in duration-700">
            <IntroMeaning />
          </div>
        )
      },
      {
        id: "intro-karma",
        title: "Karma and Destiny",
        content: (
          <div className="space-y-8 animate-in fade-in duration-700">
            <IntroKarma />
          </div>
        )
      }
    ]
  },
  {
    id: "origins",
    title: "Origins & Evolution",
    subtitle: "Vedic & Epic Literature",
    subTopics: [
      {
        id: "origins-vedas",
        title: "Vedas & Vedāṅga",
        content: (
          <div className="space-y-8 animate-in fade-in duration-700">
            <OriginsVedas />
          </div>
        )
      },
      {
        id: "origins-epics",
        title: "Rāmāyaṇa & Mahābhārata",
        content: (
          <div className="space-y-8 animate-in fade-in duration-700">
            <OriginsEpics />
          </div>
        )
      }
    ]
  },
  {
    id: "texts",
    title: "Core Extant Texts",
    subtitle: "The Pillars of Jyotiṣa",
    subTopics: [
      {
        id: "texts-bphs",
        title: "Bṛhat Parāśara Horā Śāstra",
        content: (
          <div className="space-y-8 animate-in fade-in duration-700">
            <TextsBphs />
          </div>
        )
      },
      {
        id: "texts-surya",
        title: "Sūrya Siddhānta & Sārāvalī",
        content: (
          <div className="space-y-8 animate-in fade-in duration-700">
            <TextsSurya />
          </div>
        )
      }
    ]
  },
  {
    id: "skandhas",
    title: "Tri-Skandha (Three Branches)",
    subtitle: "The Architecture of Astrology",
    subTopics: [
      {
        id: "skandhas-overview",
        title: "The Three Limbs",
        content: (
          <div className="space-y-8 animate-in fade-in duration-700">
            <SkandhasOverview />
          </div>
        )
      }
    ]
  },
  {
    id: "jataka",
    title: "Elements of Jātaka",
    subtitle: "The Architecture of a Horoscope",
    subTopics: [
      {
        id: "jataka-elements",
        title: "Core Components",
        content: (
          <div className="space-y-8 animate-in fade-in duration-700">
            <JatakaElements />
          </div>
        )
      }
    ]
  },
];

export default function LearnAstrologyPage() {
  const [activeTopicId, setActiveTopicId] = useState<string>(LEARN_MODULES[0]?.id || "");
  const [activeSubTopicId, setActiveSubTopicId] = useState<string>(LEARN_MODULES[0]?.subTopics[0]?.id || "");

  const activeContent = LEARN_MODULES.find(t => t.id === activeTopicId)?.subTopics.find(s => s.id === activeSubTopicId)?.content || null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Page Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/20 px-6 py-8 sm:px-12 flex flex-col items-center justify-center text-center rounded-none relative overflow-hidden">
        <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-slate-100 mb-2">
          Learn <span className="font-semibold text-amber-500">Astrology</span>
        </h1>
        <p className="text-slate-400 text-sm tracking-widest uppercase">
          The Ancient Science of Jyotiṣa
        </p>
        
        <Link 
          href="/" 
          className="absolute left-6 top-8 text-xs font-semibold tracking-widest uppercase text-slate-500 hover:text-amber-400 transition-colors"
        >
          &larr; Back to Home
        </Link>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1 flex-col md:flex-row max-w-7xl mx-auto w-full">
        
        {/* Left Side Panel (Navigation) */}
        <aside className="w-full md:w-80 bg-slate-950 border-r border-slate-800/80 shrink-0 flex flex-col z-10">
          <div className="p-6 pb-2">
            <h2 className="text-[11px] font-bold text-slate-500 tracking-[0.2em] uppercase">
              Course Curriculum
            </h2>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 pt-8 pb-6 space-y-4 custom-scrollbar">
            {LEARN_MODULES.map((topic) => {
              const isTopicActive = activeTopicId === topic.id;
              return (
                <div key={topic.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTopicId(topic.id);
                      setActiveSubTopicId(topic.subTopics[0]?.id || "");
                    }}
                    className={`w-full text-left px-4 py-2 font-semibold transition-all duration-300 ${
                      isTopicActive ? "text-amber-500" : "text-slate-300 hover:text-amber-400/70"
                    }`}
                  >
                    {topic.title}
                  </button>
                  
                  {isTopicActive && (
                    <div className="pl-4 space-y-1 border-l-2 border-slate-800 ml-4">
                      {topic.subTopics.map((sub) => {
                        const isSubActive = activeSubTopicId === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => setActiveSubTopicId(sub.id)}
                            className={`w-full text-left px-3 py-2 text-sm transition-all duration-300 border-l-[2px] -ml-[2px] ${
                              isSubActive 
                                ? "border-amber-500 bg-slate-900/60 text-slate-100" 
                                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                            }`}
                          >
                            {sub.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-slate-950/40 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

          <div className="h-full w-full overflow-y-auto p-6 sm:p-10 lg:p-16 custom-scrollbar relative z-10">
            {activeContent}
            
            {/* Call to Action at bottom of content */}
            <div className="mt-16 pt-8 border-t border-slate-800/80 flex justify-between items-center animate-in fade-in duration-1000">
              <p className="text-sm text-slate-500 italic">
                Delve deeper into your own Prārabdha Karma.
              </p>
              <Link 
                href="/chart/create"
                className="px-6 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all duration-300"
              >
                Cast Your Chart
              </Link>
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
}