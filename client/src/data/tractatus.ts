export type Segment =
  | { type: 'text'; content: string }
  | { type: 'semantic'; original: string; alternatives: string[] };

export type Proposition = {
  id: string;
  segments: Segment[];
};

export const tractatusEnglish: Proposition[] = [
  {
    id: "1",
    segments: [
      { type: 'semantic', original: 'The world', alternatives: ['The totality of facts'] },
      { type: 'text', content: ' is everything that is the case.' }
    ]
  },
  {
    id: "1.1",
    segments: [
      { type: 'semantic', original: 'The world', alternatives: ['The totality of facts'] },
      { type: 'text', content: ' is the totality of facts, not of things.' }
    ]
  },
  {
    id: "1.11",
    segments: [
      { type: 'semantic', original: 'The world', alternatives: ['The totality of facts'] },
      { type: 'text', content: ' is determined by the facts, and by these being all the facts.' }
    ]
  },
  {
    id: "1.12",
    segments: [
      { type: 'text', content: 'For the totality of facts determines both what is the case, and also all that is not the case.' }
    ]
  },
  {
    id: "1.13",
    segments: [
      { type: 'text', content: 'The facts in logical space are ' },
      { type: 'semantic', original: 'the world', alternatives: ['the totality of facts'] },
      { type: 'text', content: '.' }
    ]
  },
  {
    id: "1.2",
    segments: [
      { type: 'semantic', original: 'The world', alternatives: ['The totality of facts'] },
      { type: 'text', content: ' divides into facts.' }
    ]
  },
  {
    id: "1.21",
    segments: [
      { type: 'text', content: 'Any one can either be the case or not be the case, and everything else remain the same.' }
    ]
  },
  {
    id: "2",
    segments: [
      { type: 'text', content: 'What is the case, the fact, is the existence of atomic facts.' }
    ]
  }
];

export const tractatusFrench: Proposition[] = [
  {
    id: "1",
    segments: [
      { type: 'semantic', original: 'Le monde', alternatives: ['La totalité des faits'] },
      { type: 'text', content: ' est tout ce qui a lieu.' }
    ]
  },
  {
    id: "1.1",
    segments: [
      { type: 'semantic', original: 'Le monde', alternatives: ['La totalité des faits'] },
      { type: 'text', content: ' est la totalité des faits, non des choses.' }
    ]
  },
  {
    id: "1.11",
    segments: [
      { type: 'semantic', original: 'Le monde', alternatives: ['La totalité des faits'] },
      { type: 'text', content: ' est déterminé par les faits, et par ceci qu\'ils sont tous les faits.' }
    ]
  },
  {
    id: "1.12",
    segments: [
      { type: 'text', content: 'Car la totalité des faits détermine ce qui a lieu, et aussi tout ce qui n\'a pas lieu.' }
    ]
  },
  {
    id: "1.13",
    segments: [
      { type: 'text', content: 'Les faits dans l\'espace logique sont ' },
      { type: 'semantic', original: 'le monde', alternatives: ['la totalité des faits'] },
      { type: 'text', content: '.' }
    ]
  },
  {
    id: "1.2",
    segments: [
      { type: 'semantic', original: 'Le monde', alternatives: ['La totalité des faits'] },
      { type: 'text', content: ' se décompose en faits.' }
    ]
  },
  {
    id: "1.21",
    segments: [
      { type: 'text', content: 'Quelque chose peut isolément avoir lieu ou ne pas avoir lieu, et tout le reste demeurer inchangé.' }
    ]
  },
  {
    id: "2",
    segments: [
      { type: 'text', content: 'Ce qui a lieu, le fait, est la subsistance d\'états de chose.' }
    ]
  }
];
