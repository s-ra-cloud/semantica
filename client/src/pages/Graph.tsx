import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ConnectionType = 'agreement' | 'disagreement' | 'neutral';

interface ExternalSource {
  id: string;
  author: string;
  title: string;
  year: string;
  url: string;
}

interface Connection {
  propositionId: string;
  propositionText: string;
  source: ExternalSource;
  type: ConnectionType;
}

const connections: Connection[] = [
  {
    propositionId: '3.328',
    propositionText: 'If a sign is not necessary then it is meaningless. That is the meaning of Occam\'s razor.',
    source: {
      id: 'occam',
      author: 'William of Occam',
      title: 'Questions on the Sentences',
      year: 'c. 1319',
      url: 'https://legacy-um6p.1337.ma/projects/great-conversation/contribute/q1lw43yiq6rpaga2dwu2s2it-william-of-occam/qyun3usgm5xqxtmgel6qvhyd',
    },
    type: 'agreement',
  },
  {
    propositionId: '4.0031',
    propositionText: 'All philosophy is "Critique of language" (but not at all in Mauthner\'s sense).',
    source: {
      id: 'mauthner',
      author: 'Fritz Mauthner',
      title: 'Contributions toward a Critique of Language',
      year: '1901–1902',
      url: 'https://legacy-um6p.1337.ma/projects/library/y12qfjv0ujlf45gy3zyjxllk-fritz-mauthner/temo2e2k7tu732h3hydm76vn',
    },
    type: 'disagreement',
  },
  {
    propositionId: '5.47321',
    propositionText: 'Occam\'s razor is, of course, not an arbitrary rule nor one justified by its practical success.',
    source: {
      id: 'occam',
      author: 'William of Occam',
      title: 'Questions on the Sentences',
      year: 'c. 1319',
      url: 'https://legacy-um6p.1337.ma/projects/great-conversation/contribute/q1lw43yiq6rpaga2dwu2s2it-william-of-occam/qyun3usgm5xqxtmgel6qvhyd',
    },
    type: 'agreement',
  },
  {
    propositionId: '6.36111',
    propositionText: 'The Kantian problem of the right and left hand which cannot be made to cover one another already exists in the plane...',
    source: {
      id: 'kant',
      author: 'Immanuel Kant',
      title: 'Critique of Pure Reason',
      year: '1781',
      url: 'https://legacy-um6p.1337.ma/projects/library/q8kf9oc7o3dktg2a6x3s7h5c-immanuel-kant/qznk00j5qgpsc3hd2tfh2dg0',
    },
    type: 'agreement',
  },
  {
    propositionId: '6.45',
    propositionText: 'The feeling of the world as a limited whole is the mystical feeling.',
    source: {
      id: 'spinoza',
      author: 'Baruch Spinoza',
      title: 'Ethics',
      year: '1677',
      url: 'https://legacy-um6p.1337.ma/projects/library/u2okeerjjvq5vtxtsyvu1ptl-baruch-spinoza/uh2oonrmfp56dnl1tfjccs31',
    },
    type: 'agreement',
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);

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
          <h1 className="text-3xl font-display font-medium text-white flex-1">Connexion Graph</h1>
        </div>

        <div className="mb-10 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 text-sm text-zinc-400 leading-relaxed max-w-2xl">
          <p>
            This graph is a subset of{' '}
            <a href="https://legacy-um6p.1337.ma/projects/great-conversation" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white" data-testid="link-great-conversation">The Great Conversation</a>
            {' '}graph published on the{' '}
            <a href="https://legacy-um6p.1337.ma/home" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white" data-testid="link-legacy-graph">LEGACY project</a>
            {' '}and uses data from that project as well as from the{' '}
            <a href="https://wab.uib.no/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 underline underline-offset-2 hover:text-white" data-testid="link-archives-graph">Wittgenstein Archives</a>.
            {' '}We are adding new connexions every week.
          </p>
          <div className="flex items-center gap-6 mt-4 text-xs">
            <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-green-500 inline-block rounded"></span> Agreement</span>
            <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-red-500 inline-block rounded"></span> Disagreement</span>
            <span className="flex items-center gap-2"><span className="w-6 h-0.5 bg-zinc-500 inline-block rounded"></span> Neutral</span>
          </div>
        </div>

        <div className="relative">
          {sortedPropositions.map((propId, propIdx) => {
            const propConnections = connections.filter(c => c.propositionId === propId);
            const propText = propConnections[0]?.propositionText || '';
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

function SourceCard({ conn, side, isHovered, onHover }: {
  conn: Connection;
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
        <div className="text-xs text-zinc-500 italic leading-snug mt-0.5">{conn.source.title}</div>
        <div className="text-xs text-zinc-600 mt-0.5">{conn.source.year}</div>
      </a>
    </div>
  );
}
