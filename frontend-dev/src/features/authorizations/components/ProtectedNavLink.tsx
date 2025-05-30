import { useAuth } from "@/providers/auth-provider";
import { useNavigate, useRouter } from "@tanstack/react-router";
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
  className = '',
  activeClassName = '',
  exactMatch = false
}) => {
  const { hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  
  // Vérifier si le lien est actif
  const isActive = useMemo(() => {
    const currentPath = router.state.location.pathname;
    if (exactMatch) {
      return currentPath === to;
    }
    return currentPath.startsWith(to);
  }, [router.state.location.pathname, to, exactMatch]);

  // Vérifier les permissions
  const hasAccess = useMemo(() => {
    if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
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

  const finalClassName = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a 
      href={to}
      onClick={handleClick}
      className={finalClassName}
    >
      {children}
    </a>
  );
};