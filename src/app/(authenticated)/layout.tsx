import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const u = session.user;

  return (
    <AppShell
      user={{
        name: u.name ?? "User",
        role: u.role ?? "user",
        department: u.department ?? "",
        position: u.position ?? "",
        modules: u.modules ?? [],
      }}
    >
      {children}
    </AppShell>
  );
}
