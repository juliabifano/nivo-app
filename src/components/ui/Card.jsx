import { useTheme } from "../../theme/useTheme";

export default function Card({
  children,
  className = "",
  variant = "default",
  hover = "none",
  interactive = false,
  ...props
}) {
  const { theme, themeName } = useTheme();

  const variants = {
    default: `${theme.surface} border ${theme.border}`,

    glass:
      themeName === "light"
        ? "bg-white/35 border border-slate-200/60 backdrop-blur-2xl"
        : "bg-white/[0.045] border border-white/[0.08] backdrop-blur-xl",

    solid:
      themeName === "light"
        ? "bg-white/80 border border-slate-200/70"
        : "bg-[#111827] border border-white/5",

    glow:
      themeName === "light"
        ? "bg-white/45 border border-emerald-200/70 shadow-[0_20px_60px_rgba(16,185,129,0.12)]"
        : "bg-white/5 border border-emerald-400/10 shadow-[0_20px_60px_rgba(16,185,129,0.10)]",
  };

  const hoverStyles = {
    none: "",

    subtle: `
      transition-all
      duration-300
      hover:-translate-y-[1px]
    `,

    premium: `
      transition-all
      duration-300
      hover:-translate-y-[2px]
      ${
        themeName === "light"
          ? "hover:shadow-[0_25px_70px_rgba(15,23,42,0.16)]"
          : "hover:shadow-[0_25px_70px_rgba(0,0,0,0.22)]"
      }
    `,
  };

  return (
    <div
      {...props}
      className={`
      rounded-[28px]
      overflow-hidden

      ${
        variant === "glass"
          ? "shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
          : "shadow-lg"
      }

      ${variants[variant]}
      ${hoverStyles[hover]}

      ${className}
    `}
    >
      {children}
    </div>
  );
}
