export function IconContainer({ as: Component = 'div', color, className = '', ...props }) {
  return (
    <Component
      className={`w-13 h-13 rounded-xl mb-8 bg-gradient-to-br flex items-center justify-center ${className}`}
      {...props}
    />
  )
}

export function Caption({ as: Component = 'p', className = '', ...props }) {
  return (
    <Component
      className={`text-lg font-semibold tracking-tight leading-snug uppercase ${className}`}
      {...props}
    />
  )
}

export function BigText({ as: Component = 'p', className = '', ...props }) {
  return (
    <Component
      className={`text-6xl leading-none font-extrabold text-black tracking-tight ${className}`}
      {...props}
    />
  )
}

export function Paragraph({ as: Component = 'p', className = '', ...props }) {
  return (
    <Component
      className={`max-w-4xl text-2xl font-medium leading-10 space-y-6 ${className}`}
      {...props}
    />
  )
}

export function Link({ className = '', ...props }) {
  return <a className={`inline-flex text-2xl leading-8 font-medium ${className}`} {...props} />
}
