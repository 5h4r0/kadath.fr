import { cn } from '@/lib/utils'
import * as React from 'react'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  // biome-ignore lint/a11y/noLabelWithoutControl: generic component — always paired with htmlFor in usage
  return <label ref={ref} className={cn('text-sm font-medium text-white', className)} {...props} />
})
Label.displayName = 'Label'

export { Label }
