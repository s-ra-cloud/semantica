import { type SynonymGroup, type InsertSynonymGroup, synonymGroups, type Feedback, type InsertFeedback, feedback } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSynonymGroups(): Promise<SynonymGroup[]>;
  getSynonymGroup(id: number): Promise<SynonymGroup | undefined>;
  createSynonymGroup(group: InsertSynonymGroup): Promise<SynonymGroup>;
  updateSynonymGroup(id: number, group: InsertSynonymGroup): Promise<SynonymGroup | undefined>;
  deleteSynonymGroup(id: number): Promise<boolean>;
  replaceAllSynonymGroups(groups: InsertSynonymGroup[]): Promise<SynonymGroup[]>;
  getFeedback(): Promise<Feedback[]>;
  createFeedback(entry: InsertFeedback): Promise<Feedback>;
}

export class DatabaseStorage implements IStorage {
  async getSynonymGroups(): Promise<SynonymGroup[]> {
    return db.select().from(synonymGroups);
  }

  async getSynonymGroup(id: number): Promise<SynonymGroup | undefined> {
    const [group] = await db.select().from(synonymGroups).where(eq(synonymGroups.id, id));
    return group;
  }

  async createSynonymGroup(group: InsertSynonymGroup): Promise<SynonymGroup> {
    const [created] = await db.insert(synonymGroups).values(group).returning();
    return created;
  }

  async updateSynonymGroup(id: number, group: InsertSynonymGroup): Promise<SynonymGroup | undefined> {
    const [updated] = await db.update(synonymGroups).set(group).where(eq(synonymGroups.id, id)).returning();
    return updated;
  }

  async deleteSynonymGroup(id: number): Promise<boolean> {
    const [deleted] = await db.delete(synonymGroups).where(eq(synonymGroups.id, id)).returning();
    return !!deleted;
  }

  async replaceAllSynonymGroups(groups: InsertSynonymGroup[]): Promise<SynonymGroup[]> {
    return await db.transaction(async (tx) => {
      await tx.delete(synonymGroups);
      if (groups.length === 0) return [];
      return tx.insert(synonymGroups).values(groups).returning();
    });
  }

  async getFeedback(): Promise<Feedback[]> {
    return db.select().from(feedback).orderBy(desc(feedback.createdAt));
  }

