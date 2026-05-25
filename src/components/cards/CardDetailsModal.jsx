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
      className="p-5 sm:p-6"
      style={{
        background: `linear-gradient(135deg, ${
          getBank(selected.banco).cor
        }, #0b0f1a)`,
      }}
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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
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
    </BottomSheet>
  );
}
