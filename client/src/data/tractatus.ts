export type Segment =
  | { type: 'text'; content: string }
  | { type: 'semantic'; original: string; alternatives: string[] };

export type Proposition = {
  id: string;
  segments: Segment[];
};

export const tractatusEnglish: Proposition[] = [];

export const tractatusFrench: Proposition[] = [];
