'use client';

import type React from 'react';
import { AlertCircle } from 'lucide-react';
import Shimmer from '@/components/ui/loader/LoadingShimmer';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingCardProps {
    isLoading: boolean;
    isError: boolean;
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export function LoadingCard({ isLoading, isError, children, header, footer, ...props }: LoadingCardProps) {
    // Variantes d'animation pour les différents états
    const contentVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2
            }
        }
    };

    // Si erreur, on affiche le message d'erreur avec animation
    if (isError) {
        return (
            <motion.div
                className="w-full px-4"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
            >
                <div className="flex flex-col items-center justify-center">
                    <div className="text-destructive mb-4">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h3 className="font-medium">Erreur de chargement</h3>
                    <p className="text-muted-foreground mb-4 text-center">Impossible de charger les données.</p>
                </div>
            </motion.div>
        );
    }

    // Conteneur principal qui reste stable pendant les transitions
    return (
        <div className={props.className || "w-full px-4"}>
            {header && <div>{header}</div>}

            <AnimatePresence mode="wait">
                {isLoading ? (
                    // État de chargement avec animation
                    <motion.div
                        key="loading"
                        className="space-y-2"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={contentVariants}
                    >
                        <Shimmer height="24px" width="40%" />
                        <Shimmer height="50px" />
                    </motion.div>
                ) : (
                    // Contenu principal avec animation
                    <motion.div
                        key="content"
                        className="space-y-2"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={contentVariants}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            {footer && <div>{footer}</div>}
        </div>
    );
}
