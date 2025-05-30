import { useAuth } from "@/providers/auth-provider";
import { useNavigate } from "@tanstack/react-router";
import { useNavigationHistory } from "../hooks/use-navigation-history";

export const UnauthorizedPage: React.FC = () => {
  const { user, getUserPermissions } = useAuth();
  const navigate = useNavigate();
  const { goToPreviousOrDashboard } = useNavigationHistory();
  const userPermissions = getUserPermissions();

  const handleGoBack = () => {
    const redirectPath = goToPreviousOrDashboard();
    navigate({ to: redirectPath });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h1>
        <p className="text-gray-600 mb-4">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        {user && (
          <div className="text-sm text-gray-500 mb-4">
            <p className="mb-2">
              Connecté en tant que : <span className="font-medium">{user.fullName}</span>
            </p>
            <p className="mb-2">
              Rôle : <span className="font-medium">{user.role?.roleName}</span>
            </p>
            {userPermissions.length > 0 && (
              <details className="text-left">
                <summary className="cursor-pointer hover:text-gray-700">
                  Vos permissions ({userPermissions.length})
                </summary>
                <div className="mt-2 space-y-1">
                  {userPermissions.map((permission, index) => (
                    <div key={index} className="text-xs bg-gray-100 p-2 rounded">
                      <strong>{permission.resource}</strong>: {permission.actions.join(', ')}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
        <div className="space-x-2">
          <button
            onClick={handleGoBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Retour
          </button>
          <button
            onClick={() => navigate({ to: '/' })}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
};