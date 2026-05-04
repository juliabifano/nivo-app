import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RightSidebarCards from "../components/RightSidebarCards";
import CardDetailsModal from "../components/cards/CardDetailsModal";
import CardItem from "../components/cards/CardItem";
import DeleteCardModal from "../components/cards/DeleteCardModal";
import { useCards } from "../contexts/CardContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import {
  generateInvoice,
  groupByDate,
  formatDateLabel,
} from "../utils/invoices";

export default function Cards() {
  const { cards, remove } = useCards();
  const { transactions = [] } = useTransactions();
  const { items: budgetItems = [] } = useBudgetAnnual();

  const [selected, setSelected] = useState(null);
  const [editandoCartao, setEditandoCartao] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tab, setTab] = useState("transacoes");
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [direction, setDirection] = useState(0);

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

  const currentMonthIndex = new Date().getMonth();
  const currentMonth = months[currentMonthIndex];
  const currentYear = new Date().getFullYear();

  const paidScheduleIds = transactions
    .map((t) => t.schedulePaymentId)
    .filter(Boolean);

  const budgetAsTransactions = budgetItems
    .filter((item) => item.cartaoId)
    .filter((item) => item.meses?.includes(currentMonth))
    .filter((item) => {
      const paymentId = `orcamento-${item.id}-${currentMonth}-${currentYear}`;
      return !paidScheduleIds.includes(paymentId);
    })
    .map((item) => ({
      id: `budget-${item.id}-${currentMonth}-${currentYear}`,
      descricao: item.descricao,
      valor: Number(item.valorMensal || 0),
      tipo: item.tipo,
      categoriaId: item.categoriaId,
      data: `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(
        item.diaVencimento || 1,
      ).padStart(2, "0")}`,
      formaPagamento: item.formaPagamento || "credito",
      cartaoId: item.cartaoId,
      accountId: item.accountId || "",
      parcelas: 1,
      origem: "orcamento",
      isPreview: true,
    }));

  const allTransactions = [...transactions, ...budgetAsTransactions];

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const getTransacoes = (id) =>
    Array.isArray(allTransactions)
      ? allTransactions.filter((t) => String(t.cartaoId) === String(id))
      : [];

  const getGasto = (id) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return getTransacoes(id)
      .filter((t) => {
        const d = new Date(t.data);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + Number(t.valor), 0);
  };

  const formatCardNumber = (num) => {
    if (!num) return "•••• •••• •••• 0000";
    const digits = num.replace(/\D/g, "");
    return `•••• •••• •••• ${digits.slice(-4)}`;
  };

  const getLastResetDate = (diaReset) => {
    if (!diaReset) return null;

    const hoje = new Date();
    const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), diaReset);

    if (hoje < dataAtual) {
      return new Date(hoje.getFullYear(), hoje.getMonth() - 1, diaReset);
    }

    return dataAtual;
  };

  const getInvoicePeriod = (month, year, fechamento) => {
    const diaFechamento = fechamento || 10;
    const end = new Date(year, month - 1, diaFechamento);
    const start = new Date(year, month - 2, diaFechamento + 1);
    return { start, end };
  };

  const getCurrentInvoiceDate = (card) => {
    const hoje = new Date();
    const diaHoje = hoje.getDate();

    let mes = hoje.getMonth() + 1;
    let ano = hoje.getFullYear();

    if (diaHoje > (card.fechamento || 10)) {
      mes++;
      if (mes > 12) {
        mes = 1;
        ano++;
      }
    }

    return { mes, ano };
  };

  return (
    <div className="flex h-screen">
      {/* GRID */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px]">
        <h1 className="text-2xl font-semibold mb-6">Cartões</h1>

        <div className="flex flex-wrap gap-6">
          <div className="flex flex-wrap gap-6">
            {cards.map((c) => (
              <CardItem
                key={c.id}
                c={c}
                transactions={allTransactions}
                setSelected={setSelected}
                setEditandoCartao={setEditandoCartao}
                setConfirmDelete={setConfirmDelete}
                formatCurrency={formatCurrency}
                formatCardNumber={formatCardNumber}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <RightSidebarCards
        editandoCartao={editandoCartao}
        setEditandoCartao={setEditandoCartao}
      />

      {/* MODAL COMPLETO */}
      <CardDetailsModal
        selected={selected}
        setSelected={setSelected}
        transactions={allTransactions}
        formatCurrency={formatCurrency}
        getTransacoes={getTransacoes}
        getGasto={getGasto}
        getInvoicePeriod={getInvoicePeriod}
        getCurrentInvoiceDate={getCurrentInvoiceDate}
        getLastResetDate={getLastResetDate}
        generateInvoice={generateInvoice}
        groupByDate={groupByDate}
        formatDateLabel={formatDateLabel}
        tab={tab}
        setTab={setTab}
        invoiceDate={invoiceDate}
        setInvoiceDate={setInvoiceDate}
        direction={direction}
        setDirection={setDirection}
      />

      {/* DELETE MODAL */}
      <DeleteCardModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        onDelete={remove}
      />
    </div>
  );
}
