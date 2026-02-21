import React from 'react';
import { useSemantic } from '@/context/SemanticContext';
import { parseSemantic } from '@/lib/semanticParser';
import { SemanticWord } from '@/components/SemanticWord';
import { LogicWord } from '@/components/LogicWord';
import { MathLogicWord } from '@/components/MathLogicWord';
import { MathText } from '@/components/MathText';

export function ParsedText({ text, className }: { text: string; className?: string }) {
  const { synonymGroups } = useSemantic();
  if (!synonymGroups || synonymGroups.length === 0) {
    return <span className={className}>{text}</span>;
  }
  const segments = parseSemantic(text, synonymGroups);
  return (
    <span className={className}>
      {segments.map((segment, idx) => {
        if (segment.type === 'text') {
          return <MathText key={idx} text={segment.content} />;
        } else if (segment.type === 'semantic') {
          return (
            <SemanticWord
              key={idx}
              original={segment.original}
              alternatives={segment.alternatives}
              groupId={segment.groupId}
            />
          );
        } else if (segment.type === 'logic') {
          return (
            <LogicWord
              key={idx}
              original={segment.original}
              translation={segment.translation}
              groupId={segment.groupId}
            />
          );
        } else if (segment.type === 'math-logic') {
          return (
            <MathLogicWord
              key={idx}
              latex={segment.latex}
              translation={segment.translation}
              groupId={segment.groupId}
            />
          );
        }
        return null;
      })}
    </span>
  );
}
