import { SynonymGroup } from '../context/SemanticContext';

type PropositionTextOverride = {
  original: string;
  replacements: Record<string, string>;
};

const propositionOverrides: Record<string, PropositionTextOverride[]> = {
  '1.1': [
    {
      original: ', non des ',
      replacements: {
        'la totalité des faits': ', non des ',
        'le monde': ', non le monde.',
        'tout ce qui a lieu': ", non tout ce qui a lieu.",
        'tous les faits': ', non tous les faits.',
        'la totalité de la réalité': ', non la totalité de la réalité.',
      },
    },
  ],
};

const propositionOverridesEn: Record<string, PropositionTextOverride[]> = {
  '1.1': [
    {
      original: ', not of ',
      replacements: {
        'the totality of facts': ', not of ',
        'the world': ', not the world.',
        'everything that is the case': ', not everything that is the case.',
        'all the facts': ', not all the facts.',
        'the totality of reality': ', not the totality of reality.',
      },
    },
  ],
};

export type Segment =
  | { type: 'text'; content: string }
  | { type: 'semantic'; original: string; alternatives: string[]; groupId: number }
  | { type: 'logic'; original: string; translation: string; groupId: number }
  | { type: 'math-logic'; latex: string; rawMatch: string; translation: string; groupId: number };

interface TextChunk {
  kind: 'plain' | 'math';
  content: string;
  start: number;
}

function splitMathBlocks(text: string): TextChunk[] {
  const chunks: TextChunk[] = [];
  const mathRegex = /\[math\].*?\[\/math\]/g;
  let lastIndex = 0;
  let m;

  while ((m = mathRegex.exec(text)) !== null) {
    if (m.index > lastIndex) {
      chunks.push({ kind: 'plain', content: text.substring(lastIndex, m.index), start: lastIndex });
    }
    chunks.push({ kind: 'math', content: m[0], start: m.index });
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < text.length) {
    chunks.push({ kind: 'plain', content: text.substring(lastIndex), start: lastIndex });
  }

  return chunks;
}

