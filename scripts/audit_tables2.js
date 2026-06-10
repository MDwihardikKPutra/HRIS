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
  const match = content.match(regex);
  return match ? match[1] : '';
}

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('<table')) continue;

  const relPath = path.relative(path.join(__dirname, '../src'), file).replace(/\\/g, '/');
  
  const tableClasses = extractClassMatches(content, /<table[^>]*className=["']([^"']*)["'][^>]*>/);
  const theadTrClasses = extractClassMatches(content, /<thead[^>]*>[\s\S]*?<tr[^>]*className=["']([^"']*)["'][^>]*>/);
  const thClasses = extractClassMatches(content, /<th[^>]*className=["']([^"']*)["'][^>]*>/);
  const tbodyClasses = extractClassMatches(content, /<tbody[^>]*className=["']([^"']*)["'][^>]*>/);
  const tdClasses = extractClassMatches(content, /<td[^>]*className=["']([^"']*)["'][^>]*>/);

  results.push({
    file: relPath,
    table: tableClasses.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
    theadTr: theadTrClasses.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
    th: thClasses.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
    tbody: tbodyClasses.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
    td: tdClasses.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  });
}

const md = [
  '# Audit Typography Tabel',
  '',
  '| File | `<table ...>` | `<thead tr ...>` | `<th ...>` | `<tbody ...>` | `<td ...>` |',
  '|---|---|---|---|---|---|',
  ...results.map(r => '| ' + [r.file, r.table, r.theadTr, r.th, r.tbody, r.td].map(c => c ? '`' + c + '`' : '').join(' | ') + ' |')
].join('\n');

fs.writeFileSync('C:\\Users\\Dyko Putra\\.gemini\\antigravity-ide\\brain\\0b3b8c45-8529-4472-8596-8e89caed8152\\table_audit.md', md);
console.log('Artifact created at table_audit.md');
