import { motion, AnimatePresence } from "framer-motion";

export default function CardInvoice({
  selected,
  transactions,
  accounts = [],
  budgetItems = [],
  formatCurrency,
  getInvoicePeriod,
  getCurrentInvoiceDate,
  generateInvoice,
  groupByDate,
  formatDateLabel,
  invoiceDate,
  setInvoiceDate,
  direction,
  setDirection,
  slideHorizontal,
  groupFade,
  staggerContainer,
  onPayInvoice,
}) {
  const { mes, ano } = invoiceDate || getCurrentInvoiceDate(selected);

  const generatedInvoice = generateInvoice({
    transactions,
    budgetItems,
    card: selected,
    month: mes,
    year: ano,
  });

  const invoicePaymentId = `invoice-${selected.id}-${mes}-${ano}`;

  const paymentTransaction = transactions.find((t) => {
    const sameInvoice = t.invoicePaymentId === invoicePaymentId;

    const sameCardInvoice =
      String(t.cardInvoiceId) === String(selected.id) &&
      t.origem === "pagamento_fatura";

    return sameInvoice || sameCardInvoice;
  });

  const paidSnapshot = paymentTransaction?.invoiceSnapshot;

  const fatura = paidSnapshot
    ? {
        total: paidSnapshot.total,
        transactions: paidSnapshot.transactions,
      }
    : generatedInvoice;

  const isPaid = !!paymentTransaction;

  const { start, end } = getInvoicePeriod(mes, ano, selected.fechamento);

  const hoje = new Date();

  const isCurrentMonth =
    hoje.getMonth() + 1 === mes && hoje.getFullYear() === ano;

  const fechamento = Number(selected.fechamento || 10);
  const vencimento = Number(selected.vencimento || 15);

  const status = isPaid
    ? "paga"
    : hoje.getDate() > vencimento && isCurrentMonth
      ? "atrasada"
      : hoje.getDate() > fechamento && isCurrentMonth
        ? "fechada"
        : "aberta";

  const paymentAccount = accounts.find(
    (acc) => String(acc.id) === String(paymentTransaction?.accountId),
  );

  const currentInvoice = getCurrentInvoiceDate(selected);

  const invoiceHistory = [-2, -1, 0, 1].map((offset) => {
    const date = new Date(
      currentInvoice.ano,
      currentInvoice.mes - 1 + offset,
      1,
    );

    const historyMes = date.getMonth() + 1;
    const historyAno = date.getFullYear();

    const historyInvoice = generateInvoice({
      transactions,
      budgetItems,
      card: selected,
      month: historyMes,
      year: historyAno,
    });

    const historyPaymentId = `invoice-${selected.id}-${historyMes}-${historyAno}`;

    const historyPayment = transactions.find((t) => {
      const sameInvoice = t.invoicePaymentId === historyPaymentId;

      const sameCardInvoice =
        String(t.cardInvoiceId) === String(selected.id) &&
        t.origem === "pagamento_fatura";

      return sameInvoice || sameCardInvoice;
    });

    return {
      mes: historyMes,
      ano: historyAno,
      total: historyInvoice.total,
      isPaid: !!historyPayment,
      payment: historyPayment,
    };
  });
  return (
    <div className="mt-4 text-white flex flex-col h-[58vh] overflow-hidden">
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] backdrop-blur-xl p-4">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-red-400/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setDirection(-1);
              setInvoiceDate((prev) => {
                const base = prev || getCurrentInvoiceDate(selected);
                let mes = base.mes - 1;
                let ano = base.ano;

                if (mes < 1) {
                  mes = 12;
                  ano -= 1;
                }

                return { mes, ano };
              });
            }}
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            ←
          </button>

          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Fatura
            </p>

            <p className="text-lg font-semibold capitalize mt-1">
              {new Date(ano, mes - 1).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={() => {
              setDirection(1);
              setInvoiceDate((prev) => {
                const base = prev || getCurrentInvoiceDate(selected);
                let mes = base.mes + 1;
                let ano = base.ano;

                if (mes > 12) {
                  mes = 1;
                  ano += 1;
                }

                return { mes, ano };
              });
            }}
            className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            →
          </button>
        </div>

        <div className="relative z-10 mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-white/45">Total da fatura</p>

            <p className="text-2xl font-semibold mt-1">
              {formatCurrency(fatura.total)}
            </p>

            <p className="text-xs text-white/45 mt-2">
              {start.toLocaleDateString("pt-BR")} →{" "}
              {end.toLocaleDateString("pt-BR")}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div
                className={`
                px-3 h-7 rounded-full text-xs font-medium
                flex items-center justify-center
                ${
                  status === "paga"
                    ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/25"
                    : status === "aberta"
                      ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/20"
                      : status === "fechada"
                        ? "bg-yellow-400/15 text-yellow-300 border border-yellow-400/20"
                        : "bg-red-400/15 text-red-300 border border-red-400/20"
                }
              `}
              >
                {status === "paga" && "Fatura paga"}
                {status === "aberta" && "Fatura aberta"}
                {status === "fechada" && "Fatura fechada"}
                {status === "atrasada" && "Fatura atrasada"}
              </div>
            </div>
            {isPaid && paymentTransaction && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {paymentAccount && (
                  <span className="px-2.5 h-7 rounded-full bg-white/[0.06] border border-white/10 text-white/55 flex items-center">
                    {paymentAccount.nome}
                  </span>
                )}

                <span className="px-2.5 h-7 rounded-full bg-white/[0.06] border border-white/10 text-white/55 flex items-center">
                  {formatCurrency(paymentTransaction.valor)}
                </span>
              </div>
            )}
          </div>

          {fatura.total > 0 && (
            <button
              type="button"
              disabled={isPaid}
              onClick={() =>
                onPayInvoice?.({
                  card: selected,
                  invoice: fatura,
                  mes,
                  ano,
                })
              }
              className={`
                shrink-0 h-9 px-4 rounded-full text-xs font-medium transition-all
                inline-flex items-center justify-center cursor-pointer
                ${
                  isPaid
                    ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/20 cursor-default"
                    : "bg-white/10 text-white/80 border border-white/10 hover:bg-emerald-400 hover:text-black active:scale-[0.98]"
                }
              `}
            >
              {isPaid ? "Paga" : "Pagar"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {invoiceHistory.map((item) => {
          const active = item.mes === mes && item.ano === ano;

          return (
            <button
              key={`${item.mes}-${item.ano}`}
              type="button"
              onClick={() => {
                setDirection(item.ano > ano || item.mes > mes ? 1 : -1);
                setInvoiceDate({ mes: item.mes, ano: item.ano });
              }}
              className={`
          shrink-0 px-3 h-9 rounded-full text-xs border transition-all cursor-pointer
          ${
            active
              ? "bg-white/15 border-white/20 text-white"
              : item.isPaid
                ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-300"
                : "bg-white/[0.05] border-white/10 text-white/45"
          }
        `}
            >
              {new Date(item.ano, item.mes - 1).toLocaleDateString("pt-BR", {
                month: "short",
                year: "2-digit",
              })}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${mes}-${ano}`}
          custom={direction}
          variants={slideHorizontal}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="mt-4 flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1"
        >
          {fatura.transactions.length === 0 ? (
            <div className="h-32 flex items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.05]">
              <p className="text-white/45 text-sm">
                Nenhuma compra nesta fatura
              </p>
            </div>
          ) : (
            <motion.div
              variants={groupFade}
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] backdrop-blur-xl p-4"
            >
              <div className="flex flex-col">
                {Object.entries(
                  groupByDate(
                    [...fatura.transactions].sort(
                      (a, b) => new Date(a.data) - new Date(b.data),
                    ),
                  ),
                ).map(([date, items], groupIndex, groups) => (
                  <div key={date}>
                    <div className="flex flex-col">
                      {items.map((t, index) => {
                        const isLast =
                          groupIndex === groups.length - 1 &&
                          index === items.length - 1;

                        return (
                          <motion.div
                            key={t.id}
                            variants={staggerContainer}
                            className={`
                              flex items-center justify-between gap-3 py-3
                              ${!isLast ? "border-b border-white/[0.07]" : ""}
                            `}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {t.descricao}
                              </p>

                              <p className="text-xs text-white/40 mt-1">
                                {formatDateLabel(
                                  `${new Date(t.data).getFullYear()}-${String(
                                    new Date(t.data).getMonth() + 1,
                                  ).padStart(2, "0")}-${String(
                                    new Date(t.data).getDate(),
                                  ).padStart(2, "0")}`,
                                )}
                              </p>
                            </div>

                            <p className="text-sm font-semibold text-white/85 shrink-0">
                              {formatCurrency(t.valor)}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
