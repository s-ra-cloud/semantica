import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import StarSphere from '@/components/StarSphere';
import { SemanticWord } from '@/components/SemanticWord';
import { tractatusEnglishRaw, tractatusFrenchRaw } from '@/data/tractatusRaw';
import { useSemantic } from '@/context/SemanticContext';
import { parseSemantic } from '@/lib/semanticParser';
import { Link } from 'wouter';
import { Database } from 'lucide-react';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [globalSelections, setGlobalSelections] = useState<Record<string, string>>({});
  const { synonymGroups } = useSemantic();

  const setGlobalSelection = (groupId: string, selection: string) => {
    setGlobalSelections(prev => ({
      ...prev,
      [groupId]: selection
    }));
  };

  const rawData = language === 'en' ? tractatusEnglishRaw : tractatusFrenchRaw;
  const activeGroups = synonymGroups.filter(g => g.language === language);

  const parsedData = useMemo(() => {
    // If the data isn't loaded yet (can happen during hot reloads before file exists), return empty
    if (!rawData) return [];
    
    return rawData.map(prop => ({
      ...prop,
      segments: parseSemantic(prop.content, activeGroups)
    }));
  }, [rawData, activeGroups]);

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-green-500/30 overflow-hidden relative">
      {/* Background Star Sphere */}
      <div className="fixed top-1/2 right-[-20%] -translate-y-1/2 w-[800px] h-[800px] opacity-60 pointer-events-none z-0">
        <StarSphere />
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 relative z-10 flex flex-col md:flex-row gap-16 md:gap-24 min-h-screen">
        
        {/* Left Sidebar / Navigation */}
        <aside className="w-full md:w-48 flex flex-col shrink-0">
          <div className="mb-16">
            {/* Logo */}
            <svg viewBox="0 0 40 40" className="w-8 h-8 text-white mb-2" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M10 20 L20 10 L30 20 L20 30 Z" />
              <path d="M5 25 L15 15" />
            </svg>
            <h1 className="font-display font-semibold text-white text-xl tracking-tight">Semantica</h1>
          </div>

          <nav className="flex flex-col gap-4 font-medium text-sm">
            <button 
              onClick={() => setLanguage('en')}
              className={`text-left transition-colors ${language === 'en' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              data-testid="btn-lang-en"
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('fr')}
              className={`text-left transition-colors ${language === 'fr' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              data-testid="btn-lang-fr"
            >
              Français
            </button>
            
            <div className="h-px w-8 bg-zinc-800 my-2"></div>
            
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">About</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Team</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Writing</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Products</a>

            <div className="h-px w-8 bg-zinc-800 my-2"></div>

            <Link href="/editor">
              <span className="text-zinc-500 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer">
                <Database className="w-4 h-4" />
                Expression DB
              </span>
            </Link>
          </nav>

          <div className="mt-auto pt-24 text-xs text-zinc-600 flex flex-col gap-2">
            <div className="flex gap-3">
              <a href="#" className="hover:text-zinc-400">X</a>
              <a href="#" className="hover:text-zinc-400">Substack</a>
              <a href="#" className="hover:text-zinc-400">Docs</a>
            </div>
            <a href="mailto:hello@semantica.xyz" className="hover:text-zinc-400">hello@semantica.xyz</a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 max-w-2xl">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-4">
              Tractatus Logico-Philosophicus
            </h2>
            <p className="text-zinc-500 max-w-md text-sm leading-relaxed">
              Read the Tractatus in a new way. Click the highlighted expressions to explore the semantic structure of the propositions.
            </p>
          </div>

          <div className="space-y-8">
            {parsedData.map((proposition) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                key={proposition.id} 
                className="flex gap-4 group"
              >
                <div className="font-mono text-xs text-zinc-600 pt-1 shrink-0 w-8">
                  {proposition.id}
                </div>
                <div className="text-lg leading-relaxed text-zinc-300 transition-colors group-hover:text-white">
                  {proposition.segments.map((segment, idx) => {
                    if (segment.type === 'text') {
                      return <span key={idx}>{segment.content}</span>;
                    } else if (segment.type === 'semantic') {
                      return (
                        <SemanticWord 
                          key={idx}
                          original={segment.original}
                          alternatives={segment.alternatives}
                          groupId={segment.groupId}
                          globalSelections={globalSelections}
                          setGlobalSelection={setGlobalSelection}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}