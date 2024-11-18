import React, { useState, useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
    children: ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
    return <div className="relative">{children}</div>;
};

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
    ({ children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn("outline-none")}
                {...props}
            >
                {children}
            </button>
        );
    }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    align?: "start" | "end"; // 메뉴 정렬 옵션
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
    ({ isOpen, onClose, children, className, align = "start", ...props }, ref) => {
        const localRef = useRef<HTMLDivElement | null>(null);
        const combinedRef = (node: HTMLDivElement | null) => {
            localRef.current = node;
            if (typeof ref === "function") {
                ref(node);
            } else if (ref && "current" in ref) {
                ref.current = node;
            }
        };

        useEffect(() => {
            if (isOpen) {
                const handleClickOutside = (event: MouseEvent) => {
                    if (localRef.current && !localRef.current.contains(event.target as Node)) {
                        onClose();
                    }
                };
                document.addEventListener("mousedown", handleClickOutside);
                return () => document.removeEventListener("mousedown", handleClickOutside);
            }
        }, [isOpen, onClose]);

        if (!isOpen) return null;

        return (
            <div
                ref={combinedRef}
                className={cn(
                    "absolute z-50 mt-2 min-w-[8rem] rounded-md border bg-white shadow-md p-1",
                    "dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700",
                    align === "end" ? "right-0" : "left-0",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                    "hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white",
                    "focus:bg-gray-100 focus:text-black dark:focus:bg-gray-700 dark:focus:text-white",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
DropdownMenuItem.displayName = "DropdownMenuItem";
