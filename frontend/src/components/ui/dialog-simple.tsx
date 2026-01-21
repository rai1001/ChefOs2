import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    trigger?: React.ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children }: DialogProps) {
    useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => onOpenChange(false)}
            />

            {/* Content */}
            <div className="z-50 grid w-full max-w-lg gap-4 bg-slate-950 border border-slate-800 p-6 shadow-lg sm:rounded-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold leading-none tracking-tight text-white">{title}</h3>
                        <Button variant="ghost" className="h-6 w-6 p-0 rounded-full" onClick={() => onOpenChange(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    {description && (
                        <p className="text-sm text-slate-400">{description}</p>
                    )}
                </div>

                <div className="py-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
