import { useState, useCallback } from 'react';

export interface PermissionMatrix {
  [resource: string]: string[];
}

export const usePermissionMatrix = (initialResources: string[]) => {
  const [matrix, setMatrix] = useState<PermissionMatrix>(() => {
    const initial: PermissionMatrix = {};
    initialResources.forEach(resource => {
      initial[resource] = [];
    });
    return initial;
  });

  const toggleAction = useCallback((resource: string, action: string) => {
    setMatrix(prev => {
      const newMatrix = { ...prev };
      const actions = [...(newMatrix[resource] || [])];
      
      const index = actions.indexOf(action);
      if (index >= 0) {
        actions.splice(index, 1);
      } else {
        actions.push(action);
      }
      
      newMatrix[resource] = actions;
      return newMatrix;
    });
  }, []);

  const toggleResource = useCallback((resource: string, allActions: string[]) => {
    setMatrix(prev => {
      const newMatrix = { ...prev };
      const currentActions = newMatrix[resource] || [];
      
      if (currentActions.length === allActions.length) {
        // Désélectionner toutes les actions
        newMatrix[resource] = [];
      } else {
        // Sélectionner toutes les actions
        newMatrix[resource] = [...allActions];
      }
      
      return newMatrix;
    });
  }, []);

  const isActionSelected = useCallback((resource: string, action: string) => {
    return matrix[resource]?.includes(action) || false;
  }, [matrix]);

  const isResourceFullySelected = useCallback((resource: string, allActions: string[]) => {
    const actions = matrix[resource] || [];
    return allActions.every(action => actions.includes(action));
  }, [matrix]);

  const isResourcePartiallySelected = useCallback((resource: string, allActions: string[]) => {
    const actions = matrix[resource] || [];
    return actions.length > 0 && !isResourceFullySelected(resource, allActions);
  }, [matrix, isResourceFullySelected]);

  const getFormattedPermissions = useCallback(() => {
    return Object.entries(matrix)
      .filter(([, actions]) => actions.length > 0)
      .map(([resource, actions]) => ({
        resource,
        actions
      }));
  }, [matrix]);

  const getTotalPermissions = useCallback(() => {
    return Object.values(matrix).reduce((total, actions) => total + actions.length, 0);
  }, [matrix]);

  return {
    matrix,
    toggleAction,
    toggleResource,
    isActionSelected,
    isResourceFullySelected,
    isResourcePartiallySelected,
    getFormattedPermissions,
    getTotalPermissions,
    setMatrix
  };
};