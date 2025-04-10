import React from 'react'
import { cn } from '~src/lib/utils'

interface HoverCardContentProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
}

export const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, isOpen, children, ...props }, ref) => {
    if (!isOpen) return null
    
    return (
      <div
        ref={ref}
        className={cn(
          "fixed z-[9999]","w-80 top-full mt-2",
          "flex flex-col gap-4 rounded-md",
          "bg-popover p-4 text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-popover" />
      </div>
    )
  }
)
HoverCardContent.displayName = 'HoverCardContent'