import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';

interface SemanticWordProps {
  original: string;
  alternatives: string[];
  groupId: number;
}

export function SemanticWord({ original, alternatives, groupId }: SemanticWordProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(original);
  
  const isChanged = currentSelection !== original;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <span 
          className={`semantic-word font-medium ${isChanged ? 'semantic-word-changed' : ''}`} 
          data-testid={`semantic-word-${original.replace(/\s+/g, '-')}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={currentSelection}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {currentSelection}
            </motion.span>
          </AnimatePresence>
        </span>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-1 bg-zinc-900 border-zinc-800 rounded-lg shadow-xl"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col">
          <button
            onClick={() => {
              setCurrentSelection(original);
              setIsOpen(false);
            }}
            className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
              currentSelection === original 
                ? (isChanged ? 'bg-zinc-800 text-orange-400' : 'bg-zinc-800 text-green-400')
                : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            {original}
          </button>
          
          {alternatives.map((alt) => (
            <button
              key={alt}
              onClick={() => {
                setCurrentSelection(alt);
                setIsOpen(false);
              }}
              className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                currentSelection === alt 
                  ? 'bg-zinc-800 text-orange-400' 
                  : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              {alt}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}