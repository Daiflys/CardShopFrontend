import React from 'react';

/**
 * Button Component
 * Componente de botón centralizado con variantes y tamaños
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'success'|'outline'|'sky'|'ghost'} variant - Estilo del botón
 * @param {'sm'|'md'|'lg'} size - Tamaño del botón
 * @param {boolean} loading - Estado de carga (muestra spinner)
 * @param {boolean} active - Estado activo (para toggle buttons)
 * @param {React.ReactNode} children - Contenido del botón
 * @param {...any} props - Props adicionales (onClick, disabled, type, etc.)
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  active = false,
  children,
  className = '',
  disabled = false,
  ...props
}) {
  // Estilos base compartidos
  const baseStyles = 'rounded-md font-semibold transition-colors duration-200 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variantes de color
  const variants = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400',
    // Used in: CardInfoTab "About Condition Info" button
    warning: 'bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-400',
    // Used in: CardInfoTab "See other versions" button
    info: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
    // Used in: Search.jsx view toggles, other toggle buttons
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
    // Used in: Search.jsx mobile filter button
    sky: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-400',
    // Used in: modal close buttons, icon-only buttons
    ghost: 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-400',
    // Used in: CardDetail.jsx tabs, other navigation tabs
    tab: 'border-b-2 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300 focus:ring-0',
    // Used in: CardInfoTab expansion links, text-only buttons
    link: 'bg-transparent text-blue-600 hover:underline focus:ring-0 p-0 min-h-0'
  };

  // Tamaños
  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]'
  };

  // Spinner de loading (reutilizado de Login.jsx)
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-white"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Active state override (for toggle buttons like list/grid view and tabs)
  const activeStyles = active
    ? variant === 'outline'
      ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
      : variant === 'tab'
      ? 'border-sky-600 text-sky-700'
      : ''
    : '';

  return (
    <button
      className={`${baseStyles} ${activeStyles || variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
}

export default Button;
