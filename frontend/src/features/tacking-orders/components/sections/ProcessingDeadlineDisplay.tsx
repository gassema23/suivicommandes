import { Button } from "@/components/ui/shadcn/button";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import type { UseQueryResult } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import moment from "moment";

type ProcessingDeadlineResult = {
  deadline: moment.Moment;
};

type ProcessingDeadlineDisplayProps = {
  processingDeadlineQuery: UseQueryResult<ProcessingDeadlineResult, Error>;
};

export function ProcessingDeadlineDisplay({
  processingDeadlineQuery,
}: ProcessingDeadlineDisplayProps) {
  const { data, isError, isFetching, error } = processingDeadlineQuery;

  if (isFetching) {
    return <Skeleton className="h-9 w-full" />;
  }

  if (isError) {
    return (
      <div className="px-3 py-1 h-9 border items-center flex w-full bg-destructive/10 text-sm text-destructive">
        Erreur lors du calcul {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-3 py-1 h-9 border items-center flex w-full bg-muted text-sm text-muted-foreground justify-between">
        Délai de traitement
        <Calendar className="ml-2 h-4 w-4" />
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
          {moment(data?.deadline).format("LL")}
          <Calendar />
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
