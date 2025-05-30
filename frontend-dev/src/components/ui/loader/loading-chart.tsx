import { AlertCircle } from 'lucide-react';
import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingChartProps {
    isLoading: boolean;
    isError: boolean;
    children: React.ReactNode;
    className?: string;
    columns?: number;
}

/**
 * Composant qui affiche un squelette de chargement pour un graphique
 * ou un message d'erreur, ou le contenu enfant si ni chargement ni erreur
 */
export const LoadingChart: React.FC<LoadingChartProps> = ({
    isLoading,
    isError,
    children,
    columns = 5,
    className
}) => {
    // Calculer la largeur de colonne une seule fois
    const columnWidth = useMemo(() => 100 / columns, [columns]);

    // Générer et mémoriser les hauteurs aléatoires pour éviter qu'elles changent à chaque rendu
    const stableHeights = useRef<number[][]>([]);

    // Initialiser les hauteurs stables si elles n'existent pas encore
    if (stableHeights.current.length === 0) {
        for (let i = 0; i < columns; i++) {
            stableHeights.current.push([20 + Math.floor(Math.random() * 180), 20 + Math.floor(Math.random() * 180)]);
        }
    }

    // Composant pour afficher l'état d'erreur
    if (isError) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <ErrorState />
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={className}
                >
                    <LoadingSkeleton
                        columnWidth={columnWidth}
                        columns={columns}
                        stableHeights={stableHeights.current}
                    />
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2
                    }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Composant pour l'état d'erreur
const ErrorState: React.FC = () => (
    <div className="w-full px-4">
        <div className="flex flex-col items-center justify-center">
            <div className="text-destructive mb-4">
                <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="font-medium">Erreur de chargement</h3>
            <p className="text-muted-foreground mb-4 text-center">Impossible de charger les données.</p>
        </div>
    </div>
);

interface LoadingSkeletonProps {
    columnWidth: number;
    columns: number;
    stableHeights: number[][];
}

// Composant pour l'état de chargement avec squelettes
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    columnWidth,
    columns,
    stableHeights
}) => {
    return (
        <div className="flex h-full w-full justify-between">
            {Array.from({ length: columns }).map((_, index) => (
                <SkeletonColumn
                    key={index}
                    columnWidth={columnWidth}
                    heights={stableHeights[index]}
                    index={index}
                />
            ))}
        </div>
    );
};

interface SkeletonColumnProps {
    columnWidth: number;
    heights: number[];
    index: number;
}

// Composant pour une colonne individuelle du squelette
const SkeletonColumn: React.FC<SkeletonColumnProps> = ({
    columnWidth,
    heights,
    index
}) => (
    <div
        className="flex h-full flex-col justify-between px-2"
        style={{ width: `${columnWidth}%` }}
    >
        {/* Section des barres verticales animées partant du bas */}
        <div className="flex w-full items-end space-x-2 mb-4 h-[200px]">
            <motion.div
                initial={{ height: 0 }}
                animate={{
                    height: [heights[0] * 0.7, heights[0], heights[0] * 0.85, heights[0]]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: index * 0.1
                }}
                className="bg-primary/20 w-5 origin-bottom rounded-md"
            />
            <motion.div
                initial={{ height: 0 }}
                animate={{
                    height: [heights[1] * 0.8, heights[1], heights[1] * 0.9, heights[1]]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: index * 0.1 + 0.3
                }}
                className="bg-primary/20 w-5 origin-bottom rounded-md"
            />
        </div>

        {/* Barre horizontale fixe en bas - TOUJOURS AU BAS */}
        <div className="w-full flex">
            <div className="bg-muted-foreground h-4 w-full rounded-md" />
        </div>
    </div>
);

export default LoadingChart;
