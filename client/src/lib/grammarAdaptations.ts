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
  'fr:1.1': [
    {
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
    },
    {
      trigger: 'la totalité des faits',
      deps: [{
        find: ', non des ',
        replacements: {
          'le monde': ', non les ',
          'la totalité des faits': ', non des ',
          'tout ce qui a lieu': ', non les ',
          'tous les faits': ', non les ',
          'les faits dans l\'espace logique': ', non les ',
          'la totalité de la réalité': ', non les ',
        }
      }]
    }
  ],

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

  // Prop 2.0121: "...qu'à une chose qui pourrait subsister seule en elle-même..."
  'fr:2.0121': [
    {
      trigger: 'une chose',
      deps: [
        {
          find: 'seule en elle-même',
          replacements: {
            'une chose': 'seule en elle-même',
            'un objet': 'seul en lui-même',
            'une entité': 'seule en elle-même',
          }
        }
      ]
    },
    {
      trigger: 'choses',
      deps: [
        {
          find: 'celles-ci',
          replacements: {
            'choses': 'celles-ci',
            'objets': 'ceux-ci',
            'entités': 'celles-ci',
          }
        }
      ]
    }
  ],

  // Prop 2.0122: "La chose est indépendante, en tant qu'elle peut se présenter..."
  'fr:2.0122': [{
    trigger: 'la chose',
    deps: [
      {
        find: ' est indépendante',
        replacements: {
          'la chose': ' est indépendante',
          'l\'objet': ' est indépendant',
          'l\'entité': ' est indépendante',
        }
      },
      {
        find: 'qu\'elle',
        replacements: {
          'la chose': 'qu\'elle',
          'l\'objet': 'qu\'il',
          'l\'entité': 'qu\'elle',
        }
      }
    ]
  }],

  // Prop 2.0123: "...inhérente à la nature de cet objet..."
  'fr:2.0123': [{
    trigger: 'objet',
    deps: [{
      find: 'cet ',
      replacements: {
        'objet': 'cet ',
        'chose': 'cette ',
        'entité': 'cette ',
      }
    }]
  }],

  'fr:2.032': [{
    trigger: 'objets',
    deps: [{
      find: 'les uns aux autres',
      replacements: {
        'objets': 'les uns aux autres',
        'entités': 'les unes aux autres',
        'choses': 'les unes aux autres',
      }
    }]
  }],

  'fr:3.321': [{
    trigger: 'symboles différents',
    deps: [{
      find: ' ils dénotent',
      replacements: {
        'symboles différents': ' ils dénotent',
        'expressions différentes': ' elles dénotent',
        'différentes parties de la proposition qui caractérisent son sens': ' elles dénotent',
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
  'en:1.1': [
    {
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
    },
    {
      trigger: 'the totality of facts',
      deps: [{
        find: ', not of ',
        replacements: {
          'the world': ', not the ',
          'the totality of facts': ', not of ',
          'everything that is the case': ', not ',
          'all that is the case': ', not ',
          'all the facts': ', not the ',
          'the facts in logical space': ', not the ',
          'the totality of reality': ', not the ',
        }
      }]
    }
  ],

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

  // Prop 2.0123: "If I know an object..."
  'en:2.0123': [{
    trigger: 'object',
    deps: [{
      find: 'know an ',
      replacements: {
        'object': 'know an ',
        'thing': 'know a ',
        'entity': 'know an ',
      }
    }]
  }],

  // Prop 2.01231: "In order to know an object..."
  'en:2.01231': [{
    trigger: 'object',
    deps: [{
      find: 'know an ',
      replacements: {
        'object': 'know an ',
        'thing': 'know a ',
        'entity': 'know an ',
      }
    }]
  }],

  // Prop 2.0121: "...when to a thing that could exist alone on its own account..."
  'en:2.0121': [
    {
      trigger: 'thing',
      deps: [{
        find: 'to a ',
        replacements: {
          'thing': 'to a ',
          'object': 'to an ',
          'entity': 'to an ',
        }
      }]
    },
    {
      trigger: 'object',
      deps: [{
        find: 'think of an ',
        replacements: {
          'object': 'think of an ',
          'thing': 'think of a ',
          'entity': 'think of an ',
        }
      }]
    }
  ],

  // Prop 2.063: "The total reality is the world." — "total reality" not in group, skip

  // ── GERMAN ──────────────────────────────────────────────

  // Prop 2.0123: "Wenn ich den Gegenstand kenne..."
  'de:2.0123': [{
    trigger: 'gegenstand',
    deps: [
      {
        find: 'ich den ',
        replacements: {
          'gegenstand': 'ich den ',
          'ding': 'ich das ',
          'sache': 'ich die ',
        }
      },
      {
        find: 'seines Vorkommens',
        replacements: {
          'gegenstand': 'seines Vorkommens',
          'ding': 'seines Vorkommens',
          'sache': 'ihres Vorkommens',
        }
      },
      {
        find: 'des Gegenstandes',
        replacements: {
          'gegenstand': 'des Gegenstandes',
          'ding': 'des Dinges',
          'sache': 'der Sache',
        }
      }
    ]
  }],

  // Prop 2.01231: "Um einen Gegenstand zu kennen..."
  'de:2.01231': [{
    trigger: 'gegenstand',
    deps: [
      {
        find: 'einen ',
        replacements: {
          'gegenstand': 'einen ',
          'ding': 'ein ',
          'sache': 'eine ',
        }
      },
      {
        find: 'seine externen',
        replacements: {
          'gegenstand': 'seine externen',
          'ding': 'seine externen',
          'sache': 'ihre externen',
        }
      },
      {
        find: 'seine internen',
        replacements: {
          'gegenstand': 'seine internen',
          'ding': 'seine internen',
          'sache': 'ihre internen',
        }
      }
    ]
  }],

  // Prop 2.0121: "...wenn dem Ding, das allein für sich bestehen könnte..."
  'de:2.0121': [
    {
      trigger: 'ding',
      deps: [
        {
          find: 'wenn dem ',
          replacements: {
            'ding': 'wenn dem ',
            'gegenstand': 'wenn dem ',
            'sache': 'wenn der ',
          }
        },
        {
          find: ', das allein',
          replacements: {
            'ding': ', das allein',
            'gegenstand': ', der allein',
            'sache': ', die allein',
          }
        }
      ]
    },
    {
      trigger: 'gegenstand',
      deps: [
        {
          find: 'uns keinen ',
          replacements: {
            'gegenstand': 'uns keinen ',
            'ding': 'uns kein ',
            'sache': 'uns keine ',
          }
        },
        {
          find: 'mir den ',
          replacements: {
            'gegenstand': 'mir den ',
            'ding': 'mir das ',
            'sache': 'mir die ',
          }
        },
        {
          find: 'seiner Verbindung',
          replacements: {
            'gegenstand': 'seiner Verbindung',
            'ding': 'seiner Verbindung',
            'sache': 'ihrer Verbindung',
          }
        }
      ]
    }
  ],

  // Prop 2.0211 DE: "keine Substanz" → "nicht das, was unabhängig..."
  'de:2.0211': [{
    trigger: 'die substanz',
    deps: [{
      find: 'keine ',
      replacements: {
        'die substanz': 'keine ',
        'das, was unabhängig von dem was der fall ist, besteht': 'nicht ',
      }
    }]
  }],
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