  async createFeedback(entry: InsertFeedback): Promise<Feedback> {
    const [created] = await db.insert(feedback).values(entry).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();

export async function seedDatabaseIfEmpty() {
  const existing = await storage.getSynonymGroups();
  if (existing.length > 0) return;

  console.log("Database empty, seeding default synonym groups...");

  const semanticGroupsEn: InsertSynonymGroup[] = [
    { language: 'en', words: ['the world', 'the totality of facts', 'everything that is the case', 'all that is the case', 'all the facts', 'the totality of reality'], type: 'semantic' },
    { language: 'en', words: ['the thought', 'the logical picture of the facts', 'the significant proposition'], type: 'semantic' },
    { language: 'en', words: ['names', 'simple signs'], type: 'semantic' },
    { language: 'en', words: ['what is the case', 'the fact', 'the existence of states of affairs'], type: 'semantic' },
    { language: 'en', words: ['objects', 'entities', 'things'], type: 'semantic' },
    { language: 'en', words: ['object', 'entity', 'thing'], type: 'semantic' },
  ];

  const semanticGroupsFr: InsertSynonymGroup[] = [
    { language: 'fr', words: ['le monde', 'la totalité des faits', 'tout ce qui a lieu', 'tous les faits', 'la totalité de la réalité'], type: 'semantic' },
    { language: 'fr', words: ['la pensée', "l'image logique des faits", 'la proposition pourvue de sens'], type: 'semantic' },
    { language: 'fr', words: ['noms', 'signes simples'], type: 'semantic' },
    { language: 'fr', words: ['ce qui a lieu', 'le fait', "la subsistance d'états de choses"], type: 'semantic' },
    { language: 'fr', words: ['objets', 'entités', 'choses'], type: 'semantic' },
    { language: 'fr', words: ['objet', 'entité', 'chose'], type: 'semantic' },
    { language: 'fr', words: ["d'objet", "d'entité", "de chose"], type: 'semantic' },
    { language: 'fr', words: ["d'objets", "d'entités", "de choses"], type: 'semantic' },
    { language: 'fr', words: ["l'objet", "l'entité", "la chose"], type: 'semantic' },
  ];

  const logicPairsEn: [string, string][] = [
    ['~p', 'not p'], ['~q', 'not q'], ['~~p', 'not not p'], ['~~~~p', 'not not not not p'],
    ['p . q', 'p and q'], ['p ∨ q', 'p or q'], ['p ⊃ q', 'if p then q'],
    ['p | q', 'neither p nor q'], ['p | p', 'not p'], ['~p . ~q', 'neither p nor q'],
    ['(∃x)', 'there exists an x such that'], ['(∃x, y)', 'there exist x and y such that'],
    ['(∃x, φ)', 'there exist x and φ such that'], ['~(∃x)', 'there does not exist an x such that'],
    ['~(∃x, y)', 'there do not exist x, y such that'], ['(x)', 'for all x'],
    ['aRb', 'a stands in relation R to b'], ['aRx', 'a stands in relation R to x'],
    ['xRb', 'x stands in relation R to b'], ['xRy', 'x stands in relation R to y'],
    ['yRb', 'y stands in relation R to b'], ['fx', 'f applied to x'], ['fy', 'f applied to y'],
    ['fa', 'f applied to a'], ['φx', 'φ applied to x'], ['~fx', 'not f applied to x'],
    ['p ⊃ p', 'p implies p'], ['~(p . ~p)', 'not (p and not p)'],
    ['~(p ∨ q)', 'not (p or q)'], ['~(p ∨ ~q)', 'not (p or not q)'],
    ['(∃x) . fx', 'there exists an x such that f(x)'], ['(x) . fx', 'for all x, f(x)'],
    ['~(∃x) . fx', 'there does not exist an x such that f(x)'],
    ['~(∃x) . ~fx', 'there does not exist x such that not f(x)'],
    ['(∃x) . ~fx', 'there exists an x such that not f(x)'],
    ['(∃x) . fx . x = a', 'there exists x such that f(x) and x equals a'],
    ['fx . ⊃ . x = a', 'f(x) implies x equals a'],
    ['(x) : fx . ⊃ . x = a', 'for all x: f(x) implies x equals a'],
    ['fx ⊃ x = a', 'f(x) implies x equals a'],
    ['f(x, y)', 'f applied to x and y'], ['f(x, x)', 'f applied to x and x'],
    ['f(x, y) . x = y', 'f(x,y) and x equals y'],
    ['f(x, y) . ~x = y', 'f(x,y) and x does not equal y'],
    ['a = a', 'a equals a'], ['a = b', 'a equals b'], ['x = x', 'x equals x'], ['x = a', 'x equals a'],
    ['(p ⊃ q) . (p) : ⊃ : (q)', '(if p then q) and p, therefore q'],
    ['(x) . fx : ⊃ : fa', 'for all x f(x), therefore f(a)'],
    ['a = b . b = c . ⊃ a = c', 'a=b and b=c implies a=c'],
    ['(∃x) . fx . ⊃ . fa : ~(∃x, y) . fx . fy', 'there exists x with f(x) implies f(a) and no two distinct x,y satisfy f'],
    ["O'O'O'a", 'threefold successive application of O to a'],
    ["O'ξ", 'operation O applied to ξ'], ["O'a", 'operation O applied to a'],
    ["O'O'a", 'twofold successive application of O to a'],
    ["[a, x, O'x]", 'general term of formal series'],
    ['[0, ξ, ξ + 1]', '[starting from 0, variable ξ, successor ξ+1] — recursive definition of natural numbers'],
    ['(x)fx', 'for all x, f(x)'], ['(∃x) . x = a', 'there exists an x such that x equals a'],
    ['(x) . x = x', 'for all x, x equals x'], ['~(∃x) . x ⊃ x', 'there does not exist an x such that x implies x'],
    ['~ξ', 'negation of ξ'], ['ξ . η', 'ξ and η (conjunction)'], ['~(p . ~q)', 'not (p and not q)'],
    ['f(a,a)', 'f applied to a and a'], ['f(a,b)', 'f applied to a and b'],
    ['f(a,b) . a = b', 'f(a,b) and a equals b'], ['f(a,b) . ~ a = b', 'f(a,b) and a does not equal b'],
    ['f(b,b)', 'f applied to b and b'],
    ['(∃x,y) . f(x,y)', 'there exist x and y such that f(x,y)'],
    ['(∃x,y) . f(x,y) . x = y', 'there exist x,y such that f(x,y) and x equals y'],
    ['(∃x,y) . f(x,y) . ~x = y)', 'there exist x,y such that f(x,y) and x does not equal y'],
    ['(∃x) . f(x,x)', 'there exists an x such that f(x,x)'],
    ['p | q .|. p | q', 'neither p nor q, therefore neither p nor q'],
    ['(∃x,φ). φx', 'there exist x and φ such that φx'],
    ['(∃x) . fx. x = a', 'there exists x such that f(x) and x equals a'],
    ['(∃x) . fx . ⊃ . fa : ~(∃x,y) . fx . fy', 'there exists x with f(x) implies f(a) and no two distinct x,y satisfy f'],
    ['(x) : fx ⊃ x = a', 'for all x: f(x) implies x equals a'],
    ['(– – – – – T)(ξ, ....)', 'joint negation truth-function of ξ'],
    ['f(xg)', 'f applied to x with generality index g'], ['Gen. fx', 'general f(x)'],
    ['f(a, b)', 'f applied to a and b'], ['f(a, a)', 'f applied to a and a'],
    ['f(b, b)', 'f applied to b and b'],
    ['f(a, b) . a = b', 'f(a,b) and a equals b'], ['f(a, b) . ~a = b', 'f(a,b) and a does not equal b'],
    ['(∃x, y) . f(x, y)', 'there exist x and y such that f(x,y)'],
    ['(∃x, y) . f(x, y) . x = y', 'there exist x,y such that f(x,y) and x equals y'],
    ['(∃x, y) . f(x, y) . ~x = y', 'there exist x,y such that f(x,y) and x does not equal y'],
    ['(∃x) . f(x, x)', 'there exists an x such that f(x,x)'],
    ['p | q . | . p | q', 'neither p nor q, therefore neither p nor q'],
  ];

  const logicPairsFr: [string, string][] = [
    ['~p', 'non p'], ['~q', 'non q'], ['~~p', 'non non p'], ['~~~~p', 'non non non non p'],
    ['p . q', 'p et q'], ['p ∨ q', 'p ou q'], ['p ⊃ q', 'si p alors q'],
    ['p | q', 'ni p ni q'], ['p | p', 'non p'], ['~p . ~q', 'ni p, ni q'],
    ['(∃x)', "il existe un x tel que"], ['(∃x, y)', "il existe x et y tels que"],
    ['(∃x, φ)', "il existe x et φ tels que"], ['~(∃x)', "il n'existe pas de x tel que"],
    ['~(∃x, y)', "il n'existe pas de x, y tels que"], ['(x)', 'pour tout x'],
    ['aRb', 'a est dans la relation R avec b'], ['aRx', 'a est dans la relation R avec x'],
    ['xRb', 'x est dans la relation R avec b'], ['xRy', 'x est dans la relation R avec y'],
    ['yRb', 'y est dans la relation R avec b'], ['fx', 'f appliqué à x'], ['fy', 'f appliqué à y'],
    ['fa', 'f appliqué à a'], ['φx', 'φ appliqué à x'], ['~fx', 'non f appliqué à x'],
    ['p ⊃ p', 'p implique p'], ['~(p . ~p)', 'non (p et non p)'],
    ['~(p ∨ q)', 'non (p ou q)'], ['~(p ∨ ~q)', 'non (p ou non q)'],
    ['(∃x) . fx', "il existe un x tel que f(x)"], ['(x) . fx', 'pour tout x, f(x)'],
    ['~(∃x) . fx', "il n'existe pas de x tel que f(x)"],
    ['~(∃x) . ~fx', "il n'existe pas de x tel que non f(x)"],
    ['(∃x) . ~fx', "il existe un x tel que non f(x)"],
    ['(∃x) . fx . x = a', "il existe x tel que f(x) et x égale a"],
    ['fx . ⊃ . x = a', 'f(x) implique x égale a'],
    ['(x) : fx . ⊃ . x = a', 'pour tout x : f(x) implique x égale a'],
    ['fx ⊃ x = a', 'f(x) implique x égale a'],
    ['f(x, y)', 'f appliqué à x et y'], ['f(x, x)', 'f appliqué à x et x'],
    ['f(x, y) . x = y', 'f(x,y) et x égale y'],
    ['f(x, y) . ~x = y', 'f(x,y) et x ne vaut pas y'],
    ['a = a', 'a égale a'], ['a = b', 'a égale b'], ['x = x', 'x égale x'], ['x = a', 'x égale a'],
    ['(p ⊃ q) . (p) : ⊃ : (q)', '(si p alors q) et p, donc q'],
    ['(x) . fx : ⊃ : fa', 'pour tout x f(x), donc f(a)'],
    ['a = b . b = c . ⊃ a = c', 'a=b et b=c implique a=c'],
    ['(∃x) . fx . ⊃ . fa : ~(∃x, y) . fx . fy', "il existe x avec f(x) implique f(a) et il n'existe pas deux x,y distincts satisfaisant f"],
    ["O'O'O'a", 'triple application successive de O à a'],
    ["O'ξ", 'opération O appliquée à ξ'], ["O'a", 'opération O appliquée à a'],
    ["O'O'a", 'double application successive de O à a'],
    ["[a,x,O'x]", 'terme général d\'une série de formes'],
    ['[0, ξ, ξ+1]', '[en partant de 0, variable ξ, successeur ξ+1] — définition récursive des nombres naturels'],
    ['~ξ', 'négation de ξ'], ['ξ . η', 'ξ et η (conjonction)'], ['~(p . ~q)', 'non (p et non q)'],
    ['(x)fx', 'pour tout x, f(x)'], ['(∃x) . x = a', 'il existe un x tel que x égale a'],
    ['(x) . x = x', 'pour tout x, x égale x'], ['~(∃x) . x ⊃ x', "il n'existe pas de x tel que x implique x"],
    ['f(a,a)', 'f appliqué à a et a'], ['f(a,b)', 'f appliqué à a et b'],
    ['f(a,b) . a = b', 'f(a,b) et a égale b'], ['f(a,b) . ~ a = b', 'f(a,b) et a ne vaut pas b'],
    ['f(b,b)', 'f appliqué à b et b'],
    ['(∃x,y) . f(x,y)', 'il existe x et y tels que f(x,y)'],
    ['(∃x,y) . f(x,y) . x = y', 'il existe x,y tels que f(x,y) et x égale y'],
    ['(∃x,y) . f(x,y) . ~x = y)', 'il existe x,y tels que f(x,y) et x ne vaut pas y'],
    ['(∃x) . f(x,x)', 'il existe un x tel que f(x,x)'],
    ['p | q .|. p | q', 'ni p ni q, donc ni p ni q'],
    ['(∃x,φ). φx', 'il existe x et φ tels que φx'],
    ['(∃x) . fx. x = a', 'il existe x tel que f(x) et x égale a'],
    ['(∃x) . fx . ⊃ . fa : ~(∃x,y) . fx . fy', "il existe x avec f(x) implique f(a) et il n'existe pas deux x,y distincts satisfaisant f"],
    ['(x) : fx ⊃ x = a', 'pour tout x : f(x) implique x égale a'],
    ['(– – – – – V) (ξ,....)', 'fonction de vérité de négation conjointe de ξ'],
    ['f(xα)', 'f appliqué à x avec indice de généralisation α'], ['Gén.fx', 'généralisation de f(x)'],
    ['p v q', 'p ou q'],
    ['f(x,x)', 'f appliqué à x et x'], ['f(x,y)', 'f appliqué à x et y'],
  ];

  const mathLogicPairsEn: [string, string][] = [
    ['[math]\\displaystyle{ N ( \\bar{\\xi} ) }[/math]', 'joint denial of all propositions ξ'],
    ['[math]\\displaystyle{ N (\\bar{\\xi}) }[/math]', 'joint denial of all propositions ξ'],
    ['[math]\\displaystyle{ ( \\bar{\\xi} ) }[/math]', 'all values of ξ'],
    ['[math]\\displaystyle{ [ \\bar{p}, \\bar{\\xi}, N (\\bar{\\xi}) ] }[/math]', '[all propositions, variable, joint denial] — general truth-function form'],
    ['[math]\\displaystyle{ \\Omega \' (\\bar{\\eta}) }[/math]', 'successive application of operation Ω to η'],
    ['[math]\\displaystyle{ [\\bar{\\xi}, N(\\bar{\\xi})]\' (\\bar{\\eta}) (= [ \\bar{\\eta}, \\bar{\\xi}, N (\\bar{\\xi}) ]) }[/math]', 'general form of a proposition: result of successively applying joint denial N(ξ̄) to base propositions η̄'],
    ['[math]\\displaystyle{ K_n = \\sum_{\\nu=0}^n \\binom{n}{\\nu} }[/math]', 'Kn = total combinations of truth-values for n states of affairs'],
    ['[math]\\displaystyle{ \\sum_{\\kappa=0}^{K_n} \\binom{K_n}{\\kappa} = L_n }[/math]', 'Ln = total possible truth-functions for n propositions'],
  ];

  const mathLogicPairsFr: [string, string][] = [
    ['[math]\\displaystyle{ N ( \\bar{\\xi} ) }[/math]', 'négation conjointe de toutes les propositions ξ'],
    ['[math]\\displaystyle{ N (\\bar{\\xi}) }[/math]', 'négation conjointe de toutes les propositions ξ'],
    ['[math]\\displaystyle{ ( \\bar{\\xi} ) }[/math]', 'toutes les valeurs de ξ'],
    ['[math]\\displaystyle{ [ \\bar{p}, \\bar{\\xi}, N (\\bar{\\xi}) ] }[/math]', '[toutes les propositions, variable, négation conjointe] — forme générale de la fonction de vérité'],
    ['[math]\\displaystyle{ \\Omega \' (\\bar{\\eta}) }[/math]', "application successive de l'opération Ω à η"],
    ['[math]\\displaystyle{ [\\bar{\\xi}, N(\\bar{\\xi})]\' (\\bar{\\eta}) (= [ \\bar{\\eta}, \\bar{\\xi}, N (\\bar{\\xi}) ]) }[/math]', "forme générale d'une proposition : résultat de l'application successive de la négation conjointe N(ξ̄) à des propositions de départ η̄"],
  ];

  const allGroups: InsertSynonymGroup[] = [
    ...semanticGroupsEn,
    ...semanticGroupsFr,
    ...logicPairsEn.map(([expr, trans]) => ({ language: 'en', words: [expr, trans], type: 'logic' } as InsertSynonymGroup)),
    ...logicPairsFr.map(([expr, trans]) => ({ language: 'fr', words: [expr, trans], type: 'logic' } as InsertSynonymGroup)),
    ...mathLogicPairsEn.map(([expr, trans]) => ({ language: 'en', words: [expr, trans], type: 'math-logic' } as InsertSynonymGroup)),
    ...mathLogicPairsFr.map(([expr, trans]) => ({ language: 'fr', words: [expr, trans], type: 'math-logic' } as InsertSynonymGroup)),
  ];

  for (const group of allGroups) {
    await storage.createSynonymGroup(group);
  }

  console.log(`Seeded ${allGroups.length} synonym groups.`);
}
