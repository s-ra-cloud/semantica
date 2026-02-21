import React, { createContext, useContext, useEffect, useState } from 'react';

export type SynonymGroup = {
  id: string;
  language: 'en' | 'fr';
  words: string[];
};

export const defaultSynonyms: SynonymGroup[] = [
  { 
    id: '1', 
    language: 'en', 
    words: ['the world', 'the totality of facts', 'everything that is the case', 'all that is the case'] 
  },
  { 
    id: '2', 
    language: 'fr', 
    words: ['le monde', 'la totalité des faits', 'tout ce qui a lieu'] 
  }
];

type SemanticContextType = {
  synonymGroups: SynonymGroup[];
  setSynonymGroups: React.Dispatch<React.SetStateAction<SynonymGroup[]>>;
  addGroup: (group: SynonymGroup) => void;
  updateGroup: (id: string, group: SynonymGroup) => void;
  deleteGroup: (id: string) => void;
};

const SemanticContext = createContext<SemanticContextType | null>(null);

export const SemanticProvider = ({ children }: { children: React.ReactNode }) => {
  const [synonymGroups, setSynonymGroups] = useState<SynonymGroup[]>(() => {
    const saved = localStorage.getItem('semantica_synonyms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return defaultSynonyms;
  });

  useEffect(() => {
    localStorage.setItem('semantica_synonyms', JSON.stringify(synonymGroups));
  }, [synonymGroups]);

  const addGroup = (group: SynonymGroup) => setSynonymGroups(prev => [...prev, group]);
  const updateGroup = (id: string, group: SynonymGroup) => setSynonymGroups(prev => prev.map(g => g.id === id ? group : g));
  const deleteGroup = (id: string) => setSynonymGroups(prev => prev.filter(g => g.id !== id));

  return (
    <SemanticContext.Provider value={{ synonymGroups, setSynonymGroups, addGroup, updateGroup, deleteGroup }}>
      {children}
    </SemanticContext.Provider>
  );
};

export const useSemantic = () => {
  const ctx = useContext(SemanticContext);
  if (!ctx) throw new Error('useSemantic must be used within SemanticProvider');
  return ctx;
};
