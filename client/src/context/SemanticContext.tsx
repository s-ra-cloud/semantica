import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export type SynonymGroup = {
  id: number;
  language: string;
  words: string[];
  type: string;
};

type SemanticContextType = {
  synonymGroups: SynonymGroup[];
  isLoading: boolean;
  addGroup: (group: Omit<SynonymGroup, 'id'>) => void;
  updateGroup: (id: number, group: Omit<SynonymGroup, 'id'>) => void;
  deleteGroup: (id: number) => void;
  resetDefaults: () => void;
  refetch: () => void;
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

      const logicPairsEn: [string, string][] = [
        ['~p', 'not p'],
        ['~q', 'not q'],
        ['~~p', 'not not p'],
        ['~~~~p', 'not not not not p'],
        ['p . q', 'p and q'],
        ['p ∨ q', 'p or q'],
        ['p ⊃ q', 'if p then q'],
        ['p | q', 'neither p nor q'],
        ['p | p', 'not p'],
        ['~p . ~q', 'neither p nor q'],
        ['(∃x)', 'there exists an x such that'],
        ['(∃x, y)', 'there exist x and y such that'],
        ['(∃x, φ)', 'there exist x and φ such that'],
        ['~(∃x)', 'there does not exist an x such that'],
        ['~(∃x, y)', 'there do not exist x, y such that'],
        ['(x)', 'for all x'],
        ['aRb', 'a stands in relation R to b'],
        ['aRx', 'a stands in relation R to x'],
        ['xRb', 'x stands in relation R to b'],
        ['xRy', 'x stands in relation R to y'],
        ['yRb', 'y stands in relation R to b'],
        ['fx', 'f applied to x'],
        ['fy', 'f applied to y'],
        ['fa', 'f applied to a'],
        ['φx', 'φ applied to x'],
        ['~fx', 'not f applied to x'],
        ['p ⊃ p', 'p implies p'],
        ['~(p . ~p)', 'not (p and not p)'],
        ['~(p ∨ q)', 'not (p or q)'],
        ['~(p ∨ ~q)', 'not (p or not q)'],
        ['(∃x) . fx', 'there exists an x such that f(x)'],
        ['(x) . fx', 'for all x, f(x)'],
        ['~(∃x) . fx', 'there does not exist an x such that f(x)'],
        ['~(∃x) . ~fx', 'there does not exist x such that not f(x)'],
        ['(∃x) . ~fx', 'there exists an x such that not f(x)'],
        ['(∃x) . fx . x = a', 'there exists x such that f(x) and x equals a'],
        ['fx . ⊃ . x = a', 'f(x) implies x equals a'],
        ['(x) : fx . ⊃ . x = a', 'for all x: f(x) implies x equals a'],
        ['fx ⊃ x = a', 'f(x) implies x equals a'],
        ['f(x, y)', 'f applied to x and y'],
        ['f(x, x)', 'f applied to x and x'],
        ['f(x, y) . x = y', 'f(x,y) and x equals y'],
        ['f(x, y) . ~x = y', 'f(x,y) and x does not equal y'],
        ['a = a', 'a equals a'],
        ['a = b', 'a equals b'],
        ['x = x', 'x equals x'],
        ['x = a', 'x equals a'],
        ['(p ⊃ q) . (p) : ⊃ : (q)', '(if p then q) and p, therefore q'],
        ['(x) . fx : ⊃ : fa', 'for all x f(x), therefore f(a)'],
        ['a = b . b = c . ⊃ a = c', 'a=b and b=c implies a=c'],
        ['(∃x) . fx . ⊃ . fa : ~(∃x, y) . fx . fy', 'there exists x with f(x) implies f(a) and no two distinct x,y satisfy f'],
      ];

      const logicPairsFr: [string, string][] = [
        ['~p', 'non p'],
        ['~q', 'non q'],
        ['~~p', 'non non p'],
        ['~~~~p', 'non non non non p'],
        ['p . q', 'p et q'],
        ['p ∨ q', 'p ou q'],
        ['p ⊃ q', 'si p alors q'],
        ['p | q', 'ni p ni q'],
        ['p | p', 'non p'],
        ['~p . ~q', 'ni p, ni q'],
        ['(∃x)', "il existe un x tel que"],
        ['(∃x, y)', "il existe x et y tels que"],
        ['(∃x, φ)', "il existe x et φ tels que"],
        ['~(∃x)', "il n'existe pas de x tel que"],
        ['~(∃x, y)', "il n'existe pas de x, y tels que"],
        ['(x)', 'pour tout x'],
        ['aRb', 'a est dans la relation R avec b'],
        ['aRx', 'a est dans la relation R avec x'],
        ['xRb', 'x est dans la relation R avec b'],
        ['xRy', 'x est dans la relation R avec y'],
        ['yRb', 'y est dans la relation R avec b'],
        ['fx', 'f appliqué à x'],
        ['fy', 'f appliqué à y'],
        ['fa', 'f appliqué à a'],
        ['φx', 'φ appliqué à x'],
        ['~fx', 'non f appliqué à x'],
        ['p ⊃ p', 'p implique p'],
        ['~(p . ~p)', 'non (p et non p)'],
        ['~(p ∨ q)', 'non (p ou q)'],
        ['~(p ∨ ~q)', 'non (p ou non q)'],
        ['(∃x) . fx', "il existe un x tel que f(x)"],
        ['(x) . fx', 'pour tout x, f(x)'],
        ['~(∃x) . fx', "il n'existe pas de x tel que f(x)"],
        ['~(∃x) . ~fx', "il n'existe pas de x tel que non f(x)"],
        ['(∃x) . ~fx', "il existe un x tel que non f(x)"],
        ['(∃x) . fx . x = a', "il existe x tel que f(x) et x égale a"],
        ['fx . ⊃ . x = a', 'f(x) implique x égale a'],
        ['(x) : fx . ⊃ . x = a', 'pour tout x : f(x) implique x égale a'],
        ['fx ⊃ x = a', 'f(x) implique x égale a'],
        ['f(x, y)', 'f appliqué à x et y'],
        ['f(x, x)', 'f appliqué à x et x'],
        ['f(x, y) . x = y', 'f(x,y) et x égale y'],
        ['f(x, y) . ~x = y', 'f(x,y) et x ne vaut pas y'],
        ['a = a', 'a égale a'],
        ['a = b', 'a égale b'],
        ['x = x', 'x égale x'],
        ['x = a', 'x égale a'],
        ['(p ⊃ q) . (p) : ⊃ : (q)', '(si p alors q) et p, donc q'],
        ['(x) . fx : ⊃ : fa', 'pour tout x f(x), donc f(a)'],
        ['a = b . b = c . ⊃ a = c', 'a=b et b=c implique a=c'],
        ['(∃x) . fx . ⊃ . fa : ~(∃x, y) . fx . fy', "il existe x avec f(x) implique f(a) et il n'existe pas deux x,y distincts satisfaisant f"],
      ];

      for (const [expr, trans] of logicPairsEn) {
        await apiRequest('POST', '/api/synonym-groups', {
          language: 'en',
          words: [expr, trans],
          type: 'logic',
        });
      }
      for (const [expr, trans] of logicPairsFr) {
        await apiRequest('POST', '/api/synonym-groups', {
          language: 'fr',
          words: [expr, trans],
          type: 'logic',
        });
      }

      const mathLogicPairsEn: [string, string][] = [
        ['[math]\\displaystyle{ N ( \\bar{\\xi} ) }[/math]', 'joint denial of all propositions ξ'],
        ['[math]\\displaystyle{ N (\\bar{\\xi}) }[/math]', 'joint denial of all propositions ξ'],
        ['[math]\\displaystyle{ ( \\bar{\\xi} ) }[/math]', 'all values of ξ'],
        ['[math]\\displaystyle{ [ \\bar{p}, \\bar{\\xi}, N (\\bar{\\xi}) ] }[/math]', '[all propositions, variable, joint denial] — general truth-function form'],
        ['[math]\\displaystyle{ \\Omega \' (\\bar{\\eta}) }[/math]', 'successive application of operation Ω to η'],
        ['[math]\\displaystyle{ [\\bar{\\xi}, N(\\bar{\\xi})]\' (\\bar{\\eta}) (= [ \\bar{\\eta}, \\bar{\\xi}, N (\\bar{\\xi}) ]) }[/math]', 'general form of successive operation application'],
        ['[math]\\displaystyle{ K_n = \\sum_{\\nu=0}^n \\binom{n}{\\nu} }[/math]', 'Kn = total combinations of truth-values for n states of affairs'],
        ['[math]\\displaystyle{ \\sum_{\\kappa=0}^{K_n} \\binom{K_n}{\\kappa} = L_n }[/math]', 'Ln = total possible truth-functions for n propositions'],
      ];

      const mathLogicPairsFr: [string, string][] = [
        ['[math]\\displaystyle{ N ( \\bar{\\xi} ) }[/math]', 'négation conjointe de toutes les propositions ξ'],
        ['[math]\\displaystyle{ N (\\bar{\\xi}) }[/math]', 'négation conjointe de toutes les propositions ξ'],
        ['[math]\\displaystyle{ ( \\bar{\\xi} ) }[/math]', 'toutes les valeurs de ξ'],
        ['[math]\\displaystyle{ [ \\bar{p}, \\bar{\\xi}, N (\\bar{\\xi}) ] }[/math]', '[toutes les propositions, variable, négation conjointe] — forme générale de la fonction de vérité'],
        ['[math]\\displaystyle{ \\Omega \' (\\bar{\\eta}) }[/math]', 'application successive de l\'opération Ω à η'],
        ['[math]\\displaystyle{ [\\bar{\\xi}, N(\\bar{\\xi})]\' (\\bar{\\eta}) (= [ \\bar{\\eta}, \\bar{\\xi}, N (\\bar{\\xi}) ]) }[/math]', 'forme générale de l\'application successive d\'opérations'],
      ];

      for (const [expr, trans] of mathLogicPairsEn) {
        await apiRequest('POST', '/api/synonym-groups', {
          language: 'en',
          words: [expr, trans],
          type: 'math-logic',
        });
      }
      for (const [expr, trans] of mathLogicPairsFr) {
        await apiRequest('POST', '/api/synonym-groups', {
          language: 'fr',
          words: [expr, trans],
          type: 'math-logic',
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/synonym-groups'] }),
  });

  const addGroup = (group: Omit<SynonymGroup, 'id'>) => addMutation.mutate(group);
  const updateGroup = (id: number, group: Omit<SynonymGroup, 'id'>) => updateMutation.mutate({ id, group });
  const deleteGroup = (id: number) => deleteMutation.mutate(id);
  const resetDefaults = () => resetMutation.mutate();
  const refetch = () => queryClient.invalidateQueries({ queryKey: ['/api/synonym-groups'] });

  return (
    <SemanticContext.Provider value={{ synonymGroups, isLoading, addGroup, updateGroup, deleteGroup, resetDefaults, refetch }}>
      {children}
    </SemanticContext.Provider>
  );
};

export const useSemantic = () => {
  const ctx = useContext(SemanticContext);
  if (!ctx) throw new Error('useSemantic must be used within SemanticProvider');
  return ctx;
};
