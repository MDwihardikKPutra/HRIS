const fs = require('fs');
let content = fs.readFileSync('src/lib/data.ts', 'utf8');
const newPlan = `
  {
    "id": 101,
    "userId": 5,
    "projectId": 9,
    "planNumber": "WP-2026-101",
    "planDate": "2026-06-15",
    "activities": "Penyelesaian desain arsitektur untuk sistem core.",
    "status": "pending",
    "createdAt": "2026-06-08T08:00:00",
    "assignedBy": 4,
    "isAcknowledged": false
  },
`;
content = content.replace('export const workPlans: WorkPlan[] = [', 'export const workPlans: WorkPlan[] = [' + newPlan);
fs.writeFileSync('src/lib/data.ts', content);
console.log('Added work plan');
