import Card from "../ui/Card";
import { useTheme } from "../../theme/useTheme";

export default function AgendaCard({
  pendingSchedule,
  todayCount,
  overdueCount,
  formatCurrency,
}) {
  const { theme, themeName } = useTheme();

 const alertMessage =
    overdueCount > 0
      ? `${overdueCount} pagamento(s) atrasado(s)`
      : todayCount > 0
        ? `${todayCount} pagamento(s) vencem hoje`
        : "Tudo em dia";

  return (
    <Card hover="subtle" className="p-4 sm:p-5 h-full flex flex-col">
      <div className="flex items-start justify-between gap-3 py-3">
        <div>
          <p className={`text-[15px] font-medium ${theme.textSecondary}`}>
            Agenda
          </p>

          <p className={`text-[11px] mt-1 ${theme.textMuted}`}>
            Próximos pagamentos
          </p>
        </div>
      </div>

      <div
        className={`
        mb-3 rounded-2xl border px-3 py-2 text-xs
        ${
          overdueCount > 0
            ? "bg-red-400/10 border-red-400/20 text-red-400"
            : todayCount > 0
              ? "bg-yellow-400/10 border-yellow-400/20 text-yellow-500"
              : themeName === "light"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-emerald-400/10 border-emerald-400/20 text-emerald-300"
        }
      `}
      >
        {alertMessage}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-3 no-scrollbar">
        {pendingSchedule.length === 0 ? (
          <p className={`text-sm ${theme.textMuted}`}>
            Nenhum pagamento pendente.
          </p>
        ) : (
          pendingSchedule.map((item, index) => {
            const statusStyle = {
              hoje: "bg-yellow-400/10 text-yellow-500",
              atrasado: "bg-red-400/10 text-red-400",
              pendente:
                themeName === "light"
                  ? "bg-slate-200/70 text-slate-500"
                  : "bg-white/10 text-gray-300",
            };

            return (
              <div
                key={item.paymentId}
                className={`
                  flex items-start justify-between gap-3 py-3
                  ${
                    index !== pendingSchedule.length - 1
                      ? themeName === "light"
                        ? "border-b border-slate-200/50"
                        : "border-b border-white/[0.06]"
                      : ""
                  }
                `}
              >
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${theme.textPrimary}`}
                  >
                    {item.descricao}
                  </p>

                  <p className={`text-[11px] mt-1 ${theme.textSecondary}`}>
                    {new Date(item.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-[13px] sm:text-sm font-semibold ${
                      item.tipo === "receita"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.tipo === "receita" ? "+" : "-"}{" "}
                    {formatCurrency(item.valor)}
                  </p>

                  <span
                    className={`
                      inline-block px-2 py-0.5 rounded-full
                      text-[8px] sm:text-[9px] uppercase mt-1
                      ${statusStyle[item.status] || statusStyle.pendente}
                    `}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
