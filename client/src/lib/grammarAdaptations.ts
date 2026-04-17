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

  // ── FRENCH (props ≥ 3.324) ──────────────────────────────

  // Prop 4.2211: "Même si le monde est infiniment complexe..."
  'fr:4.2211': [{
    trigger: 'le monde',
    deps: [{
      find: ' est infiniment complexe',
      replacements: {
        'le monde': ' est infiniment complexe',
        'la totalité des faits': ' est infiniment complexe',
        'tout ce qui a lieu': ' est infiniment complexe',
        'tous les faits': ' sont infiniment complexes',
        'les faits dans l\'espace logique': ' sont infiniment complexes',
        'la totalité de la réalité': ' est infiniment complexe',
        'la totalité des états de choses subsistants': ' est infiniment complexe',
      }
    }]
  }],

  // Prop 4.26: "...décrit complètement le monde. Le monde est complètement décrit..."
  'fr:4.26': [{
    trigger: 'le monde',
    deps: [{
      find: ' est complètement décrit ',
      replacements: {
        'le monde': ' est complètement décrit ',
        'la totalité des faits': ' est complètement décrite ',
        'tout ce qui a lieu': ' est complètement décrit ',
        'tous les faits': ' sont complètement décrits ',
        'les faits dans l\'espace logique': ' sont complètement décrits ',
        'la totalité de la réalité': ' est complètement décrite ',
        'la totalité des états de choses subsistants': ' est complètement décrite ',
      }
    }]
  }],

  // Prop 5.62: "Que le monde soit mon monde se montre..."
  'fr:5.62': [{
    trigger: 'le monde',
    deps: [{
      find: ' soit mon monde',
      replacements: {
        'le monde': ' soit mon monde',
        'la totalité des faits': ' soit mon monde',
        'tout ce qui a lieu': ' soit mon monde',
        'tous les faits': ' soient mon monde',
        'les faits dans l\'espace logique': ' soient mon monde',
        'la totalité de la réalité': ' soit mon monde',
        'la totalité des états de choses subsistants': ' soit mon monde',
      }
    }]
  }],

  // Prop 5.641: "...que « le monde est mon monde »."
  'fr:5.641': [{
    trigger: 'le monde',
    deps: [{
      find: ' est mon monde',
      replacements: {
        'le monde': ' est mon monde',
        'la totalité des faits': ' est mon monde',
        'tout ce qui a lieu': ' est mon monde',
        'tous les faits': ' sont mon monde',
        'les faits dans l\'espace logique': ' sont mon monde',
        'la totalité de la réalité': ' est mon monde',
        'la totalité des états de choses subsistants': ' est mon monde',
      }
    }]
  }],

  // Prop 6.342: "...que le monde se laisse décrire par la mécanique..."
  'fr:6.342': [{
    trigger: 'le monde',
    deps: [{
      find: ' se laisse décrire',
      replacements: {
        'le monde': ' se laisse décrire',
        'la totalité des faits': ' se laisse décrire',
        'tout ce qui a lieu': ' se laisse décrire',
        'tous les faits': ' se laissent décrire',
        'les faits dans l\'espace logique': ' se laissent décrire',
        'la totalité de la réalité': ' se laisse décrire',
        'la totalité des états de choses subsistants': ' se laisse décrire',
      }
    }]
  }],

  // Prop 6.373: "Le monde est indépendant de ma volonté."
  'fr:6.373': [{
    trigger: 'le monde',
    deps: [{
      find: ' est indépendant ',
      replacements: {
        'le monde': ' est indépendant ',
        'la totalité des faits': ' est indépendante ',
        'tout ce qui a lieu': ' est indépendant ',
        'tous les faits': ' sont indépendants ',
        'les faits dans l\'espace logique': ' sont indépendants ',
        'la totalité de la réalité': ' est indépendante ',
        'la totalité des états de choses subsistants': ' est indépendante ',
      }
    }]
  }],

  // Prop 6.43: "...le monde doit alors devenir par là totalement autre..."
  'fr:6.43': [{
    trigger: 'le monde',
    deps: [{
      find: ' doit alors devenir par là totalement autre',
      replacements: {
        'le monde': ' doit alors devenir par là totalement autre',
        'la totalité des faits': ' doit alors devenir par là totalement autre',
        'tout ce qui a lieu': ' doit alors devenir par là totalement autre',
        'tous les faits': ' doivent alors devenir par là totalement autres',
        'les faits dans l\'espace logique': ' doivent alors devenir par là totalement autres',
        'la totalité de la réalité': ' doit alors devenir par là totalement autre',
        'la totalité des états de choses subsistants': ' doit alors devenir par là totalement autre',
      }
    }]
  }],

  // Prop 6.431: "...le monde n'est pas changé, il cesse."
  'fr:6.431': [
    {
      trigger: 'le monde',
      deps: [
        {
          find: ' n\'est pas changé',
          replacements: {
            'le monde': ' n\'est pas changé',
            'la totalité des faits': ' n\'est pas changée',
            'tout ce qui a lieu': ' n\'est pas changé',
            'tous les faits': ' ne sont pas changés',
            'les faits dans l\'espace logique': ' ne sont pas changés',
            'la totalité de la réalité': ' n\'est pas changée',
            'la totalité des états de choses subsistants': ' n\'est pas changée',
          }
        },
        {
          find: ', il cesse.',
          replacements: {
            'le monde': ', il cesse.',
            'la totalité des faits': ', elle cesse.',
            'tout ce qui a lieu': ', cela cesse.',
            'tous les faits': ', ils cessent.',
            'les faits dans l\'espace logique': ', ils cessent.',
            'la totalité de la réalité': ', elle cesse.',
            'la totalité des états de choses subsistants': ', elle cesse.',
          }
        }
      ]
    }
  ],

  // Prop 6.432: "Comment est le monde, ceci est pour le Supérieur parfaitement indifférent."
  'fr:6.432': [{
    trigger: 'le monde',
    deps: [{
      find: 'Comment est ',
      replacements: {
        'le monde': 'Comment est ',
        'la totalité des faits': 'Comment est ',
        'tout ce qui a lieu': 'Comment est ',
        'tous les faits': 'Comment sont ',
        'les faits dans l\'espace logique': 'Comment sont ',
        'la totalité de la réalité': 'Comment est ',
        'la totalité des états de choses subsistants': 'Comment est ',
      }
    }]
  }],

  // Prop 6.44: "Ce n'est pas comment est le monde qui est le Mystique, mais qu'il soit."
  'fr:6.44': [{
    trigger: 'le monde',
    deps: [
      {
        find: 'comment est ',
        replacements: {
          'le monde': 'comment est ',
          'la totalité des faits': 'comment est ',
          'tout ce qui a lieu': 'comment est ',
          'tous les faits': 'comment sont ',
          'les faits dans l\'espace logique': 'comment sont ',
          'la totalité de la réalité': 'comment est ',
          'la totalité des états de choses subsistants': 'comment est ',
        }
      },
      {
        find: ' qui est ',
        replacements: {
          'le monde': ' qui est ',
          'la totalité des faits': ' qui est ',
          'tout ce qui a lieu': ' qui est ',
          'tous les faits': ' qui sont ',
          'les faits dans l\'espace logique': ' qui sont ',
          'la totalité de la réalité': ' qui est ',
          'la totalité des états de choses subsistants': ' qui est ',
        }
      },
      {
        find: 'mais qu\'il soit',
        replacements: {
          'le monde': 'mais qu\'il soit',
          'la totalité des faits': 'mais qu\'elle soit',
          'tout ce qui a lieu': 'mais que cela soit',
          'tous les faits': 'mais qu\'ils soient',
          'les faits dans l\'espace logique': 'mais qu\'ils soient',
          'la totalité de la réalité': 'mais qu\'elle soit',
          'la totalité des états de choses subsistants': 'mais qu\'elle soit',
        }
      }
    ]
  }],

  // Prop 4.062: "...une proposition est vraie si les états de choses sont tels que..."
  'fr:4.062': [{
    trigger: 'les états de choses',
    deps: [{
      find: ' sont tels que',
      replacements: {
        'les états de choses': ' sont tels que',
        'les connexions d\'objets': ' sont telles que',
      }
    }]
  }],

  // Prop 4.063: "...correspond à un fait positif – le fait qu'un point soit blanc (non noir) à un fait négatif."
  'fr:4.063': [{
    trigger: 'un fait',
    deps: [
      {
        find: ' positif',
        replacements: {
          'un fait': ' positif',
          'un état de choses subsistant': ' positif',
          'une connexion d\'objets subsistante': ' positive',
        }
      },
      {
        find: ' négatif',
        replacements: {
          'un fait': ' négatif',
          'un état de choses subsistant': ' négatif',
          'une connexion d\'objets subsistante': ' négative',
        }
      }
    ]
  }],

  // Prop 4.0311: "Un nom est mis pour une chose, un autre pour une autre, et ils sont reliés..."
  'fr:4.0311': [{
    trigger: 'une chose',
    deps: [{
      find: ', un autre pour une autre',
      replacements: {
        'un objet': ', un autre pour un autre',
        'une entité': ', un autre pour une autre',
        'une chose': ', un autre pour une autre',
      }
    }]
  }],

  // Prop 4.123: "...quand il est impensable que son objet ne la possède pas."
  'fr:4.123': [{
    trigger: 'objet',
    deps: [{
      find: 'que son ',
      replacements: {
        'objet': 'que son ',
        'entité': 'que son ',
        'chose': 'que sa ',
      }
    }]
  }],

  // Prop 4.126: "...comme l'un de ses objets ne peut être exprimé par une proposition."
  'fr:4.126': [{
    trigger: 'objets',
    deps: [
      {
        find: 'l\'un de ses ',
        replacements: {
          'objets': 'l\'un de ses ',
          'entités': 'l\'une de ses ',
          'choses': 'l\'une de ses ',
        }
      },
      {
        find: ' ne peut être exprimé ',
        replacements: {
          'objets': ' ne peut être exprimé ',
          'entités': ' ne peut être exprimée ',
          'choses': ' ne peut être exprimée ',
        }
      }
    ]
  }],

  // Prop 4.1272: "...parler du nombre de tous les objets."
  'fr:4.1272': [{
    trigger: 'objets',
    deps: [{
      find: 'nombre de tous les ',
      replacements: {
        'objets': 'nombre de tous les ',
        'entités': 'nombre de toutes les ',
        'choses': 'nombre de toutes les ',
      }
    }]
  }],

  // Prop 4.243: "...la même chose ou deux choses différentes ?"
  'fr:4.243': [{
    trigger: 'choses',
    deps: [{
      find: ' différentes',
      replacements: {
        'objets': ' différents',
        'entités': ' différentes',
        'choses': ' différentes',
      }
    }]
  }],

  // Prop 5.4733: "...dans les deux cas le symbole est tout à fait différent..."
  'fr:5.4733': [{
    trigger: 'le symbole',
    deps: [{
      find: ' est tout à fait différent',
      replacements: {
        'le symbole': ' est tout à fait différent',
        'l\'expression': ' est tout à fait différente',
      }
    }]
  }],

  // Prop 5.5151: "...exprimer la proposition négative au moyen d'un fait négatif ?"
  'fr:5.5151': [{
    trigger: 'un fait',
    deps: [{
      find: ' négatif',
      replacements: {
        'un fait': ' négatif',
        'un état de choses subsistant': ' négatif',
        'une connexion d\'objets subsistante': ' négative',
      }
    }]
  }],

  // Prop 5.5351: "...a rendu l'expression dépourvue de sens « p est une proposition »..."
  'fr:5.5351': [{
    trigger: 'l\'expression',
    deps: [{
      find: ' dépourvue ',
      replacements: {
        'l\'expression': ' dépourvue ',
        'le symbole': ' dépourvu ',
      }
    }]
  }],

  // ── ENGLISH (props ≥ 3.324) ─────────────────────────────

  // Prop 4.2211: "Even if the world is infinitely complex..."
  'en:4.2211': [{
    trigger: 'the world',
    deps: [{
      find: ' is infinitely complex',
      replacements: {
        'the world': ' is infinitely complex',
        'the totality of facts': ' is infinitely complex',
        'everything that is the case': ' is infinitely complex',
        'all that is the case': ' is infinitely complex',
        'all the facts': ' are infinitely complex',
        'the facts in logical space': ' are infinitely complex',
        'the totality of reality': ' is infinitely complex',
        'the totality of subsisting states of affairs': ' is infinitely complex',
      }
    }]
  }],

  // Prop 4.26: "...describes the world completely. The world is completely described..."
  'en:4.26': [{
    trigger: 'the world',
    deps: [{
      find: ' is completely described ',
      replacements: {
        'the world': ' is completely described ',
        'the totality of facts': ' is completely described ',
        'everything that is the case': ' is completely described ',
        'all that is the case': ' is completely described ',
        'all the facts': ' are completely described ',
        'the facts in logical space': ' are completely described ',
        'the totality of reality': ' is completely described ',
        'the totality of subsisting states of affairs': ' is completely described ',
      }
    }]
  }],

  // Prop 5.62: "That the world is my world, shows itself..."
  'en:5.62': [{
    trigger: 'the world',
    deps: [{
      find: ' is my world',
      replacements: {
        'the world': ' is my world',
        'the totality of facts': ' is my world',
        'everything that is the case': ' is my world',
        'all that is the case': ' is my world',
        'all the facts': ' are my world',
        'the facts in logical space': ' are my world',
        'the totality of reality': ' is my world',
        'the totality of subsisting states of affairs': ' is my world',
      }
    }]
  }],

  // Prop 6.373: "The world is independent of my will."
  'en:6.373': [{
    trigger: 'the world',
    deps: [{
      find: ' is independent ',
      replacements: {
        'the world': ' is independent ',
        'the totality of facts': ' is independent ',
        'everything that is the case': ' is independent ',
        'all that is the case': ' is independent ',
        'all the facts': ' are independent ',
        'the facts in logical space': ' are independent ',
        'the totality of reality': ' is independent ',
        'the totality of subsisting states of affairs': ' is independent ',
      }
    }]
  }],

  // Prop 6.431: "As in death, too, the world does not change, but ceases."
  'en:6.431': [{
    trigger: 'the world',
    deps: [{
      find: ' does not change, but ceases',
      replacements: {
        'the world': ' does not change, but ceases',
        'the totality of facts': ' does not change, but ceases',
        'everything that is the case': ' does not change, but ceases',
        'all that is the case': ' does not change, but ceases',
        'all the facts': ' do not change, but cease',
        'the facts in logical space': ' do not change, but cease',
        'the totality of reality': ' does not change, but ceases',
        'the totality of subsisting states of affairs': ' does not change, but ceases',
      }
    }]
  }],

  // Prop 6.432: "How the world is, is completely indifferent for what is higher..."
  'en:6.432': [{
    trigger: 'the world',
    deps: [{
      find: ' is, is ',
      replacements: {
        'the world': ' is, is ',
        'the totality of facts': ' is, is ',
        'everything that is the case': ' is, is ',
        'all that is the case': ' is, is ',
        'all the facts': ' are, is ',
        'the facts in logical space': ' are, is ',
        'the totality of reality': ' is, is ',
        'the totality of subsisting states of affairs': ' is, is ',
      }
    }]
  }],

  // Prop 6.44: "Not how the world is, is the mystical, but that it is."
  'en:6.44': [{
    trigger: 'the world',
    deps: [
      {
        find: ' is, is ',
        replacements: {
          'the world': ' is, is ',
          'the totality of facts': ' is, is ',
          'everything that is the case': ' is, is ',
          'all that is the case': ' is, is ',
          'all the facts': ' are, is ',
          'the facts in logical space': ' are, is ',
          'the totality of reality': ' is, is ',
          'the totality of subsisting states of affairs': ' is, is ',
        }
      },
      {
        find: 'but that it is.',
        replacements: {
          'the world': 'but that it is.',
          'the totality of facts': 'but that it is.',
          'everything that is the case': 'but that it is.',
          'all that is the case': 'but that it is.',
          'all the facts': 'but that they are.',
          'the facts in logical space': 'but that they are.',
          'the totality of reality': 'but that it is.',
          'the totality of subsisting states of affairs': 'but that it is.',
        }
      }
    ]
  }],

  // ── GERMAN (props ≥ 3.324) ──────────────────────────────

  // Prop 4.022: "Der Satz zeigt ... wenn er wahr ist. Und er sagt..."
  // Note: "seinen Sinn" is its own semantic token, so we only adapt the
  // pronoun co-references in the second sentence here.
  'de:4.022': [{
    trigger: 'der satz',
    deps: [
      {
        find: 'wenn er wahr ist',
        replacements: {
          'der satz': 'wenn er wahr ist',
          'die beschreibung eines sachverhaltes': 'wenn sie wahr ist',
          'die beschreibung einer verbindung von gegenständen': 'wenn sie wahr ist',
        }
      },
      {
        find: 'Und er sagt',
        replacements: {
          'der satz': 'Und er sagt',
          'die beschreibung eines sachverhaltes': 'Und sie sagt',
          'die beschreibung einer verbindung von gegenständen': 'Und sie sagt',
        }
      }
    ]
  }],

  // Prop 4.121: "Der Satz kann die logische Form nicht darstellen, sie spiegelt sich in ihm... Er weist sie auf."
  'de:4.121': [{
    trigger: 'der satz',
    deps: [
      {
        find: 'in ihm',
        replacements: {
          'der satz': 'in ihm',
          'die beschreibung eines sachverhaltes': 'in ihr',
          'die beschreibung einer verbindung von gegenständen': 'in ihr',
        }
      },
      {
        find: 'Er weist ',
        replacements: {
          'der satz': 'Er weist ',
          'die beschreibung eines sachverhaltes': 'Sie weist ',
          'die beschreibung einer verbindung von gegenständen': 'Sie weist ',
        }
      }
    ]
  }],

  // Prop 4.123: "...dass ihr Gegenstand sie nicht besitzt."
  'de:4.123': [{
    trigger: 'gegenstand',
    deps: [{
      find: 'dass ihr ',
      replacements: {
        'gegenstand': 'dass ihr ',
        'sache': 'dass ihre ',
        'ding': 'dass ihr ',
      }
    }]
  }],

  // Prop 4.12721: "Der formale Begriff ist mit einem Gegenstand, der unter ihn fällt, bereits gegeben."
  'de:4.12721': [{
    trigger: 'gegenstand',
    deps: [
      {
        find: ', der unter ihn fällt',
        replacements: {
          'gegenstand': ', der unter ihn fällt',
          'sache': ', die unter ihn fällt',
          'ding': ', das unter ihn fällt',
        }
      }
    ]
  }],

  // Prop 4.461: "Der Satz zeigt was er sagt..."
  'de:4.461': [{
    trigger: 'der satz',
    deps: [{
      find: 'zeigt was er sagt',
      replacements: {
        'der satz': 'zeigt was er sagt',
        'die beschreibung eines sachverhaltes': 'zeigt was sie sagt',
        'die beschreibung einer verbindung von gegenständen': 'zeigt was sie sagt',
      }
    }]
  }],

  // Prop 5.123: "...worin der Satz „p" wahr ist, ohne seine sämtlichen Gegenstände zu schaffen."
  'de:5.123': [{
    trigger: 'der satz',
    deps: [{
      find: ' ohne seine sämtlichen ',
      replacements: {
        'der satz': ' ohne seine sämtlichen ',
        'die beschreibung eines sachverhaltes': ' ohne ihre sämtlichen ',
        'die beschreibung einer verbindung von gegenständen': ' ohne ihre sämtlichen ',
      }
    }]
  }],

  // Prop 5.1241: "Jeder Satz der einem anderen widerspricht, verneint ihn."
  'de:5.1241': [{
    trigger: 'jeder satz',
    deps: [{
      find: ' der einem anderen widerspricht',
      replacements: {
        'jeder satz': ' der einem anderen widerspricht',
        'jede beschreibung eines sachverhaltes': ' die einer anderen widerspricht',
        'jede beschreibung einer verbindung von gegenständen': ' die einer anderen widerspricht',
      }
    }]
  }],

  // Prop 5.1511: "...keinen besonderen Gegenstand, der den Wahrscheinlichkeitssätzen eigen wäre."
  'de:5.1511': [{
    trigger: 'gegenstand',
    deps: [{
      find: ', der den Wahrscheinlichkeitssätzen',
      replacements: {
        'gegenstand': ', der den Wahrscheinlichkeitssätzen',
        'sache': ', die den Wahrscheinlichkeitssätzen',
        'ding': ', das den Wahrscheinlichkeitssätzen',
      }
    }]
  }],

  // Prop 5.44: "Und gäbe es einen Gegenstand, der „∼" hiesse..."
  'de:5.44': [{
    trigger: 'gegenstand',
    deps: [{
      find: ', der „',
      replacements: {
        'gegenstand': ', der „',
        'sache': ', die „',
        'ding': ', das „',
      }
    }]
  }],

  // Prop 5.5352: "...selbst wenn dies ein Satz wäre, – wäre er nicht auch wahr..."
  'de:5.5352': [{
    trigger: 'ein satz',
    deps: [{
      find: ' wäre er nicht auch wahr',
      replacements: {
        'ein satz': ' wäre er nicht auch wahr',
        'eine beschreibung eines sachverhaltes': ' wäre sie nicht auch wahr',
        'eine beschreibung einer verbindung von gegenständen': ' wäre sie nicht auch wahr',
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
