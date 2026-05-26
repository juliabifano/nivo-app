import { useTheme } from "../../theme/useTheme";

export default function SectionHeader({
  title,
  subtitle,
  icon,
  action,
  className = "",
}) {
  const { theme } = useTheme();

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
            className={`
              md:hidden
              w-10 h-10
              rounded-2xl
              ${theme.surface}
              border ${theme.border}
              flex items-center justify-center
              shrink-0
            `}
          >
            {icon}
          </div>
        )}

        <div className="min-w-0">
          <h1 className={`text-2xl font-semibold truncate ${theme.textPrimary}`}>
            {title}
          </h1>

          {subtitle && (
            <p className={`text-sm mt-1 truncate ${theme.textSecondary}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}