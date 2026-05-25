export default function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  className = "",
}) {
  return (
    <div
      className={`
        flex items-center justify-between gap-4
        ${className}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div
            className="
            md:hidden
            w-10 h-10
            rounded-2xl
            bg-white/[0.04]
            border border-white/[0.08]
            flex items-center justify-center
            shrink-0
          "
          >
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white truncate">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-gray-400 mt-1 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
