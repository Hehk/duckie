import React, { HTMLAttributes, ElementType } from "react"

type ClassNameGenerator<T> = (props: T, className: string) => string

interface StyledComponentProps<T> extends HTMLAttributes<HTMLElement> {
  classNameGenerator?: ClassNameGenerator<T>
}

export default function styled<T>(
  Tag: ElementType,
  defaultClassName: string,
  classNameGenerator?: ClassNameGenerator<T>,
) {
  return React.forwardRef<unknown, StyledComponentProps<T> & T>(
    ({ ...props }, ref) => {
      const finalClassName = classNameGenerator
        ? classNameGenerator(props as T, defaultClassName)
        : defaultClassName

      return <Tag ref={ref} className={finalClassName} {...props} />
    },
  )
}
