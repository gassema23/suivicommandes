import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import React from 'react';
import { Spinner } from './Spinner';

const SIZES = {
    default: 'text-md',
    lg: 'text-2xl',
    xl: 'text-2xl',
    xxl: 'text-3xl',
} as const;

// Define loading page variants
const loadingPageVariants = cva('animate-pulse tracking-tighter', {
    variants: {
        customSize: SIZES,
    },
    defaultVariants: {
        customSize: 'default',
    },
});
// Define props interface
interface LoadingPageProps extends VariantProps<typeof loadingPageVariants> {
    readonly message?: string;
    readonly customSize?: keyof typeof SIZES;
}
export function LoadingPage({ message, customSize = 'default' }: LoadingPageProps): React.ReactElement {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Spinner size="lg" variant="primary" className="mb-2" />
            <p className={cn(loadingPageVariants({ customSize }))}>Chargement des données...</p>
            {message && <p className="text-muted-foreground text-sm">{message}</p>}
        </div>
    );
}

// Named export for better tree-shaking
export default LoadingPage;
