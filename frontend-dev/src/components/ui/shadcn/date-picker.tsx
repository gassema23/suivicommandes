import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { Button } from "../quebec/Button";
import { CalendarIcon } from "lucide-react";
import { cn, parseLocalDate } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/shadcn/calendar";
import type { DayPickerSingleProps } from "react-day-picker";
import { fr } from "date-fns/locale";
import { useState } from "react";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
} & Omit<DayPickerSingleProps, "selected" | "onSelect">;

export default function DatePicker({
  value,
  onChange,
  className,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const dateValue =
    typeof value === "string" && value
      ? parseLocalDate(value)
      : value instanceof Date
        ? value
        : undefined;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            className
          )}
          type="button"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? (
            format(dateValue, "yyyy-MM-dd", { locale: fr })
          ) : (
            <span>Choisir une date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          selected={dateValue}
          month={dateValue}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false); // Ferme le popover après sélection
          }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
