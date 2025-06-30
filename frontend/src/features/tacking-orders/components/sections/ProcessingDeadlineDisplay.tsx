import { Button } from "@/components/ui/shadcn/button";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import type { UseQueryResult } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import moment from "moment";
import FormTitle from "../forms/FormTitle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { ScrollArea } from "@/components/ui/shadcn/scroll-area";

type ProcessingDeadlineResult = {
  deadline: moment.Moment;
  delay: number;
  startDate: moment.Moment;
  holidays: {
    holidayName: string;
    holidayDate: string;
  }[];
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="w-full text-left justify-between"
        >
          {moment(data?.deadline).format("LL")}
          <Calendar />
        </Button>
      </DialogTrigger>

      <DialogContent className="lg:min-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle asChild className="text-left w-full">
            <h1 className="section-title">Détails de la date calculée</h1>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-96 pr-2">
          <FormTitle title="Informations calculées" />
          <div className="flex flex-col lg:flex-row w-full lg:items-center justify-between border-b p-2">
            <span className="text-sm font-medium">Délai de traitement</span>
            <span className="text-sm font-normal">{data.delay} jours</span>
          </div>
          <div className="flex flex-col lg:flex-row w-full lg:items-center justify-between border-b p-2">
            <span className="text-sm font-medium">
              Date d'inscription de la réquisition
            </span>
            <span className="text-sm font-normal">
              {}
              {moment(data.startDate).format("dddd LL")}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row w-full lg:items-center justify-between border-b p-2">
            <span className="text-sm font-medium">Date calculée</span>
            <span className="text-sm font-normal">
              {moment(data.deadline).format("dddd LL")}
            </span>
          </div>
          <FormTitle title="Jours fériés calculés" />
          {data?.holidays &&
            data.holidays.map((holiday) => (
              <div
                key={holiday.holidayName + "_" + holiday.holidayDate}
                className="flex flex-col lg:flex-row w-full lg:items-center justify-between border-b p-2 last:border-b-0"
              >
                <span className="text-sm font-medium">
                  {holiday.holidayName}
                </span>
                <span className="text-sm font-normal">
                  {moment(holiday.holidayDate).format("dddd LL")}
                </span>
              </div>
            ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
