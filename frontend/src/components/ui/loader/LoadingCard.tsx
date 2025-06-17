import { Card, CardContent, CardHeader } from "@/components/ui/quebec/Card";
import { Skeleton } from "@/components/ui/shadcn/skeleton";

interface LoadingCardProps {
  readonly count?: number;
}

export default function LoadingCard({
  count = 8,
}: LoadingCardProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card elevation={1} key={`loading-card-${index}`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {/* Avatar skeleton */}
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Name skeleton */}
                  <Skeleton className="h-4 w-24" />
                  {/* Department skeleton */}
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              {/* Menu button skeleton */}
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            {/* Status badges skeleton */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Contact information skeleton */}
            <div className="space-y-2">
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            {/* Role section skeleton */}
            <div className="pt-2 border-t border-muted">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
