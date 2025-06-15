"use client";

import type React from "react";
import { AlertCircle } from "lucide-react";
import Shimmer from "@/components/ui/loader/LoadingShimmer";
import { motion, AnimatePresence, type Easing } from "framer-motion";

interface LoadingCardProps {
  isLoading: boolean;
  isError: boolean;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function LoadingCard({
  isLoading,
  isError,
  children,
  header,
  footer,
  ...props
}: LoadingCardProps) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut" as Easing,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className={props.className || "w-full px-4"}>
      {header && <div>{header}</div>}

      <AnimatePresence mode="wait">
        {isError ? (
          <motion.div
            key="error"
            className="w-full px-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="text-destructive mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="font-medium">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Impossible de charger les données.
              </p>
            </div>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            key="loading"
            className="space-y-2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <Shimmer height="24px" width="40%" />
            <Shimmer height="50px" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="space-y-2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {footer && <div>{footer}</div>}
    </div>
  );
}
