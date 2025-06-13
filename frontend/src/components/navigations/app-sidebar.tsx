import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/shadcn/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcn/collapsible";
import { ChevronDown } from "lucide-react";
import { sidebarMenu } from "./config/sidebar-menu";
import AppLogo from "@/components/ui/quebec/AppLogo";
import { usePermissions } from "../../shared/authorizations/hooks/usePermissions";
import { ProtectedNavLink } from "../../shared/authorizations/components/ProtectedNavLink";
import type { ComponentProps } from "react";

type Permission = {
  resource: string;
  action: string;
};

type SidebarItem = {
  title: string;
  url: string;
  isActive?: boolean;
  permission?: Permission;
  role?: string;
};

type SidebarGroupType = {
  title: string;
  url?: string;
  items: SidebarItem[];
  requiredPermissions?: Permission[];
  permissionLogic?: "AND" | "OR";
  role?: string;
  permission?: Permission;
};

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions } =
    usePermissions();

  const canAccessGroup = (group: SidebarGroupType): boolean => {
    if (
      group.permission &&
      !hasPermission(group.permission.resource, group.permission.action)
    ) {
      return false;
    }
    if (group.role && !hasRole(group.role)) {
      return false;
    }
    if (group.requiredPermissions?.length) {
      return group.permissionLogic === "AND"
        ? hasAllPermissions(group.requiredPermissions)
        : hasAnyPermission(group.requiredPermissions);
    }
    return true;
  };

  const canAccessItem = (item: SidebarItem): boolean => {
    if (
      item.permission &&
      !hasPermission(item.permission.resource, item.permission.action)
    ) {
      return false;
    }
    if (item.role && !hasRole(item.role)) {
      return false;
    }
    return true;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="py-4 flex w-full items-center justify-center">
        <AppLogo />
      </SidebarHeader>

      <SidebarContent className="gap-0 p-0 m-0">
        {sidebarMenu.navMain
          .filter((group) => {
            if (!canAccessGroup(group)) return false;
            return group.items.some(canAccessItem);
          })
          .map((group) => {
            const visibleItems = group.items.filter(canAccessItem);
            if (visibleItems.length === 0) return null;

            return (
              <Collapsible
                key={group.title}
                title={group.title}
                className="group/collapsible p-0 m-0"
              >
                <SidebarGroup>
                  <SidebarGroupLabel
                    asChild
                    className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <CollapsibleTrigger>
                      <div className="flex items-center w-full gap-x-2">
                        <span>{group.title}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </div>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>

                  <CollapsibleContent className="m-0 pb-1 w-full border-b border-muted-foreground/20">
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {visibleItems.map((item) => (
                          <SidebarMenuItem key={item.url ?? item.title}>
                            <SidebarMenuButton
                              asChild
                              className="pl-4 truncate w-full block"
                            >
                              <ProtectedNavLink
                                to={item.url}
                                activeClassName="text-sidebar-accent-foreground bg-sidebar-accent w-full "
                                requiredPermission={
                                  "permission" in item
                                    ? item.permission
                                    : undefined
                                }
                                requiredRole={
                                  "role" in item ? item.role : undefined
                                }
                              >
                                {item.title}
                              </ProtectedNavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            );
          })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
