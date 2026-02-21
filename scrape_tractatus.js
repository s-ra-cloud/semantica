import * as cheerio from 'cheerio';
import fs from 'fs';

async function fetchAndParse(url, lang, wordsToFind, replaceMap) {
  console.log(`Fetching ${lang} from ${url}...`);
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const propositions = [];
  
  // Looking for <span class="tlp-aside-par" id="1"><a href="...">1</a></span>
  $('.tlp-aside-par').each((_, el) => {
    const $span = $(el);
    const id = $span.attr('id'); // Get ID directly from the span's id attribute
    
    if (id && /^\d+(\.\d+)*$/.test(id)) {
      const $parent = $span.closest('p, div');
      
      // Get the full text of the parent
      let text = $parent.text().trim();
      
      // The text usually starts with the ID, e.g., "1 The world is..."
      // Remove it by matching the exact id at the start
      let content = text.replace(new RegExp('^' + id.replace(/\./g, '\\.') + '\\s*'), '').trim();
      
      // Clean up references like [1]
      content = content.replace(/\[\d+\]/g, '').trim();
      
      if (content) {
        // If there's an existing one, just take the first one or combine. 
        // We'll just push if not duplicate.
        if (!propositions.find(p => p.id === id)) {
          propositions.push({ id, content });
        }
      }
    }
  });

  console.log(`Parsed ${propositions.length} propositions for ${lang}`);

  // Find and replace semantics
  const findPattern = wordsToFind.join('|');
  const findRegex = new RegExp(`\\b(${findPattern})\\b`, 'gi');

  return propositions.map(prop => {
    const segments = [];
    let remaining = prop.content;
    let m;
    let lastIndex = 0;
    
    while ((m = findRegex.exec(remaining)) !== null) {
      if (m.index > lastIndex) {
        segments.push({ type: 'text', content: remaining.substring(lastIndex, m.index) });
      }
      
      const original = m[0];
      const lowerOriginal = original.toLowerCase();
      const isCapitalized = original[0] === original[0].toUpperCase();
      
      let replace = replaceMap[lowerOriginal] || replaceMap[wordsToFind[0]];
      const replaceWord = isCapitalized ? replace.charAt(0).toUpperCase() + replace.slice(1) : replace;
      
      segments.push({ 
        type: 'semantic', 
        original: original, 
        alternatives: [replaceWord] 
      });
      
      lastIndex = findRegex.lastIndex;
    }
    
    if (lastIndex < remaining.length) {
      segments.push({ type: 'text', content: remaining.substring(lastIndex) });
    }

    return { id: prop.id, segments };
  });
}

async function main() {
  const englishWords = ['the world', 'the world.'];
  const englishReplaceMap = { 'the world': 'the totality of facts', 'the world.': 'the totality of facts.' };

  const frenchWords = ['le monde', 'au monde', 'du monde', 'le monde.'];
  const frenchReplaceMap = {
    'le monde': 'la totalité des faits',
    'au monde': 'à la totalité des faits',
    'du monde': 'de la totalité des faits',
    'le monde.': 'la totalité des faits.'
  };

  const englishProps = await fetchAndParse(
    'https://www.wittgensteinproject.org/w/index.php/Tractatus_Logico-Philosophicus_(English)',
    'English',
    englishWords,
    englishReplaceMap
  );
  
  const frenchProps = await fetchAndParse(
    'https://www.wittgensteinproject.org/w/index.php/Tractatus_logico-philosophicus_(fran%C3%A7ais)',
    'French',
    frenchWords,
    frenchReplaceMap
  );

  const fileContent = `export type Segment =
  | { type: 'text'; content: string }
  | { type: 'semantic'; original: string; alternatives: string[] };

export type Proposition = {
  id: string;
  segments: Segment[];
};

export const tractatusEnglish: Proposition[] = ${JSON.stringify(englishProps, null, 2)};

export const tractatusFrench: Proposition[] = ${JSON.stringify(frenchProps, null, 2)};
`;

  fs.writeFileSync('client/src/data/tractatus.ts', fileContent);
  console.log(`Saved ${englishProps.length} English and ${frenchProps.length} French propositions!`);
}

main().catch(console.error);
