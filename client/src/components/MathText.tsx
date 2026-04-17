import React from 'react';
import katex from 'katex';

function renderMath(latex: string): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode: false,
    });
  } catch {
    return latex;
  }
}

const LOGIC_TERMS = new Set(['p', 'q', 'r', 'n', 'x', 'z', 'b', 'N', 'R', 'Ln', 'ab', '\u03D5', '\u03C6', '\u03C8', '\u03BE', '\u03B7']);
const MULTI_CHAR_TERMS: string[] = ['Ln', 'ab'];
function langSet(terms: string[]): Record<string, Set<string>> {
  return { en: new Set(terms), fr: new Set(terms), de: new Set(terms) };
}
const PROP_LANG_SPECIFIC_LOGIC_TERMS: Record<string, Record<string, Set<string>>> = {
  '3.1432': { 'fr': new Set(['a']) },
  '3.333': {
    'en': new Set(['F', 'u', 'fx', 'Fu', '\u03D5u']),
    'fr': new Set(['F', 'u', 'fx', 'Fu', '\u03C6u']),
    'de': new Set(['F', 'u', 'fx', 'Fu', '\u03D5u']),
  },
  '4.0411': langSet(['F', 'G', 'g', 'fx', 'xg']),
  '4.1211': langSet(['a', 'fa', 'ga']),
  '4.1252': langSet(['a', 'y', 'aRb', 'aRx', 'xRb', 'xRy', 'yRb']),
  '4.1272': langSet(['y']),
  '4.1273': langSet(['a', 'y', 'aRb', 'aRx', 'xRb', 'xRy', 'yRb']),
  '4.24': langSet(['y', 'fx']),
  '4.241': langSet(['a']),
  '4.242': langSet(['a']),
  '4.243': langSet(['a']),
};
const OPEN_QUOTES = new Set(['"', '\u201c', '\u201e', '\u00ab']);
const CLOSE_QUOTES = new Set(['"', '\u201d', '\u201c', '\u00bb']);
const BOUNDARY_BEFORE = new Set([' ', '\u00a0', ',', ';', ':', '(', ')', '\u00ab', '\u00bb', '\u201c', '\u201d', '\u201e', '\n', '\t', '~', '\u223C', '\u00AC', '\u2228', '\u2227', '\u2283', '\u2261', '\u2192', '|', '\u22A2', '.']);
const BOUNDARY_AFTER = new Set([' ', '\u00a0', ',', ';', ':', '.', ')', '\u2013', '\u2014', '\u00ab', '\u00bb', '\u201c', '\u201d', '\u201e', '\n', '\t', '~', '\u223C', '\u00AC', '\u2228', '\u2227', '\u2283', '\u2261', '\u2192', '|', '\u22A2']);

function wrapGuillemets(text: string): string {
  return text.replace(/\u00ab\s+(.*?)\s+\u00bb/g, '\u00ab\u00a0$1\u00a0\u00bb');
}

function highlightLogicTerms(text: string, propositionId?: string, language?: string): React.ReactNode[] {
  const propEntry = propositionId ? PROP_LANG_SPECIFIC_LOGIC_TERMS[propositionId] : undefined;
  const extraTerms = propEntry && language ? propEntry[language] : undefined;
  const parts: React.ReactNode[] = [];
  let i = 0;
  let lastPlain = 0;

  while (i < text.length) {
    const isBoundaryBefore = i === 0 || BOUNDARY_BEFORE.has(text[i - 1]);
    if (!isBoundaryBefore) { i++; continue; }

    let openQ = '';
    let pos = i;
    if (OPEN_QUOTES.has(text[pos])) {
      openQ = text[pos];
      pos++;
    }

    let term = '';
    const allMulti: string[] = [...MULTI_CHAR_TERMS];
    if (extraTerms) {
      extraTerms.forEach(t => { if (t.length > 1) allMulti.push(t); });
    }
    allMulti.sort((a, b) => b.length - a.length);
    for (const m of allMulti) {
      if (text.substr(pos, m.length) === m) {
        term = m;
        break;
      }
    }
    if (!term && pos < text.length && (LOGIC_TERMS.has(text[pos]) || (extraTerms && extraTerms.has(text[pos])))) {
      term = text[pos];
    }

    if (!term) { i++; continue; }

    let endPos = pos + term.length;
    let closeQ = '';
    if (openQ && endPos < text.length && CLOSE_QUOTES.has(text[endPos])) {
      closeQ = text[endPos];
      endPos++;
    }

    const isBoundaryAfter = endPos >= text.length || BOUNDARY_AFTER.has(text[endPos]);
    if (!isBoundaryAfter) { i++; continue; }
    if (openQ && !closeQ) { i++; continue; }
    if (!openQ && closeQ) { i++; continue; }

    if (i > lastPlain) {
      parts.push(text.substring(lastPlain, i));
    }
    parts.push(
      <span key={i} className="text-blue-400">
        {openQ}{term}{closeQ}
      </span>
    );
    lastPlain = endPos;
    i = endPos;
  }

  if (parts.length === 0) return [text];
  if (lastPlain < text.length) {
    parts.push(text.substring(lastPlain));
  }
  return parts;
}

export function MathText({ text, propositionId, language }: { text: string; propositionId?: string; language?: string }) {
  const processed = wrapGuillemets(text);
  const mathRegex = /\[math\](.*?)\[\/math\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mathRegex.exec(processed)) !== null) {
    if (match.index > lastIndex) {
      const plain = processed.substring(lastIndex, match.index);
      parts.push(<span key={lastIndex} className="whitespace-pre-line">{highlightLogicTerms(plain, propositionId, language)}</span>);
    }
    const cleanLatex = match[1].replace(/\\displaystyle\s*/, '');
    parts.push(
      <span
        key={match.index}
        dangerouslySetInnerHTML={{ __html: renderMath(cleanLatex) }}
        className="inline-block align-middle"
      />
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) {
    return <span className="whitespace-pre-line">{highlightLogicTerms(processed, propositionId, language)}</span>;
  }

  if (lastIndex < processed.length) {
    const plain = processed.substring(lastIndex);
    parts.push(<span key={lastIndex} className="whitespace-pre-line">{highlightLogicTerms(plain, propositionId, language)}</span>);
  }

  return <>{parts}</>;
}
