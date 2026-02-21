import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';

interface MathLogicWordProps {
  latex: string;
  translation: string;
  groupId: number;
}

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

export function MathLogicWord({ latex, translation, groupId }: MathLogicWordProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setShowTranslation(false);
  }, [latex]);

  return (
    <span
      onClick={() => setShowTranslation(!showTranslation)}
      className={`logic-word font-medium cursor-pointer transition-colors duration-200 inline-block align-middle ${
        showTranslation ? 'logic-word-translated' : ''
      }`}
      data-testid={`math-logic-word-${groupId}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={showTranslation ? 'translation' : 'original'}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          {showTranslation ? (
            translation
          ) : (
            <span
              dangerouslySetInnerHTML={{ __html: renderMath(latex) }}
              className="inline-block align-middle"
            />
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
