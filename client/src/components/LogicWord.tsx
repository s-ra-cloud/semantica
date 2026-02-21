import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogicWordProps {
  original: string;
  translation: string;
  groupId: number;
}

export function LogicWord({ original, translation, groupId }: LogicWordProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    setShowTranslation(false);
  }, [original]);

  return (
    <span
      onClick={() => setShowTranslation(!showTranslation)}
      className={`logic-word font-medium cursor-pointer transition-colors duration-200 ${
        showTranslation ? 'logic-word-translated' : ''
      }`}
      data-testid={`logic-word-${original.replace(/\s+/g, '-')}`}
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
          {showTranslation ? translation : original}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
