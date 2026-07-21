import type { ReactNode } from "react";

import {
  hasMinimumBandRole,
  type BandRole,
} from "@/lib/bandspace";

type PermissionGuardProps = {
  role: BandRole | null | undefined;
  minimumRole: BandRole;
  children: ReactNode;
  fallback?: ReactNode;
};

export default function PermissionGuard({
  role,
  minimumRole,
  children,
  fallback = null,
}: PermissionGuardProps) {
  if (!hasMinimumBandRole(role, minimumRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export type { PermissionGuardProps };