import React from 'react';
import { Skeleton } from '../shadcn/skeleton';

interface LoadingTableProps {
    readonly rows?: number;
    readonly columns?: number;
    readonly showHeader?: boolean;
}

export function LoadingTable({ rows = 5, columns = 4, showHeader = true }: LoadingTableProps): React.ReactElement {
    return (
        <div className="w-full space-y-4">
            <div className="border">
                <div className="w-full">
                    {showHeader && (
                        <div className="bg-muted/50 border-b px-4 py-3">
                            <div className="flex items-center space-x-4">
                                {Array.from({ length: columns }).map((_, index) => (
                                    <Skeleton key={`header-${index}`} className="h-4 w-full" />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="divide-y">
                        {Array.from({ length: rows }).map((_, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="px-4 py-3">
                                <div className="flex items-center space-x-4">
                                    {Array.from({ length: columns }).map((_, colIndex) => (
                                        <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-4 w-full" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Named export for better tree-shaking
export default LoadingTable;
