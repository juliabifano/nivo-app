export default function AgendaCard({
  pendingSchedule,
  todayCount,
  overdueCount,
  formatCurrency,
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[28px] p-5 shadow-lg overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-400">Agenda</p>
          <p className="text-xs text-gray-500 mt-1">Próximos pagamentos</p>
        </div>

        <div className="flex gap-2 text-xs">
          {todayCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-yellow-400/10 text-yellow-300">
              {todayCount} hoje
            </span>
          )}

          {overdueCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-red-400/10 text-red-400">
              {overdueCount} atrasado
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-3 no-scrollbar">
        {pendingSchedule.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum pagamento pendente.</p>
        ) : (
          pendingSchedule.map((item, index) => {
            const statusStyle = {
              hoje: "bg-yellow-400/10 text-yellow-300",
              atrasado: "bg-red-400/10 text-red-400",
              pendente: "bg-white/10 text-gray-300",
            };

            return (
              <div
                key={item.paymentId}
                className={`flex justify-between items-center py-3 ${
                  index !== pendingSchedule.length - 1
                    ? "border-b border-white/[0.06]"
                    : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {item.descricao}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-semibold ${
                      item.tipo === "receita"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.tipo === "receita" ? "+" : "-"}{" "}
                    {formatCurrency(item.valor)}
                  </p>

                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] uppercase mt-1 ${
                      statusStyle[item.status] || statusStyle.pendente
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}