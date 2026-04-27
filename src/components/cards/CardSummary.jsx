export default function CardSummary({
  selected,
  transactions,
  formatCurrency,
  getCurrentInvoiceDate,
  getInvoicePeriod,
  generateInvoice,
}) {
  const { mes, ano } = getCurrentInvoiceDate(selected);

  const fatura = generateInvoice({
    transactions,
    card: selected,
    month: mes,
    year: ano,
  });

  const { start, end } = getInvoicePeriod(
    mes,
    ano,
    selected.fechamento,
  );

  const ultimas = [...fatura.transactions]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 3);

  const usado = fatura.total;
  const limite = Number(selected.limite || 0);
  const percent = limite > 0 ? (usado / limite) * 100 : 0;

  return (
    <div className="flex flex-col gap-5 mt-4 text-white">
      <div className="bg-white/10 rounded-xl p-4 backdrop-blur">
        <p className="text-xs text-white/60">Fatura atual</p>

        <p className="text-2xl font-semibold mt-1">
          {formatCurrency(usado)}
        </p>

        <p className="text-xs text-white/50 mt-1">
          {start.toLocaleDateString("pt-BR")} →{" "}
          {end.toLocaleDateString("pt-BR")}
        </p>

        <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
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
      </div>

      <div>
        <p className="text-sm text-white/70 mb-2">
          Últimas compras
        </p>

        <div className="flex flex-col gap-2">
          {ultimas.length === 0 ? (
            <p className="text-white/40 text-sm">
              Nenhuma compra recente
            </p>
          ) : (
            ultimas.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg"
              >
                <div className="flex flex-col">
                  <span className="text-sm">
                    {t.descricao.charAt(0).toUpperCase() +
                      t.descricao.slice(1)}
                  </span>
                  <span className="text-xs text-white/40">
                    {new Date(t.data).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <span className="text-sm text-white/80">
                  {formatCurrency(t.valor)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
        {percent > 80 && (
          <p className="text-red-400 text-sm">
            Alto uso do limite neste mês
          </p>
        )}

        {percent <= 80 && percent > 50 && (
          <p className="text-yellow-400 text-sm">
            Atenção ao ritmo de gastos
          </p>
        )}

        {percent <= 50 && (
          <p className="text-emerald-400 text-sm">
            Uso controlado do cartão
          </p>
        )}
      </div>
    </div>
  );
}