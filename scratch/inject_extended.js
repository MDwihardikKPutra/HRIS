const fs = require('fs');
let content = fs.readFileSync('src/lib/data.ts', 'utf8');
const newPlan = `
  {
    "id": 102,
    "userId": 5,
    "projectId": 9,
    "planNumber": "WP-2026-102",
    "planDate": "2026-06-18",
    "activities": "Testing dan QA sistem untuk peluncuran (Tugas Tambahan).",
    "status": "extended",
    "createdAt": "2026-06-08T08:00:00",
    "assignedBy": 4,
    "isAcknowledged": false
  },
`;
content = content.replace('export const workPlans: WorkPlan[] = [', 'export const workPlans: WorkPlan[] = [' + newPlan);
fs.writeFileSync('src/lib/data.ts', content);
console.log('Added extended work plan');
