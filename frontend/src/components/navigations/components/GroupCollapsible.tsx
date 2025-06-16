import { useRouter } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/shadcn/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/shadcn/sidebar";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SidebarGroupProps = {
  group: {
    title: string;
    items: { url: string; title: string }[];
  };
  children: React.ReactNode;
};

export function GroupCollapsible({ group, children }: SidebarGroupProps) {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  // Fonction pour matcher les routes dynamiques ($param)
  const isInGroup = group.items.some((item) => {
    if (item.url.includes("$")) {
      const prefix = item.url.split("$")[0];
      return currentPath.startsWith(prefix);
    }
    return currentPath === item.url || currentPath.startsWith(item.url + "/");
  });

  // État contrôlé pour permettre le toggle manuel
  const [open, setOpen] = useState(isInGroup);

  // Si l'URL courante change et appartient au groupe, force l'ouverture
  useEffect(() => {
    if (isInGroup) setOpen(true);
  }, [isInGroup]);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <CollapsibleTrigger>
            <div className="flex items-center w-full gap-x-2">
              <span>{group.title}</span>
              <ChevronDown
                className={cn(
                  "ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180",
                  open ? "rotate-180" : ""
                )}
              />
            </div>
          </CollapsibleTrigger>
        </SidebarGroupLabel>
      </SidebarGroup>
      <CollapsibleContent className="pl-2 border-b border-muted">{children}</CollapsibleContent>
    </Collapsible>
  );
}
