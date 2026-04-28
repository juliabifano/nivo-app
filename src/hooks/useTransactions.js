import { useMemo, useState } from "react";
import { useBudget } from "../contexts/BudgetContext";

/* =========================
   HELPERS
========================= */
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getToday = () => formatDate(new Date());

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const [y, m, d] = String(dateStr).split("-").map(Number);
  return new Date(y, m - 1, d);
};

const getYesterdayDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
};

const getLast7DaysStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return formatDate(d);
};

/* =========================
   HOOK
========================= */
export function useTransactions(transactions = []) {
  /* =========================
     FILTROS
  ========================= */
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [filtroCartao, setFiltroCartao] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  const [filtroPeriodo, setFiltroPeriodo] = useState("dia");
  const [dataSelecionada, setDataSelecionada] = useState(getToday());

  const { addTransaction, updateTransaction, deleteTransaction } = useBudget();

  /* =========================
     FORM
  ========================= */
  const [form, setForm] = useState({
    descricao: "",
    categoria: "",
    valor: "",
    tipo: "despesa",
    data: getToday(),
    formaPagamento: "",
    cartao: "",
    parcelas: "",
  });

  const [editandoId, setEditandoId] = useState(null);

  const resetForm = () => {
    setEditandoId(null);
    setForm({
      descricao: "",
      categoria: "",
      valor: "",
      tipo: "despesa",
      data: getToday(),
      formaPagamento: "",
      cartao: "",
      parcelas: "",
    });
  };

  /* =========================
     ADD
  ========================= */
  const handleAdd = () => {
    if (!form.descricao || !form.valor || !form.data) return;

    if (editandoId) {
      updateTransaction(editandoId, {
        ...form,
        valor: Number(form.valor),
      });
    } else {
      addTransaction({
        ...form,
        id: crypto.randomUUID(),
        valor: Number(form.valor),
      });
    }

    resetForm();
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (t) => {
    setEditandoId(t.id);

    setForm({
      descricao: t.descricao,
      categoria: t.categorias?.[0] || "",
      valor: t.valor,
      tipo: t.tipo,
      data: t.data,
      formaPagamento: t.formaPagamento,
      cartao: t.cartaoId,
      parcelas: "",
    });
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = (id) => {
    deleteTransaction(id);
  };

  const restoreTransaction = (t) => {
    addTransaction(t);
  };

  /* =========================
     FILTRO RÁPIDO
  ========================= */
  const setFilterRange = (type) => {
    if (type === "hoje") {
      setDataSelecionada(getToday());
      setFiltroPeriodo("dia");
    }

    if (type === "ontem") {
      setDataSelecionada(getYesterdayDate());
      setFiltroPeriodo("ontem");
    }

    if (type === "ultimos7") {
      setDataSelecionada(getLast7DaysStart());
      setFiltroPeriodo("ultimos7");
    }
  };

  /* =========================
     FILTRO PRINCIPAL
  ========================= */
  const filteredTransactions = useMemo(() => {
    const safe = Array.isArray(transactions) ? transactions : [];

    return safe.filter((t) => {
      const matchPagamento =
        filtroPagamento === "todos" || t.formaPagamento === filtroPagamento;

      const matchCartao = !filtroCartao || t.cartaoId === filtroCartao;

      const matchCategoria =
        !categoriaFiltro || t.categorias?.includes(categoriaFiltro);

      const dataItem = parseLocalDate(t.data);

      let matchPeriodo = true;

      const dataStr = t.data ? String(t.data) : "";

      /* =========================
         TODAS
      ========================= */

      if (filtroPeriodo === "todos") {
        matchPeriodo = true;
      }

      /* =========================
         HOJE
      ========================= */
      if (filtroPeriodo === "dia") {
        matchPeriodo =
          dataSelecionada &&
          dataStr.slice(0, 10) === String(dataSelecionada).slice(0, 10);
      }

      /* =========================
         ONTEM
      ========================= */
      if (filtroPeriodo === "ontem") {
        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);
        ontem.setHours(0, 0, 0, 0);

        matchPeriodo = dataItem?.toDateString() === ontem.toDateString();
      }

      /* =========================
         ÚLTIMOS 7 DIAS
      ========================= */
      if (filtroPeriodo === "ultimos7") {
        const seteDias = new Date();
        seteDias.setDate(seteDias.getDate() - 6);
        seteDias.setHours(0, 0, 0, 0);

        matchPeriodo = dataItem >= seteDias;
      }

      /* =========================
         MÊS ATUAL
      ========================= */
      if (filtroPeriodo === "mes") {
        const hoje = new Date();

        matchPeriodo =
          dataItem &&
          dataItem.getMonth() === hoje.getMonth() &&
          dataItem.getFullYear() === hoje.getFullYear();
      }

      /* =========================
         CUSTOM (DatePicker)
      ========================= */
      if (filtroPeriodo === "custom") {
        matchPeriodo =
          dataSelecionada &&
          dataStr.slice(0, 10) === String(dataSelecionada).slice(0, 10);
      }

      return matchPagamento && matchCartao && matchCategoria && matchPeriodo;
    });
  }, [
    transactions,
    filtroPagamento,
    filtroCartao,
    categoriaFiltro,
    filtroPeriodo,
    dataSelecionada,
  ]);

  /* =========================
     RETURN
  ========================= */
  return {
    filteredTransactions,

    filtroPagamento,
    setFiltroPagamento,

    filtroCartao,
    setFiltroCartao,

    categoriaFiltro,
    setCategoriaFiltro,

    filtroPeriodo,
    setFiltroPeriodo,

    dataSelecionada,
    setDataSelecionada,

    setFilterRange,

    form,
    setForm,
    handleAdd,
    editandoId,
    setEditandoId,
    resetForm,
    handleEdit,
    handleDelete,
    restoreTransaction,
  };
}
