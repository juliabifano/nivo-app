import { motion } from "framer-motion";

export default function GlassButton({
  children,
  onClick,
  active = false,
  variant = "default",
  size = "md",
  icon,
  className = "",
}) {
  const variants = {
    default: active
      ? "bg-white/20 text-white border-white/15"
      : "bg-white/[0.04] text-gray-300 border-white/[0.08] hover:bg-white/[0.08]",

    danger: active
      ? "bg-red-400/20 text-red-200 border-red-400/20"
      : "bg-red-400/10 text-red-300 border-red-400/10 hover:bg-red-400/20",

    success: active
      ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/20"
      : "bg-emerald-400/10 text-emerald-300 border-emerald-400/10 hover:bg-emerald-400/20",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-xl",
    md: "h-10 px-4 text-sm rounded-2xl",
    lg: "h-12 px-5 text-sm rounded-2xl",
    icon: "w-10 h-10 rounded-2xl",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`
        border
        backdrop-blur-xl
        transition-all
        duration-200
        flex items-center justify-center gap-2
        font-medium
        shrink-0
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {icon && icon}

      {children}
    </motion.button>
  );
}