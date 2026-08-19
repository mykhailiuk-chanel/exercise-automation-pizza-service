"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function useRequireAdmin() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/account/login?redirect=/admin");
    }
  }, [isLoading, user, router]);

  const isAdmin = !isLoading && !!user && user.role === "admin";
  return { user, isLoading, isAdmin };
}
