export default function Button({ children, onClick, variant = 'default', className = '', type = 'button', disabled = false }) {
  const base = 'inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    default: 'bg-white/20 hover:bg-white/30 text-white',
    ghost: 'hover:bg-black/10 text-inherit',
    danger: 'hover:bg-red-100 text-red-600',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </button>
  )
}
