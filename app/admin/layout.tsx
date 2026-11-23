"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/lib/userService";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    userService
      .getOverview()
      .then((overview) => {
        if (cancelled) return;
        if (overview.profile.role === "ADMIN") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsAdmin(false);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground/60">Memverifikasi hak akses administrasi...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Akses Ditolak (403 Forbidden)</h1>
        <p className="mt-2 max-w-md text-sm text-foreground/60">
          Halaman ini khusus untuk Administrator sistem GoalPath. Akun Anda tidak memiliki izin untuk mengakses fungsi ini.
        </p>
        <button
          onClick={() => router.push("/today")}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition"
        >
          Kembali ke Dashboard Utama
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar active="admin" className="hidden lg:flex" />
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        {children}
      </main>
      <BottomNavigation active="me" />
    </div>
  );
}
