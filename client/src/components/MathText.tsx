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

const LOGIC_TERMS = new Set(['p', 'q', 'r', 'n', 'x', 'z', 'b', 'N', 'R', 'Ln', 'ab']);
const PROP_LANG_SPECIFIC_LOGIC_TERMS: Record<string, Record<string, Set<string>>> = {
  '3.1432': { 'fr': new Set(['a']) },
};
const OPEN_QUOTES = new Set(['"', '\u201c', '\u201e', '\u00ab']);
const CLOSE_QUOTES = new Set(['"', '\u201d', '\u201c', '\u00bb']);
const BOUNDARY_BEFORE = new Set([' ', '\u00a0', ',', ';', ':', '(', ')', '\u00ab', '\u00bb', '\u201c', '\u201d', '\u201e', '\n', '\t']);
const BOUNDARY_AFTER = new Set([' ', '\u00a0', ',', ';', ':', '.', ')', '\u2013', '\u2014', '\u00ab', '\u00bb', '\u201c', '\u201d', '\u201e', '\n', '\t']);

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
    if (pos + 1 < text.length && text[pos] === 'L' && text[pos + 1] === 'n') {
      term = 'Ln';
    } else if (pos + 1 < text.length && text[pos] === 'a' && text[pos + 1] === 'b') {
      term = 'ab';
    } else if (pos < text.length && (LOGIC_TERMS.has(text[pos]) || (extraTerms && extraTerms.has(text[pos])))) {
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
