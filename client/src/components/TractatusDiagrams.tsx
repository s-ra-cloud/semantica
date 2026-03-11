import React from 'react';
import { ParsedText } from '@/components/ParsedText';

export function NeckerCube() {
  return (
    <svg viewBox="0 0 160 140" className="w-40 h-36 my-4" fill="none" stroke="white" strokeWidth="1.5">
      <polygon points="30,90 30,40 80,10 80,60" />
      <polygon points="80,60 80,10 130,40 130,90" />
      <polygon points="30,90 80,60 130,90 80,120" />
      <line x1="30" y1="40" x2="80" y2="70" strokeDasharray="4,3" opacity="0.4" />
      <line x1="80" y1="70" x2="130" y2="40" strokeDasharray="4,3" opacity="0.4" />
      <line x1="80" y1="70" x2="80" y2="120" strokeDasharray="4,3" opacity="0.4" />
      <text x="75" y="8" fill="white" stroke="none" fontSize="12" fontFamily="serif" fontStyle="italic">a</text>
      <text x="75" y="135" fill="white" stroke="none" fontSize="12" fontFamily="serif" fontStyle="italic">b</text>
    </svg>
  );
}

export function VisualFieldEye({ isFrench, isGerman }: { isFrench?: boolean; isGerman?: boolean }) {
  const label = isFrench ? 'Œil' : isGerman ? 'Auge' : 'Eye';
  const labelX = isFrench ? 52 : isGerman ? 48 : 56;
  return (
    <svg viewBox="0 0 260 140" className="w-64 h-36 my-4" fill="none" stroke="white" strokeWidth="2">
      <path d="M 60 70 Q 100 5, 200 15 Q 225 18, 228 70 Q 225 122, 200 125 Q 100 135, 60 70 Z" />
      <circle cx="60" cy="70" r="3.5" fill="white" stroke="none" />
      <line x1="22" y1="70" x2="56" y2="70" strokeWidth="1.5" />
      <text x={labelX} y="66" fill="white" stroke="none" fontSize="13" fontFamily="serif" textAnchor="end">{label}</text>
    </svg>
  );
}

export function CongruentSegments() {
  return (
    <svg viewBox="0 0 340 40" className="w-80 h-10 my-4" fill="none" stroke="white" strokeWidth="1.5">
      <line x1="10" y1="20" x2="330" y2="20" strokeDasharray="2,4" opacity="0.3" />
      <circle cx="60" cy="20" r="4" fill="none" />
      <line x1="64" y1="20" x2="146" y2="20" />
      <line x1="146" y1="14" x2="146" y2="26" />
      <line x1="60" y1="14" x2="60" y2="26" />
      <text x="100" y="14" fill="white" stroke="none" fontSize="12" fontFamily="serif" fontStyle="italic">a</text>
      <circle cx="280" cy="20" r="4" fill="none" />
      <line x1="194" y1="20" x2="276" y2="20" />
      <line x1="194" y1="14" x2="194" y2="26" />
      <line x1="280" y1="14" x2="280" y2="26" />
      <text x="233" y="14" fill="white" stroke="none" fontSize="12" fontFamily="serif" fontStyle="italic">b</text>
    </svg>
  );
}

function BracketDiagram({ rows, results }: { rows: string[][]; results: string[] }) {
  const rowHeight = 22;
  const colWidth = 28;
  const cols = rows[0]?.length || 0;
  const height = rows.length * rowHeight + 12;
  const bracketWidth = 12;
  const totalWidth = cols * colWidth + bracketWidth + 40;

  return (
    <svg viewBox={`0 0 ${totalWidth} ${height}`} className="my-2" style={{ width: totalWidth, height }} fill="none">
      {rows.map((row, ri) => (
        <React.Fragment key={ri}>
          {row.map((cell, ci) => (
            <text
              key={ci}
              x={ci * colWidth + 14}
              y={ri * rowHeight + 18}
              fill="white"
              stroke="none"
              fontSize="13"
              fontFamily="serif"
              fontStyle="italic"
              textAnchor="middle"
            >
              {cell}
            </text>
          ))}
        </React.Fragment>
      ))}
      <line x1={cols * colWidth + 4} y1="4" x2={cols * colWidth + 4} y2={height - 4} stroke="white" strokeWidth="1" />
      {results.map((r, ri) => (
        <text
          key={ri}
          x={cols * colWidth + 20}
          y={ri * rowHeight + 18}
          fill="white"
          stroke="none"
          fontSize="13"
          fontFamily="serif"
          fontWeight="bold"
        >
          {r}
        </text>
      ))}
    </svg>
  );
}

