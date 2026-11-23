"use client";

import { useEffect, useState } from "react";
import {
  adminService,
  type AdminStats,
  type AdminUserItem,
} from "@/lib/adminService";
import {
  Users,
  Target,
  CheckCircle2,
  Cpu,
  Crown,
  Shield,
  ShieldCheck,
  Search,
  RefreshCw,
  AlertCircle,
  Check,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const loadData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [statsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(page, 20),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
      setTotalUsers(usersData.total);
    } catch (err: any) {
      setMessage({
        text: err?.message || "Gagal memuat data admin.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleRoleToggle = async (user: AdminUserItem) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const confirmText =
      newRole === "ADMIN"
        ? `Apakah Anda yakin ingin mempromosikan ${user.email} menjadi ADMIN?`
        : `Apakah Anda yakin ingin mencabut hak ADMIN dari ${user.email} menjadi USER?`;

    if (!window.confirm(confirmText)) return;

    setUpdatingId(user.id);
    setMessage(null);
    try {
      await adminService.updateUserRole(user.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
      setMessage({
        text: `Role ${user.email} berhasil diubah menjadi ${newRole}.`,
        type: "success",
      });
    } catch (err: any) {
      setMessage({
        text: err?.message || "Gagal mengubah role user.",
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.profile?.name && u.profile.name.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sistem Keamanan Informasi (RBAC)
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Admin Management Console
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Audit akun, monitoring sistem, dan kelola kewenangan akses pengguna GoalPath.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Alert / Notification */}
      {message && (
        <div
          className={`mt-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {message.type === "success" ? (
            <Check className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* System Stats Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-3 text-primary">
            <Users className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Total Users</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {stats ? stats.totalUsers : "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-500">
            <Target className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Total Goals</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {stats ? stats.totalGoals : "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-3 text-blue-500">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Total Habits</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {stats ? stats.totalHabits : "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-3 text-purple-500">
            <Cpu className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">AI Sessions</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {stats ? stats.totalSessions : "-"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-3 text-amber-500">
            <Crown className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Premium</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {stats ? stats.premiumUsers : "-"}
          </p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="mt-10 rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Daftar Pengguna & Manajemen Role</h2>
            <p className="text-xs text-foreground/60">
              Total {totalUsers} akun terdaftar dalam sistem MySQL.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari email, nama, role..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-wider text-foreground/60">
              <tr>
                <th className="px-5 py-3.5">Pengguna</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Tier Langganan</th>
                <th className="px-5 py-3.5">Terdaftar Sejak</th>
                <th className="px-5 py-3.5 text-right">Aksi Administrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-foreground/50">
                    {loading ? "Memuat data pengguna..." : "Tidak ada pengguna yang cocok."}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isUserAdmin = u.role === "ADMIN";
                  const isUpdating = updatingId === u.id;
                  const joinedDate = new Date(u.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr key={u.id} className="hover:bg-muted/20 transition">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-foreground">
                          {u.profile?.name || "GoalPath User"}
                        </div>
                        <div className="text-xs text-foreground/50">{u.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            isUserAdmin
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          <Shield className="h-3 w-3" />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                            u.subscription?.tier === "premium"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
                              : "bg-muted text-foreground/60"
                          }`}
                        >
                          {u.subscription?.tier === "premium" ? "Premium" : "Free"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-foreground/60">
                        {joinedDate}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleRoleToggle(u)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                            isUserAdmin
                              ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                        >
                          {isUpdating ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Shield className="h-3.5 w-3.5" />
                          )}
                          {isUserAdmin ? "Turunkan ke USER" : "Jadikan ADMIN"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
