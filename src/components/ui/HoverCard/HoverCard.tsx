import React, { useState } from 'react'
import { cn } from '~src/lib/utils'

interface HoverCardProps {
  children: React.ReactNode
  onClick?: () => void
}

export const HoverCard = ({ children, onClick  }: HoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative inline-block w-full"
      data-state={isOpen ? "open" : "closed"}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            isOpen,
            setIsOpen,
            className: cn(child.props.className)
          })
        }
        return child
      })}
    </div>
  )
}