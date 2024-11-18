"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownMenu = ({
                          children,
                          ...props
                      }: DropdownMenuPrimitive.DropdownMenuProps) => {
    return <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>;
};

const DropdownMenuTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Trigger
        ref={ref}
        className={cn("outline-none", className)}
        {...props}
    >
        {children}
    </DropdownMenuPrimitive.Trigger>
));
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            className={cn(
                "z-50 min-w-[8rem] rounded-md border bg-white p-1 text-gray-800 shadow-md", // 기본 라이트 모드 색상
                "dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700", // 다크모드 색상 추가
                "data-[side=bottom]:animate-slideUpAndFade",
                "data-[side=left]:animate-slideRightAndFade",
                "data-[side=right]:animate-slideLeftAndFade",
                "data-[side=top]:animate-slideDownAndFade",
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
            "focus:bg-gray-100 focus:text-black", // 라이트 모드 포커스 색상
            "hover:bg-gray-200 hover:text-black", // 라이트 모드 호버 색상
            "dark:focus:bg-gray-700 dark:focus:text-white", // 다크모드 포커스 색상
            "dark:hover:bg-gray-600 dark:hover:text-white", // 다크모드 호버 색상
            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
};