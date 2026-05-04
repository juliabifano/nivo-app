import { useState } from "react";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useCards } from "../contexts/CardContext";
import { getPaymentSchedule } from "../core/selectors/paymentScheduleSelectors";
import { usePaymentSchedule } from "../contexts/PaymentScheduleContext";
import { useAccounts } from "../contexts/AccountContext";
import { mapAccountsWithBalance } from "../core/selectors/accountSelectors";
import { motion, AnimatePresence } from "framer-motion";

export default function Schedule() {
  const { items = [] } = useBudgetAnnual();
  const { transactions = [], add } = useTransactions();
  const { cards = [] } = useCards();
  const { paidIds, markAsPaid, unmarkAsPaid } = usePaymentSchedule();
  const { accounts = [] } = useAccounts();

  const months = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const accountsWithBalance = mapAccountsWithBalance(accounts, transactions);

  const totalAccountsBalance = accountsWithBalance.reduce(
    (acc, a) => acc + Number(a.saldoAtual || 0),
    0,
  );

  const schedule = getPaymentSchedule({
    items,
    transactions,
    cards,
    month: selectedMonth,
    year: currentYear,
    paidIds,
    initialBalance: totalAccountsBalance,
  });

  const groupedByStatus = {
    atrasado: [],
    hoje: [],
    pendente: [],
    pago: [],
  };

  schedule.forEach((item) => {
    if (item.status === "pago") {
      groupedByStatus.pago.push(item);
    } else if (item.status === "atrasado") {
      groupedByStatus.atrasado.push(item);
    } else if (item.status === "hoje") {
      groupedByStatus.hoje.push(item);
    } else {
      groupedByStatus.pendente.push(item);
    }
  });

  const getLocalDateKey = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  };

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });

  const groupByDate = (list) => {
    return list.reduce((acc, item) => {
      const key = getLocalDateKey(item.data);

      if (!acc[key]) acc[key] = [];

      acc[key].push(item);
      return acc;
    }, {});
  };

  const renderItem = (item) => (
    <motion.div
      key={item.paymentId}
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: item.status === "pago" ? 0.55 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 ${
        item.status === "hoje"
          ? "bg-yellow-400/10 border-yellow-400/20"
          : item.status === "atrasado"
            ? "bg-red-400/10 border-red-400/20"
            : ""
      }`}
    >
      <div>
        <p
          className={`font-medium ${
            item.status === "pago" ? "line-through text-gray-400" : ""
          }`}
        >
          {item.descricao}
        </p>

        <p className="text-xs text-gray-400">
          {item.origem === "orcamento" ? "Orçamento" : "Fatura"}
        </p>

        <p
          className={`text-xs mt-1 ${
            item.saldoPrevisto < 0 ? "text-red-400" : "text-emerald-300"
          }`}
        >
          Saldo previsto: {formatCurrency(item.saldoPrevisto)}
        </p>
      </div>

      <div className="text-right space-y-2">
        <p className="text-white font-semibold">{formatCurrency(item.valor)}</p>

        <label className="flex items-center gap-2 cursor-pointer justify-end">
          <input
            type="checkbox"
            checked={item.status === "pago"}
            onChange={(e) => {
              if (e.target.checked) {
                markAsPaid(item.paymentId);

                add({
                  descricao: item.descricao,
                  valor: item.valor,
                  tipo: item.tipo,
                  data: new Date(item.data).toISOString().split("T")[0],
                  categoriaId: item.categoriaId || "",
                  formaPagamento: item.formaPagamento || "pix",
                  accountId: item.accountId || "",
                  cartaoId: item.cartaoId || "",
                  schedulePaymentId: item.paymentId,
                });
              } else {
                unmarkAsPaid(item.paymentId);
              }
            }}
            className="hidden"
          />

          <motion.div
            whileTap={{ scale: 0.85 }}
            className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
              item.status === "pago"
                ? "bg-emerald-400 border-emerald-400"
                : "border-white/30 bg-white/5"
            }`}
          >
            {item.status === "pago" && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-black text-xs font-bold"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        </label>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen overflow-y-auto p-6 flex justify-center text-white">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Agenda de pagamentos</h1>
          <p className="text-sm text-gray-400 mt-1">
            Previsão de contas, faturas e pagamentos do mês.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-2">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`py-2 rounded-full text-xs transition cursor-pointer ${
                selectedMonth === m
                  ? "bg-emerald-400 text-black font-semibold"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          {schedule.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Nenhum pagamento previsto para este mês.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-6">
                {[
                  ["ATRASADO", groupedByStatus.atrasado, "text-red-400"],
                  ["HOJE", groupedByStatus.hoje, "text-yellow-300"],
                  ["PRÓXIMOS", groupedByStatus.pendente, "text-gray-400"],
                  ["PAGOS", groupedByStatus.pago, "text-emerald-300"],
                ].map(([title, list, color]) => {
                  if (list.length === 0) return null;

                  return (
                    <div key={title} className="flex flex-col gap-3">
                      <p className={`text-xs font-semibold ${color}`}>
                        {title}
                      </p>

                      {Object.entries(groupByDate(list)).map(
                        ([date, items]) => {
                          const [y, m, d] = date.split("-");
                          const localDate = new Date(
                            Number(y),
                            Number(m) - 1,
                            Number(d),
                          );

                          return (
                            <div key={date} className="flex flex-col gap-2">
                              <p className="text-xs text-gray-500 font-semibold">
                                {localDate
                                  .toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                  .toUpperCase()}
                              </p>
                              <AnimatePresence mode="popLayout">
                                {items.map((item) => renderItem(item))}
                              </AnimatePresence>
                            </div>
                          );
                        },
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
