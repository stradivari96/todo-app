export default function IconButton({ onClick, title, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center w-6 h-6 rounded hover:bg-black/10 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  )
}
