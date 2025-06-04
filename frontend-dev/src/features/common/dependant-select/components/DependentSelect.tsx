import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface DependentSelectProps<T> {
  value: string | undefined;
  onChange: (val: string) => void;
  data: T[] | undefined;
  isLoading: boolean;
  isError: boolean;
  placeholder: string;
  getOptionValue: (item: T) => string;
  getOptionLabel: (item: T) => string;
}

export function DependentSelect<T>({
  value,
  onChange,
  data,
  isLoading,
  isError,
  placeholder,
  getOptionValue,
  getOptionLabel,
}: DependentSelectProps<T>) {
  if (isLoading) return <Skeleton className="h-9 w-full" />;
  if (isError)
    return (
      <div className="text-destructive/80 bg-muted/50 border h-9 flex px-3 items-center">
        Erreur lors du chargement
      </div>
    );

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={!data || data.length === 0}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data &&
          data.length > 0 &&
          data?.map((item) => (
            <SelectItem key={getOptionValue(item)} value={getOptionValue(item)}>
              {getOptionLabel(item)}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
