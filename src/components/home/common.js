export function IconContainer({ as: Component = 'div', color, className = '', ...props }) {
  return (
    <Component
      className={`w-12 h-12 rounded-xl mb-8 bg-gradient-to-br flex items-center justify-center ${className}`}
      {...props}
    />
  )
}

export function Caption({ as: Component = 'p', className = '', ...props }) {
  return (
    <Component
      className={`sm:text-lg sm:leading-snug font-semibold tracking-wide uppercase ${className}`}
      {...props}
    />
  )
}

export function BigText({ as: Component = 'p', className = '', ...props }) {
  return (
    <Component
      className={`text-3xl sm:text-5xl lg:text-6xl leading-none font-extrabold text-black tracking-tight ${className}`}
      {...props}
    />
  )
}

export function Paragraph({ as: Component = 'p', className = '', ...props }) {
  return (
    <Component
      className={`max-w-4xl text-lg sm:text-2xl font-medium sm:leading-10 space-y-6 ${className}`}
      {...props}
    />
  )
}

export function Link({ className = '', ...props }) {
  return <a className={`inline-flex text-lg sm:text-2xl font-medium ${className}`} {...props} />
}

export function Widont({ children }) {
  return children.replace(/ ([^ ]+)$/, '\u00A0$1')
}
