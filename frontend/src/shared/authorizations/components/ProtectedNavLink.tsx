import { useAuth } from "@/providers/auth.provider";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  requiredPermission?: { resource: string; action: string };
  requiredRole?: string;
  className?: string;
  activeClassName?: string;
  exactMatch?: boolean;
}

export const ProtectedNavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  requiredPermission,
  requiredRole,
  className = "",
  activeClassName = "",
}) => {
  const { hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();

  // Vérifier les permissions
  const hasAccess = useMemo(() => {
    if (
      requiredPermission &&
      !hasPermission(requiredPermission.resource, requiredPermission.action)
    ) {
      return false;
    }
    if (requiredRole && !hasRole(requiredRole)) {
      return false;
    }
    return true;
  }, [requiredPermission, requiredRole, hasPermission, hasRole]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasAccess) {
      navigate({ to });
    }
  };
  // Ne pas rendre le lien si pas d'accès
  if (!hasAccess) {
    return null;
  }

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={className}
      activeProps={{ className: activeClassName }}
    >
      {children}
    </Link>
  );
};
