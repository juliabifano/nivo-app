import { motion, AnimatePresence } from "framer-motion";
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
          className="w-[600px] max-h-[80vh] rounded-2xl p-6 overflow-y-auto"
          style={{
            background: `linear-gradient(135deg, ${
              getBank(selected.banco).cor
            }, #0b0f1a)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* VIEW EXPANDIDA */}
          <AnimatePresence>
            {selected && (
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
                  <h2 className="text-white text-xl font-semibold">
                    {selected.nome}
                  </h2>

                  {(() => {
                    const gastoSelecionado = getGasto(selected.id);
                    const limiteSelecionado = Number(selected.limite || 0);
                    const saldoSelecionado = Number(selected.saldo || 0);

                    let disponivelSelecionado = 0;

                    if (
                      selected.tipo === "credito" ||
                      selected.tipo === "multiplo"
                    ) {
                      disponivelSelecionado =
                        limiteSelecionado - gastoSelecionado;
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

                      disponivelSelecionado = saldoSelecionado - gastoPeriodo;
                    }

                    return (
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="bg-white/10 p-3 rounded-lg">
                          <p className="text-xs text-gray-300">
                            {selected.tipo === "vale" ? "Saldo" : "Limite"}
                          </p>

                          <p className="text-white font-semibold">
                            {formatCurrency(
                              selected.tipo === "vale"
                                ? saldoSelecionado
                                : limiteSelecionado,
                            )}
                          </p>
                        </div>

                        <div className="bg-white/10 p-3 rounded-lg">
                          <p className="text-xs text-gray-300">Utilizado</p>
                          <p className="text-red-400 font-semibold">
                            {formatCurrency(gastoSelecionado)}
                          </p>
                        </div>

                        <div className="bg-white/10 p-3 rounded-lg">
                          <p className="text-xs text-gray-300">Disponível</p>
                          <p className="text-emerald-400 font-semibold">
                            {formatCurrency(disponivelSelecionado)}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex flex-col gap-4">
                    {/* HEADER + AÇÕES */}
                    <div className="flex items-center justify-between mt-5">
                      <h3 className="text-white font-medium">
                        Detalhes do cartão
                      </h3>

                      {(selected.tipo === "credito" ||
                        selected.tipo === "multiplo") && (
                        <button
                          onClick={() => {
                            const { mes, ano } =
                              getCurrentInvoiceDate(selected);

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
                      {["resumo", "transacoes", "fatura"].map((item) => (
                        <button
                          key={item}
                          onClick={() => setTab(item)}
                          className={`text-sm px-3 py-1 rounded cursor-pointer ${
                            tab === item
                              ? "bg-white/20 text-white"
                              : "text-white/60"
                          }`}
                        >
                          {item === "resumo" && "Resumo"}
                          {item === "transacoes" && "Transações"}
                          {item === "fatura" && "Fatura"}
                        </button>
                      ))}
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
                    {tab === "fatura" && (
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
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
