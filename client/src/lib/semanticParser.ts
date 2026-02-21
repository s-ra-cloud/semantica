import { SynonymGroup } from '../context/SemanticContext';

export type Segment =
  | { type: 'text'; content: string }
  | { type: 'semantic'; original: string; alternatives: string[]; groupId: number }
  | { type: 'logic'; original: string; translation: string; groupId: number };

export function parseSemantic(text: string, groups: SynonymGroup[]): Segment[] {
  const semanticGroups = groups.filter(g => g.type === 'semantic');
  const logicGroups = groups.filter(g => g.type === 'logic');

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

  semanticGroups.forEach(group => {
    group.words.forEach(word => {
      const trimmed = word.trim();
      if (!trimmed) return;
      const regex = new RegExp(`\\b(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
      let m;
      while ((m = regex.exec(text)) !== null) {
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
