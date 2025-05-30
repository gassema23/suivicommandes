import React from 'react'
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, Loader2, X } from "lucide-react";

export default function Toaster() {
    return (
        <Sonner
            position="top-right"
            closeButton
            toastOptions={{
                classNames: {
                    toast: '!items-start !bg-background border-border group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg !border-0 !border-l-6 !rounded-none',
                    success: '!border-success',
                    error: '!border-destructive',
                    info: '!border-info',
                    warning: '!border-warning',
                    title: 'pl-4',
                    description: 'pl-4',
                    closeButton:
                        '!text-destructive !group-[.toast]:text-destructive !right-0 !left-auto !top-2.5 !rounded-none !border-none !bg-transparent !p-0 ',
                },
            }}
            icons={{
                success: <CheckCircle2 className="text-success h-6 w-6" />,
                error: <AlertOctagon className="text-destructive h-6 w-6" />,
                info: <Info className="text-info h-6 w-6" />,
                warning: <AlertTriangle className="text-warning h-6 w-6" />,
                loading: <Loader2 className="text-primary h-6 w-6 animate-spin" />,
                close: <X className="text-muted-foreground hover:text-foreground duration-300 transition-colors ease-in-out h-4 w-4" />,
            }}
        />
    )
}
