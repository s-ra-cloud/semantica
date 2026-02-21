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

export function MathText({ text }: { text: string }) {
  const mathRegex = /\[math\](.*?)\[\/math\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mathRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={lastIndex}>{text.substring(lastIndex, match.index)}</span>);
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
    return <span>{text}</span>;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={lastIndex}>{text.substring(lastIndex)}</span>);
  }

  return <>{parts}</>;
}
