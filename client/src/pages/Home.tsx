import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarSphere from '@/components/StarSphere';
import { SemanticWord } from '@/components/SemanticWord';
import { LogicWord } from '@/components/LogicWord';
import { MathLogicWord } from '@/components/MathLogicWord';
import { MathText } from '@/components/MathText';
import { tractatusEnglishRaw, tractatusFrenchRaw, tractatusGermanRaw } from '@/data/tractatusRaw';
import { prefaceEN, prefaceFR, prefaceDE, type PrefaceData } from '@/data/prefaceData';
import { useSemantic } from '@/context/SemanticContext';
import { parseSemantic, Segment } from '@/lib/semanticParser';
import { applyGrammarAdaptations } from '@/lib/grammarAdaptations';
import { Link } from 'wouter';
import { Database, ChevronDown, MessageSquare, X, Sparkles, Eye, EyeOff, Code, BookOpen, GitBranch, HelpCircle } from 'lucide-react';
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

function PropositionSegments({ segments, propositionId, language }: { segments: Segment[]; propositionId: string; language: string }) {
  const [swaps, setSwaps] = useState<Record<string, string>>({});

  const handleSwap = useCallback((original: string, selected: string) => {
    const key = original.toLowerCase();
    const val = selected.toLowerCase();
    setSwaps(prev => {
      if (prev[key] === val) return prev;
      return { ...prev, [key]: val };
    });
  }, []);

  return (
    <>
      {segments.map((segment, idx) => {
        if (segment.type === 'text') {
          const adapted = applyGrammarAdaptations(segment.content, propositionId, language, swaps);
          return <MathText key={idx} text={adapted} />;
        } else if (segment.type === 'semantic') {
          return (
            <SemanticWord
              key={idx}
              original={segment.original}
              alternatives={segment.alternatives}
              groupId={segment.groupId}
              onSwap={handleSwap}
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
    </>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'fr' | 'de'>('en');
  const [showTeam, setShowTeam] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showParticles, setShowParticles] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackPropId, setFeedbackPropId] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMode, setFeedbackMode] = useState<'feedback' | 'contact'>('feedback');
  const [jumpTo, setJumpTo] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackPropError, setFeedbackPropError] = useState('');
  const [openAnnotation, setOpenAnnotation] = useState<string | null>(null);
  const [showPreface, setShowPreface] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [verifiedUpTo, setVerifiedUpTo] = useState('2.01');
  const { synonymGroups } = useSemantic();

  useEffect(() => {
    fetch('/api/settings/verified_up_to')
      .then(r => r.json())
      .then(data => { if (data.value) setVerifiedUpTo(data.value); })
      .catch(() => {});
  }, []);

  const preface: PrefaceData = language === 'en' ? prefaceEN : language === 'de' ? prefaceDE : prefaceFR;
  const rawData = language === 'en' ? tractatusEnglishRaw : language === 'de' ? tractatusGermanRaw : tractatusFrenchRaw;
  const activeGroups = useMemo(() => synonymGroups.filter(g => g.language === language), [synonymGroups, language]);
  const allIds = useMemo(() => rawData?.map(p => p.id) || [], [rawData]);

  const parsedData = useMemo(() => {
    if (!rawData) return [];
    
    const contentTransforms: Record<string, (text: string) => string> = {
      '4.31': (text) => text.replace(/\n\np\n\nq\n\nr[\s\S]*$/, ''),
      '5.101': (text) => {
        const marker = text.indexOf('\n\n(');
        if (marker === -1) return text;
        const afterText = language === 'fr'
          ? '\n\nÀ ces possibilités de vérité de ses arguments de vérité qui vérifient une proposition, je donnerai le nom de fondements de vérité de cette proposition.'
          : language === 'de'
          ? '\n\nDiejenigen Wahrheitsmöglichkeiten seiner Wahrheitsargumente, welche den Satz bewahrheiten, will ich seine Wahrheitsgründe nennen.'
          : '\n\nThose truth-possibilities of its truth-arguments, which verify the proposition, I shall call its truth-grounds.';
        return text.substring(0, marker) + afterText;
      },
    };

    return rawData.map(prop => {
      const transform = contentTransforms[prop.id];
      const content = transform ? transform(prop.content) : prop.content;
      return {
        ...prop,
        segments: parseSemantic(content, activeGroups, prop.id, language)
      };
    });
  }, [rawData, activeGroups, language]);

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
    if (feedbackMode === 'contact' && !feedbackEmail.trim()) return;
    if (feedbackMode === 'feedback' && feedbackPropId.trim() && !allIds.includes(feedbackPropId.trim())) {
      if (feedbackPropId.trim() === '3.6') {
        setFeedbackPropError(
          language === 'fr'
            ? "Menteur ! Cette proposition n'existe pas ! Sauf si vous avez juste fait une erreur, dans ce cas nous sommes vraiment désolés d'avoir douté de vous..."
            : language === 'de'
            ? "Lügner! Einen solchen Satz gibt es nicht! Es sei denn, Sie haben sich geirrt, in diesem Fall tut es uns sehr leid, an Ihnen gezweifelt zu haben..."
            : "You are a liar! Such proposition does not exist! Unless maybe you just made a mistake, in that case we're very sorry to have been doubting you..."
        );
      } else {
        setFeedbackPropError(
          language === 'fr'
            ? "Cette proposition n'existe pas dans le Tractatus."
            : language === 'de'
            ? "Dieser Satz existiert nicht im Tractatus."
            : "This proposition does not exist in the Tractatus."
        );
      }
      return;
    }
    setFeedbackPropError('');
    setFeedbackSending(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propositionId: feedbackMode === 'feedback' ? (feedbackPropId || 'general') : 'contact',
          language,
          message: feedbackMessage.trim(),
          name: feedbackName.trim() || null,
          email: feedbackMode === 'contact' ? feedbackEmail.trim() : null,
          type: feedbackMode,
        }),
      });
      setFeedbackSent(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackPropId('');
        setFeedbackMessage('');
        setFeedbackName('');
        setFeedbackEmail('');
        setFeedbackMode('feedback');
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
        <div className="fixed top-1/2 right-[-50%] -translate-y-1/2 w-[250vw] h-[250vw] md:w-[1200px] md:h-[1200px] md:right-[-30%] opacity-60 pointer-events-none z-0">
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
          <button
            onClick={() => setLanguage('de')}
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors font-medium ${language === 'de' ? 'text-white border-white/30 bg-white/10' : 'text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}
            data-testid="btn-lang-de-mobile"
          >
            DE
          </button>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-amber-500/80 border border-amber-500/30 rounded-full px-2.5 py-0.5 bg-amber-500/5 font-medium" data-testid="badge-beta">
          Beta
        </span>
        <button
          onClick={() => setShowParticles(!showParticles)}
          className="w-8 h-8 rounded-full border border-zinc-700 hover:border-zinc-500 flex items-center justify-center transition-colors text-zinc-500 hover:text-zinc-300"
          title={showParticles ? (language === 'fr' ? 'Masquer les particules' : language === 'de' ? 'Partikel ausblenden' : 'Hide particles') : (language === 'fr' ? 'Afficher les particules' : language === 'de' ? 'Partikel anzeigen' : 'Show particles')}
          data-testid="btn-toggle-particles"
        >
          {showParticles ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setShowFeedback(true)}
          className="w-8 h-8 rounded-full border border-zinc-700 hover:border-green-500/50 flex items-center justify-center transition-colors text-zinc-500 hover:text-green-400"
          title={language === 'fr' ? 'Signaler une erreur' : language === 'de' ? 'Fehler melden' : 'Report a mistake'}
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
                <h3 className="text-white font-display font-medium">
                  {feedbackMode === 'contact'
                    ? (language === 'fr' ? 'Nous contacter' : language === 'de' ? 'Kontakt' : 'Contact Us')
                    : (language === 'fr' ? 'Signaler une erreur' : language === 'de' ? 'Fehler melden' : 'Report a Mistake')}
                </h3>
                <button onClick={() => setShowFeedback(false)} className="text-zinc-500 hover:text-white" data-testid="btn-close-feedback">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {feedbackSent ? (
                <p className="text-green-400 text-sm py-4">{language === 'fr' ? 'Merci pour votre retour\u00a0!' : language === 'de' ? 'Vielen Dank für Ihr Feedback!' : 'Thank you for your feedback!'}</p>
              ) : (
                <>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => { setFeedbackMode('feedback'); setFeedbackPropError(''); }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${feedbackMode === 'feedback' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                      data-testid="btn-mode-feedback"
                    >
                      {language === 'fr' ? 'Signaler une erreur' : language === 'de' ? 'Fehler melden' : 'Report Issue'}
                    </button>
                    <button
                      onClick={() => { setFeedbackMode('contact'); setFeedbackPropError(''); }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${feedbackMode === 'contact' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                      data-testid="btn-mode-contact"
                    >
                      {language === 'fr' ? 'Nous contacter' : language === 'de' ? 'Kontakt' : 'Contact Us'}
                    </button>
                  </div>
                  {feedbackMode === 'feedback' ? (
                    <p className="text-zinc-500 text-xs mb-4">{language === 'fr' ? 'Vous avez trouvé une substitution manquante ou incorrecte\u00a0? Faites-le nous savoir.' : language === 'de' ? 'Eine fehlende oder falsche Substitution gefunden? Lassen Sie es uns wissen.' : "Found a missing or incorrect substitution? Let us know and we'll fix it."}</p>
                  ) : (
                    <p className="text-zinc-500 text-xs mb-4">{language === 'fr' ? 'Envoyez-nous un message et nous vous répondrons.' : language === 'de' ? 'Senden Sie uns eine Nachricht und wir melden uns bei Ihnen.' : 'Send us a message and we\'ll get back to you.'}</p>
                  )}
                  <input
                    type="text"
                    placeholder={language === 'fr' ? "Votre nom (affiché comme contributeur)" : language === 'de' ? "Ihr Name (wird als Mitwirkender angezeigt)" : "Your name (displayed as contributor)"}
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 mb-2 focus:outline-none focus:border-green-500/50"
                    data-testid="input-feedback-name"
                  />
                  {feedbackMode === 'contact' && (
                    <input
                      type="email"
                      placeholder={language === 'fr' ? "Votre email" : language === 'de' ? "Ihre E-Mail" : "Your email"}
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 mb-2 focus:outline-none focus:border-green-500/50"
                      data-testid="input-feedback-email"
                    />
                  )}
                  {feedbackMode === 'feedback' && (
                    <>
                      <input
                        type="text"
                        placeholder={language === 'fr' ? "Numéro de proposition (ex. 3.141)" : language === 'de' ? "Satznummer (z.B. 3.141)" : "Proposition number (e.g. 3.141)"}
                        value={feedbackPropId}
                        onChange={(e) => { setFeedbackPropId(e.target.value); setFeedbackPropError(''); }}
                        className={`w-full bg-zinc-800 border rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 mb-1 focus:outline-none ${feedbackPropError ? 'border-red-500/70' : 'border-zinc-700 focus:border-green-500/50'}`}
                        data-testid="input-feedback-prop"
                      />
                      {feedbackPropError && (
                        <p className="text-red-400 text-xs mb-2 italic" data-testid="text-feedback-prop-error">{feedbackPropError}</p>
                      )}
                      {!feedbackPropError && <div className="mb-1" />}
                    </>
                  )}
                  <textarea
                    placeholder={feedbackMode === 'contact'
                      ? (language === 'fr' ? "Votre message..." : language === 'de' ? "Ihre Nachricht..." : "Your message...")
                      : (language === 'fr' ? "Décrivez le problème..." : language === 'de' ? "Beschreiben Sie das Problem..." : "Describe the issue...")}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 mb-4 h-24 resize-none focus:outline-none focus:border-green-500/50"
                    data-testid="input-feedback-message"
                  />
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={feedbackSending || !feedbackMessage.trim() || (feedbackMode === 'contact' && !feedbackEmail.trim())}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    data-testid="btn-submit-feedback"
                  >
                    {feedbackSending
                      ? (language === 'fr' ? 'Envoi...' : language === 'de' ? 'Wird gesendet...' : 'Sending...')
                      : (language === 'fr' ? 'Envoyer' : language === 'de' ? 'Senden' : 'Send')}
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
            <p className="text-white text-xs leading-relaxed">{language === 'fr' ? <>Un projet en Humanités Computationnelles de la Chair of Transitions</> : language === 'de' ? <>Ein Projekt der Computational Humanities vom Chair of Transitions</> : <>A project in Computational Humanities by the Chair of Transitions</>}</p>
          </div>

          <nav className="flex flex-col gap-2 font-medium text-sm">
            <button 
              onClick={() => setLanguage('en')}
              className={`text-left transition-colors ${language === 'en' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              data-testid="btn-lang-en"
            >
              English
            </button>
            <button 
              onClick={() => setLanguage('fr')}
              className={`text-left transition-colors ${language === 'fr' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              data-testid="btn-lang-fr"
            >
              Fran&ccedil;ais
            </button>
            <button 
              onClick={() => setLanguage('de')}
              className={`text-left transition-colors ${language === 'de' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              data-testid="btn-lang-de"
            >
              Deutsch
            </button>

            <button
              onClick={() => { setShowTeam(!showTeam); setShowThanks(false); }}
              className={`text-left transition-colors flex items-center gap-1 ${showTeam ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              data-testid="btn-team"
            >
              {language === 'fr' ? '\u00c9quipe' : language === 'de' ? 'Team' : 'Team'}
              <ChevronDown className={`w-3 h-3 transition-transform ${showTeam ? 'rotate-180' : ''}`} />
            </button>
            {showTeam && (
              <div className="flex flex-col gap-2 pl-2 text-xs">
                <a href="https://fr.linkedin.com/in/raphael-liogier-573573127" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-raphael">Rapha&euml;l Liogier</a>
                <a href="https://www.linkedin.com/in/laura-duparc-52504b215" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-laura">Laura Duparc</a>
                <a href="https://www.linkedin.com/in/eric-parisot-3719bb2a/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-eric">Eric Parisot</a>
                <a href="https://www.linkedin.com/in/sofiane-baddag-743158145" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-sofiane">Sofiane Baddag</a>
                <span className="text-zinc-400" data-testid="link-camille">Camille Bertrand</span>
                <span className="text-zinc-400" data-testid="link-emma">Emma Alvarez-Seuron</span>
              </div>
            )}

            <button
              onClick={() => { setShowThanks(!showThanks); setShowTeam(false); }}
              className={`text-left transition-colors flex items-center gap-1 ${showThanks ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              data-testid="btn-thanks"
            >
              {language === 'fr' ? 'Remerciements' : language === 'de' ? 'Danksagungen' : 'Thanks'}
              <ChevronDown className={`w-3 h-3 transition-transform ${showThanks ? 'rotate-180' : ''}`} />
            </button>
            {showThanks && (
              <div className="flex flex-col gap-2 pl-2 text-xs text-zinc-400">
                <a href="https://www.wittgensteinproject.org/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" data-testid="link-wittgenstein-project">The Wittgenstein Project</a>
                <a href="https://wab.uib.no/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" data-testid="link-wittgenstein-archives">The Wittgenstein Archives</a>
                <a href="https://www.cggg.fr/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors" data-testid="link-cggg">Centre Gilles-Gaston Granger</a>
                <span className="text-zinc-400 leading-relaxed">{language === 'fr' ? 'La fille de Gilles-Gaston Granger pour les droits de la traduction française' : language === 'de' ? 'Die Tochter von Gilles-Gaston Granger für die Rechte der französischen Übersetzung' : 'The daughter of Gilles-Gaston Granger for the rights of the French translation'}</span>
                <span className="text-zinc-400 leading-relaxed">David Stern</span>
                <div className="h-px w-6 bg-zinc-800 my-1"></div>
                <span className="text-zinc-500 italic">{language === 'fr' ? 'Avec l\'aide spéciale de :' : language === 'de' ? 'Mit besonderer Hilfe von:' : 'With the special help of:'}</span>
                <span className="text-zinc-400">SATT Sud Est</span>
                <span className="text-zinc-400" data-testid="link-machina">Machina Research Network</span>
                <a href="https://www.iufrance.fr/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-iuf">Institut Universitaire de France</a>
                <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-green-400 transition-colors" data-testid="link-legacy-thanks">LEGACY project</a>
              </div>
            )}

            <a href="https://www.wittgensteinproject.org/w/index.php/Blog:How_to_Keep_Track_of_the_Wittgensteinian_World" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-400 transition-colors text-xs underline underline-offset-2" data-testid="link-wittgenstein-blog">{language === 'fr' ? 'Comment suivre le monde wittgensteinien' : language === 'de' ? 'Die Wittgenstein-Welt im Blick behalten' : 'How to keep track of the Wittgenstein World'}</a>

            <div className="flex flex-col gap-1">
              <label className="text-white text-xs">{language === 'fr' ? 'Aller à la proposition' : language === 'de' ? 'Zum Satz springen' : 'Jump to proposition'}</label>
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
                placeholder={language === 'fr' ? 'ex. 4.21' : 'e.g. 4.21'}
                className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 w-full"
                data-testid="input-jump-to"
              />
            </div>

            <button
              onClick={() => setShowFaq(!showFaq)}
              className={`text-left transition-colors flex items-center gap-2 ${showFaq ? 'text-green-400' : 'text-white hover:text-green-400'}`}
              data-testid="btn-faq"
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </button>

            <Link href="/editor">
              <span className="text-white hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer">
                <Database className="w-4 h-4" />
                {language === 'fr' ? 'Base d\u2019expressions' : language === 'de' ? 'Ausdrucks-DB' : 'Expression DB'}
              </span>
            </Link>

            <Link href={`/graph?lang=${language}`}>
              <span className="text-white hover:text-green-400 transition-colors flex items-center gap-2 cursor-pointer" data-testid="link-graph">
                <GitBranch className="w-4 h-4" />
                {language === 'fr' ? 'Graphe de connexions' : language === 'de' ? 'Verbindungsgraph' : 'Connexion Graph'}
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
              className="flex items-center gap-2 text-white hover:text-green-400 transition-colors text-xs"
              data-testid="btn-download-code"
            >
              <Code className="w-3.5 h-3.5" />
              {language === 'fr' ? 'Télécharger le code source' : language === 'de' ? 'Quellcode herunterladen' : 'Download Source Code'}
            </button>
            <p className="text-xs text-white mb-1">
              {language === 'fr'
                ? 'La première version de Semantica utilisait un modèle BERT ad hoc et a été enregistrée IDDN FR.001.130034.000.S.C.2022.000.31235 le 23/05/2022. Cette version utilise une architecture entièrement nouvelle et est publiée sous la'
                : language === 'de'
                ? 'Die erste Version von Semantica verwendete ein ad hoc BERT-Modell und wurde am 23.05.2022 unter IDDN FR.001.130034.000.S.C.2022.000.31235 registriert. Diese Version verwendet eine völlig neue Architektur und wird unter der'
                : 'The first version of Semantica used an ad hoc BERT model and was registered IDDN FR.001.130034.000.S.C.2022.000.31235 on 23/05/2022. This version uses a completely new architecture and is published under the'}{' '}
              <a
                href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-green-400 transition-colors underline underline-offset-2"
                data-testid="link-license"
              >
                GNU General Public License v3.0
              </a>
            </p>
          </nav>
        </aside>

        <main className="flex-1 max-w-2xl md:ml-72">
          {showFaq ? (
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-6">
                {language === 'fr' ? 'Foire Aux Questions' : language === 'de' ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-white font-display font-medium text-lg mb-2" data-testid="faq-q1">
                    {language === 'fr' ? 'Qui êtes-vous\u00a0?' : language === 'de' ? 'Wer seid ihr?' : 'Who are you?'}
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    {language === 'fr'
                      ? <>Nous sommes une équipe de recherche affiliée à la Chair of Transitions de l'Université Mohammed VI Polytechnique et au Machina Research Network. Nos travaux portent sur les intersections entre philosophie, épistémologie, et les humanités numériques et computationnelles.</>
                      : language === 'de'
                      ? <>Wir sind ein Forschungsteam, das mit dem Chair of Transitions der Mohammed VI Polytechnic University und dem Machina Research Network verbunden ist. Unsere Arbeit konzentriert sich auf die Schnittstellen zwischen Philosophie, Epistemologie und den digitalen und computerbasierten Geisteswissenschaften.</>
                      : <>We are a research team affiliated with the Chair of Transitions at Mohammed VI Polytechnic University and the Machina Research Network. Our work focuses on the intersections between philosophy, epistemology, and the digital and computational humanities.</>
                    }
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-display font-medium text-lg mb-2" data-testid="faq-q2">
                    {language === 'fr' ? 'Qu\'est-ce que Semantica\u00a0?' : language === 'de' ? 'Was ist Semantica?' : 'What is Semantica?'}
                  </h3>
                  <div className="text-white text-sm leading-relaxed space-y-2">
                    <p>
                      {language === 'fr'
                        ? 'Semantica est une nouvelle façon de lire la philosophie. Elle transforme des textes philosophiques complexes en environnements interactifs équipés d\'outils qui aident lecteurs et chercheurs dans l\'analyse textuelle approfondie.'
                        : language === 'de'
                        ? 'Semantica ist eine neue Art, Philosophie zu lesen. Es verwandelt komplexe philosophische Texte in interaktive Umgebungen mit Werkzeugen, die sowohl Leser als auch Forscher bei der tiefgehenden Textanalyse unterstützen.'
                        : 'Semantica is a new way of reading philosophy. It transforms complex philosophical texts into interactive environments equipped with tools that support both readers and researchers in deep textual analysis.'}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-white">
                      <li>{language === 'fr' ? <>Quand l'auteur définit une équivalence entre deux termes, ceux-ci apparaissent en <span className="text-green-400">vert</span> et peuvent être substitués l'un à l'autre.</> : language === 'de' ? <>Wenn der Autor eine Äquivalenz zwischen zwei Begriffen definiert, erscheinen diese in <span className="text-green-400">Grün</span> und können gegeneinander ausgetauscht werden.</> : <>When the author defines an equivalence between two terms, those terms appear in <span className="text-green-400">green</span> and can be substituted for one another.</>}</li>
                      <li>{language === 'fr' ? <>Quand l'auteur utilise des expressions mathématiques ou logiques formelles, celles-ci apparaissent en <span className="text-blue-400">bleu</span> et peuvent être traduites dans un langage plus accessible.</> : language === 'de' ? <>Wenn der Autor formale mathematische oder logische Ausdrücke verwendet, erscheinen diese in <span className="text-blue-400">Blau</span> und können in verständlichere Sprache übersetzt werden.</> : <>When the author uses formal mathematical or logical expressions, these appear in <span className="text-blue-400">blue</span> and can be translated into more accessible language.</>}</li>
                      <li>{language === 'fr' ? <>Quand l'auteur fait référence à un texte externe, la référence apparaît en <span className="text-purple-400">violet</span> et peut être affichée directement.</> : language === 'de' ? <>Wenn der Autor auf einen externen Text verweist, erscheint die Referenz in <span className="text-purple-400">Violett</span> und kann direkt angezeigt werden.</> : <>When the author refers to an external text, the reference appears in <span className="text-purple-400">purple</span> and can be displayed directly.</>}</li>
                    </ul>
                    <p className="text-white">
                      {language === 'fr'
                        ? 'L\'objectif est de rendre les œuvres philosophiques difficiles plus navigables sans réduire leur rigueur conceptuelle.'
                        : language === 'de'
                        ? 'Das Ziel ist es, schwierige philosophische Werke zugänglicher zu machen, ohne ihre konzeptuelle Strenge zu reduzieren.'
                        : 'The goal is to make difficult philosophical works more navigable without reducing their conceptual rigor.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-display font-medium text-lg mb-2" data-testid="faq-q3">
                    {language === 'fr' ? 'Comment cette information est-elle construite\u00a0?' : language === 'de' ? 'Wie werden diese Informationen erstellt?' : 'How is this information constructed?'}
                  </h3>
                  <div className="text-white text-sm leading-relaxed space-y-2">
                    <p>
                      {language === 'fr'
                        ? 'Les expressions substituables sont développées par un processus hybride\u00a0:'
                        : language === 'de'
                        ? 'Substituierbare Ausdrücke werden durch einen hybriden Prozess entwickelt:'
                        : 'Substitutable expressions are developed through a hybrid process:'}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-white">
                      <li>{language === 'fr' ? 'Manuellement par l\'équipe éditoriale du projet' : language === 'de' ? 'Manuell durch das Redaktionsteam des Projekts' : 'Manually by the project\'s editorial team'}</li>
                      <li>{language === 'fr' ? 'Avec l\'aide de modèles de langage qui génèrent des suggestions, ensuite revues et validées par l\'équipe' : language === 'de' ? 'Mit Unterstützung von Sprachmodellen, die Vorschläge generieren, die dann vom Team überprüft und validiert werden' : 'With assistance from language models that generate suggestions, which are then reviewed and validated by the team'}</li>
                      <li>{language === 'fr' ? 'Par des contributions participatives des utilisateurs, qui peuvent proposer des synonymes ou expressions équivalentes via le bouton de retour' : language === 'de' ? 'Durch partizipative Beiträge von Nutzern, die über den Feedback-Button Synonyme oder äquivalente Ausdrücke vorschlagen können' : 'Through participatory contributions from users, who can propose synonyms or equivalent expressions via the feedback button'}</li>
                    </ul>
                    <p className="text-white">
                      {language === 'fr'
                        ? <>L'intelligence artificielle est utilisée à certaines étapes, mais tous les résultats ont été validés par des experts humains jusqu'à la proposition {verifiedUpTo}.</>
                        : language === 'de'
                        ? <>Künstliche Intelligenz wird in bestimmten Phasen eingesetzt, aber alle Ergebnisse wurden von menschlichen Experten bis Satz {verifiedUpTo} validiert.</>
                        : <>Artificial intelligence is used at certain stages, but all outputs have been validated by human experts up to proposition {verifiedUpTo}.</>}
                    </p>
                    <p className="text-white">
                      {language === 'fr'
                        ? 'Les connexions à d\'autres œuvres sont établies sur la base de recherches philologiques et ne sont pas automatisées. Ces sources philologiques sont mentionnées dans les crédits du projet, notamment les Archives Wittgenstein et le projet LEGACY.'
                        : language === 'de'
                        ? 'Verbindungen zu anderen Werken werden auf der Grundlage philologischer Forschung hergestellt und sind nicht automatisiert. Diese philologischen Quellen werden in den Projektcredits anerkannt, insbesondere die Wittgenstein-Archive und das LEGACY-Projekt.'
                        : 'Connections to other works are established on the basis of philological research and are not automated. These philological sources are acknowledged in the project\'s credits, particularly the Wittgenstein Archives and the Legacy Project.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-display font-medium text-lg mb-2" data-testid="faq-q4">
                    {language === 'fr' ? 'Comment puis-je contribuer\u00a0?' : language === 'de' ? 'Wie kann ich beitragen?' : 'How can I contribute?'}
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    {language === 'fr'
                      ? 'Vous pouvez contribuer en utilisant le bouton de retour pour nous contacter et proposer des suggestions ou des améliorations. Nous créditons tous les contributeurs.'
                      : language === 'de'
                      ? 'Sie können beitragen, indem Sie den Feedback-Button verwenden, um uns zu kontaktieren und Vorschläge oder Verbesserungen vorzuschlagen. Wir würdigen alle Mitwirkenden.'
                      : 'You can contribute by using the feedback button to contact us and propose suggestions or improvements. We credit all contributors.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-display font-medium text-lg mb-2" data-testid="faq-q5">
                    {language === 'fr'
                      ? 'Pourquoi certains mots ne sont-ils pas substituables dans certaines propositions\u00a0?'
                      : language === 'de'
                      ? 'Warum sind manche Wörter in bestimmten Sätzen nicht austauschbar?'
                      : 'Why are some words not swappable in certain propositions?'}
                  </h3>
                  <div className="text-white text-sm leading-relaxed space-y-3">
                    <p>
                      {language === 'fr'
                        ? 'Wittgenstein utilise parfois un même mot tantôt dans son acception technique précise, tantôt dans un sens plus courant et flexible. Lorsqu\'un mot est employé dans son sens ordinaire plutôt que dans sa définition philosophique stricte, la substitution par un équivalent technique serait trompeuse — c\'est pourquoi elle est désactivée dans ces propositions.'
                        : language === 'de'
                        ? 'Wittgenstein verwendet manchmal dasselbe Wort sowohl in seiner präzisen technischen Bedeutung als auch in einem alltäglicheren, flexibleren Sinn. Wenn ein Wort in seiner gewöhnlichen Bedeutung statt in seiner strengen philosophischen Definition verwendet wird, wäre die Substitution durch ein technisches Äquivalent irreführend — deshalb ist sie in diesen Sätzen deaktiviert.'
                        : 'Wittgenstein sometimes uses the same word both in its precise technical sense and in a more colloquial, flexible everyday sense. When a word is used in its ordinary meaning rather than in its strict philosophical definition, substituting it with a technical equivalent would be misleading — so the swap is disabled in those propositions.'}
                    </p>
                    <p>
                      {language === 'fr'
                        ? 'Par exemple\u00a0:'
                        : language === 'de'
                        ? 'Zum Beispiel:'
                        : 'For example:'}
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        {language === 'fr'
                          ? <>Le mot «\u00a0<span className="text-green-400">pensée</span>\u00a0» est défini comme «\u00a0l'image logique des faits\u00a0» (3), mais dans l'Avant-propos, Wittgenstein écrit «\u00a0la vérité des pensées\u00a0» dans un sens plus général et philosophiquement courant.</>
                          : language === 'de'
                          ? <>Das Wort «<span className="text-green-400">Gedanke</span>» wird als «das logische Bild der Tatsachen» definiert (3), aber im Vorwort schreibt Wittgenstein «die Wahrheit der Gedanken» in einem allgemeineren, philosophisch gebräuchlichen Sinn.</>
                          : <>The word "<span className="text-green-400">thought</span>" is defined as "the logical picture of the facts" (3), but in the Foreword, Wittgenstein writes "the truth of the thoughts" in a more general, philosophically common sense.</>}
                      </li>
                      <li>
                        {language === 'fr'
                          ? <>Le mot «\u00a0<span className="text-green-400">mot</span>\u00a0» est synonyme de «\u00a0nom\u00a0» ou «\u00a0signe simple\u00a0» dans le Tractatus, mais en 3.323, Wittgenstein l'emploie dans son sens courant pour décrire comment «\u00a0le même mot désigne de deux manières différentes\u00a0».</>
                          : language === 'de'
                          ? <>Das Wort «<span className="text-green-400">Wort</span>» ist im Tractatus gleichbedeutend mit «Name» oder «einfaches Zeichen», aber in 3.323 verwendet Wittgenstein es im alltäglichen Sinn, um zu beschreiben, wie «dasselbe Wort auf verschiedene Art und Weise bezeichnet».</>
                          : <>The word "<span className="text-green-400">word</span>" is synonymous with "name" or "simple sign" in the Tractatus, but in 3.323, Wittgenstein uses it in its ordinary sense to describe how "the same word signifies in two different ways".</>}
                      </li>
                      <li>
                        {language === 'fr'
                          ? <>De même, «\u00a0<span className="text-green-400">langue</span>\u00a0» est défini comme «\u00a0la totalité des propositions\u00a0» (4.001), mais en 3.323, il désigne simplement «\u00a0la langue de tous les jours\u00a0» au sens habituel du terme.</>
                          : language === 'de'
                          ? <>Ebenso wird «<span className="text-green-400">Sprache</span>» als «die Gesamtheit der Sätze» definiert (4.001), aber in 3.323 bezeichnet es einfach die «Umgangssprache» im üblichen Sinne.</>
                          : <>Similarly, "<span className="text-green-400">language</span>" is defined as "the totality of propositions" (4.001), but in 3.323, it simply means "the language of everyday life" in the ordinary sense.</>}
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-display font-medium text-lg mb-2" data-testid="faq-q6">
                    {language === 'fr' ? 'Est-ce un projet open source\u00a0?' : language === 'de' ? 'Ist dies ein Open-Source-Projekt?' : 'Is this an open-source project?'}
                  </h3>
                  <p className="text-white text-sm leading-relaxed">
                    {language === 'fr'
                      ? 'Oui. Le projet Semantica est entièrement open source. Vous pouvez télécharger à la fois le code et la base de données. Le projet est publié sous la licence GNU 3.0.'
                      : language === 'de'
                      ? 'Ja. Das Semantica-Projekt ist vollständig Open Source. Sie können sowohl den Code als auch die Datenbank herunterladen. Das Projekt wird unter der GNU 3.0 Lizenz veröffentlicht.'
                      : 'Yes. The Semantica project is fully open source. You can download both the code and the database. The project is released under the GNU 3.0 license.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowFaq(false)}
                className="mt-8 text-sm text-green-400 hover:text-green-300 transition-colors underline underline-offset-2"
                data-testid="btn-back-to-tractatus"
              >
                {language === 'fr' ? '\u2190 Retour au Tractatus' : language === 'de' ? '\u2190 Zurück zum Tractatus' : '\u2190 Back to the Tractatus'}
              </button>
            </div>
          ) : (
          <>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-2">
              Tractatus Logico-Philosophicus
            </h2>
            <p className="text-white text-sm mb-4">
              {language === 'fr' ? 'par Ludwig Wittgenstein' : language === 'de' ? 'von Ludwig Wittgenstein' : 'by Ludwig Wittgenstein'}
            </p>
            <p className="text-white max-w-md text-sm leading-relaxed">
              {language === 'fr' ? <>Cliquez sur les expressions en <span className="text-green-400">vert</span> pour permuter des équivalents sémantiques, sur les expressions en <span className="text-blue-400">bleu</span> pour basculer en notation logique, et sur les encadrés <span className="text-purple-400">violets</span> pour découvrir des connexions à d'autres textes philosophiques.</> : language === 'de' ? <>Klicken Sie auf <span className="text-green-400">grüne</span> Ausdrücke, um semantische Äquivalente auszutauschen, auf <span className="text-blue-400">blaue</span> Ausdrücke, um die logische Notation umzuschalten, und auf <span className="text-purple-400">violette</span> Kästen, um Verbindungen zu anderen philosophischen Texten zu entdecken.</> : <>Click on <span className="text-green-400">green</span> expressions to swap semantic equivalents, <span className="text-blue-400">blue</span> expressions to toggle logical notation, and <span className="text-purple-400">purple</span> boxes to discover connections to other philosophical texts.</>}
            </p>
            <div className={`mt-3 flex items-start gap-2 text-xs max-w-md ${language === 'de' ? 'text-amber-500/90 border border-amber-500/30 rounded-lg p-3 bg-amber-500/5' : 'text-amber-500/70'}`}>
              <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <p>{language === 'fr' ? <>[Beta] Il y a encore des erreurs et des oublis dans les substitutions que vous pouvez signaler avec le bouton de retour (<MessageSquare className="w-3 h-3 inline" />). Les substitutions actuelles ont été vérifiées jusqu'à la proposition {verifiedUpTo}, bien qu'elles puissent bien sûr encore contenir des erreurs. Tous les contributeurs seront mentionnés. Nous ajoutons de nouvelles connexions à des textes externes chaque semaine.</> : language === 'de' ? <>Achtung: Die deutsche Version wurde noch nicht Korrektur gelesen. Es können Fehler im Text und in den Substitutionen vorhanden sein. Bitte melden Sie Fehler über den Feedback-Button (<MessageSquare className="w-3 h-3 inline" />). Die aktuellen Substitutionen wurden bis Satz {verifiedUpTo} überprüft. Alle Mitwirkenden werden aufgelistet. Wir fügen jede Woche neue Verbindungen zu externen Texten hinzu.</> : <>[Beta] There are still errors and omissions in the substitutions that you can signal with the feedback button (<MessageSquare className="w-3 h-3 inline" />). The current substitutions have been verified up to proposition {verifiedUpTo}, although they might still of course contain mistakes. All contributors will be listed. We're adding new connexions to external texts every week.</>}</p>
            </div>
            <div className="mt-4 text-white text-xs leading-relaxed max-w-md italic">
              {language === 'fr' ? (
                <>
                  <p>Traduction fran&ccedil;aise de Gilles-Gaston Granger, reproduite avec l'aimable autorisation de sa fille.</p>
                  <p className="mt-2">Texte fourni par <a href="https://www.wittgensteinproject.org/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">The Wittgenstein Project</a>. Connexions aux textes externes fournies par <a href="https://wab.uib.no/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">les Archives Wittgenstein</a> et le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">projet LEGACY</a>.</p>
                </>
              ) : language === 'de' ? (
                <>
                  <p>Deutscher Originaltext aus der Erstausgabe (1921/1922).</p>
                  <p className="mt-2">Text bereitgestellt von <a href="https://www.wittgensteinproject.org/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">The Wittgenstein Project</a> unter <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">CC BY-SA 4.0</a>. Verbindungen zu externen Texten bereitgestellt von <a href="https://wab.uib.no/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">den Wittgenstein-Archiven</a> und dem <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">LEGACY-Projekt</a>.</p>
                </>
              ) : (
                <>
                  <p>C.K. Ogden and Ramsey translation (1922). We have replaced every occurrence of &ldquo;atomic fact&rdquo; with &ldquo;state of affairs&rdquo; to better reflect the original German &ldquo;Sachverhalt.&rdquo;</p>
                  <p className="mt-2">Text provided by <a href="https://www.wittgensteinproject.org/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">The Wittgenstein Project</a> under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">CC BY-SA 4.0</a>. Connexions to external texts provided by <a href="https://wab.uib.no/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">The Wittgenstein Archives</a> and the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">LEGACY project</a>.</p>
                </>
              )}
            </div>
          </div>

          <div className="mb-8" key={`preface-${language}`}>
            <div className="flex gap-4 group">
              <div className="shrink-0 w-16" />
              <div>
                <h3 className="text-lg font-display text-white mb-3">{preface.prefaceLabel}</h3>
                <button
                  onClick={() => setShowPreface(!showPreface)}
                  className="text-xs px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                  data-testid="btn-toggle-preface"
                >
                  {showPreface ? preface.hideButton : preface.showButton}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {showPreface && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-4 mt-6">
                    <div className="shrink-0 w-16" />
                    <div className="text-lg leading-relaxed text-zinc-300 space-y-8">
                      <div className="text-center space-y-1">
                        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">{preface.dedicationLabel}</p>
                        {preface.dedication.map((line, i) => (
                          <p key={i} className={line === 'DAVID H. PINSENT' ? 'font-display text-white tracking-wide' : 'text-zinc-400 text-base'}>{line}</p>
                        ))}
                      </div>

                      <div className="text-center">
                        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">{preface.mottoLabel}</p>
                        <blockquote className="text-zinc-400 text-base italic border-l-2 border-zinc-700 pl-4 text-left">
                          <p>{preface.motto}</p>
                          <p className="mt-2 text-zinc-500 not-italic text-sm">{preface.mottoAuthor}</p>
                        </blockquote>
                      </div>

                      <div className="border-t border-zinc-800 pt-6">
                        {preface.prefaceParagraphs.map((para, i) => (
                          <p key={i} className="text-zinc-300 text-base leading-relaxed mb-4">{para}</p>
                        ))}
                        <p className="text-zinc-400 text-base mt-6">{preface.signature}</p>
                        <p className="text-zinc-500 text-sm italic">{preface.location}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                  <div className="shrink-0 w-16 flex flex-col items-center gap-1">
                    <span className="font-mono text-lg text-white pt-1">{proposition.id}</span>
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
                  <div className={`text-lg leading-relaxed transition-colors ${['6.36111', '6.45', '3.328', '5.47321', '4.0031', '4.1122', '5.452', '5.4541', '3.331', '4.014', '4.04'].includes(proposition.id) ? 'text-purple-200 border border-purple-500/40 bg-purple-500/10 rounded-xl p-4 cursor-pointer hover:bg-purple-500/15 hover:border-purple-500/50' : 'text-zinc-300 group-hover:text-white'}`} onClick={['6.36111', '6.45', '3.328', '5.47321', '4.0031', '4.1122', '5.452', '5.4541', '3.331', '4.014', '4.04'].includes(proposition.id) ? (e) => { if ((e.target as HTMLElement).closest('a, .annotation-content')) return; setOpenAnnotation(openAnnotation === proposition.id ? null : proposition.id); } : undefined} data-testid={['6.36111', '6.45', '3.328', '5.47321', '4.0031', '4.1122', '5.452', '5.4541', '3.331', '4.014', '4.04'].includes(proposition.id) ? `btn-annotation-${proposition.id}` : undefined}>
                    <PropositionSegments
                      segments={proposition.segments}
                      propositionId={proposition.id}
                      language={language}
                    />
                    {propositionDiagrams[proposition.id] && (
                      <>
                        {propositionDiagrams[proposition.id].diagram({ isFrench: language === 'fr', isGerman: language === 'de' })}
                        {language === 'fr' && propositionDiagrams[proposition.id].afterTextFr && (
                          <ParsedText className="whitespace-pre-line" text={propositionDiagrams[proposition.id].afterTextFr!} />
                        )}
                        {(language === 'en' || language === 'de') && propositionDiagrams[proposition.id].afterTextEn && (
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

                    {proposition.id === '6.45' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === '6.45' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid="annotation-6.45">
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>This passage has been noted as an implicit neutral connection to <a href="#spinoza-passage" onClick={(e) => { e.preventDefault(); document.getElementById('spinoza-passage')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-spinoza-ethics"><em>Ethics</em></a> by Baruch Spinoza.</>
                                    : <>Ce passage a été noté comme une connexion neutre implicite à l'<a href="#spinoza-passage" onClick={(e) => { e.preventDefault(); document.getElementById('spinoza-passage')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-spinoza-ethics"><em>Éthique</em></a> de Baruch Spinoza.</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-2">
                                  {language === 'en'
                                    ? 'The contributor noted the similarity of ideas.'
                                    : 'Le contributeur a noté la similarité des idées.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3 italic">
                                  {language === 'en'
                                    ? 'Comments: LW rarely uses Latin, and here he uses the specific Latin expression used by Spinoza.'
                                    : 'Commentaires\u00a0: LW utilise rarement le latin, et ici il utilise l\u2019expression latine spécifique employée par Spinoza.'
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
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-spinoza">LEGACY website</a>.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer à ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-spinoza">site LEGACY</a>.</>
                                  }
                                </p>
                              </div>

                              <div id="spinoza-passage" className="annotation-content mt-4 p-5 rounded-xl border border-purple-500/20 bg-purple-900/10 scroll-mt-24">
                                <p className="text-xs text-purple-400/70 uppercase tracking-wider mb-2 font-medium">
                                  {language === 'en' ? 'Baruch Spinoza — Ethics, Part II, Proposition XLIV, Corollary II' : 'Baruch Spinoza — Éthique, Partie II, Proposition XLIV, Corollaire II'}
                                </p>
                                <blockquote className="text-purple-200/80 text-sm leading-relaxed italic border-l-2 border-purple-500/30 pl-4">
                                  {language === 'en'
                                    ? <>
                                        <p className="mb-2"><strong>Corollary II.</strong>—It is in the nature of reason to perceive things under a certain form of eternity (sub quâdam æternitatis specie).</p>
                                        <p><strong>Proof.</strong>—It is in the nature of reason to regard things, not as contingent, but as necessary (II. xliv.). Reason perceives this necessity of things (II. xli.) truly—that is (I. Ax. vi.), as it is in itself. But (I. xvi.) this necessity of things is the very necessity of the eternal nature of God; therefore, it is in the nature of reason to regard things under this form of eternity. We may add that the bases of reason are the notions (II. xxxviii.), which answer to things common to all, and which (II. xxxvii.) do not answer to the essence of any particular thing: which must therefore be conceived without any relation to time, under a certain form of eternity.</p>
                                      </>
                                    : <>
                                        <p className="mb-2"><strong>Corollaire II.</strong>—Il est dans la nature de la raison de percevoir les choses sous une certaine forme d'éternité (sub quâdam æternitatis specie).</p>
                                        <p><strong>Démonstration.</strong>—Il est dans la nature de la raison de considérer les choses, non comme contingentes, mais comme nécessaires (II. xliv.). La raison perçoit cette nécessité des choses (II. xli.) véritablement, c'est-à-dire (I. Ax. vi.) comme elle est en soi. Mais (I. xvi.) cette nécessité des choses est la nécessité même de la nature éternelle de Dieu\u00a0; par conséquent, il est dans la nature de la raison de considérer les choses sous cette forme d'éternité. Ajoutons que les fondements de la raison sont les notions (II. xxxviii.) qui répondent aux choses communes à toutes, et qui (II. xxxvii.) ne répondent à l'essence d'aucune chose particulière\u00a0: elles doivent donc être conçues sans aucune relation au temps, sous une certaine forme d'éternité.</p>
                                      </>
                                  }
                                </blockquote>
                                <p className="text-xs text-purple-400/50 mt-2 text-right">
                                  <a href="https://legacy-um6p.1337.ma/projects/library/u2okeerjjvq5vtxtsyvu1ptl-baruch-spinoza/uh2oonrmfp56dnl1tfjccs31" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors underline underline-offset-2" data-testid="link-legacy-source-spinoza">
                                    {language === 'en' ? 'Source: LEGACY Library' : 'Source\u00a0: Bibliothèque LEGACY'}
                                  </a>
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {(proposition.id === '3.328' || proposition.id === '5.47321') && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === proposition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid={`annotation-${proposition.id}`}>
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>This passage has been noted as an explicit agreement to <a href={`#occam-passage-${proposition.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`occam-passage-${proposition.id}`)?.scrollIntoView({ behavior: 'smooth' }); }} className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid={`link-occam-${proposition.id}`}><em>Questions on the Sentences</em></a> by William of Occam.</>
                                    : <>Ce passage a été noté comme un accord explicite avec les <a href={`#occam-passage-${proposition.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`occam-passage-${proposition.id}`)?.scrollIntoView({ behavior: 'smooth' }); }} className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid={`link-occam-${proposition.id}`}><em>Questions sur les Sentences</em></a> de Guillaume d'Occam.</>
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
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid={`link-legacy-website-occam-${proposition.id}`}>LEGACY website</a>.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer à ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid={`link-legacy-website-occam-${proposition.id}`}>site LEGACY</a>.</>
                                  }
                                </p>
                              </div>

                              <div id={`occam-passage-${proposition.id}`} className="annotation-content mt-4 p-5 rounded-xl border border-purple-500/20 bg-purple-900/10 scroll-mt-24">
                                <p className="text-xs text-purple-400/70 uppercase tracking-wider mb-2 font-medium">
                                  {language === 'en' ? 'William of Occam — Questions on the Sentences' : 'Guillaume d\u2019Occam — Questions sur les Sentences'}
                                </p>
                                <blockquote className="text-purple-200/80 text-sm leading-relaxed italic border-l-2 border-purple-500/30 pl-4">
                                  {language === 'en'
                                    ? 'Plurality is never to be posited without necessity.'
                                    : 'La pluralité ne doit jamais être posée sans nécessité.'
                                  }
                                </blockquote>
                                <p className="text-xs text-purple-400/50 mt-2 text-right">
                                  <a href="https://legacy-um6p.1337.ma/projects/great-conversation/contribute/q1lw43yiq6rpaga2dwu2s2it-william-of-occam/qyun3usgm5xqxtmgel6qvhyd" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors underline underline-offset-2" data-testid={`link-legacy-source-occam-${proposition.id}`}>
                                    {language === 'en' ? 'Source: LEGACY Library' : 'Source\u00a0: Bibliothèque LEGACY'}
                                  </a>
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {proposition.id === '4.0031' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === proposition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid={`annotation-4.0031`}>
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>This passage has been noted as an explicit opposition to <a href="https://legacy-um6p.1337.ma/projects/library/y12qfjv0ujlf45gy3zyjxllk-fritz-mauthner/temo2e2k7tu732h3hydm76vn" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-mauthner-4.0031"><em>Contributions toward a Critique of Language</em></a> by Fritz Mauthner.</>
                                    : <>Ce passage a été noté comme une opposition explicite aux <a href="https://legacy-um6p.1337.ma/projects/library/y12qfjv0ujlf45gy3zyjxllk-fritz-mauthner/temo2e2k7tu732h3hydm76vn" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-mauthner-4.0031"><em>Contributions à une critique du langage</em></a> de Fritz Mauthner.</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3">
                                  {language === 'en'
                                    ? 'Contributor: Laura Duparc, University Mohammed VI Polytech, based on data from the Wittgenstein Archives.'
                                    : 'Contributrice\u00a0: Laura Duparc, Université Mohammed VI Polytechnique, sur la base des données des Archives Wittgenstein.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs">
                                  {language === 'en'
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-mauthner">LEGACY website</a>.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer à ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-mauthner">site LEGACY</a>.</>
                                  }
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {proposition.id === '4.1122' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === proposition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid="annotation-4.1122">
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>This passage is a reference to <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-darwin-4.1122"><em>On the Origin of Species</em></a> by Charles Darwin.</>
                                    : language === 'de'
                                    ? <>Diese Passage ist eine Referenz auf <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-darwin-4.1122"><em>{'\u00dc'}ber die Entstehung der Arten</em></a> von Charles Darwin.</>
                                    : <>Ce passage est une r{'\u00e9'}f{'\u00e9'}rence {'\u00e0'} <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-darwin-4.1122"><em>L'Origine des esp{'\u00e8'}ces</em></a> de Charles Darwin.</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3">
                                  {language === 'en'
                                    ? 'Contributor: Laura Duparc, Mohammed VI Polytechnic University, based on data collected by the Wittgenstein Archives.'
                                    : language === 'de'
                                    ? 'Beitragende: Laura Duparc, Mohammed VI Polytechnic University, basierend auf Daten der Wittgenstein-Archive.'
                                    : 'Contributrice\u00a0: Laura Duparc, Universit\u00e9 Mohammed VI Polytechnique, sur la base des donn\u00e9es collect\u00e9es par les Archives Wittgenstein.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs">
                                  {language === 'en'
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-darwin">LEGACY website</a>.</>
                                    : language === 'de'
                                    ? <>Sie k{'\u00f6'}nnen diese Verbindung diskutieren und zu dieser kollektiven Arbeit auf der <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-darwin">LEGACY-Website</a> beitragen.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer {'\u00e0'} ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-darwin">site LEGACY</a>.</>
                                  }
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {proposition.id === '5.452' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === proposition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid="annotation-5.452">
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>This passage has been noted as an explicit opposition to <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-principia-5.452"><em>Principia Mathematica</em></a> by Alfred North Whitehead and Bertrand Russell (1910{'\u2013'}1913).</>
                                    : language === 'de'
                                    ? <>Diese Passage wurde als expliziter Widerspruch zu den <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-principia-5.452"><em>Principia Mathematica</em></a> von Alfred North Whitehead und Bertrand Russell (1910{'\u2013'}1913) vermerkt.</>
                                    : <>Ce passage a {'\u00e9'}t{'\u00e9'} not{'\u00e9'} comme une opposition explicite aux <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-principia-5.452"><em>Principia Mathematica</em></a> d'Alfred North Whitehead et Bertrand Russell (1910{'\u2013'}1913).</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3">
                                  {language === 'en'
                                    ? 'Contributor: Laura Duparc, Mohammed VI Polytechnic University, based on data collected by the Wittgenstein Archives.'
                                    : language === 'de'
                                    ? 'Beitragende: Laura Duparc, Mohammed VI Polytechnic University, basierend auf Daten der Wittgenstein-Archive.'
                                    : 'Contributrice\u00a0: Laura Duparc, Universit\u00e9 Mohammed VI Polytechnique, sur la base des donn\u00e9es collect\u00e9es par les Archives Wittgenstein.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs">
                                  {language === 'en'
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-principia">LEGACY website</a>.</>
                                    : language === 'de'
                                    ? <>Sie k{'\u00f6'}nnen diese Verbindung diskutieren und zu dieser kollektiven Arbeit auf der <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-principia">LEGACY-Website</a> beitragen.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer {'\u00e0'} ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-principia">site LEGACY</a>.</>
                                  }
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {proposition.id === '5.4541' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === proposition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid="annotation-5.4541">
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>The Latin phrase <em>simplex sigillum veri</em> ("simplicity is the seal of truth") is most commonly associated with the Dutch physician and scientist <strong>Hermann Boerhaave</strong> (1668{'\u2013'}1738), though it was widely used in the intellectual culture of the time. There is no explicit reference to Boerhaave in the <em>Nachlass</em>.</>
                                    : language === 'de'
                                    ? <>Der lateinische Satz <em>simplex sigillum veri</em> ({'\u201e'}Einfachheit ist das Siegel der Wahrheit{'\u201c'}) wird am h{'\u00e4'}ufigsten mit dem niederl{'\u00e4'}ndischen Arzt und Wissenschaftler <strong>Hermann Boerhaave</strong> (1668{'\u2013'}1738) in Verbindung gebracht, obwohl er in der intellektuellen Kultur der Zeit weit verbreitet war. Es gibt keinen expliziten Verweis auf Boerhaave im <em>Nachlass</em>.</>
                                    : <>La formule latine <em>simplex sigillum veri</em> ({'\u00ab'}{'\u00a0'}la simplicit{'\u00e9'} est le sceau de la v{'\u00e9'}rit{'\u00e9'}{'\u00a0'}{'\u00bb'}) est le plus souvent associ{'\u00e9'}e au m{'\u00e9'}decin et scientifique n{'\u00e9'}erlandais <strong>Hermann Boerhaave</strong> (1668{'\u2013'}1738), bien qu{'\u2019'}elle ait {'\u00e9'}t{'\u00e9'} largement utilis{'\u00e9'}e dans la culture intellectuelle de l{'\u2019'}{'\u00e9'}poque. Il n{'\u2019'}y a pas de r{'\u00e9'}f{'\u00e9'}rence explicite {'\u00e0'} Boerhaave dans le <em>Nachlass</em>.</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3">
                                  {language === 'en'
                                    ? 'Contributor: Laura Duparc, Mohammed VI Polytechnic University, based on data collected by the Wittgenstein Archives.'
                                    : language === 'de'
                                    ? 'Beitragende: Laura Duparc, Mohammed VI Polytechnic University, basierend auf Daten der Wittgenstein-Archive.'
                                    : 'Contributrice\u00a0: Laura Duparc, Universit\u00e9 Mohammed VI Polytechnique, sur la base des donn\u00e9es collect\u00e9es par les Archives Wittgenstein.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs">
                                  {language === 'en'
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-boerhaave">LEGACY website</a>.</>
                                    : language === 'de'
                                    ? <>Sie k{'\u00f6'}nnen diese Verbindung diskutieren und zu dieser kollektiven Arbeit auf der <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-boerhaave">LEGACY-Website</a> beitragen.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer {'\u00e0'} ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-boerhaave">site LEGACY</a>.</>
                                  }
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {proposition.id === '3.331' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === proposition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid="annotation-3.331">
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>This passage has been noted as an explicit disagreement with <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-principia-3.331"><em>Principia Mathematica</em></a> (1910{'\u2013'}1913) by Alfred North Whitehead and Bertrand Russell. The theory of types discussed here was first introduced by Russell in his paper <em>Mathematical Logic as Based on the Theory of Types</em> (1908).</>
                                    : language === 'de'
                                    ? <>Diese Passage wurde als expliziter Widerspruch zu den <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-principia-3.331"><em>Principia Mathematica</em></a> (1910{'\u2013'}1913) von Alfred North Whitehead und Bertrand Russell vermerkt. Die hier diskutierte Typentheorie wurde erstmals von Russell in seinem Aufsatz <em>Mathematical Logic as Based on the Theory of Types</em> (1908) eingef{'\u00fc'}hrt.</>
                                    : <>Ce passage a {'\u00e9'}t{'\u00e9'} not{'\u00e9'} comme un d{'\u00e9'}saccord explicite avec les <a href="https://legacy-um6p.1337.ma/projects/library" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-principia-3.331"><em>Principia Mathematica</em></a> (1910{'\u2013'}1913) d{'\u2019'}Alfred North Whitehead et Bertrand Russell. La th{'\u00e9'}orie des types discut{'\u00e9'}e ici a {'\u00e9'}t{'\u00e9'} introduite pour la premi{'\u00e8'}re fois par Russell dans son article <em>Mathematical Logic as Based on the Theory of Types</em> (1908).</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3">
                                  {language === 'en'
                                    ? 'Contributor: Laura Duparc, Mohammed VI Polytechnic University, based on data collected by the Wittgenstein Archives.'
                                    : language === 'de'
                                    ? 'Beitragende: Laura Duparc, Mohammed VI Polytechnic University, basierend auf Daten der Wittgenstein-Archive.'
                                    : 'Contributrice\u00a0: Laura Duparc, Universit\u00e9 Mohammed VI Polytechnique, sur la base des donn\u00e9es collect\u00e9es par les Archives Wittgenstein.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs">
                                  {language === 'en'
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-russell-types">LEGACY website</a>.</>
                                    : language === 'de'
                                    ? <>Sie k{'\u00f6'}nnen diese Verbindung diskutieren und zu dieser kollektiven Arbeit auf der <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-russell-types">LEGACY-Website</a> beitragen.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer {'\u00e0'} ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-russell-types">site LEGACY</a>.</>
                                  }
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {proposition.id === '4.014' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === proposition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid="annotation-4.014">
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>The story referenced here is <em>Die Goldkinder</em> (<em>The Golden Children</em>), a fairy tale collected by <strong>Jacob and Wilhelm Grimm</strong> in their <em>Kinder- und Hausm{'\u00e4'}rchen</em>. In the tale, two golden children, their two golden horses, and two golden lilies are mystically linked{'\u2014'}what happens to one is reflected in the others, illustrating the idea of a shared logical structure.</>
                                    : language === 'de'
                                    ? <>Das hier erw{'\u00e4'}hnte M{'\u00e4'}rchen ist <em>Die Goldkinder</em>, ein M{'\u00e4'}rchen aus den <em>Kinder- und Hausm{'\u00e4'}rchen</em> von <strong>Jacob und Wilhelm Grimm</strong>. In der Geschichte sind zwei goldene Kinder, ihre zwei goldenen Pferde und zwei goldene Lilien auf mystische Weise miteinander verbunden{'\u2014'}was dem einen geschieht, spiegelt sich in den anderen wider, und veranschaulicht so die Idee einer gemeinsamen logischen Struktur.</>
                                    : <>Le conte {'\u00e9'}voqu{'\u00e9'} ici est <em>Die Goldkinder</em> (<em>Les Enfants d{'\u2019'}or</em>), un conte recueilli par <strong>Jacob et Wilhelm Grimm</strong> dans leurs <em>Kinder- und Hausm{'\u00e4'}rchen</em>. Dans ce r{'\u00e9'}cit, deux enfants d{'\u2019'}or, leurs deux chevaux d{'\u2019'}or et deux lis d{'\u2019'}or sont mystiquement li{'\u00e9'}s{'\u2014'}ce qui arrive {'\u00e0'} l{'\u2019'}un se refl{'\u00e8'}te dans les autres, illustrant l{'\u2019'}id{'\u00e9'}e d{'\u2019'}une structure logique commune.</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3">
                                  {language === 'en'
                                    ? 'Contributor: Laura Duparc, Mohammed VI Polytechnic University, based on data collected by the Wittgenstein Archives.'
                                    : language === 'de'
                                    ? 'Beitragende: Laura Duparc, Mohammed VI Polytechnic University, basierend auf Daten der Wittgenstein-Archive.'
                                    : 'Contributrice\u00a0: Laura Duparc, Universit\u00e9 Mohammed VI Polytechnique, sur la base des donn\u00e9es collect\u00e9es par les Archives Wittgenstein.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs">
                                  {language === 'en'
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-grimm">LEGACY website</a>.</>
                                    : language === 'de'
                                    ? <>Sie k{'\u00f6'}nnen diese Verbindung diskutieren und zu dieser kollektiven Arbeit auf der <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-grimm">LEGACY-Website</a> beitragen.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer {'\u00e0'} ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-grimm">site LEGACY</a>.</>
                                  }
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {proposition.id === '4.04' && (
                      <div className="mt-4">
                        <AnimatePresence>
                          {openAnnotation === proposition.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="annotation-content mt-3 p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 text-sm leading-relaxed" data-testid="annotation-4.04">
                                <p className="text-purple-200 mb-3">
                                  {language === 'en'
                                    ? <>This is an explicit reference to <em>The Principles of Mechanics Presented in a New Form</em> (<em>Die Prinzipien der Mechanik in neuem Zusammenhange dargestellt</em>) by <strong>Heinrich Hertz</strong>, published posthumously in 1894. Hertz{'\u2019'}s concept of {'\u201c'}dynamic models{'\u201d'} deeply influenced Wittgenstein{'\u2019'}s picture theory of propositions.</>
                                    : language === 'de'
                                    ? <>Dies ist ein expliziter Verweis auf <em>Die Prinzipien der Mechanik in neuem Zusammenhange dargestellt</em> von <strong>Heinrich Hertz</strong>, posthum ver{'\u00f6'}ffentlicht 1894. Hertz{'\u2019'} Konzept der {'\u201e'}dynamischen Modelle{'\u201c'} beeinflusste Wittgensteins Bildtheorie des Satzes ma{'\u00df'}geblich.</>
                                    : <>Il s{'\u2019'}agit d{'\u2019'}une r{'\u00e9'}f{'\u00e9'}rence explicite aux <em>Principes de la m{'\u00e9'}canique expos{'\u00e9'}s dans un ordre nouveau</em> (<em>Die Prinzipien der Mechanik in neuem Zusammenhange dargestellt</em>) de <strong>Heinrich Hertz</strong>, publi{'\u00e9'} {'\u00e0'} titre posthume en 1894. Le concept de {'\u00ab'}{'\u00a0'}mod{'\u00e8'}les dynamiques{'\u00a0'}{'\u00bb'} de Hertz a profond{'\u00e9'}ment influenc{'\u00e9'} la th{'\u00e9'}orie picturale de la proposition chez Wittgenstein.</>
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs mb-3">
                                  {language === 'en'
                                    ? 'Contributor: Laura Duparc, Mohammed VI Polytechnic University, based on data collected by the Wittgenstein Archives.'
                                    : language === 'de'
                                    ? 'Beitragende: Laura Duparc, Mohammed VI Polytechnic University, basierend auf Daten der Wittgenstein-Archive.'
                                    : 'Contributrice\u00a0: Laura Duparc, Universit\u00e9 Mohammed VI Polytechnique, sur la base des donn\u00e9es collect\u00e9es par les Archives Wittgenstein.'
                                  }
                                </p>
                                <p className="text-purple-300/70 text-xs">
                                  {language === 'en'
                                    ? <>You can discuss this connection and contribute to this collective work on the <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-hertz">LEGACY website</a>.</>
                                    : language === 'de'
                                    ? <>Sie k{'\u00f6'}nnen diese Verbindung diskutieren und zu dieser kollektiven Arbeit auf der <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-hertz">LEGACY-Website</a> beitragen.</>
                                    : <>Vous pouvez discuter de cette connexion et contribuer {'\u00e0'} ce travail collectif sur le <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline underline-offset-2 hover:text-purple-300" data-testid="link-legacy-website-hertz">site LEGACY</a>.</>
                                  }
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
          </>
          )}
        </main>
      </div>
    </div>
  );
}
