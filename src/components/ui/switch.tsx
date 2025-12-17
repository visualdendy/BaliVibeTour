"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, onCheckedChange, onChange, ...props }, ref) => {
        return (
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    ref={ref}
                    onChange={(e) => {
                        onChange?.(e)
                        onCheckedChange?.(e.target.checked)
                    }}
                    {...props}
                />
                <div className={cn(
                    "h-6 w-11 rounded-full bg-red-500 transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                    "peer-checked:bg-green-500",
                    className
                )} />
            </label>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }
