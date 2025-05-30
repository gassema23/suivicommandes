import { useAuth } from "@/providers/auth-provider";
import { useAvailablePermissions } from "../hooks/use-available-permissions";

export const PermissionDebugger: React.FC = () => {
  const { user } = useAuth();
  const { getAllPermissions } = useAvailablePermissions();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <details className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg border max-w-md">
      <summary className="cursor-pointer font-semibold">
        🐛 Debug Permissions
      </summary>
      
      <div className="mt-2 text-xs space-y-2">
        <div>
          <strong>Utilisateur:</strong> {user?.fullName}
        </div>
        <div>
          <strong>Rôle:</strong> {user?.role?.roleName}
        </div>
        
        <div>
          <strong>Permissions backend:</strong>
          {user?.role?.permissions?.map((perm, i) => (
            <div key={i} className="ml-2 p-1 bg-gray-100 rounded">
              <div><strong>{perm.resource}</strong></div>
              <div className="text-gray-600">
                [{perm.actions.join(', ')}]
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <strong>Constantes disponibles:</strong>
          {getAllPermissions().map((perm, i) => (
            <div key={i} className="text-gray-600">
              {perm.resource}.{perm.action}
            </div>
          ))}
        </div>
      </div>
    </details>
  );
};