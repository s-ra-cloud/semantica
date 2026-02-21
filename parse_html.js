import fs from 'fs';

async function fetchAndParse(url, lang, wordsToFind, replaceMap) {
  console.log(`Fetching ${lang}...`);
  const response = await fetch(url);
  const html = await response.text();
  
  // The propositions are usually in paragraphs or divs with specific formatting.
  // In the HTML, they look like:
  // <b><a href="...">1</a></b> The world is everything that is the case.
  // Or similar. Let's extract all the text nodes that start with a number.
  
  const propositions = [];
  
  // A crude regex to find the propositions in the HTML:
  // Matches <b><a ...>1.1</a></b> or <strong><a ...>1.1</a></strong>
  // followed by the text until the next <p> or <br> or </div>
  const regex = /<(?:b|strong)><a[^>]*>([\d\.]+)<\/a><\/(?:b|strong)>\s*(.*?)(?=(?:<(?:p|br|div|b|strong)|$))/gi;
  
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    let content = match[2].trim();
    
    // Clean up HTML tags in content
    content = content.replace(/<[^>]*>/g, '').trim();
    
    // Clean up wiki references like [1]
    content = content.replace(/\[\d+\]/g, '').trim();
    
    if (content) {
      propositions.push({ id, content });
    }
  }

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
  const englishWords = ['the world'];
  const englishReplaceMap = { 'the world': 'the totality of facts' };

  const frenchWords = ['le monde', 'au monde', 'du monde'];
  const frenchReplaceMap = {
    'le monde': 'la totalité des faits',
    'au monde': 'à la totalité des faits',
    'du monde': 'de la totalité des faits'
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
