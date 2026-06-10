const fs = require('fs');
const path = require('path');

function findFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findFiles(fullPath, files);
    } else if (file.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = findFiles(path.join(__dirname, '../src'));
const results = [];

function extractClassMatches(content, regex) {
  const matches = [...content.matchAll(regex)];
  return matches.map(m => m[1] || m[2] || '');
}

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('<table')) continue;

  const relPath = path.relative(path.join(__dirname, '../src'), file).replace(/\\/g, '/');
  
  const tableClasses = extractClassMatches(content, /<table[^>]*className=["']([^"']*)["'][^>]*>/g);
  const theadClasses = extractClassMatches(content, /<thead[^>]*className=["']([^"']*)["'][^>]*>/g);
  
  // Try to find the tr inside thead
  const theadTrMatch = content.match(/<thead[^>]*>[\s\S]*?<tr[^>]*className=["']([^"']*)["'][^>]*>/);
  const theadTrClass = theadTrMatch ? theadTrMatch[1] : '';

  // Try to find th
  const thMatch = content.match(/<th[^>]*className=["']([^"']*)["'][^>]*>/);
  const thClass = thMatch ? thMatch[1] : '';

  const tbodyClasses = extractClassMatches(content, /<tbody[^>]*className=["']([^"']*)["'][^>]*>/g);
  
  // Try to find td
  const tdMatch = content.match(/<td[^>]*className=["']([^"']*)["'][^>]*>/);
  const tdClass = tdMatch ? tdMatch[1] : '';

  results.push({
    file: relPath,
    table: tableClasses[0] || '',
    thead: theadClasses[0] || '',
    theadTr: theadTrClass,
    th: thClass,
    tbody: tbodyClasses[0] || '',
    td: tdClass
  });
}

console.log('| File | Table | Thead TR | TH | Tbody | TD |');
console.log('|---|---|---|---|---|---|');
for (const r of results) {
  const truncate = (s) => s.length > 30 ? s.substring(0, 30) + '...' : s;
  console.log(`| ${r.file} | \`${truncate(r.table)}\` | \`${truncate(r.theadTr)}\` | \`${truncate(r.th)}\` | \`${truncate(r.tbody)}\` | \`${truncate(r.td)}\` |`);
}
