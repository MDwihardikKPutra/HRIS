import { leaveRequests, spds, purchases, vendorPayments, getUserById, getProjectById, getVendorById, getLeaveTypeById, formatCurrency, formatDate, getStatusColor } from "@/lib/data";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export default function ApprovalPage() {
  const pendingLeaves = leaveRequests.filter(l => l.status === "pending");
  const pendingSPDs = spds.filter(s => s.status === "pending");
  const pendingPurchases = purchases.filter(p => p.status === "pending");
  const pendingVPs = vendorPayments.filter(v => v.status === "pending");
  const totalPending = pendingLeaves.length + pendingSPDs.length + pendingPurchases.length + pendingVPs.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Approval Center</h1>
        <p className="text-sm text-slate-500 mt-0.5">{totalPending} item menunggu persetujuan</p>
      </div>

      {/* Leave Approvals */}
      {pendingLeaves.length > 0 && (
        <Section title="Leave Requests" count={pendingLeaves.length}>
          {pendingLeaves.map((lr) => {
            const user = getUserById(lr.userId);
            const leaveType = getLeaveTypeById(lr.leaveTypeId);
            return (
              <ApprovalCard key={`leave-${lr.id}`} number={lr.leaveNumber} type="Leave" user={user?.name || ""} date={formatDate(lr.createdAt)}
                detail={`${leaveType?.name} • ${lr.totalDays} hari • ${formatDate(lr.startDate)} — ${formatDate(lr.endDate)}`}
                description={lr.reason}
              />
            );
          })}
        </Section>
      )}

      {/* SPD Approvals */}
      {pendingSPDs.length > 0 && (
        <Section title="SPD" count={pendingSPDs.length}>
          {pendingSPDs.map((s) => {
            const user = getUserById(s.userId);
            return (
              <ApprovalCard key={`spd-${s.id}`} number={s.spdNumber} type="SPD" user={user?.name || ""} date={formatDate(s.createdAt)}
                detail={`${s.destination} • ${formatCurrency(s.totalCost)}`}
                description={s.purpose}
              />
            );
          })}
        </Section>
      )}

      {/* Purchase Approvals */}
      {pendingPurchases.length > 0 && (
        <Section title="Purchases" count={pendingPurchases.length}>
          {pendingPurchases.map((p) => {
            const user = getUserById(p.userId);
            const project = getProjectById(p.projectId);
            return (
              <ApprovalCard key={`purchase-${p.id}`} number={p.purchaseNumber} type="Purchase" user={user?.name || ""} date={formatDate(p.createdAt)}
                detail={`${project?.name || ""} • ${formatCurrency(p.totalPrice)}`}
                description={p.description}
              />
            );
          })}
        </Section>
      )}

      {/* Vendor Payment Approvals */}
      {pendingVPs.length > 0 && (
        <Section title="Vendor Payments" count={pendingVPs.length}>
          {pendingVPs.map((vp) => {
            const user = getUserById(vp.userId);
            const vendor = getVendorById(vp.vendorId);
            return (
              <ApprovalCard key={`vp-${vp.id}`} number={vp.paymentNumber} type="Vendor Payment" user={user?.name || ""} date={formatDate(vp.createdAt)}
                detail={`${vendor?.name || ""} • ${formatCurrency(vp.amount)}`}
                description={vp.description}
              />
            );
          })}
        </Section>
      )}

      {totalPending === 0 && (
        <div className="text-center py-16 text-slate-400">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
          <p className="font-medium">All caught up!</p>
          <p className="text-sm">Tidak ada item yang menunggu persetujuan.</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{count}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ApprovalCard({ number, type, user, date, detail, description }: { number: string; type: string; user: string; date: string; detail: string; description: string }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-medium text-slate-700">{number}</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs text-slate-500">{type}</span>
          </div>
          <p className="text-sm text-slate-800 font-medium">{user}</p>
        </div>
        <span className="text-xs text-slate-400">{date}</span>
      </div>
      <p className="text-xs text-slate-500 mb-2">{detail}</p>
      <p className="text-xs text-slate-400 line-clamp-1">{description}</p>
      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition-colors border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors border border-red-200">
          <XCircle className="w-3.5 h-3.5" /> Reject
        </button>
      </div>
    </div>
  );
}
