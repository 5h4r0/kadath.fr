import { cn } from '@/lib/utils'
import * as React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-[.2rem] border border-[#555555] bg-[#444444] px-3 py-2 text-sm text-white placeholder:text-[#999999] focus:border-tt-accent focus:outline-hidden focus:ring-1 focus:ring-tt-accent disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
