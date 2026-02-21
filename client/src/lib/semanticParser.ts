import { SynonymGroup } from '../context/SemanticContext';

export type Segment =
  | { type: 'text'; content: string }
  | { type: 'semantic'; original: string; alternatives: string[]; groupId: string };

export function parseSemantic(text: string, groups: SynonymGroup[]): Segment[] {
  const matches: { index: number; word: string; group: SynonymGroup }[] = [];

  groups.forEach(group => {
    group.words.forEach(word => {
      const trimmed = word.trim();
      if (!trimmed) return;
      // Use word boundaries. If the word has punctuation at the end or start, word boundary might fail, 
      // but assuming mostly standard alphabetical words for this philosophical text
      const regex = new RegExp(`\\b(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
      let m;
      while ((m = regex.exec(text)) !== null) {
        matches.push({ index: m.index, word: m[0], group });
      }
    });
  });

  // Sort matches by index (earlier first), then by length descending (longest first)
  matches.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index;
    return b.word.length - a.word.length;
  });

  const validMatches = [];
  let currentEnd = 0;
  for (const match of matches) {
    if (match.index >= currentEnd) {
      validMatches.push(match);
      currentEnd = match.index + match.word.length;
    }
  }

  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of validMatches) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }
    
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
    
    lastIndex = match.index + match.word.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return segments;
}
