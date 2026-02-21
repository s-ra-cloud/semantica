import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import StarSphere from '@/components/StarSphere';
import { SemanticWord } from '@/components/SemanticWord';
import { LogicWord } from '@/components/LogicWord';
import { MathLogicWord } from '@/components/MathLogicWord';
import { MathText } from '@/components/MathText';
import { tractatusEnglishRaw, tractatusFrenchRaw } from '@/data/tractatusRaw';
import { useSemantic } from '@/context/SemanticContext';
import { parseSemantic } from '@/lib/semanticParser';
import { Link } from 'wouter';
import { Database, ChevronDown } from 'lucide-react';
import 'katex/dist/katex.min.css';

function isChildOf(childId: string, parentId: string): boolean {
  if (!parentId.includes('.')) {
    return childId.startsWith(parentId + '.');
  }
  return childId.startsWith(parentId) && childId.length > parentId.length;
}

function hasChildren(propId: string, allIds: string[]): boolean {
  return allIds.some(id => isChildOf(id, propId));
}

function isVisible(propId: string, collapsed: Set<string>): boolean {
  let visible = true;
  collapsed.forEach(cId => {
    if (isChildOf(propId, cId)) visible = false;
  });
  return visible;
}

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [showTeam, setShowTeam] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const { synonymGroups } = useSemantic();

  const rawData = language === 'en' ? tractatusEnglishRaw : tractatusFrenchRaw;
  const activeGroups = useMemo(() => synonymGroups.filter(g => g.language === language), [synonymGroups, language]);
  const allIds = useMemo(() => rawData?.map(p => p.id) || [], [rawData]);

  const parsedData = useMemo(() => {
    if (!rawData) return [];
    
    return rawData.map(prop => ({
      ...prop,
      segments: parseSemantic(prop.content, activeGroups)
    }));
  }, [rawData, activeGroups]);

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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

            <button
              onClick={() => { setShowTeam(!showTeam); setShowThanks(false); }}
              className={`text-left transition-colors flex items-center gap-1 ${showTeam ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
              data-testid="btn-team"
            >
              Team
              <ChevronDown className={`w-3 h-3 transition-transform ${showTeam ? 'rotate-180' : ''}`} />
            </button>
            {showTeam && (
              <div className="flex flex-col gap-2 pl-2 text-xs">
                <a href="https://fr.linkedin.com/in/raphael-liogier-573573127" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-raphael">Raphaël Liogier</a>
                <a href="https://fr.linkedin.com/in/sacha-raoult" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-sacha">Sacha Raoult</a>
                <a href="https://www.linkedin.com/in/laura-duparc-52504b215" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-laura">Laura Duparc</a>
                <a href="https://fr.linkedin.com/in/eric-parisot" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-eric">Eric Parisot</a>
                <a href="https://www.linkedin.com/in/sofiane-baddag-743158145" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-sofiane">Sofiane Baddag</a>
              </div>
            )}

            <button
              onClick={() => { setShowThanks(!showThanks); setShowTeam(false); }}
              className={`text-left transition-colors flex items-center gap-1 ${showThanks ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
              data-testid="btn-thanks"
            >
              Thanks
              <ChevronDown className={`w-3 h-3 transition-transform ${showThanks ? 'rotate-180' : ''}`} />
            </button>
            {showThanks && (
              <div className="flex flex-col gap-2 pl-2 text-xs text-zinc-400">
                <a href="https://www.wittgensteinproject.org/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" data-testid="link-wittgenstein-project">The Wittgenstein Project</a>
                <a href="https://wab.uib.no/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" data-testid="link-wittgenstein-archives">The Wittgenstein Archives</a>
                <span className="text-zinc-500 leading-relaxed">The daughter of Gilles-Gaston Granger for the rights of the French translation</span>
              </div>
            )}

            <div className="h-px w-8 bg-zinc-800 my-2"></div>

            <Link href="/editor">
              <span className="text-zinc-500 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer">
                <Database className="w-4 h-4" />
                Expression DB
              </span>
            </Link>
          </nav>
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
            <div className="mt-4 text-zinc-600 text-xs leading-relaxed max-w-md italic">
              {language === 'en' ? (
                <p>Based on the C.K. Ogden translation (1922), revised by Frank P. Ramsey. We have replaced every occurrence of "atomic fact" with "state of affairs" to better reflect the original German "Sachverhalt."</p>
              ) : (
                <p>Traduction française de Gilles-Gaston Granger, reproduite avec l'aimable autorisation de sa fille.</p>
              )}
            </div>
          </div>

          <div className="space-y-8" key={language}>
            {parsedData.map((proposition) => {
              if (!isVisible(proposition.id, collapsed)) return null;
              const canCollapse = hasChildren(proposition.id, allIds);
              const isCollapsed = collapsed.has(proposition.id);

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={proposition.id} 
                  className="flex gap-4 group"
                >
                  <div className="shrink-0 w-8 flex flex-col items-center gap-1">
                    <span className="font-mono text-xs text-zinc-600 pt-1">{proposition.id}</span>
                    {canCollapse && (
                      <button
                        onClick={() => toggleCollapse(proposition.id)}
                        className="w-5 h-5 rounded-full border border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-colors"
                        data-testid={`collapse-${proposition.id}`}
                      >
                        <svg
                          viewBox="0 0 10 10"
                          className={`w-2.5 h-2.5 text-zinc-500 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                          fill="currentColor"
                        >
                          <polygon points="2,1 8,5 2,9" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="text-lg leading-relaxed text-zinc-300 transition-colors group-hover:text-white">
                    {proposition.segments.map((segment, idx) => {
                      if (segment.type === 'text') {
                        return <MathText key={idx} text={segment.content} />;
                      } else if (segment.type === 'semantic') {
                        return (
                          <SemanticWord 
                            key={idx}
                            original={segment.original}
                            alternatives={segment.alternatives}
                            groupId={segment.groupId}
                          />
                        );
                      } else if (segment.type === 'logic') {
                        return (
                          <LogicWord
                            key={idx}
                            original={segment.original}
                            translation={segment.translation}
                            groupId={segment.groupId}
                          />
                        );
                      } else if (segment.type === 'math-logic') {
                        return (
                          <MathLogicWord
                            key={idx}
                            latex={segment.latex}
                            translation={segment.translation}
                            groupId={segment.groupId}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}