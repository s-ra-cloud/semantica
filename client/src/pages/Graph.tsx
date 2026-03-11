import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Lang = 'en' | 'fr' | 'de';
type ConnectionType = 'agreement' | 'disagreement' | 'neutral';

interface ExternalSource {
  id: string;
  author: string;
  title: Record<Lang, string>;
  year: string;
  url: string;
}

interface Connection {
  propositionId: string;
  propositionText: Record<Lang, string>;
  source: ExternalSource;
  type: ConnectionType;
  contributor?: string;
}

const i18n: Record<Lang, {
  title: string;
  description: (links: { gc: React.ReactNode; legacy: React.ReactNode; archives: React.ReactNode }) => React.ReactNode;
  addingNew: string;
  agreement: string;
  disagreement: string;
  neutral: string;
}> = {
  en: {
    title: 'Connexion Graph',
    description: ({ gc, legacy, archives }) => (
      <>This graph is a subset of {gc} graph published on the {legacy} and uses data from that project as well as from the {archives}.</>
    ),
    addingNew: 'We are adding new connexions every week.',
    agreement: 'Agreement',
    disagreement: 'Disagreement',
    neutral: 'Neutral',
  },
  fr: {
    title: 'Graphe de connexions',
    description: ({ gc, legacy, archives }) => (
      <>Ce graphe est un sous-ensemble du graphe {gc} publié sur le {legacy} et utilise des données de ce projet ainsi que des {archives}.</>
    ),
    addingNew: 'Nous ajoutons de nouvelles connexions chaque semaine.',
    agreement: 'Accord',
    disagreement: 'Désaccord',
    neutral: 'Neutre',
  },
  de: {
    title: 'Verbindungsgraph',
    description: ({ gc, legacy, archives }) => (
      <>Dieser Graph ist eine Teilmenge des {gc}-Graphen, veröffentlicht auf dem {legacy}, und verwendet Daten aus diesem Projekt sowie aus den {archives}.</>
    ),
    addingNew: 'Wir fügen jede Woche neue Verbindungen hinzu.',
    agreement: 'Übereinstimmung',
    disagreement: 'Widerspruch',
    neutral: 'Neutral',
  },
};

