import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarSphere from '@/components/StarSphere';
import { SemanticWord } from '@/components/SemanticWord';
import { LogicWord } from '@/components/LogicWord';
import { MathLogicWord } from '@/components/MathLogicWord';
import { MathText } from '@/components/MathText';
import { tractatusEnglishRaw, tractatusFrenchRaw } from '@/data/tractatusRaw';
import { useSemantic } from '@/context/SemanticContext';
import { parseSemantic } from '@/lib/semanticParser';
import { Link } from 'wouter';
import { Database, ChevronDown, MessageSquare, X, Sparkles, Eye, EyeOff } from 'lucide-react';
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
  const [showParticles, setShowParticles] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackPropId, setFeedbackPropId] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
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

  const handleFeedbackSubmit = async () => {
    if (!feedbackMessage.trim()) return;
    setFeedbackSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propositionId: feedbackPropId || 'general',
          language,
          message: feedbackMessage.trim(),
        }),
      });
      setFeedbackSent(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackPropId('');
        setFeedbackMessage('');
        setFeedbackSent(false);
      }, 2000);
    } catch {
      // silently fail
    } finally {
      setFeedbackSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-green-500/30 overflow-hidden relative">
      {showParticles && (
        <div className="fixed top-1/2 right-[-20%] -translate-y-1/2 w-[800px] h-[800px] opacity-60 pointer-events-none z-0">
          <StarSphere />
        </div>
      )}

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-amber-500/80 border border-amber-500/30 rounded-full px-2.5 py-0.5 bg-amber-500/5 font-medium" data-testid="badge-beta">
          Beta
        </span>
        <button
          onClick={() => setShowParticles(!showParticles)}
          className="w-8 h-8 rounded-full border border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-300"
          title={showParticles ? 'Hide particles' : 'Show particles'}
          data-testid="btn-toggle-particles"
        >
          {showParticles ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setShowFeedback(true)}
          className="w-8 h-8 rounded-full border border-zinc-700 hover:border-green-500/50 flex items-center justify-center transition-colors text-zinc-500 hover:text-green-400"
          title="Report a mistake"
          data-testid="btn-feedback"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { if (!feedbackSending) setShowFeedback(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-display font-medium">Report a Mistake</h3>
                <button onClick={() => setShowFeedback(false)} className="text-zinc-500 hover:text-white" data-testid="btn-close-feedback">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {feedbackSent ? (
                <p className="text-green-400 text-sm py-4">Thank you for your feedback!</p>
              ) : (
                <>
                  <p className="text-zinc-500 text-xs mb-4">Found a missing or incorrect substitution? Let us know and we'll fix it.</p>
                  <input
                    type="text"
                    placeholder="Proposition number (e.g. 3.141)"
                    value={feedbackPropId}
                    onChange={(e) => setFeedbackPropId(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 mb-3 focus:outline-none focus:border-green-500/50"
                    data-testid="input-feedback-prop"
                  />
                  <textarea
                    placeholder="Describe the issue..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 mb-4 h-24 resize-none focus:outline-none focus:border-green-500/50"
                    data-testid="input-feedback-message"
                  />
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={feedbackSending || !feedbackMessage.trim()}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    data-testid="btn-submit-feedback"
                  >
                    {feedbackSending ? 'Sending...' : 'Send Feedback'}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 relative z-10 flex flex-col md:flex-row gap-16 md:gap-24 min-h-screen">
        
        <aside className="w-full md:w-48 flex flex-col shrink-0">
          <div className="mb-16">
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
              Fran&ccedil;ais
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
                <a href="https://fr.linkedin.com/in/raphael-liogier-573573127" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-raphael">Rapha&euml;l Liogier</a>
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
                <div className="h-px w-6 bg-zinc-800 my-1"></div>
                <span className="text-zinc-500">SATT Sud Est</span>
                <span className="text-zinc-500">Machina Research Network</span>
                <span className="text-zinc-500">Chair of Transitions</span>
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

        <main className="flex-1 max-w-2xl">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-2">
              Tractatus Logico-Philosophicus
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              by Ludwig Wittgenstein
            </p>
            <p className="text-zinc-500 max-w-md text-sm leading-relaxed">
              Read the Tractatus in a new way. Click the highlighted expressions to explore the semantic structure of the propositions.
            </p>
            <div className="mt-3 flex items-start gap-2 text-amber-500/70 text-xs max-w-md">
              <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>This is a beta version. There may still be mistakes in the substitutions. A German version is coming soon.</p>
            </div>
            <div className="mt-4 text-zinc-600 text-xs leading-relaxed max-w-md italic">
              {language === 'en' ? (
                <p>Based on the C.K. Ogden translation (1922), revised by Frank P. Ramsey. We have replaced every occurrence of "atomic fact" with "state of affairs" to better reflect the original German "Sachverhalt."</p>
              ) : (
                <p>Traduction fran&ccedil;aise de Gilles-Gaston Granger, reproduite avec l'aimable autorisation de sa fille.</p>
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
                        className="collapse-btn w-5 h-5 rounded-full border border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-colors"
                        data-testid={`collapse-${proposition.id}`}
                      >
                        <svg
                          viewBox="0 0 10 10"
                          className={`w-2.5 h-2.5 text-zinc-500 transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-90'}`}
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

          <footer className="mt-24 mb-12 pt-8 border-t border-zinc-800/50">
            <div className="flex flex-col gap-3 text-xs text-zinc-600">
              <p>
                Licensed under the{' '}
                <a
                  href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-green-400 transition-colors underline underline-offset-2"
                  data-testid="link-license"
                >
                  GNU General Public License v3.0
                </a>
              </p>
              <p className="text-zinc-700">Semantica &mdash; An interactive reading of the Tractatus Logico-Philosophicus</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
