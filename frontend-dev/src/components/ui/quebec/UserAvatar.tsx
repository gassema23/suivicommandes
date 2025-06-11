import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/shadcn/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/shadcn/tooltip";
import type { User } from "../../../features/users/types/user.type";

interface UserAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariant> {
  user: User;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  showStatusIndicator?: boolean;
  tooltipContent?: React.ReactNode;
}

const statusVariant = cva(
  "border-background absolute z-10 rounded-full border",
  {
    variants: {
      variant: {
        online: "bg-success",
        offline: "bg-muted-foreground",
        busy: "bg-destructive",
        away: "bg-warning",
        invisible: "bg-transparent border-dashed border-muted-foreground",
      },
      size: {
        sm: "h-2 w-2 -right-0.5 bottom-0",
        md: "h-3 w-3 -right-0.5 bottom-0",
        lg: "h-4 w-4 -right-0.5 bottom-0",
        xl: "h-5 w-5 right-1 bottom-0",
        xxl: "h-5 w-5 right-1 bottom-0",
      },
    },
    defaultVariants: {
      variant: "online",
      size: "md",
    },
  }
);

const avatarSizeVariant = cva(
  "avatar-editing transition-all duration-300  font-bold tracking-tighter  elevation-1",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-lg",
        lg: "h-12 w-12 text-xl",
        xl: "h-16 w-16 text-4xl",
        xxl: "h-32 w-32 text-4xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export default function UserAvatar({
  className,
  variant = "online",
  size = "md",
  user,
  showStatusIndicator = false,
  tooltipContent,
  ...props
}: UserAvatarProps) {
  const statusLabel = {
    online: "En ligne",
    offline: "Hors ligne",
    busy: "Occupé",
    away: "Absent",
    invisible: "Invisible",
  };


  const avatar = (
    <div className={cn("group relative", className)} {...props}>
      {showStatusIndicator && (
        <div className={`${statusVariant({ variant, size })} border-2`} />
      )}
      <Avatar className={avatarSizeVariant({ size })}>
        <AvatarImage src={user?.profileImage} alt={user?.fullName} />
        <AvatarFallback className="bg-muted text-muted-foreground">
          {user.initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );

  // If tooltip content is provided, wrap with tooltip
  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{avatar}</TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{user.fullName}</p>
            {showStatusIndicator && (
              <p className="text-xs text-muted-foreground">
                {statusLabel[variant || "online"]}
              </p>
            )}
            {tooltipContent && <div className="mt-1">{tooltipContent}</div>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Otherwise return avatar directly
  return avatar;
}
