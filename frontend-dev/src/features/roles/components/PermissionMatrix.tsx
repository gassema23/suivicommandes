import { Checkbox } from '@/components/ui/shadcn/checkbox';
import React from 'react';

interface PermissionMatrixProps {
  resources: string[];
  actions: string[];
  isActionSelected: (resource: string, action: string) => boolean;
  isResourceFullySelected: (resource: string) => boolean;
  isResourcePartiallySelected: (resource: string) => boolean;
  onActionToggle: (resource: string, action: string) => void;
  onResourceToggle: (resource: string) => void;
  disabled?: boolean;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  resources,
  actions,
  isActionSelected,
  isResourceFullySelected,
  isResourcePartiallySelected,
  onActionToggle,
  onResourceToggle,
  disabled = false
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left p-3 font-medium">Ressource</th>
            <th className="text-center p-3 font-medium w-20">Tout</th>
            {actions.map((action) => (
              <th key={action} className="last:pr-0 text-center p-3 min-w-[80px]">
                <div className="bg-foreground text-muted px-3 py-2 rounded-md text-sm font-medium capitalize">
                  {action}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource, index) => (
            <tr
              key={resource}
              className={index % 2 === 0 ? "bg-muted/30" : "bg-background"}
            >
              <td className="p-3 font-medium capitalize">
                {resource}
              </td>
              
              <td className="text-center p-3">
                <Checkbox
                  checked={isResourceFullySelected(resource)}
                  onCheckedChange={() => onResourceToggle(resource)}
                  disabled={disabled}
                  className={isResourcePartiallySelected(resource) ? "opacity-60" : ""}
                />
              </td>
              
              {actions.map((action) => (
                <td key={action} className="text-center p-3">
                  <Checkbox
                    checked={isActionSelected(resource, action)}
                    onCheckedChange={() => onActionToggle(resource, action)}
                    disabled={disabled}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};