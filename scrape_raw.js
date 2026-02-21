import * as cheerio from 'cheerio';
import fs from 'fs';

async function fetchAndParseRaw(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  const propositions = [];
  
  $('.tlp-aside-par').each((_, el) => {
    const $span = $(el);
    const id = $span.attr('id');
    
    if (id && /^\d+(\.\d+)*$/.test(id)) {
      const $parent = $span.closest('p, div');
      let text = $parent.text().trim();
      let content = text.replace(new RegExp('^' + id.replace(/\./g, '\\.') + '\\s*'), '').trim();
      content = content.replace(/\[\d+\]/g, '').trim();
      
      if (content && !propositions.find(p => p.id === id)) {
        propositions.push({ id, content });
      }
    }
  });

  return propositions;
}

async function main() {
  const englishProps = await fetchAndParseRaw('https://www.wittgensteinproject.org/w/index.php/Tractatus_Logico-Philosophicus_(English)');
  const frenchProps = await fetchAndParseRaw('https://www.wittgensteinproject.org/w/index.php/Tractatus_logico-philosophicus_(fran%C3%A7ais)');

  const fileContent = `export type RawProposition = {
  id: string;
  content: string;
};

export const tractatusEnglishRaw: RawProposition[] = ${JSON.stringify(englishProps, null, 2)};

export const tractatusFrenchRaw: RawProposition[] = ${JSON.stringify(frenchProps, null, 2)};
`;

  fs.writeFileSync('client/src/data/tractatusRaw.ts', fileContent);
  console.log('Saved raw tractatus propositions.');
}

main().catch(console.error);