const connections: Connection[] = [
  {
    propositionId: '3.328',
    propositionText: {
      en: 'If a sign is not necessary then it is meaningless. That is the meaning of Occam\'s razor.',
      fr: 'Si un signe n\'est pas nécessaire, il est dépourvu de signification. C\'est le sens du rasoir d\'Occam.',
      de: 'Wenn ein Zeichen nicht notwendig ist, so ist es bedeutungslos. Das ist der Sinn von Occams Devise.',
    },
    source: {
      id: 'occam',
      author: 'William of Occam',
      title: {
        en: 'Questions on the Sentences',
        fr: 'Questions sur les Sentences',
        de: 'Fragen zu den Sentenzen',
      },
      year: 'c. 1319',
      url: 'https://legacy-um6p.1337.ma/projects/great-conversation/contribute/q1lw43yiq6rpaga2dwu2s2it-william-of-occam/qyun3usgm5xqxtmgel6qvhyd',
    },
    type: 'agreement',
  },
  {
    propositionId: '4.0031',
    propositionText: {
      en: 'All philosophy is "Critique of language" (but not at all in Mauthner\'s sense).',
      fr: 'Toute la philosophie est « critique du langage » (mais nullement au sens de Mauthner).',
      de: 'Alle Philosophie ist „Sprachkritik" (allerdings nicht im Sinne Mauthners).',
    },
    source: {
      id: 'mauthner',
      author: 'Fritz Mauthner',
      title: {
        en: 'Contributions toward a Critique of Language',
        fr: 'Contributions à une critique du langage',
        de: 'Beiträge zu einer Kritik der Sprache',
      },
      year: '1901–1902',
      url: 'https://legacy-um6p.1337.ma/projects/library/y12qfjv0ujlf45gy3zyjxllk-fritz-mauthner/temo2e2k7tu732h3hydm76vn',
    },
    type: 'disagreement',
  },
  {
    propositionId: '5.47321',
    propositionText: {
      en: 'Occam\'s razor is, of course, not an arbitrary rule nor one justified by its practical success.',
      fr: 'Le rasoir d\'Occam n\'est naturellement pas une règle arbitraire, ni justifiée par son succès pratique.',
      de: 'Occams Devise ist natürlich keine willkürliche, oder durch ihren praktischen Erfolg gerechtfertigte Regel.',
    },
    source: {
      id: 'occam',
      author: 'William of Occam',
      title: {
        en: 'Questions on the Sentences',
        fr: 'Questions sur les Sentences',
        de: 'Fragen zu den Sentenzen',
      },
      year: 'c. 1319',
      url: 'https://legacy-um6p.1337.ma/projects/great-conversation/contribute/q1lw43yiq6rpaga2dwu2s2it-william-of-occam/qyun3usgm5xqxtmgel6qvhyd',
    },
    type: 'agreement',
  },
  {
    propositionId: '6.36111',
    propositionText: {
      en: 'The Kantian problem of the right and left hand which cannot be made to cover one another already exists in the plane...',
      fr: 'Le problème kantien de la main droite et de la main gauche, que l\'on ne peut faire coïncider, existe déjà dans le plan...',
      de: 'Das Kantsche Problem von der rechten und linken Hand, die man nicht zur Deckung bringen kann, besteht schon in der Ebene...',
    },
    source: {
      id: 'kant',
      author: 'Immanuel Kant',
      title: {
        en: 'Prolegomena to Any Future Metaphysics',
        fr: 'Prolégomènes à toute métaphysique future',
        de: 'Prolegomena zu einer jeden künftigen Metaphysik',
      },
      year: '1783',
      url: 'https://legacy-um6p.1337.ma/projects/library/q8kf9oc7o3dktg2a6x3s7h5c-immanuel-kant/qznk00j5qgpsc3hd2tfh2dg0',
    },
    type: 'agreement',
  },
  {
    propositionId: '6.45',
    propositionText: {
      en: 'The contemplation of the world sub specie aeterni is its contemplation as a limited whole.',
      fr: 'La contemplation du monde sub specie aeterni est sa contemplation en tant que totalité bornée.',
      de: 'Die Anschauung der Welt sub specie aeterni ist ihre Anschauung als – begrenztes – Ganzes.',
    },
    source: {
      id: 'spinoza',
      author: 'Baruch Spinoza',
      title: {
        en: 'Ethics',
        fr: 'Éthique',
        de: 'Ethik',
      },
      year: '1677',
      url: 'https://legacy-um6p.1337.ma/projects/library/u2okeerjjvq5vtxtsyvu1ptl-baruch-spinoza/uh2oonrmfp56dnl1tfjccs31',
    },
    type: 'agreement',
  },
  {
    propositionId: '4.1122',
    propositionText: {
      en: 'The Darwinian theory has no more to do with philosophy than has any other hypothesis of natural science.',
      fr: 'La th\u00e9orie de Darwin n\'a pas plus \u00e0 voir avec la philosophie que n\'importe quelle autre hypoth\u00e8se des sciences de la nature.',
      de: 'Die Darwinsche Theorie hat mit der Philosophie nicht mehr zu schaffen, als irgend eine andere Hypothese der Naturwissenschaft.',
    },
    source: {
      id: 'darwin',
      author: 'Charles Darwin',
      title: {
        en: 'On the Origin of Species',
        fr: 'L\'Origine des esp\u00e8ces',
        de: '\u00dcber die Entstehung der Arten',
      },
      year: '1859',
      url: 'https://legacy-um6p.1337.ma/projects/library',
    },
    type: 'neutral',
    contributor: 'Laura Duparc, Mohammed VI Polytechnic University, based on data collected by the Wittgenstein Archives',
  },
  {
    propositionId: '5.452',
    propositionText: {
      en: 'The introduction of a new expedient in the symbolism of logic must always be an event full of consequences. No new symbol may be introduced in logic in brackets or in the margin\u2014with, so to speak, an entirely innocent face.',
      fr: 'L\u2019introduction d\u2019un exp\u00e9dient nouveau dans le symbolisme logique est n\u00e9cessairement un \u00e9v\u00e9nement lourd de cons\u00e9quences. Aucun exp\u00e9dient nouveau ne devrait en logique \u00eatre introduit, pour ainsi dire, avec des airs innocents, comme parenth\u00e8se ou comme note.',
      de: 'Die Einf\u00fchrung eines neuen Behelfes in den Symbolismus der Logik muss immer ein folgenschweres Ereignis sein. Kein neuer Behelf darf in die Logik \u2013 sozusagen, mit ganz unschuldiger Miene \u2013 in Klammern oder unter dem Striche eingef\u00fchrt werden.',
    },
    source: {
      id: 'principia',
      author: 'Alfred North Whitehead & Bertrand Russell',
      title: {
        en: 'Principia Mathematica',
        fr: 'Principia Mathematica',
        de: 'Principia Mathematica',
      },
      year: '1910\u20131913',
      url: 'https://legacy-um6p.1337.ma/projects/library',
    },
    type: 'opposition',
  },
  {
    propositionId: '5.4541',
    propositionText: {
      en: 'A sphere in which the proposition, simplex sigillum veri, is valid.',
      fr: 'Un domaine o\u00f9 vaut la proposition : Simplex sigillum veri.',
      de: 'Ein Gebiet, in dem der Satz gilt: simplex sigillum veri.',
    },
    source: {
      id: 'boerhaave',
      author: 'Hermann Boerhaave (attr.)',
      title: {
        en: 'Simplex sigillum veri',
        fr: 'Simplex sigillum veri',
        de: 'Simplex sigillum veri',
      },
      year: 'c. 1668\u20131738',
      url: 'https://legacy-um6p.1337.ma/projects/library',
    },
    type: 'neutral',
  },
  {
    propositionId: '3.331',
    propositionText: {
      en: 'From this observation we get a further view\u2014into Russell\u2019s Theory of Types. Russell\u2019s error is shown by the fact that in drawing up his symbolic rules he has to speak about the things his signs mean.',
      fr: '\u00c0 partir de cette remarque, examinons la \u00ab\u00a0th\u00e9orie des types\u00a0\u00bb de Russell\u00a0: l\u2019erreur de Russell se manifeste en ceci qu\u2019il lui faille parler de la signification des signes pour \u00e9tablir leur syntaxe.',
      de: 'Von dieser Bemerkung sehen wir in Russell\u2019s \u201eTheory of types\u201c hin\u00fcber: Der Irrtum Russell\u2019s zeigt sich darin, dass er bei der Aufstellung der Zeichenregeln von der Bedeutung der Zeichen reden musste.',
    },
    source: {
      id: 'principia-types',
      author: 'Alfred North Whitehead & Bertrand Russell',
      title: {
        en: 'Principia Mathematica',
        fr: 'Principia Mathematica',
        de: 'Principia Mathematica',
      },
      year: '1910\u20131913',
      url: 'https://legacy-um6p.1337.ma/projects/library',
    },
    type: 'opposition',
  },
  {
    propositionId: '4.014',
    propositionText: {
      en: '(Like the two youths, their two horses and their lilies in the story. They are all in a certain sense one.)',
      fr: '(Comme dans le conte, les deux jeunes gens, leurs deux chevaux et leurs lis. Ils sont tous en un certain sens un.)',
      de: '(Wie im M\u00e4rchen die zwei J\u00fcnglinge, ihre zwei Pferde und ihre Lilien. Sie sind alle in gewissem Sinne Eins.)',
    },
    source: {
      id: 'grimm-goldkinder',
      author: 'Jacob Grimm & Wilhelm Grimm',
      title: {
        en: 'The Golden Children (Die Goldkinder)',
        fr: 'Les Enfants d\u2019or (Die Goldkinder)',
        de: 'Die Goldkinder',
      },
      year: '1812',
      url: 'https://legacy-um6p.1337.ma/projects/library',
    },
    type: 'neutral',
  },
];

