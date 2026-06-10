const fs = require('fs');
let content = fs.readFileSync('src/lib/data.ts', 'utf8');

// Replace WorkPlan interface
content = content.replace(
  `  status: "pending" | "approved" | "rejected" | "extended";
  assignedBy?: number;
  isAcknowledged?: boolean;
  createdAt: string;`,
  `  status: "pending" | "approved" | "rejected" | "extended";
  assignedBy?: number;
  isAcknowledged?: boolean;
  feedback?: string;
  createdAt: string;`
);

// Replace WorkRealization interface
content = content.replace(
  `  status: "pending" | "approved" | "rejected";
  createdAt: string;`,
  `  status: "pending" | "approved" | "rejected";
  feedback?: string;
  createdAt: string;`
);

fs.writeFileSync('src/lib/data.ts', content);
console.log('WorkPlan and WorkRealization interfaces updated successfully!');
