const fs = require('fs');
const src = fs.readFileSync('src/lib/data.ts', 'utf8');

function extractArray(src, name) {
  const marker = 'export const ' + name;
  const start = src.indexOf(marker);
  if (start === -1) return [];
  const arrStart = src.indexOf('[', start);
  let depth = 0, i = arrStart;
  while (i < src.length) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') { depth--; if (depth === 0) break; }
    i++;
  }
  try { return JSON.parse(src.substring(arrStart, i + 1)); } catch(e) { console.error('Parse error for', name, e.message); return []; }
}

const users = extractArray(src, 'users');
console.log('Total users parsed:', users.length);
console.log('First user:', users[0] ? users[0].email : 'none');

const workPlans = extractArray(src, 'workPlans');
const workReal = extractArray(src, 'workRealizations');
const leaves = extractArray(src, 'leaveRequests');
const spds = extractArray(src, 'spds');
const purchases = extractArray(src, 'purchases');
const payrolls = extractArray(src, 'payrolls');

console.log('\n=== DEMO ACCOUNT AUDIT ===\n');
const demoEmails = ['admin@hris.local','hr@hris.local','finance@hris.local','pm@hris.local','budi@hris.local'];
demoEmails.forEach(email => {
  const u = users.find(u => u.email === email);
  if (!u) { console.log(email + ': USER NOT FOUND'); return; }
  const wp = workPlans.filter(x => x.userId === u.id).length;
  const wr = workReal.filter(x => x.userId === u.id).length;
  const lv = leaves.filter(x => x.userId === u.id).length;
  const sp = spds.filter(x => x.userId === u.id).length;
  const po = purchases.filter(x => x.userId === u.id).length;
  const pr = payrolls.filter(x => x.userId === u.id).length;
  
  const ok = (n, label) => (n > 0 ? 'OK' : 'EMPTY') + ' ' + label + ':' + n;
  console.log('[' + u.name + ' / ' + u.role + ']');
  console.log('  ' + ok(wp,'WorkPlan') + ' | ' + ok(wr,'WorkReal') + ' | ' + ok(lv,'Cuti') + ' | ' + ok(sp,'SPD') + ' | ' + ok(po,'Purchase') + ' | ' + ok(pr,'Payroll'));
  console.log('');
});
