"use client";

import { useSession } from "next-auth/react";
import { ROLE_ACCESS, type UserRole } from "@/lib/data";
import DashboardFinance from "./_components/DashboardFinance";
import DashboardHR from "./_components/DashboardHR";
import DashboardAdmin from "./_components/DashboardAdmin";
import DashboardKaryawan from "./_components/DashboardKaryawan";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = (session?.user?.role ?? "karyawan") as UserRole;
  const access = ROLE_ACCESS[userRole] ?? ROLE_ACCESS.karyawan;

  if (userRole === "admin") return <DashboardAdmin />;
  if (access.canApprovePayment) return <DashboardFinance />;
  if (access.canApproveLeave) return <DashboardHR />;
  return <DashboardKaryawan />;
}