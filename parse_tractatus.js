import fs from 'fs';

const englishRaw = fs.readFileSync('tractatus_english.md', 'utf8');
const frenchRaw = fs.readFileSync('tractatus_french.md', 'utf8');

function parse(text, findWords, replaceWordMap) {
  const lines = text.split('\n');
  const propositions = [];
  
  let currentId = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match line starting with **[number]** or '''[number]''' depending on markdown
    const match = line.match(/^['*]{2,3}\[?([\d\.]+)\]?['*]{2,3}\s*(.*)/);
    
    if (match) {
      if (currentId) {
        propositions.push({ id: currentId, content: currentContent.join(' ').trim() });
      }
      currentId = match[1];
      currentContent = [match[2]];
    } else if (currentId && line.trim()) {
      // Continuation of previous prop if it doesn't start with heading markers
      if (!line.startsWith('=') && !line.startsWith('----') && !line.startsWith('<')) {
         currentContent.push(line.replace(/<[^>]*>/g, '').trim()); // Strip HTML
      }
    }
  }
  
  if (currentId) {
    propositions.push({ id: currentId, content: currentContent.join(' ').trim() });
  }

  // Build regex pattern for all variations of find words
  const findPattern = findWords.join('|');
  const regex = new RegExp(`\\b(${findPattern})\\b`, 'gi');

  return propositions.map(prop => {
    const segments = [];
    let remaining = prop.content;
    
    // Clean up footnote references like <ref> or [1]
    remaining = remaining.replace(/<ref[^>]*>.*?<\/ref>/g, '');
    remaining = remaining.replace(/\[\d+\]/g, '');
    // Clean up markdown bold/italic
    remaining = remaining.replace(/['*]{2,3}/g, '');
    
    let m;
    let lastIndex = 0;
    
    while ((m = regex.exec(remaining)) !== null) {
      if (m.index > lastIndex) {
        segments.push({ type: 'text', content: remaining.substring(lastIndex, m.index) });
      }
      
      const original = m[0];
      const lowerOriginal = original.toLowerCase();
      const isCapitalized = original[0] === original[0].toUpperCase();
      
      // Determine replacement based on exact word match
      let replace = replaceWordMap[lowerOriginal] || replaceWordMap[findWords[0]];
      const replaceWord = isCapitalized ? replace.charAt(0).toUpperCase() + replace.slice(1) : replace;
      
      segments.push({ 
        type: 'semantic', 
        original: original, 
        alternatives: [replaceWord] 
      });
      
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < remaining.length) {
      segments.push({ type: 'text', content: remaining.substring(lastIndex) });
    }

    return {
      id: prop.id,
      segments
    };
  });
}

const englishWords = ['the world'];
const englishReplaceMap = {
  'the world': 'the totality of facts'
};

const frenchWords = ['le monde', 'au monde', 'du monde'];
const frenchReplaceMap = {
  'le monde': 'la totalité des faits',
  'au monde': 'à la totalité des faits',
  'du monde': 'de la totalité des faits'
};

const englishProps = parse(englishRaw, englishWords, englishReplaceMap);
const frenchProps = parse(frenchRaw, frenchWords, frenchReplaceMap);

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
console.log('Done parsing full tractatus!');
