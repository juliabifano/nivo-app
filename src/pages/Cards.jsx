import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RightSidebarCards from "../components/RightSidebarCards";
import CardDetailsModal from "../components/cards/CardDetailsModal";
import CardItem from "../components/cards/CardItem";
import DeleteCardModal from "../components/cards/DeleteCardModal";
import SectionHeader from "../components/ui/SectionHeader";
import BottomSheet from "../components/ui/BottomSheet";
import FloatingActionButton from "../components/ui/FloatingActionButton";
import { useCards } from "../contexts/CardContext";
import { useTransactions } from "../contexts/TransactionContext";
import { useBudgetAnnual } from "../contexts/BudgetAnnualContext";
import { useTheme } from "../theme/useTheme";
import {
  generateInvoice,
  groupByDate,
  formatDateLabel,
} from "../utils/invoices";

export default function Cards() {
  const { cards, remove } = useCards();
  const { transactions = [] } = useTransactions();
  const { items: budgetItems = [] } = useBudgetAnnual();
  const { theme, themeName } = useTheme();

  const [selected, setSelected] = useState(null);
  const [editandoCartao, setEditandoCartao] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tab, setTab] = useState("transacoes");
  const [invoiceDate, setInvoiceDate] = useState(null);
  const [direction, setDirection] = useState(0);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    if (cards.length > 0) {
      setActiveCardIndex(0);
    }
  }, [cards.length]);

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

  const goNextCard = () => {
    setActiveCardIndex((prev) => Math.min(prev + 1, cards.length - 1));
  };

  const goPrevCard = () => {
    setActiveCardIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div
      className={`relative flex flex-col lg:flex-row h-full overflow-hidden ${theme.textPrimary}`}
    >
      {/* GRID */}
      <div
        className="
        flex-1
        min-h-0
        overflow-y-auto
        px-4
        pt-5
        pb-36
        lg:p-6
        lg:pr-[360px]
        no-scrollbar
      "
      >
        <SectionHeader
          title="Cartões"
          subtitle="Seus cartões e limites"
          icon={
            <img
              src={
                themeName === "light"
                  ? "/logo-ni-preta.svg"
                  : "/logo-ni-branca.svg"
              }
              className="w-6 h-6 object-contain"
            />
          }
        />

        <div
          className="
          mt-6
          flex
          h-[58vh]
          items-center
          lg:h-auto
          lg:items-start
        "
        >
          <div
            className="
            relative
            h-full
            w-full
            no-scrollbar
            pr-1
            lg:h-auto
            lg:overflow-visible
            lg:flex
            lg:flex-wrap
            lg:gap-6
            lg:pr-0
          "
          >
            {cards.map((c, index) => (
              <div
                key={c.id}
                className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                lg:static
                lg:block
              "
                style={
                  window.innerWidth < 1024
                    ? {
                        zIndex: 30 - Math.abs(index - activeCardIndex),
                        pointerEvents:
                          index === activeCardIndex ? "auto" : "none",
                      }
                    : {
                        zIndex: "auto",
                        pointerEvents: "auto",
                      }
                }
              >
                <CardItem
                  c={c}
                  index={index}
                  onNext={goNextCard}
                  onPrev={goPrevCard}
                  activeIndex={activeCardIndex}
                  positionOffset={index - activeCardIndex}
                  transactions={allTransactions}
                  setSelected={setSelected}
                  setEditandoCartao={(card) => {
                    setEditandoCartao(card);

                    if (window.innerWidth < 1024) {
                      setShowMobileForm(true);
                    }
                  }}
                  setConfirmDelete={setConfirmDelete}
                  formatCurrency={formatCurrency}
                  formatCardNumber={formatCardNumber}
                />
              </div>
            ))}
            <div className="lg:hidden absolute left-1/2 -translate-x-1/2 bottom-24 flex items-center gap-2 z-40">
              <button
                onClick={goPrevCard}
                disabled={activeCardIndex === 0}
                className={`
                w-8 h-8
                rounded-xl
                backdrop-blur-xl
                text-sm
                disabled:opacity-20
                active:scale-95
                transition-all
                border
                ${
                  themeName === "light"
                    ? "bg-white/90 border-slate-300/80 text-slate-600 shadow-sm"
                    : "bg-black/30 border-white/10 text-white/80"
                }
              `}
              >
                ↑
              </button>

              <div
                className={`
                px-2.5 h-8
                rounded-xl
                backdrop-blur-xl
                flex items-center justify-center
                text-[11px]
                min-w-[52px]
                border
                ${
                  themeName === "light"
                    ? "bg-white/90 border-slate-300/80 text-slate-600 shadow-sm"
                    : "bg-black/30 border-white/10 text-gray-300"
                }
              `}
              >
                {activeCardIndex + 1} / {cards.length}
              </div>

              <button
                onClick={goNextCard}
                disabled={activeCardIndex === cards.length - 1}
                className={`
                w-8 h-8
                rounded-xl
                backdrop-blur-xl
                text-sm
                disabled:opacity-20
                active:scale-95
                transition-all
                border
                ${
                  themeName === "light"
                    ? "bg-white/90 border-slate-300/80 text-slate-600 shadow-sm"
                    : "bg-black/30 border-white/10 text-white/80"
                }
              `}
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="hidden lg:block">
        <RightSidebarCards
          editandoCartao={editandoCartao}
          setEditandoCartao={setEditandoCartao}
        />
      </div>

      {/* MODAL COMPLETO */}
      <CardDetailsModal
        selected={selected}
        setSelected={setSelected}
        transactions={allTransactions}
        budgetItems={budgetItems}
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

      {/* FAB MOBILE */}
      {!selected && (
        <FloatingActionButton
          open={showMobileForm}
          onClick={() => {
            if (showMobileForm) {
              setShowMobileForm(false);
              setEditandoCartao(null);
              return;
            }

            setEditandoCartao(null);
            setShowMobileForm(true);
          }}
        />
      )}

      <BottomSheet
        open={showMobileForm}
        onClose={() => {
          setShowMobileForm(false);
          setEditandoCartao(null);
        }}
      >
        <RightSidebarCards
          editandoCartao={editandoCartao}
          setEditandoCartao={setEditandoCartao}
          isMobile
          setShowMobileForm={setShowMobileForm}
        />
      </BottomSheet>
    </div>
  );
}
