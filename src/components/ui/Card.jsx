export default function Card({
  children,
  className = "",
  variant = "default",
  hover = "none",
  interactive = false,
  ...props
}) {
  const variants = {
    default: "bg-white/5 border border-white/10",
    glass: "bg-white/[0.045] border border-white/[0.08] backdrop-blur-xl",
    solid: "bg-[#111827] border border-white/5",
    glow: "bg-white/5 border border-emerald-400/10 shadow-[0_20px_60px_rgba(16,185,129,0.10)]",
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
      hover:shadow-[0_25px_70px_rgba(0,0,0,0.22)]
    `,
  };

  return (
    <div
      {...props}
      className={`
        rounded-[28px]
        shadow-lg
        overflow-hidden

        ${variants[variant]}
        ${hoverStyles[hover]}

        ${className}
      `}
    >
      {children}
    </div>
  );
}