function parsePlainText(text: string, offset: number, semanticGroups: SynonymGroup[], logicGroups: SynonymGroup[], excludedWords?: string[]): Segment[] {
  const matches: { index: number; length: number; word: string; group: SynonymGroup; matchType: 'semantic' | 'logic' }[] = [];

  logicGroups.forEach(group => {
    const expression = group.words[0];
    if (!expression) return;
    const escaped = expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Zàâäéèêëïîôùûüÿçæœ])${escaped}(?![a-zA-Zàâäéèêëïîôùûüÿçæœ])`, 'g');
    let m;
    while ((m = regex.exec(text)) !== null) {
      matches.push({ index: m.index, length: m[0].length, word: m[0], group, matchType: 'logic' });
    }
  });

  const compoundExclusions: Record<string, string[]> = {
    'chose': ['quelque chose', 'état de chose', 'états de chose', 'état de choses', 'états de choses'],
    'choses': ['quelques choses', 'état de choses', 'états de choses'],
    'de chose': ['état de chose', 'états de chose', 'état de choses', 'états de choses'],
    'de choses': ['état de choses', 'états de choses'],
    'thing': ['something', 'anything', 'nothing', 'everything'],
    'things': ['somethings'],
    'objects': ['combination of objects', 'combinations of objects'],
    'forme': ['forme de l\'objet', 'sa forme', 'forme logique', 'forme de représentation', 'forme de figuration', 'forme de la réalité', 'la forme logique', 'la forme de la réalité', 'sa forme de représentation', 'sa forme de figuration', 'la forme logique de représentation', 'la forme générale'],
    'objet': ['forme de l\'objet'],
    'form': ['form of the object', 'its form', 'logical form', 'form of representation', 'form of depiction', 'form of reality', 'the logical form', 'the form of reality', 'its form of representation', 'its form of depiction', 'the logical form of representation', 'the general form'],
    'object': ['form of the object'],
  };

  semanticGroups.forEach(group => {
    group.words.forEach(word => {
      const trimmed = word.trim();
      if (!trimmed) return;
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const hasApostrophe = trimmed.includes("'") || trimmed.includes("\u2019");
      let regex: RegExp;
      if (hasApostrophe) {
        regex = new RegExp(`(?<![a-zA-Zàâäéèêëïîôùûüÿçæœ])${escaped}(?![a-zA-Zàâäéèêëïîôùûüÿçæœ])`, 'gi');
      } else {
        regex = new RegExp(`\\b(${escaped})\\b`, 'gi');
      }
      let m;
      while ((m = regex.exec(text)) !== null) {
        const lowerWord = trimmed.toLowerCase();
        const exclusions = compoundExclusions[lowerWord];
        if (exclusions) {
          const surrounding = text.substring(Math.max(0, m.index - 20), m.index + m[0].length + 20).toLowerCase();
          const isPartOfCompound = exclusions.some(compound => surrounding.includes(compound));
          if (isPartOfCompound) continue;
        }
        if (excludedWords && excludedWords.some(ew => ew.toLowerCase() === m[0].toLowerCase())) continue;
        matches.push({ index: m.index, length: m[0].length, word: m[0], group, matchType: 'semantic' });
      }
    });
  });

  matches.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return b.length - a.length;
  });

  const validMatches = [];
  let currentEnd = 0;
  for (const match of matches) {
    if (match.index >= currentEnd) {
      validMatches.push(match);
      currentEnd = match.index + match.length;
    }
  }

  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of validMatches) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }

    if (match.matchType === 'logic') {
      segments.push({
        type: 'logic',
        original: match.word,
        translation: match.group.words[1] || match.word,
        groupId: match.group.id
      });
    } else {
      const isCapitalized = match.word[0] === match.word[0].toUpperCase();
      const alternatives = match.group.words
        .filter(w => w.toLowerCase() !== match.word.toLowerCase())
        .map(alt => isCapitalized ? alt.charAt(0).toUpperCase() + alt.slice(1) : alt.toLowerCase());

      segments.push({
        type: 'semantic',
        original: match.word,
        alternatives,
        groupId: match.group.id
      });
    }

    lastIndex = match.index + match.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return segments;
}

const formeExclusionProps = ['2.0122', '2.0272', '4.063', '5.451', '5.501', '5.5351', '5.5422', '5.5542', '5.562', '6.1201', '6.1203', '6.1264', '6.321', '6.34', '6.421', '6.342', '6.35', '6.422'];
const propositionExclusions: Record<string, string[]> = Object.fromEntries([
  ...formeExclusionProps.map(p => [`fr:${p}`, ['forme']]),
  ...formeExclusionProps.map(p => [`en:${p}`, ['form']]),
  ...formeExclusionProps.map(p => [`de:${p}`, ['Form']]),
]);

export function parseSemantic(text: string, groups: SynonymGroup[], propositionId?: string, language?: string): Segment[] {
  const normalizedText = text.replace(/\u00A0/g, ' ');
  const semanticGroups = groups.filter(g => g.type === 'semantic');
  const logicGroups = groups.filter(g => g.type === 'logic');
  const mathLogicGroups = groups.filter(g => g.type === 'math-logic');

  const excludeKey = propositionId && language ? `${language}:${propositionId}` : undefined;
  const excludedWords = excludeKey ? propositionExclusions[excludeKey] : undefined;

  const chunks = splitMathBlocks(normalizedText);
  const segments: Segment[] = [];

  for (const chunk of chunks) {
    if (chunk.kind === 'plain') {
      segments.push(...parsePlainText(chunk.content, chunk.start, semanticGroups, logicGroups, excludedWords));
    } else {
      const matchedGroup = mathLogicGroups.find(g => g.words[0] === chunk.content);
      if (matchedGroup) {
        const inner = chunk.content.replace(/^\[math\]/, '').replace(/\[\/math\]$/, '');
        const latex = inner.replace(/\\displaystyle\s*/, '');
        segments.push({
          type: 'math-logic',
          latex,
          rawMatch: chunk.content,
          translation: matchedGroup.words[1] || chunk.content,
          groupId: matchedGroup.id
        });
      } else {
        segments.push({ type: 'text', content: chunk.content });
      }
    }
  }

  return segments;
}