const sortedPropositions = Array.from(new Set(connections.map(c => c.propositionId))).sort((a, b) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
});

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

function getConnectionColor(type: ConnectionType): string {
  if (type === 'agreement') return '#22c55e';
  if (type === 'disagreement') return '#ef4444';
  return '#71717a';
}

export default function Graph() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialLang = (['en', 'fr', 'de'].includes(params.get('lang') || '') ? params.get('lang') : 'en') as Lang;
  const [language, setLanguageState] = useState<Lang>(initialLang);

  const setLanguage = (l: Lang) => {
    setLanguageState(l);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', l);
    window.history.replaceState({}, '', url.toString());
  };
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);

  const t = i18n[language];

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.3 + 0.05,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${p.alpha})`;
        ctx.fill();
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles]);

  const handlePropositionClick = (propId: string) => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(`prop-${propId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  };

  const gcLink = <a href="https://legacy-um6p.1337.ma/projects/great-conversation" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white" data-testid="link-great-conversation">The Great Conversation</a>;
  const legacyLink = <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white" data-testid="link-legacy-graph">{language === 'fr' ? 'projet LEGACY' : language === 'de' ? 'LEGACY-Projekt' : 'LEGACY project'}</a>;
  const archivesLink = <a href="https://wab.uib.no/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white" data-testid="link-archives-graph">{language === 'fr' ? 'Archives Wittgenstein' : language === 'de' ? 'Wittgenstein-Archiven' : 'Wittgenstein Archives'}</a>;

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-green-500/30 relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />

      <div ref={containerRef} className="relative z-10 p-6 md:p-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" data-testid="btn-back-graph">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-display font-medium text-white flex-1">{t.title}</h1>
          <div className="flex items-center gap-1.5">
            {(['en', 'fr', 'de'] as Lang[]).map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border transition-colors font-medium ${language === l ? 'text-white border-white/30 bg-white/10' : 'text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}
                data-testid={`btn-graph-lang-${l}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-400 leading-relaxed max-w-2xl">
          <p>
            {t.description({ gc: gcLink, legacy: legacyLink, archives: archivesLink })}
            {' '}{t.addingNew}
          </p>
          <div className="flex items-center gap-6 mt-4 text-xs">
            <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-green-500 inline-block rounded"></span> {t.agreement}</span>
            <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-red-500 inline-block rounded"></span> {t.disagreement}</span>
            <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-zinc-500 inline-block rounded"></span> {t.neutral}</span>
          </div>
        </div>

        <div className="relative">
          {sortedPropositions.map((propId, propIdx) => {
            const propConnections = connections.filter(c => c.propositionId === propId);
            const propText = propConnections[0]?.propositionText[language] || '';
            const leftSources = propConnections.filter((_, i) => i % 2 === 0);
            const rightSources = propConnections.filter((_, i) => i % 2 === 1);

            return (
              <div key={propId} className="relative mb-16 last:mb-0" data-testid={`graph-node-${propId}`}>
                {propIdx < sortedPropositions.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-px top-full h-16 w-0.5 bg-zinc-800/60" />
                )}

                <div className="flex items-center justify-center gap-0">
                  <div className="flex-1 flex flex-col items-end gap-3 pr-4 md:pr-8">
                    {leftSources.map((conn) => (
                      <SourceCard
                        key={`${conn.propositionId}-${conn.source.id}-left`}
                        conn={conn}
                        language={language}
                        side="left"
                        isHovered={hoveredConnection === `${conn.propositionId}-${conn.source.id}`}
                        onHover={(h) => setHoveredConnection(h ? `${conn.propositionId}-${conn.source.id}` : null)}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handlePropositionClick(propId)}
                    className="shrink-0 w-48 md:w-64 p-4 rounded-xl border border-zinc-700 bg-zinc-900/80 hover:border-zinc-500 hover:bg-zinc-800/80 transition-all cursor-pointer group z-10"
                    data-testid={`graph-prop-${propId}`}
                  >
                    <div className="text-xs font-mono text-zinc-500 mb-1 group-hover:text-green-400 transition-colors">{propId}</div>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 group-hover:text-zinc-200 transition-colors">{propText}</p>
                  </button>

                  <div className="flex-1 flex flex-col items-start gap-3 pl-4 md:pl-8">
                    {rightSources.map((conn) => (
                      <SourceCard
                        key={`${conn.propositionId}-${conn.source.id}-right`}
                        conn={conn}
                        language={language}
                        side="right"
                        isHovered={hoveredConnection === `${conn.propositionId}-${conn.source.id}`}
                        onHover={(h) => setHoveredConnection(h ? `${conn.propositionId}-${conn.source.id}` : null)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SourceCard({ conn, language, side, isHovered, onHover }: {
  conn: Connection;
  language: Lang;
  side: 'left' | 'right';
  isHovered: boolean;
  onHover: (h: boolean) => void;
}) {
  const color = getConnectionColor(conn.type);
  const lineStyle = side === 'left' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full';

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className={`absolute ${lineStyle} top-1/2 -translate-y-px w-4 md:w-8 h-0.5`} style={{ backgroundColor: color }} />

      <a
        href={conn.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block p-3 rounded-lg border transition-all ${isHovered ? 'bg-zinc-800/80 border-zinc-600' : 'bg-zinc-900/50 border-zinc-800/60'}`}
        data-testid={`graph-source-${conn.source.id}-${conn.propositionId}`}
      >
        <div className="text-xs font-medium text-zinc-300 leading-snug">{conn.source.author}</div>
        <div className="text-xs text-zinc-500 italic leading-snug mt-0.5">{conn.source.title[language]}</div>
        <div className="text-xs text-zinc-600 mt-0.5">{conn.source.year}</div>
      </a>
    </div>
  );
}
