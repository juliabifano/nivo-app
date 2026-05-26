import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { getBank } from "../../data/banks";
import CardSummary from "./CardSummary";
import CardTransactions from "./CardTransactions";
import CardInvoice from "./CardInvoice";
import { getCardFinance } from "../../utils/financeEngine";
import { getCardConfig } from "../../data/cardTypes";
import { useCards } from "../../contexts/CardContext";
import BottomSheet from "../ui/BottomSheet";
import GlassButton from "../ui/GlassButton";
import GlassTabs from "../ui/GlassTabs";
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
    budgetItems = [],
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
    <BottomSheet
      open={!!selected}
      onClose={() => {
        setSelected(null);
        setInvoiceDate(null);
      }}
      className="px-5 sm:px-6 pt-8 lg:pt-6 pb-32 lg:pb-6 flex flex-col gap-4"
      style={{
        background: `linear-gradient(135deg, ${
          getBank(selected.banco).cor
        }, #0b0f1a)`,
      }}
    >
      <div className="relative shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-xl p-4">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/50">
              {getBank(selected.banco).nome}
            </p>

            <h2 className="text-2xl font-semibold text-white mt-2">
              {selected.nome}
            </h2>

            <p className="text-sm text-white/60 mt-1 capitalize">
              {selected.tipo}
            </p>
          </div>

          <img
            src={getBank(selected.banco).logo}
            className="w-12 h-12 object-contain opacity-90"
          />
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/20 text-emerald-300 text-xs">
            Ativo
          </div>

          {config.temFatura && (
            <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs">
              Possui fatura
            </div>
          )}
        </div>
      </div>

      {/* RESUMO FINANCEIRO */}
      {config.mostrarResumoFinanceiro &&
        (() => {
          const finance = getCardFinance({
            cartao: selected,
            transactions,
            getGasto,
            getSaldoConta: () => 0,
          });

          let label1 = "";
          let valor1 = 0;

          let label2 = "";
          let valor2 = 0;

          let label3 = "";
          let valor3 = 0;

          if (config.temFatura) {
            label1 = "Limite";
            valor1 = finance.limite;

            label2 = "Fatura atual";
            valor2 = finance.fatura;

            label3 = "Disponível";
            valor3 = finance.disponivel;
          }

          if (selected.tipo === "vale") {
            label1 = "Saldo inicial";
            valor1 = finance.saldoInicial;

            label2 = "Utilizado";
            valor2 = finance.gastos;

            label3 = "Restante";
            valor3 = finance.disponivel;
          }

          const base = Number(valor1 || 0);
          const usado = Number(valor2 || 0);
          const percent = base > 0 ? Math.min((usado / base) * 100, 100) : 0;

          return (
            <div className="relative shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] backdrop-blur-xl p-5">
              <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Resumo financeiro
                  </p>

                  <h3 className="text-2xl font-semibold text-white mt-2">
                    {formatCurrency(valor3)}
                  </h3>

                  <p className="text-sm text-white/55 mt-1">{label3}</p>
                </div>

                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/70 text-xs">
                  {Math.round(percent)}% usado
                </div>
              </div>

              <div className="relative z-10 mt-5">
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`
                h-2 rounded-full
                ${
                  percent > 80
                    ? "bg-red-400"
                    : percent > 50
                      ? "bg-yellow-400"
                      : "bg-emerald-400"
                }
              `}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between mt-2 text-[11px] text-white/45">
                  <span>{formatCurrency(valor2)} usado</span>
                  <span>{formatCurrency(valor1)} total</span>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
                  <p className="text-[11px] text-white/45">{label1}</p>
                  <p className="text-sm font-semibold text-white mt-1">
                    {formatCurrency(valor1)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3">
                  <p className="text-[11px] text-white/45">{label2}</p>
                  <p className="text-sm font-semibold text-red-300 mt-1">
                    {formatCurrency(valor2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

      <div className="flex flex-col gap-3 shrink-0">
        {/* HEADER + AÇÕES */}
        <div className="flex items-center justify-between mt-5">
          <h3 className="text-white font-medium">Detalhes do cartão</h3>

          {temFatura && (
            <GlassButton
              size="sm"
              onClick={() => {
                const { mes, ano } = getCurrentInvoiceDate(selected);

                setInvoiceDate({ mes, ano });
                setTab("fatura");
              }}
            >
              Gerar fatura
            </GlassButton>
          )}
        </div>

        {/* ABAS */}
        <GlassTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "resumo", label: "Resumo" },
            { value: "transacoes", label: "Transações" },
            ...(temFatura ? [{ value: "fatura", label: "Fatura" }] : []),
          ]}
        />

        {/* RESUMO */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {tab === "resumo" && (
              <CardSummary
                selected={selected}
                transactions={transactions}
                budgetItems={budgetItems}
                formatCurrency={formatCurrency}
                getCurrentInvoiceDate={getCurrentInvoiceDate}
                getInvoicePeriod={getInvoicePeriod}
                generateInvoice={generateInvoice}
              />
            )}

            {tab === "transacoes" && (
              <CardTransactions
                selected={selected}
                getTransacoes={getTransacoes}
                formatCurrency={formatCurrency}
                listItem={listItem}
              />
            )}

            {tab === "fatura" && temFatura && (
              <CardInvoice
                selected={selected}
                transactions={transactions}
                budgetItems={budgetItems}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </BottomSheet>
  );
}
