import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export type SynonymGroup = {
  id: number;
  language: string;
  words: string[];
};

type SemanticContextType = {
  synonymGroups: SynonymGroup[];
  isLoading: boolean;
  addGroup: (group: Omit<SynonymGroup, 'id'>) => void;
  updateGroup: (id: number, group: Omit<SynonymGroup, 'id'>) => void;
  deleteGroup: (id: number) => void;
  resetDefaults: () => void;
};

const SemanticContext = createContext<SemanticContextType | null>(null);

export const SemanticProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: synonymGroups = [], isLoading } = useQuery<SynonymGroup[]>({
    queryKey: ['/api/synonym-groups'],
  });

  const addMutation = useMutation({
    mutationFn: async (group: Omit<SynonymGroup, 'id'>) => {
      const res = await apiRequest('POST', '/api/synonym-groups', group);
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/synonym-groups'] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, group }: { id: number; group: Omit<SynonymGroup, 'id'> }) => {
      const res = await apiRequest('PUT', `/api/synonym-groups/${id}`, group);
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/synonym-groups'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/synonym-groups/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/synonym-groups'] }),
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      // Delete all, then recreate defaults
      for (const g of synonymGroups) {
        await apiRequest('DELETE', `/api/synonym-groups/${g.id}`);
      }
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'en',
        words: ['the world', 'the totality of facts', 'everything that is the case', 'all that is the case', 'all the facts'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'fr',
        words: ['le monde', 'la totalité des faits', 'tout ce qui a lieu', 'tous les faits'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'en',
        words: ['the thought', 'the logical picture of the facts', 'the significant proposition'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'fr',
        words: ['la pensée', "l'image logique des faits", 'la proposition pourvue de sens'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'en',
        words: ['names', 'simple signs'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'fr',
        words: ['noms', 'signes simples'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'en',
        words: ['what is the case', 'the fact', 'the existence of atomic facts'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'fr',
        words: ['ce qui a lieu', 'le fait', "la subsistance d'états de choses"],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'en',
        words: ['objects', 'entities', 'things'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'fr',
        words: ['objets', 'entités', 'choses'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'en',
        words: ['object', 'entity', 'thing'],
      });
      await apiRequest('POST', '/api/synonym-groups', {
        language: 'fr',
        words: ['objet', 'entité', 'chose'],
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/synonym-groups'] }),
  });

  const addGroup = (group: Omit<SynonymGroup, 'id'>) => addMutation.mutate(group);
  const updateGroup = (id: number, group: Omit<SynonymGroup, 'id'>) => updateMutation.mutate({ id, group });
  const deleteGroup = (id: number) => deleteMutation.mutate(id);
  const resetDefaults = () => resetMutation.mutate();

  return (
    <SemanticContext.Provider value={{ synonymGroups, isLoading, addGroup, updateGroup, deleteGroup, resetDefaults }}>
      {children}
    </SemanticContext.Provider>
  );
};

export const useSemantic = () => {
  const ctx = useContext(SemanticContext);
  if (!ctx) throw new Error('useSemantic must be used within SemanticProvider');
  return ctx;
};
