import React from 'react';

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

export function VisualFieldEye() {
  return (
    <svg viewBox="0 0 220 120" className="w-56 h-32 my-4" fill="none" stroke="white" strokeWidth="1.5">
      <ellipse cx="100" cy="60" rx="95" ry="50" />
      <circle cx="55" cy="60" r="12" />
      <text x="48" y="64" fill="white" stroke="none" fontSize="11" fontFamily="serif">Eye</text>
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

export function TruthTable431({ isFrench }: { isFrench?: boolean }) {
  const T = isFrench ? 'V' : 'T';
  const F = isFrench ? 'F' : 'F';
  return (
    <div className="my-4 overflow-x-auto">
      <table className="border-collapse text-sm font-serif">
        <thead>
          <tr>
            <th className="border border-zinc-700 px-3 py-1 text-zinc-400">p</th>
            <th className="border border-zinc-700 px-3 py-1 text-zinc-400">q</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td></tr>
          <tr><td className="border border-zinc-700 px-3 py-1 text-center">{F}</td><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td></tr>
          <tr><td className="border border-zinc-700 px-3 py-1 text-center">{T}</td><td className="border border-zinc-700 px-3 py-1 text-center">{F}</td></tr>
          <tr><td className="border border-zinc-700 px-3 py-1 text-center">{F}</td><td className="border border-zinc-700 px-3 py-1 text-center">{F}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export function TruthTable4442({ isFrench }: { isFrench?: boolean }) {
  const T = isFrench ? 'V' : 'T';
  const F = isFrench ? 'F' : 'F';
  return (
    <div className="my-4 overflow-x-auto">
      <table className="border-collapse text-sm font-serif">
        <thead>
          <tr>
            <th className="border border-zinc-700 px-3 py-1 text-zinc-400">p</th>
            <th className="border border-zinc-700 px-3 py-1 text-zinc-400">q</th>
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
      <p className="text-zinc-500 text-sm mt-2 italic font-serif">
        {isFrench
          ? '(Si la dernière colonne ne contient que des « V », le fait est une tautologie.)'
          : '(If the last column consists entirely of T\'s, it is a tautology.)'}
      </p>
    </div>
  );
}

export function TruthTable5101({ isFrench }: { isFrench?: boolean }) {
  const T = isFrench ? 'V' : 'T';
  const F = isFrench ? 'F' : 'F';
  const headers = ['(TTTT)(p,q)', '(FTTT)(p,q)', '(TFTT)(p,q)', '(TTFT)(p,q)', '(TTTF)(p,q)'];
  const names = isFrench
    ? ['Tautologie', 'en mots: Non p et non q. (p|q ni p ni q)', 'en mots: Si q alors p. (q⊃p)', 'en mots: Si p alors q. (p⊃q)', 'en mots: p ou q. (p∨q)']
    : ['Tautology', 'in words: Not p and not q. (p|q neither p nor q)', 'in words: If q then p. (q⊃p)', 'in words: If p then q. (p⊃q)', 'in words: p or q. (p∨q)'];

  const rows = [
    { p: T, q: T, vals: [T, F, T, T, T] },
    { p: F, q: T, vals: [T, T, F, T, T] },
    { p: T, q: F, vals: [T, T, T, F, T] },
    { p: F, q: F, vals: [T, T, T, T, F] },
  ];

  return (
    <div className="my-4 overflow-x-auto">
      <table className="border-collapse text-xs font-serif">
        <thead>
          <tr>
            <th className="border border-zinc-700 px-2 py-1 text-zinc-400">p</th>
            <th className="border border-zinc-700 px-2 py-1 text-zinc-400">q</th>
            {headers.map((h, i) => (
              <th key={i} className="border border-zinc-700 px-2 py-1 text-zinc-500 font-normal text-[10px]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              <td className="border border-zinc-700 px-2 py-1 text-center">{row.p}</td>
              <td className="border border-zinc-700 px-2 py-1 text-center">{row.q}</td>
              {row.vals.map((v, vi) => (
                <td key={vi} className="border border-zinc-700 px-2 py-1 text-center">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-zinc-500 text-xs mt-2 italic">
        {isFrench ? '(Les premières 5 des 16 fonctions de vérité)' : '(First 5 of the 16 truth-functions)'}
      </p>
    </div>
  );
}

export const propositionDiagrams: Record<string, {
  diagram: (props: { isFrench?: boolean }) => React.ReactNode;
  afterTextEn?: string;
  afterTextFr?: string;
}> = {
  '4.31': {
    diagram: ({ isFrench }) => <TruthTable431 isFrench={isFrench} />,
  },
  '4.442': {
    diagram: ({ isFrench }) => <TruthTable4442 isFrench={isFrench} />,
  },
  '5.101': {
    diagram: ({ isFrench }) => <TruthTable5101 isFrench={isFrench} />,
  },
  '5.5423': {
    diagram: () => <NeckerCube />,
    afterTextEn: 'can be seen in two ways as a cube; and all similar phenomena. For we really see two different facts.\n\n(If I fix my eyes first on the corners a and only glance at b, a appears in front and b behind, and vice versa.)',
    afterTextFr: 'peut être vue de deux façons comme un cube ; et tous les phénomènes semblables. Car nous voyons réellement deux faits différents.\n\n(Si je fixe d\'abord les yeux sur les coins a et ne fais que jeter un coup d\'œil sur b, a apparaît devant et b derrière, et vice versa.)',
  },
  '5.6331': {
    diagram: () => <VisualFieldEye />,
  },
  '6.1203': {
    diagram: ({ isFrench }) => (
      <div className="my-4 space-y-4 text-sm text-zinc-300 font-serif">
        <TautologyDiagram1 />
        <p>{isFrench
          ? 'et la coordination de la vérité ou de la fausseté de la proposition entière avec les combinaisons de vérité des arguments de vérité par des lignes de la manière suivante :'
          : 'and the co-ordination of the truth or falsity of the whole proposition with the truth-combinations of the truth-arguments by lines in the following way:'}</p>
        <TautologyDiagram2 />
        <p>{isFrench
          ? 'Ce signe, par exemple, présenterait donc la proposition p ⊃ q. Je vais maintenant chercher si une proposition telle que ~(p . ~p) (la Loi de Contradiction) est une tautologie. La forme « ~ξ » s\'écrit dans notre notation :'
          : 'This sign, for example, would therefore present the proposition p ⊃ q. Now I will proceed to inquire whether such a proposition as ~(p . ~p) (The Law of Contradiction) is a tautology. The form "~ξ" is written in our notation:'}</p>
        <TautologyDiagram3 />
        <p>{isFrench ? 'la forme « ξ . η » ainsi :' : 'the form "ξ . η" thus:'}</p>
        <TautologyDiagram4 />
        <p>{isFrench ? 'D\'où la proposition ~(p . ~q) se présente ainsi :' : 'Hence the proposition ~(p . ~q) runs thus:'}</p>
        <TautologyDiagram5 />
        <p>{isFrench
          ? 'Si ici nous mettons « p » au lieu de « q » et examinons la combinaison des T et F les plus extérieurs avec les plus intérieurs, on voit que la vérité de la proposition entière est coordonnée avec toutes les combinaisons de vérité de son argument, sa fausseté avec aucune des combinaisons de vérité.'
          : 'If here we put "p" instead of "q" and examine the combination of the outermost T and F with the innermost, it is seen that the truth of the whole proposition is co-ordinated with all the truth-combinations of its argument, its falsity with none of the truth-combinations.'}</p>
      </div>
    ),
  },
  '6.36111': {
    diagram: () => <CongruentSegments />,
    afterTextEn: 'moving them out of this space. The right and left hand are in fact completely congruent. And the fact that they cannot be made to cover one another has nothing to do with it.\n\nA right-hand glove could be put on a left hand if it could be turned round in four-dimensional space.',
    afterTextFr: 'les faire sortir de cet espace. La main droite et la main gauche sont en fait parfaitement congruentes. Et le fait qu\'elles ne puissent se recouvrir n\'a rien à voir avec cela.\n\nOn pourrait enfiler un gant droit à la main gauche si on pouvait le retourner dans un espace à quatre dimensions.',
  },
};
