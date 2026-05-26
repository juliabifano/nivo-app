export default function CardSummary({
  selected,
  transactions,
  budgetItems = [],
  formatCurrency,
  getCurrentInvoiceDate,
  getInvoicePeriod,
  generateInvoice,
}) {
  const temFatura = ["credito", "multiplo"].includes(selected.tipo);

  let fatura = { total: 0, transactions: [] };
  let start = null;
  let end = null;
  let ultimas = [];

  if (temFatura) {
    const { mes, ano } = getCurrentInvoiceDate(selected);

    fatura = generateInvoice({
      transactions,
      budgetItems,
      card: selected,
      month: mes,
      year: ano,
    });

    const period = getInvoicePeriod(mes, ano, selected.fechamento);
    start = period.start;
    end = period.end;

    ultimas = [...fatura.transactions]
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 3);
  } else {
    ultimas = [...transactions]
      .filter((t) => String(t.cartaoId) === String(selected.id))
      .sort((a, b) => new Date(b.data) - new Date(a.data))
      .slice(0, 3);
  }

  const usado = temFatura ? fatura.total : 0;
  const limite = Number(selected.limite || 0);
  const percent = temFatura && limite > 0 ? (usado / limite) * 100 : 0;

  const status =
    percent > 80
      ? {
          text: "Alto uso do limite neste mês",
          color: "text-red-300",
          bg: "bg-red-400/10",
          border: "border-red-400/15",
        }
      : percent > 50
        ? {
            text: "Atenção ao ritmo de gastos",
            color: "text-yellow-300",
            bg: "bg-yellow-400/10",
            border: "border-yellow-400/15",
          }
        : {
            text: "Uso controlado do cartão",
            color: "text-emerald-300",
            bg: "bg-emerald-400/10",
            border: "border-emerald-400/15",
          };

  return (
    <div className="flex flex-col gap-4 mt-4 text-white">
      {temFatura && (
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-red-400/10 blur-3xl rounded-full" />

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                Fatura atual
              </p>

              <p className="text-3xl font-semibold mt-2">
                {formatCurrency(usado)}
              </p>

              <p className="text-xs text-white/45 mt-2">
                {start.toLocaleDateString("pt-BR")} →{" "}
                {end.toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs">
              {Math.round(percent)}%
            </div>
          </div>

          <div className="relative z-10 mt-5">
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  percent > 80
                    ? "bg-red-400"
                    : percent > 50
                      ? "bg-yellow-400"
                      : "bg-emerald-400"
                }`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>

            <div className="flex justify-between mt-2 text-[11px] text-white/45">
              <span>{formatCurrency(usado)} usado</span>
              <span>{formatCurrency(limite)} limite</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white">Últimas compras</p>
            <p className="text-xs text-white/45 mt-1">
              Movimentações recentes do cartão
            </p>
          </div>

          <span className="text-[11px] text-white/45">
            {ultimas.length} itens
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {ultimas.length === 0 ? (
            <div className="h-24 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <p className="text-white/40 text-sm">Nenhuma compra recente</p>
            </div>
          ) : (
            ultimas.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center gap-3 bg-white/[0.055] border border-white/10 px-3 py-3 rounded-2xl"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {t.descricao.charAt(0).toUpperCase() + t.descricao.slice(1)}
                  </p>

                  <p className="text-xs text-white/40 mt-1">
                    {new Date(t.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <p className="text-sm font-semibold text-white/85 shrink-0">
                  {formatCurrency(t.valor)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {temFatura && (
        <div
          className={`
            rounded-[24px]
            border
            px-4
            py-3
            ${status.bg}
            ${status.border}
          `}
        >
          <p className={`text-sm font-medium ${status.color}`}>{status.text}</p>
        </div>
      )}
    </div>
  );
}
