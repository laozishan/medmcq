import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourcePath = process.argv[2] ?? 'C:/Users/23503/Downloads/preview (53).html';
const outDir = path.resolve(import.meta.dirname, '..');

const html = await readFile(sourcePath, 'utf8');
const style = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const body = html.match(/<body>([\s\S]*?)<script>/)?.[1].trim() ?? '';
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';

const functionNames = [...script.matchAll(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm)].map(
  (match) => match[1],
);
const uniqueFunctionNames = [...new Set(functionNames)];
const scriptWithoutInit = script.replace(
  /\/\/ [^\n]* Init [^\n]*\s*\nrenderBank\(\);?\s*$/u,
  '',
);

const wrappedScript = `(() => {
${scriptWithoutInit}

Object.assign(window, {
  ${uniqueFunctionNames.join(',\n  ')}
});

renderBank();
})();
`;

await writeFile(path.join(outDir, 'src', 'prototype.css'), style.trimStart(), 'utf8');
await writeFile(
  path.join(outDir, 'src', 'prototypeMarkup.js'),
  `export const prototypeHtml = ${JSON.stringify(body)};\n`,
  'utf8',
);
await writeFile(path.join(outDir, 'public', 'prototype-runtime.js'), wrappedScript, 'utf8');

console.log(
  JSON.stringify(
    {
      cssBytes: style.length,
      markupBytes: body.length,
      runtimeBytes: wrappedScript.length,
      exportedFunctions: uniqueFunctionNames.length,
    },
    null,
    2,
  ),
);
