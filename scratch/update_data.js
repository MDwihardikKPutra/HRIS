const fs = require('fs');
let content = fs.readFileSync('src/lib/data.ts', 'utf8');

// Update WorkPlan interface
content = content.replace(
  'status: "pending" | "approved" | "rejected";',
  'status: "pending" | "approved" | "rejected" | "extended";\n  assignedBy?: number;\n  isAcknowledged?: boolean;'
);

// Update getStatusColor function
const colorFunc = `export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'active':
    case 'completed':
      return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'rejected':
    case 'cancelled':
      return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
    case 'extended':
      return { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
    case 'pending':
    case 'on_hold':
    default:
      return { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
  }
}`;

content = content.replace(
  `export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'active':
    case 'completed':
      return { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'rejected':
    case 'cancelled':
      return { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
    case 'pending':
    case 'on_hold':
    default:
      return { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' };
  }
}`, colorFunc);

fs.writeFileSync('src/lib/data.ts', content);
console.log('Done');
