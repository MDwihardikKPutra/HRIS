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

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('<table')) continue;

  let original = content;

  // 1. Standarisasi <table className="...">
  content = content.replace(/<table(\s+)className=["']([^"']+)["']/g, (match, space, classes) => {
    // Keep custom non-typography classes if needed, but for simplicity let's overwrite standard ones
    // We want: w-full text-left border-collapse whitespace-nowrap
    return `<table${space}className="w-full text-left border-collapse whitespace-nowrap"`;
  });

  // 2. Standarisasi <thead> atau <tr inside thead>
  // Most pages use: <thead className="border-b border-slate-200 text-xs text-slate-500">
  // Or in DataTable: <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
  
  content = content.replace(/<thead(\s+)className=["']([^"']+)["']/g, (match, space, classes) => {
    // If it has border-b, ensure we keep it, but standardize text
    let newClasses = classes.replace(/text-xs|text-\[\d+px\]|font-bold|font-semibold|text-slate-\d+|tracking-wide/g, '').trim();
    newClasses += ' text-xs font-medium text-slate-500';
    return `<thead${space}className="${newClasses.replace(/\s+/g, ' ').trim()}"`;
  });

  // Specifically for DataTable and work/plans which put it on TR inside thead
  content = content.replace(/<tr(\s+)className=["']([^"']+)["']/g, (match, space, classes) => {
    if (classes.includes('border-b') && classes.includes('text-slate-')) {
      let newClasses = classes.replace(/text-xs|text-\[\d+px\]|font-bold|font-semibold|text-slate-\d+|tracking-wide/g, '').trim();
      newClasses += ' text-xs font-medium text-slate-500';
      return `<tr${space}className="${newClasses.replace(/\s+/g, ' ').trim()}"`;
    }
    return match;
  });

  // 3. Standarisasi <tbody>
  content = content.replace(/<tbody(\s+)className=["']([^"']+)["']/g, (match, space, classes) => {
    let newClasses = classes.replace(/divide-y\s+divide-slate-\d+|text-xs|text-\[\d+px\]|text-slate-\d+/g, '').trim();
    newClasses = `divide-y divide-slate-100 text-[13px] text-slate-700 ${newClasses}`.trim();
    return `<tbody${space}className="${newClasses}"`;
  });

  // 4. Standarisasi <td> padding
  // Find px-4 py-2, py-3 px-4, py-2.5 px-4 etc and replace with px-4 py-3
  content = content.replace(/<td(\s+)className=["']([^"']+)["']/g, (match, space, classes) => {
    let newClasses = classes.replace(/px-\d+\.?\d*|py-\d+\.?\d*/g, '').trim();
    newClasses = `px-4 py-3 ${newClasses}`.trim();
    return `<td${space}className="${newClasses}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${path.relative(path.join(__dirname, '../src'), file)}`);
  }
}
