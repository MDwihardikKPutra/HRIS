import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ROLE_ACCESS, UserRole } from "@/lib/data";

export default async function PayrollLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user?.role || "karyawan") as UserRole;
  
  if (!ROLE_ACCESS[role]?.canManagePayroll) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
