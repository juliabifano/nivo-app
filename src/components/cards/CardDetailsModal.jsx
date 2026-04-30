import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { getBank } from "../../data/banks";
import CardSummary from "./CardSummary";
import CardTransactions from "./CardTransactions";
import CardInvoice from "./CardInvoice";
import { getCardFinance } from "../../utils/financeEngine";
import { getCardConfig } from "../../data/cardTypes";
import { useCards } from "../../contexts/CardContext";
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

  const config = getCardConfig(selected.tipo);
  const temFatura = config.temFatura;

  useEffect(() => {
    if (!temFatura && tab === "fatura") {
      setTab("resumo");
    }
  }, [selected, temFatura, tab]);
  

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

          {/* RESUMO FINANCEIRO */}
          {config.mostrarResumoFinanceiro &&
            (() => {
              const finance = getCardFinance({
                cartao: selected,
                transactions,
                getGasto,
                getSaldoConta: () => 0,
              });

              if (!config.mostrarResumoFinanceiro) return null;

              let label1 = "";
              let valor1 = 0;

              let label2 = "";
              let valor2 = 0;

              let label3 = "";
              let valor3 = 0;

              // CRÉDITO / MÚLTIPLO
              if (config.temFatura) {
                label1 = "Limite";
                valor1 = finance.limite;

                label2 = "Fatura atual";
                valor2 = finance.fatura;

                label3 = "Disponível";
                valor3 = finance.disponivel;
              }

              // VALE
              if (selected.tipo === "vale") {
                label1 = "Saldo inicial";
                valor1 = finance.saldoInicial;

                label2 = "Utilizado";
                valor2 = finance.gastos;

                label3 = "Restante";
                valor3 = finance.disponivel;
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
