export type GrammarRule = {
  trigger: string;
  deps: {
    find: string;
    replacements: Record<string, string>;
  }[];
};

export const grammarAdaptations: Record<string, GrammarRule[]> = {

  // ── FRENCH ──────────────────────────────────────────────

  // Prop 1: "Le monde est tout ce qui a lieu."
  'fr:1': [{
    trigger: 'le monde',
    deps: [{
      find: ' est ',
      replacements: {
        'le monde': ' est ',
        'la totalité des faits': ' est ',
        'tout ce qui a lieu': ' est ',
        'tous les faits': ' sont ',
        'les faits dans l\'espace logique': ' sont ',
        'la totalité de la réalité': ' est ',
      }
    }]
  }],

  // Prop 1.1: "Le monde est la totalité des faits, non des choses."
  'fr:1.1': [{
    trigger: 'le monde',
    deps: [{
      find: ' est ',
      replacements: {
        'le monde': ' est ',
        'la totalité des faits': ' est ',
        'tout ce qui a lieu': ' est ',
        'tous les faits': ' sont ',
        'les faits dans l\'espace logique': ' sont ',
        'la totalité de la réalité': ' est ',
      }
    }]
  }],

  // Prop 1.11: "Le monde est déterminé par les faits, et par ceci qu'ils sont tous les faits."
  'fr:1.11': [{
    trigger: 'le monde',
    deps: [{
      find: ' est déterminé par ',
      replacements: {
        'le monde': ' est déterminé par ',
        'la totalité des faits': ' est déterminée par ',
        'tout ce qui a lieu': ' est déterminé par ',
        'tous les faits': ' sont déterminés par ',
        'les faits dans l\'espace logique': ' sont déterminés par ',
        'la totalité de la réalité': ' est déterminée par ',
      }
    }]
  }],

  // Prop 1.12: "Car la totalité des faits détermine ce qui a lieu, et aussi tout ce qui n'a pas lieu."
  'fr:1.12': [{
    trigger: 'la totalité des faits',
    deps: [{
      find: ' détermine ',
      replacements: {
        'le monde': ' détermine ',
        'la totalité des faits': ' détermine ',
        'tout ce qui a lieu': ' détermine ',
        'tous les faits': ' déterminent ',
        'les faits dans l\'espace logique': ' déterminent ',
        'la totalité de la réalité': ' détermine ',
      }
    }]
  }],

  // Prop 1.13: "Les faits dans l'espace logique sont le monde."
  'fr:1.13': [{
    trigger: 'les faits dans l\'espace logique',
    deps: [{
      find: ' sont ',
      replacements: {
        'le monde': ' est ',
        'la totalité des faits': ' est ',
        'tout ce qui a lieu': ' est ',
        'tous les faits': ' sont ',
        'les faits dans l\'espace logique': ' sont ',
        'la totalité de la réalité': ' est ',
      }
    }]
  }],

  // Prop 2.063: "La totalité de la réalité est le monde."
  'fr:2.063': [{
    trigger: 'la totalité de la réalité',
    deps: [{
      find: ' est ',
      replacements: {
        'le monde': ' est ',
        'la totalité des faits': ' est ',
        'tout ce qui a lieu': ' est ',
        'tous les faits': ' sont ',
        'les faits dans l\'espace logique': ' sont ',
        'la totalité de la réalité': ' est ',
      }
    }]
  }],

  // ── ENGLISH ─────────────────────────────────────────────

  // Prop 1: "The world is everything that is the case."
  'en:1': [{
    trigger: 'the world',
    deps: [{
      find: ' is ',
      replacements: {
        'the world': ' is ',
        'the totality of facts': ' is ',
        'everything that is the case': ' is ',
        'all that is the case': ' is ',
        'all the facts': ' are ',
        'the facts in logical space': ' are ',
      }
    }]
  }],

  // Prop 1.1: "The world is the totality of facts, not of things."
  'en:1.1': [{
    trigger: 'the world',
    deps: [{
      find: ' is ',
      replacements: {
        'the world': ' is ',
        'the totality of facts': ' is ',
        'everything that is the case': ' is ',
        'all that is the case': ' is ',
        'all the facts': ' are ',
        'the facts in logical space': ' are ',
      }
    }]
  }],

  // Prop 1.11: "The world is determined by the facts, and by these being all the facts."
  'en:1.11': [{
    trigger: 'the world',
    deps: [{
      find: ' is determined by ',
      replacements: {
        'the world': ' is determined by ',
        'the totality of facts': ' is determined by ',
        'everything that is the case': ' is determined by ',
        'all that is the case': ' is determined by ',
        'all the facts': ' are determined by ',
        'the facts in logical space': ' are determined by ',
      }
    }]
  }],

  // Prop 1.12: "For the totality of facts determines both what is the case..."
  'en:1.12': [{
    trigger: 'the totality of facts',
    deps: [{
      find: ' determines ',
      replacements: {
        'the world': ' determines ',
        'the totality of facts': ' determines ',
        'everything that is the case': ' determines ',
        'all that is the case': ' determines ',
        'all the facts': ' determine ',
        'the facts in logical space': ' determine ',
      }
    }]
  }],

  // Prop 1.13: "The facts in logical space are the world."
  'en:1.13': [{
    trigger: 'the facts in logical space',
    deps: [{
      find: ' are ',
      replacements: {
        'the world': ' is ',
        'the totality of facts': ' is ',
        'everything that is the case': ' is ',
        'all that is the case': ' is ',
        'all the facts': ' are ',
        'the facts in logical space': ' are ',
      }
    }]
  }],

  // Prop 2.063: "The total reality is the world." — "total reality" not in group, skip
};

export function applyGrammarAdaptations(
  text: string,
  propositionId: string,
  language: string,
  activeSwaps: Record<string, string>
): string {
  const key = `${language}:${propositionId}`;
  const rules = grammarAdaptations[key];
  if (!rules) return text;

  let result = text;
  for (const rule of rules) {
    const swappedTo = activeSwaps[rule.trigger];
    if (!swappedTo) continue;

    for (const dep of rule.deps) {
      const replacement = dep.replacements[swappedTo];
      if (replacement && result.includes(dep.find)) {
        result = result.replace(dep.find, replacement);
      }
    }
  }
  return result;
}
