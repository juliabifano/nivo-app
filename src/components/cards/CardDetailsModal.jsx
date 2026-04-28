import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { getBank } from "../../data/banks";
import CardSummary from "./CardSummary";
import CardTransactions from "./CardTransactions";
import CardInvoice from "./CardInvoice";
import {
  staggerContainer,
  listItem,
  slideHorizontal,
  groupFade,
} from "../../animations";

export default function CardDetailsModal(props) {
  const {
    selected,
    setSelected,
    transactions,
    formatCurrency,
    getTransacoes,
    getGasto,
    getInvoicePeriod,
    getCurrentInvoiceDate,
    getLastResetDate,
    generateInvoice,
    groupByDate,
    formatDateLabel,
    tab,
    setTab,
    invoiceDate,
    setInvoiceDate,
    direction,
    setDirection,
  } = props;

  if (!selected) return null;

  const temFatura = ["credito", "multiplo"].includes(selected.tipo);

  useEffect(() => {
    if (!temFatura && tab === "fatura") {
      setTab("resumo");
    }
  }, [selected]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        onClick={() => {
          setSelected(null);
          setInvoiceDate(null);
        }}
      >
        <motion.div
          className="w-[600px] max-h-[80vh] rounded-2xl p-6 overflow-y-auto overflow-x-hidden"
          style={{
            background: `linear-gradient(135deg, ${
              getBank(selected.banco).cor
            }, #0b0f1a)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-white text-xl font-semibold">{selected.nome}</h2>

          {(() => {
            const gastoSelecionado = getGasto(selected.id);
            const limite = Number(selected.limite || 0);
            const saldo = Number(selected.saldo || 0);

            let label1 = "";
            let valor1 = 0;

            let label2 = "";
            let valor2 = 0;

            let label3 = "";
            let valor3 = 0;

            if (selected.tipo === "credito" || selected.tipo === "multiplo") {
              label1 = "Limite";
              valor1 = limite;

              label2 = "Utilizado";
              valor2 = gastoSelecionado;

              label3 = "Disponível";
              valor3 = limite - gastoSelecionado;
            }

            if (selected.tipo === "debito") {
              label1 = "Saldo atual";
              valor1 = saldo;

              label2 = "Gastos no mês";
              valor2 = gastoSelecionado;

              label3 = "Restante";
              valor3 = saldo - gastoSelecionado;
            }

            if (selected.tipo === "vale") {
              const lastReset = getLastResetDate(selected.diaReset);

              const gastoPeriodo = transactions
                .filter((t) => {
                  if (t.cartaoId !== selected.id) return false;

                  const data = new Date(t.data);
                  return lastReset ? data >= lastReset : true;
                })
                .reduce((acc, t) => acc + Number(t.valor), 0);

              label1 = "Saldo";
              valor1 = saldo;

              label2 = "Utilizado";
              valor2 = gastoPeriodo;

              label3 = "Restante";
              valor3 = saldo - gastoPeriodo;
            }

            return (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-gray-300">{label1}</p>
                  <p className="text-white font-semibold">
                    {formatCurrency(valor1)}
                  </p>
                </div>

                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-gray-300">{label2}</p>
                  <p className="text-red-400 font-semibold">
                    {formatCurrency(valor2)}
                  </p>
                </div>

                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-xs text-gray-300">{label3}</p>
                  <p className="text-emerald-400 font-semibold">
                    {formatCurrency(valor3)}
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="flex flex-col gap-4">
            {/* HEADER + AÇÕES */}
            <div className="flex items-center justify-between mt-5">
              <h3 className="text-white font-medium">Detalhes do cartão</h3>

              {temFatura && (
                <button
                  onClick={() => {
                    const { mes, ano } = getCurrentInvoiceDate(selected);

                    setInvoiceDate({ mes, ano });
                    setTab("fatura");
                  }}
                  className="px-3 py-1 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition cursor-pointer"
                >
                  Gerar fatura
                </button>
              )}
            </div>

            {/* ABAS */}
            <div className="flex gap-3 mt-2">
              {["resumo", "transacoes", ...(temFatura ? ["fatura"] : [])].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setTab(item)}
                    className={`text-sm px-3 py-1 rounded cursor-pointer ${
                      tab === item ? "bg-white/20 text-white" : "text-white/60"
                    }`}
                  >
                    {item === "resumo" && "Resumo"}
                    {item === "transacoes" && "Transações"}
                    {item === "fatura" && "Fatura"}
                  </button>
                ),
              )}
            </div>

            {/* RESUMO */}
            {tab === "resumo" && (
              <CardSummary
                selected={selected}
                transactions={transactions}
                formatCurrency={formatCurrency}
                getCurrentInvoiceDate={getCurrentInvoiceDate}
                getInvoicePeriod={getInvoicePeriod}
                generateInvoice={generateInvoice}
              />
            )}

            {/* TRANSAÇÕES */}
            <AnimatePresence mode="wait">
              {tab === "transacoes" && (
                <CardTransactions
                  selected={selected}
                  getTransacoes={getTransacoes}
                  formatCurrency={formatCurrency}
                  listItem={listItem}
                />
              )}
            </AnimatePresence>

            {/* FATURA */}
            {tab === "fatura" && temFatura && (
              <CardInvoice
                selected={selected}
                transactions={transactions}
                formatCurrency={formatCurrency}
                getInvoicePeriod={getInvoicePeriod}
                getCurrentInvoiceDate={getCurrentInvoiceDate}
                generateInvoice={generateInvoice}
                groupByDate={groupByDate}
                formatDateLabel={formatDateLabel}
                invoiceDate={invoiceDate}
                setInvoiceDate={setInvoiceDate}
                direction={direction}
                setDirection={setDirection}
                slideHorizontal={slideHorizontal}
                groupFade={groupFade}
                staggerContainer={staggerContainer}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
