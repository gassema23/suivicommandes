import { Skeleton } from "../shadcn/skeleton";

interface LoadingFormProps {
  readonly rows?: number;
}

export default function LoadingForm({
  rows = 5,
}: LoadingFormProps): React.ReactElement {
  return (
    <div className="w-3xl space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`}>
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-12 xl:col-span-4">
              <Skeleton key={`cell-${rowIndex}`} className="h-4 w-full" />
            </div>
            <div className="col-span-12 xl:col-span-8">
              <Skeleton key={`cell-${rowIndex}`} className="h-8 w-full" />
            </div>
          </div>
        </div>
      ))}
      <div>
        <div className="w-full flex justify-end gap-x-2">
          <Skeleton key={`submit-button`} className="h-10 w-32" />
          <Skeleton key={`cancel-button`} className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
