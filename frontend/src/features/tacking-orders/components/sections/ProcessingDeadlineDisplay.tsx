import { Button } from "@/components/ui/shadcn/button";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import type { UseQueryResult } from "@tanstack/react-query";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";

interface ProcessingDeadlineResult {
  deadline: moment.Moment;
  deadlineFormatted: string;
  businessDays: number;
  workingHours: number;
  isUrgent: boolean;
  estimatedCompletion: moment.Moment;
  estimatedCompletionFormatted: string;
  timeFromNow: string;
  isOverdue: boolean;
}

interface ProcessingDeadlineDisplayProps {
  processingDeadlineQuery: UseQueryResult<ProcessingDeadlineResult, Error>;
}

export function ProcessingDeadlineDisplay({
  processingDeadlineQuery,
}: ProcessingDeadlineDisplayProps) {
  
  const { data, isLoading, isError, error } = processingDeadlineQuery;

  if (isLoading) {
    return <Skeleton className="h-9 w-full" />;
  }

  if (isError) {
    return (
      <div className="px-3 py-1 h-9 border items-center flex w-full bg-destructive/10 text-sm text-destructive">
        Erreur lors du calcul: {error?.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-3 py-1 h-9 border items-center flex w-full bg-muted text-sm text-muted-foreground">
        Délai de traitement
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="w-full  text-left justify-between"
        >
          {data.deadlineFormatted}
          <Info />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="center">
        Place content for the popover here.Place content for the popover
        here.Place content for the popover here.Place content for the popover
        here.Place content for the popover here.
      </PopoverContent>
    </Popover>
  );
}
