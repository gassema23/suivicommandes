import { Checkbox } from "@/components/ui/shadcn/checkbox";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  id: string;
  title: string;
  description: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function OptionCard({
  id,
  title,
  description,
  checked = false,
  onCheckedChange,
  className,
}: OptionCardProps) {
  return (
    <label
      htmlFor={id}
      className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
    >
      <div
        className={cn(
          "border p-4 transition ease-in-out duration-300",
          checked ? "bg-primary/5 border-primary/20" : "bg-background border-border",
          className
        )}
      >
        <div className="flex items-start space-x-3">
          <Checkbox
            id={id}
            checked={checked}
            onCheckedChange={onCheckedChange}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <div className="flex-1 space-y-1">
            <p className="text-lg font-medium leading-none ">{title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              {description}
            </p>
          </div>
        </div>
      </div>
    </label>
  );
}
