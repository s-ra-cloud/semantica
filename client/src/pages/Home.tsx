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
import { Database, ChevronDown, MessageSquare, X, Sparkles, Eye, EyeOff, Code, BookOpen } from 'lucide-react';
import { propositionDiagrams } from '@/components/TractatusDiagrams';
import { ParsedText } from '@/components/ParsedText';
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
  const [jumpTo, setJumpTo] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackPropError, setFeedbackPropError] = useState('');
  const [openAnnotation, setOpenAnnotation] = useState<string | null>(null);
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
    if (feedbackPropId.trim() && !allIds.includes(feedbackPropId.trim())) {
      setFeedbackPropError(
        language === 'en'
          ? "You are a liar! Such proposition does not exist! Unless maybe you just made a mistake, in that case we're very sorry to have been doubting you..."
          : "Menteur ! Cette proposition n'existe pas ! Sauf si vous avez juste fait une erreur, dans ce cas nous sommes vraiment désolés d'avoir douté de vous..."
      );
      return;
    }
    setFeedbackPropError('');
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
        setFeedbackPropError('');
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
        <div className="md:hidden flex items-center gap-1 mr-1">
          <button
            onClick={() => setLanguage('en')}
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors font-medium ${language === 'en' ? 'text-white border-white/30 bg-white/10' : 'text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}
            data-testid="btn-lang-en-mobile"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('fr')}
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors font-medium ${language === 'fr' ? 'text-white border-white/30 bg-white/10' : 'text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}
            data-testid="btn-lang-fr-mobile"
          >
            FR
          </button>
          <span
            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-zinc-800 text-zinc-700 font-medium cursor-default"
            data-testid="btn-lang-de-mobile"
          >
            DE
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-amber-500/80 border border-amber-500/30 rounded-full px-2.5 py-0.5 bg-amber-500/5 font-medium" data-testid="badge-beta">
          Beta
        </span>
        <button
          onClick={() => setShowParticles(!showParticles)}
          className="w-8 h-8 rounded-full border border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-300"
          title={showParticles ? (language === 'en' ? 'Hide particles' : 'Masquer les particules') : (language === 'en' ? 'Show particles' : 'Afficher les particules')}
          data-testid="btn-toggle-particles"
        >
          {showParticles ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setShowFeedback(true)}
          className="w-8 h-8 rounded-full border border-zinc-700 hover:border-green-500/50 flex items-center justify-center transition-colors text-zinc-500 hover:text-green-400"
          title={language === 'en' ? 'Report a mistake' : 'Signaler une erreur'}
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
                <h3 className="text-white font-display font-medium">{language === 'en' ? 'Report a Mistake' : 'Signaler une erreur'}</h3>
                <button onClick={() => setShowFeedback(false)} className="text-zinc-500 hover:text-white" data-testid="btn-close-feedback">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {feedbackSent ? (
                <p className="text-green-400 text-sm py-4">{language === 'en' ? 'Thank you for your feedback!' : 'Merci pour votre retour\u00a0!'}</p>
              ) : (
                <>
                  <p className="text-zinc-500 text-xs mb-4">{language === 'en' ? "Found a missing or incorrect substitution? Let us know and we'll fix it." : 'Vous avez trouv\u00e9 une substitution manquante ou incorrecte\u00a0? Faites-le nous savoir.'}</p>
                  <input
                    type="text"
                    placeholder={language === 'en' ? "Proposition number (e.g. 3.141)" : "Num\u00e9ro de proposition (ex. 3.141)"}
                    value={feedbackPropId}
                    onChange={(e) => { setFeedbackPropId(e.target.value); setFeedbackPropError(''); }}
                    className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 mb-1 focus:outline-none ${feedbackPropError ? 'border-red-500/70' : 'border-zinc-700 focus:border-green-500/50'}`}
                    data-testid="input-feedback-prop"
                  />
                  {feedbackPropError && (
                    <p className="text-red-400 text-xs mb-2 italic" data-testid="text-feedback-prop-error">{feedbackPropError}</p>
                  )}
                  {!feedbackPropError && <div className="mb-2" />}
                  <textarea
                    placeholder={language === 'en' ? "Describe the issue..." : "D\u00e9crivez le probl\u00e8me..."}
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
                    {feedbackSending ? (language === 'en' ? 'Sending...' : 'Envoi...') : (language === 'en' ? 'Send Feedback' : 'Envoyer')}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 relative z-10 flex flex-col md:flex-row gap-16 md:gap-24 min-h-screen">
        
        <aside className="w-full md:w-48 flex flex-col shrink-0 md:fixed md:top-24 md:left-12 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
          <div className="mb-4">
            <svg viewBox="0 0 40 40" className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M10 20 L20 10 L30 20 L20 30 Z" />
              <path d="M5 25 L15 15" />
            </svg>
            <h1 className="font-display font-semibold text-white text-xl tracking-tight">Semantica</h1>
          </div>

          <nav className="flex flex-col gap-2 font-medium text-sm">
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
            <span
              className="text-zinc-700 cursor-default"
              data-testid="btn-lang-de"
            >
              Deutsch <span className="text-zinc-700 text-xs">(coming soon)</span>
            </span>

            <button
              onClick={() => { setShowTeam(!showTeam); setShowThanks(false); }}
              className={`text-left transition-colors flex items-center gap-1 ${showTeam ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
              data-testid="btn-team"
            >
              {language === 'en' ? 'Team' : '\u00c9quipe'}
              <ChevronDown className={`w-3 h-3 transition-transform ${showTeam ? 'rotate-180' : ''}`} />
            </button>
            {showTeam && (
              <div className="flex flex-col gap-2 pl-2 text-xs">
                <a href="https://fr.linkedin.com/in/raphael-liogier-573573127" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-raphael">Rapha&euml;l Liogier</a>
                <a href="https://fr.linkedin.com/in/sacha-raoult" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-sacha">Sacha Raoult</a>
                <a href="https://www.linkedin.com/in/laura-duparc-52504b215" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-laura">Laura Duparc</a>
                <a href="https://www.linkedin.com/in/eric-parisot-3719bb2a/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-eric">Eric Parisot</a>
                <a href="https://www.linkedin.com/in/sofiane-baddag-743158145" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-sofiane">Sofiane Baddag</a>
              </div>
            )}

            <button
              onClick={() => { setShowThanks(!showThanks); setShowTeam(false); }}
              className={`text-left transition-colors flex items-center gap-1 ${showThanks ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
              data-testid="btn-thanks"
            >
              {language === 'en' ? 'Thanks' : 'Remerciements'}
              <ChevronDown className={`w-3 h-3 transition-transform ${showThanks ? 'rotate-180' : ''}`} />
            </button>
            {showThanks && (
              <div className="flex flex-col gap-2 pl-2 text-xs text-zinc-400">
                <a href="https://www.wittgensteinproject.org/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" data-testid="link-wittgenstein-project">The Wittgenstein Project</a>
                <a href="https://wab.uib.no/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" data-testid="link-wittgenstein-archives">The Wittgenstein Archives</a>
                <a href="https://www.cggg.fr/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" data-testid="link-cggg">Centre Gilles-Gaston Granger</a>
                <span className="text-zinc-400 leading-relaxed">{language === 'en' ? 'The daughter of Gilles-Gaston Granger for the rights of the French translation' : 'La fille de Gilles-Gaston Granger pour les droits de la traduction française'}</span>
                <div className="h-px w-6 bg-zinc-800 my-1"></div>
                <span className="text-zinc-500 italic">{language === 'en' ? 'With the special help of:' : 'Avec l\'aide spéciale de :'}</span>
                <span className="text-zinc-400">SATT Sud Est</span>
                <a href="https://machina.rn" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-machina">Machina Research Network</a>
                <a href="https://chairtransitions.com/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-chair">Chair of Transitions</a>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 text-xs">{language === 'en' ? 'Jump to proposition' : 'Aller à la proposition'}</label>
              <input
                type="text"
                value={jumpTo}
                onChange={(e) => setJumpTo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && jumpTo.trim()) {
                    const el = document.getElementById(`prop-${jumpTo.trim()}`);
                    if (el) {
                      const newCollapsed = new Set(collapsed);
                      const parts = jumpTo.trim().split('.');
                      for (let i = 1; i < parts.length; i++) {
                        const parentId = parts.slice(0, i).join('.');
                        newCollapsed.delete(parentId);
                      }
                      const mainNum = parts[0];
                      newCollapsed.delete(mainNum);
                      setCollapsed(newCollapsed);
                      setTimeout(() => {
                        const target = document.getElementById(`prop-${jumpTo.trim()}`);
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }
                    setJumpTo('');
                  }
                }}
                placeholder={language === 'en' ? 'e.g. 4.21' : 'ex. 4.21'}
                className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 w-full"
                data-testid="input-jump-to"
              />
            </div>

            <Link href="/editor">
              <span className="text-zinc-500 hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer">
                <Database className="w-4 h-4" />
                {language === 'en' ? 'Expression DB' : 'Base d\u2019expressions'}
              </span>
            </Link>

            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/download-project');
                  const blob = await response.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'semantica-project.zip';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error('Download failed:', err);
                }
              }}
              className="flex items-center gap-2 text-zinc-500 hover:text-green-400 transition-colors text-xs"
              data-testid="btn-download-code"
            >
              <Code className="w-3.5 h-3.5" />
              {language === 'en' ? 'Download Source Code' : 'Télécharger le code source'}
            </button>
            <p className="text-xs text-zinc-600 mb-1">
              {language === 'en'
                ? 'The first version of Semantica used an ad hoc BERT model and was registered IDDN FR.001.130034.000.S.C.2022.000.31235 on 23/05/2022. This version uses a completely new architecture and is published under the'
                : 'La première version de Semantica utilisait un modèle BERT ad hoc et a été enregistrée IDDN FR.001.130034.000.S.C.2022.000.31235 le 23/05/2022. Cette version utilise une architecture entièrement nouvelle et est publiée sous la'}{' '}
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
          </nav>
        </aside>

        <main className="flex-1 max-w-2xl md:ml-72">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-2">
              Tractatus Logico-Philosophicus
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              {language === 'en' ? 'by Ludwig Wittgenstein' : 'par Ludwig Wittgenstein'}
            </p>
            <p className="text-zinc-500 max-w-md text-sm leading-relaxed">
              {language === 'en' ? 'Read the Tractatus in a new way. Click the highlighted expressions to explore the semantic structure of the propositions.' : 'Lisez le Tractatus d\u2019une nouvelle mani\u00e8re. Cliquez sur les expressions surlign\u00e9es pour explorer la structure s\u00e9mantique des propositions.'}
            </p>
            <div className="mt-3 flex items-start gap-2 text-amber-500/70 text-xs max-w-md">
              <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>{language === 'en' ? 'This is a beta version. There may still be mistakes in the substitutions.' : 'Ceci est une version b\u00eata. Il peut encore y avoir des erreurs dans les substitutions.'}</p>
            </div>
            <div className="mt-4 text-zinc-600 text-xs leading-relaxed max-w-md italic">
              {language === 'en' ? (
                <p>C.K. Ogden and Ramsey translation (1922). We have replaced every occurrence of &ldquo;atomic fact&rdquo; with &ldquo;state of affairs&rdquo; to better reflect the original German &ldquo;Sachverhalt.&rdquo;</p>
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
                  id={`prop-${proposition.id}`}
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
                  <div className={`text-lg leading-relaxed transition-colors ${proposition.id === '6.36111' ? 'text-purple-200 border border-purple-500/40 bg-purple-500/10 rounded-xl p-4 cursor-pointer hover:bg-purple-500/15 hover:border-purple-500/50' : 'text-zinc-300 group-hover:text-white'}`} onClick={proposition.id === '6.36111' ? (e) => { if ((e.target as HTMLElement).closest('a, .annotation-content')) return; setOpenAnnotation(openAnnotation === '6.36111' ? null : '6.36111'); } : undefined} data-testid={proposition.id === '6.36111' ? 'btn-annotation-6.36111' : undefined}>
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
                    {propositionDiagrams[proposition.id] && (
                      <>
                        {propositionDiagrams[proposition.id].diagram({ isFrench: language === 'fr' })}
                        {language === 'fr' && propositionDiagrams[proposition.id].afterTextFr && (
                          <ParsedText className="whitespace-pre-line" text={propositionDiagrams[proposition.id].afterTextFr!} />
                        )}
                        {language === 'en' && propositionDiagrams[proposition.id].afterTextEn && (
                          <ParsedText className="whitespace-pre-line" text={propositionDiagrams[proposition.id].afterTextEn!} />
                        )}
                      </>
                    )}

                    {proposition.id === '6.36111' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === '6.36111' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid="annotation-6.36111">
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>This passage has been noted as an explicit opposition to <a href="#kant-passage" onClick={(e) => { e.preventDefault(); document.getElementById('kant-passage')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-kant-prolegomena"><em>Prolegomena to All Future Metaphysics</em></a> by Immanuel Kant.</>
                                    : <>Ce passage a été noté comme une opposition explicite aux <a href="#kant-passage" onClick={(e) => { e.preventDefault(); document.getElementById('kant-passage')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-kant-prolegomena"><em>Prolégomènes à toute métaphysique future</em></a> d'Immanuel Kant.</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3">
                                  {language === 'en'
                                    ? 'Contributor: Laura Duparc, University Mohammed VI Polytech, based on data collected by the Wittgenstein Archives.'
                                    : 'Contributrice\u00a0: Laura Duparc, Université Mohammed VI Polytechnique, sur la base des données collectées par les Archives Wittgenstein.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs">
                                  {language === 'en'
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website">LEGACY website</a>.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer à ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website">site LEGACY</a>.</>
                                  }
                                </p>
                              </div>

                              <div id="kant-passage" className="annotation-content mt-4 p-5 rounded-xl border border-purple-500/20 bg-purple-900/10 scroll-mt-24">
                                <p className="text-xs text-purple-400/70 uppercase tracking-wider mb-2 font-medium">
                                  {language === 'en' ? 'Immanuel Kant — Prolegomena to All Future Metaphysics' : 'Immanuel Kant — Prolégomènes à toute métaphysique future'}
                                </p>
                                <blockquote className="text-purple-200/80 text-sm leading-relaxed italic border-l-2 border-purple-500/30 pl-4">
                                  {language === 'en'
                                    ? 'What can be more similar in every respect and in every part more alike to my hand and to my ear, than their images in a mirror? And yet I cannot put such a hand as is seen in the glass in the place of its archetype; for if this is a right hand, that in the glass is a left one, and the image or reflexion of the right ear is a left one which never can serve as a substitute for the other. There are in this case no internal differences which our understanding could determine by thinking alone. Yet the differences are internal as the senses teach, for, notwithstanding their complete equality and similarity, the left hand cannot be enclosed in the same bounds as the right one (they are not congruent); the glove of one hand cannot be used for the other.'
                                    : "Qu'y a-t-il de plus semblable à ma main ou à mon oreille, et de plus égal en toutes les parties, que leur image dans le miroir\u00a0? Et pourtant, je ne puis mettre à la place de l'original la main telle qu'elle se voit dans le miroir\u00a0; car si cette main est une main droite, la main du miroir est une main gauche, et l'image de l'oreille droite est une oreille gauche qui ne saurait jamais servir d'oreille droite. Il n'y a point en ce cas de différences internes qu'aucun entendement puisse penser\u00a0; et pourtant les différences sont internes autant que les sens l'enseignent, car malgré toute leur égalité et toute leur ressemblance réciproques, la main gauche ne peut être enfermée dans les mêmes limites que la main droite (elles ne sont pas congruentes), et le gant de l'une ne peut servir pour l'autre."
                                  }
                                </blockquote>
                                <p className="text-xs text-purple-400/50 mt-2 text-right">
                                  <a href="https://legacy-um6p.1337.ma/projects/library/w94c6luruazo6ipkpisvj4on-immanuel-kant/ji2ahv5fpzgfhs1cs99a27ab" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors underline underline-offset-2" data-testid="link-legacy-source">
                                    {language === 'en' ? 'Source: LEGACY Library' : 'Source\u00a0: Bibliothèque LEGACY'}
                                  </a>
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
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