export function TautologyDiagram1() {
  return (
    <BracketDiagram
      rows={[
        ['F', 'F'],
        ['F', 'T'],
        ['T', 'F'],
        ['T', 'T'],
      ]}
      results={[]}
    />
  );
}

export function TautologyDiagram2() {
  return (
    <BracketDiagram
      rows={[
        ['F', 'F'],
        ['F', 'T'],
        ['T', 'F'],
        ['T', 'T'],
      ]}
      results={['T', 'T', 'F', 'T']}
    />
  );
}

export function TautologyDiagram3() {
  return (
    <BracketDiagram
      rows={[
        ['F'],
        ['T'],
      ]}
      results={['T', 'F']}
    />
  );
}

export function TautologyDiagram4() {
  return (
    <BracketDiagram
      rows={[
        ['F', 'F'],
        ['F', 'T'],
        ['T', 'F'],
        ['T', 'T'],
      ]}
      results={['F', 'F', 'F', 'T']}
    />
  );
}

export function TautologyDiagram5() {
  return (
    <BracketDiagram
      rows={[
        ['F', 'F'],
        ['F', 'T'],
        ['T', 'F'],
        ['T', 'T'],
      ]}
      results={['T', 'T', 'F', 'T']}
    />
  );
}

export function TruthTable431({ isFrench, isGerman }: { isFrench?: boolean; isGerman?: boolean }) {
  const T = isFrench ? 'V' : isGerman ? 'W' : 'T';
  const F = 'F';
  const th = "border border-zinc-700 px-3 py-1 text-zinc-400";
  const td = "border border-zinc-700 px-3 py-1 text-center";
  return (
    <div className="my-6 flex flex-wrap items-start gap-8">
      <table className="border-collapse text-sm font-serif">
        <thead>
          <tr><th className={th}>p</th><th className={th}>q</th><th className={th}>r</th></tr>
        </thead>
        <tbody>
          <tr><td className={td}>{T}</td><td className={td}>{T}</td><td className={td}>{T}</td></tr>
          <tr><td className={td}>{F}</td><td className={td}>{T}</td><td className={td}>{T}</td></tr>
          <tr><td className={td}>{T}</td><td className={td}>{F}</td><td className={td}>{T}</td></tr>
          <tr><td className={td}>{T}</td><td className={td}>{T}</td><td className={td}>{F}</td></tr>
          <tr><td className={td}>{F}</td><td className={td}>{F}</td><td className={td}>{T}</td></tr>
          <tr><td className={td}>{F}</td><td className={td}>{T}</td><td className={td}>{F}</td></tr>
          <tr><td className={td}>{T}</td><td className={td}>{F}</td><td className={td}>{F}</td></tr>
          <tr><td className={td}>{F}</td><td className={td}>{F}</td><td className={td}>{F}</td></tr>
        </tbody>
      </table>
      <table className="border-collapse text-sm font-serif">
        <thead>
          <tr><th className={th}>p</th><th className={th}>q</th></tr>
        </thead>
        <tbody>
          <tr><td className={td}>{T}</td><td className={td}>{T}</td></tr>
          <tr><td className={td}>{F}</td><td className={td}>{T}</td></tr>
          <tr><td className={td}>{T}</td><td className={td}>{F}</td></tr>
          <tr><td className={td}>{F}</td><td className={td}>{F}</td></tr>
        </tbody>
      </table>
      <table className="border-collapse text-sm font-serif">
        <thead>
          <tr><th className={th}>p</th></tr>
        </thead>
        <tbody>
          <tr><td className={td}>{T}</td></tr>
          <tr><td className={td}>{F}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export function TruthTable4442({ isFrench, isGerman }: { isFrench?: boolean; isGerman?: boolean }) {
  const T = isFrench ? 'V' : isGerman ? 'W' : 'T';
  const F = 'F';
  const quote = isFrench ? '\u00ab' : isGerman ? '\u201e' : '\u201c';
  const quoteEnd = isFrench ? '\u00bb' : isGerman ? '\u201c' : '\u201d';
  return (
    <div className="my-4 flex items-center gap-2">
      <span className="text-zinc-400 text-lg font-serif">{quote}</span>
      <table className="border-collapse text-sm font-serif">
        <thead>
          <tr>
            <th className="border border-zinc-700 px-3 py-1 text-zinc-400 font-bold">p</th>
            <th className="border border-zinc-700 px-3 py-1 text-zinc-400 font-bold">q</th>
            <th className="border border-zinc-700 px-3 py-1 text-zinc-400"> </th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td></tr>
          <tr><td className="border border-zinc-700 px-3 py-1 text-center">{F}</td><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td></tr>
          <tr><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td><td className="border border-zinc-700 px-3 py-1 text-center">{F}</td><td className="border border-zinc-700 px-3 py-1 text-center"> </td></tr>
          <tr><td className="border border-zinc-700 px-3 py-1 text-center">{F}</td><td className="border border-zinc-700 px-3 py-1 text-center">{F}</td><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td></tr>
        </tbody>
      </table>
      <span className="text-zinc-400 text-lg font-serif">{quoteEnd}</span>
    </div>
  );
}

export function TruthTable5101({ isFrench, isGerman }: { isFrench?: boolean; isGerman?: boolean }) {
  const ditto = isFrench ? '\u00ab' : isGerman ? '\u201e \u201e' : '\u201c \u201d';
  const rows = isFrench ? [
    { pattern: '(VVVV)(p, q)', label: 'Tautologie', desc: '(si p alors p ; et si q alors q.) (p \u2283 p . q \u2283 q)' },
    { pattern: '(FVVV)(p, q)', label: 'soit :', desc: 'pas \u00e0 la fois p et q. (~(p . q))' },
    { pattern: '(VFVV)(p, q)', label: ditto, desc: 'si q alors p. (q \u2283 p)' },
    { pattern: '(VVFV)(p, q)', label: ditto, desc: 'si p alors q. (p \u2283 q)' },
    { pattern: '(VVVF)(p, q)', label: ditto, desc: 'p ou q. (p \u2228 q)' },
    { pattern: '(FFVV)(p, q)', label: ditto, desc: 'non q. ~q' },
    { pattern: '(FVFV)(p, q)', label: ditto, desc: 'non p. ~p' },
    { pattern: '(FVVF)(p, q)', label: ditto, desc: 'p ou q, mais pas les deux. (p . ~q : \u2228 : q . ~p)' },
    { pattern: '(VFFV)(p, q)', label: ditto, desc: 'si p alors q ; et si q alors p. (p \u2261 q)' },
    { pattern: '(VFVF)(p, q)', label: ditto, desc: 'p' },
    { pattern: '(VVFF)(p, q)', label: ditto, desc: 'q' },
    { pattern: '(FFFV)(p, q)', label: ditto, desc: 'ni p ni q. (~p . ~q) ou (p | q)' },
    { pattern: '(FFVF)(p, q)', label: ditto, desc: 'p et non q. (p . ~q)' },
    { pattern: '(FVFF)(p, q)', label: ditto, desc: 'q et non p. (q . ~p)' },
    { pattern: '(VFFF)(p, q)', label: ditto, desc: 'q et p. (q . p)' },
    { pattern: '(FFFF)(p, q)', label: 'Contradiction', desc: '(p et non p ; et q et non q.) (p . ~p . q . ~q)' },
  ] : isGerman ? [
    { pattern: '(WWWW)(p, q)', label: 'Tautologie', desc: '(Wenn p, so p; und wenn q, so q.) (p \u2283 p . q \u2283 q)' },
    { pattern: '(FWWW)(p, q)', label: 'in Worten:', desc: 'Nicht beides p und q. (\u223c(p . q))' },
    { pattern: '(WFWW)(p, q)', label: ditto, desc: 'Wenn q, so p. (q \u2283 p)' },
    { pattern: '(WWFW)(p, q)', label: ditto, desc: 'Wenn p, so q. (p \u2283 q)' },
    { pattern: '(WWWF)(p, q)', label: ditto, desc: 'p oder q. (p \u2228 q)' },
    { pattern: '(FFWW)(p, q)', label: ditto, desc: 'Nicht q. \u223cq' },
    { pattern: '(FWFW)(p, q)', label: ditto, desc: 'Nicht p. \u223cp' },
    { pattern: '(FWWF)(p, q)', label: ditto, desc: 'p oder q, aber nicht beide. (p . \u223cq : \u2228 : q . \u223cp)' },
    { pattern: '(WFFW)(p, q)', label: ditto, desc: 'Wenn p, so q; und wenn q, so p. (p \u2261 q)' },
    { pattern: '(WFWF)(p, q)', label: ditto, desc: 'p' },
    { pattern: '(WWFF)(p, q)', label: ditto, desc: 'q' },
    { pattern: '(FFFW)(p, q)', label: ditto, desc: 'Weder p noch q. (\u223cp . \u223cq) oder (p | q)' },
    { pattern: '(FFWF)(p, q)', label: ditto, desc: 'p und nicht q. (p . \u223cq)' },
    { pattern: '(FWFF)(p, q)', label: ditto, desc: 'q und nicht p. (q . \u223cp)' },
    { pattern: '(WFFF)(p, q)', label: ditto, desc: 'q und p. (q . p)' },
    { pattern: '(FFFF)(p, q)', label: 'Kontradiktion', desc: '(p und nicht p; und q und nicht q.) (p . \u223cp . q . \u223cq)' },
  ] : [
    { pattern: '(TTTT)(p, q)', label: 'Tautology', desc: '(if p then p, and if q then q.) [p \u2283 p . q \u2283 q]' },
    { pattern: '(FTTT)(p, q)', label: 'in words:', desc: 'Not both p and q. [~(p . q)]' },
    { pattern: '(TFTT)(p, q)', label: ditto, desc: 'If q then p. [q \u2283 p]' },
    { pattern: '(TTFT)(p, q)', label: ditto, desc: 'If p then q. [p \u2283 q]' },
    { pattern: '(TTTF)(p, q)', label: ditto, desc: 'p or q. [p \u2228 q]' },
    { pattern: '(FFTT)(p, q)', label: ditto, desc: 'Not q. ~q' },
    { pattern: '(FTFT)(p, q)', label: ditto, desc: 'Not p. ~p' },
    { pattern: '(FTTF)(p, q)', label: ditto, desc: 'p or q, but not both. [p . ~q : \u2228 : q . ~p]' },
    { pattern: '(TFFT)(p, q)', label: ditto, desc: 'If p, then q; and if q, then p. [p \u2261 q]' },
    { pattern: '(TFTF)(p, q)', label: ditto, desc: 'p' },
    { pattern: '(TTFF)(p, q)', label: ditto, desc: 'q' },
    { pattern: '(FFFT)(p, q)', label: ditto, desc: 'Neither p nor q. [~p . ~q or p | q]' },
    { pattern: '(FFTF)(p, q)', label: ditto, desc: 'p and not q. [p . ~q]' },
    { pattern: '(FTFF)(p, q)', label: ditto, desc: 'q and not p. [q . ~p]' },
    { pattern: '(TFFF)(p, q)', label: ditto, desc: 'q and p. [q . p]' },
    { pattern: '(FFFF)(p, q)', label: 'Contradiction', desc: '(p and not p; and q and not q.) [p . ~p . q . ~q]' },
  ];

  return (
    <div className="my-6 overflow-x-auto">
      <table className="text-sm font-serif">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="pr-4 py-0.5 text-zinc-400 whitespace-nowrap align-top">{row.pattern}</td>
              <td className="pr-4 py-0.5 text-zinc-400 whitespace-nowrap align-top">{row.label}</td>
              <td className="py-0.5 text-zinc-300 align-top">{row.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DiagramText6_1203({ isFrench }: { isFrench?: boolean }) {
  return (
    <div className="my-4 space-y-4 text-sm text-zinc-300 font-serif">
      <TautologyDiagram1 />
      <p><ParsedText text={isFrench
        ? 'et la coordination de la vérité ou de la fausseté de la proposition entière avec les combinaisons de vérité des arguments de vérité par des lignes de la manière suivante :'
        : 'and the co-ordination of the truth or falsity of the whole proposition with the truth-combinations of the truth-arguments by lines in the following way:'} /></p>
      <TautologyDiagram2 />
      <p><ParsedText text={isFrench
        ? 'Ce signe, par exemple, présenterait donc la proposition p ⊃ q. Je vais maintenant chercher si une proposition telle que ~(p . ~p) (la Loi de Contradiction) est une tautologie. La forme « ~ξ » s\'écrit dans notre notation :'
        : 'This sign, for example, would therefore present the proposition p ⊃ q. Now I will proceed to inquire whether such a proposition as ~(p . ~p) (The Law of Contradiction) is a tautology. The form "~ξ" is written in our notation:'} /></p>
      <TautologyDiagram3 />
      <p><ParsedText text={isFrench ? 'la forme « ξ . η » ainsi :' : 'the form "ξ . η" thus:'} /></p>
      <TautologyDiagram4 />
      <p><ParsedText text={isFrench ? 'D\'où la proposition ~(p . ~q) se présente ainsi :' : 'Hence the proposition ~(p . ~q) runs thus:'} /></p>
      <TautologyDiagram5 />
      <p><ParsedText text={isFrench
        ? 'Si ici nous mettons « p » au lieu de « q » et examinons la combinaison des T et F les plus extérieurs avec les plus intérieurs, on voit que la vérité de la proposition entière est coordonnée avec toutes les combinaisons de vérité de son argument, sa fausseté avec aucune des combinaisons de vérité.'
        : 'If here we put "p" instead of "q" and examine the combination of the outermost T and F with the innermost, it is seen that the truth of the whole proposition is co-ordinated with all the truth-combinations of its argument, its falsity with none of the truth-combinations.'} /></p>
    </div>
  );
}

export const propositionDiagrams: Record<string, {
  diagram: (props: { isFrench?: boolean; isGerman?: boolean }) => React.ReactNode;
  afterTextEn?: string;
  afterTextFr?: string;
}> = {
  '4.31': {
    diagram: ({ isFrench, isGerman }) => <TruthTable431 isFrench={isFrench} isGerman={isGerman} />,
  },
  '4.442': {
    diagram: ({ isFrench, isGerman }) => <TruthTable4442 isFrench={isFrench} isGerman={isGerman} />,
  },
  '5.101': {
    diagram: ({ isFrench, isGerman }) => <TruthTable5101 isFrench={isFrench} isGerman={isGerman} />,
  },
  '5.5423': {
    diagram: () => <NeckerCube />,
    afterTextEn: 'can be seen in two ways as a cube; and all similar phenomena. For we really see two different facts.\n\n(If I fix my eyes first on the corners a and only glance at b, a appears in front and b behind, and vice versa.)',
    afterTextFr: 'peut être vue de deux façons comme un cube ; et tous les phénomènes semblables. Car nous voyons réellement deux faits différents.\n\n(Si je fixe d\'abord les yeux sur les coins a et ne fais que jeter un coup d\'œil sur b, a apparaît devant et b derrière, et vice versa.)',
  },
  '5.6331': {
    diagram: ({ isFrench, isGerman }: { isFrench?: boolean; isGerman?: boolean }) => <VisualFieldEye isFrench={isFrench} isGerman={isGerman} />,
  },
  '6.1203': {
    diagram: ({ isFrench }) => (
      <DiagramText6_1203 isFrench={isFrench} />
    ),
  },
  '6.36111': {
    diagram: () => <CongruentSegments />,
    afterTextEn: 'moving them out of this space. The right and left hand are in fact completely congruent. And the fact that they cannot be made to cover one another has nothing to do with it.\n\nA right-hand glove could be put on a left hand if it could be turned round in four-dimensional space.',
    afterTextFr: 'les faire sortir de cet espace. La main droite et la main gauche sont en fait parfaitement congruentes. Et le fait qu\'elles ne puissent se recouvrir n\'a rien à voir avec cela.\n\nOn pourrait enfiler un gant droit à la main gauche si on pouvait le retourner dans un espace à quatre dimensions.',
  },
};
