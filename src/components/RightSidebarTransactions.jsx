import { useState, useEffect } from "react";
import DatePicker from "../components/DatePicker";
import CategoryPicker from "../components/CategoryPicker";
import { useCards } from "../contexts/CardContext";
import { useAccounts } from "../contexts/AccountContext";
import { useTheme } from "../theme/useTheme";

export default function RightSidebarTransactions({
  onAdd,
  onUpdate,
  editingTransaction,
  setEditingTransaction,
  isMobile = false,
  setShowMobileForm,
}) {
  const { cards } = useCards();
  const { accounts } = useAccounts();
  const { theme, themeName } = useTheme();

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    tipo: "despesa",
    data: getToday(),
    categoriaId: "",
    formaPagamento: "pix",
    cartaoId: "",
    parcelas: "",
    accountId: "",
  });

  function handleSubmit() {
    if (!form.descricao || !form.valor) return;

    const dataToSave = {
      ...form,
      valor: Number(form.valor),
      parcelas:
        form.formaPagamento === "credito" ? Number(form.parcelas || 1) : "",
    };

    if (editingTransaction) {
      onUpdate(editingTransaction.id, dataToSave);
      setEditingTransaction(null);
    } else {
      onAdd(dataToSave);
    }

    resetForm();
    if (isMobile) {
      setShowMobileForm(false);
    }
  }

  function resetForm() {
    setForm({
      descricao: "",
      valor: "",
      tipo: "despesa",
      data: getToday(),
      categoriaId: "",
      formaPagamento: "pix",
      cartaoId: "",
      parcelas: "",
      accountId: "",
    });
  }

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        descricao: editingTransaction.descricao || "",
        valor: editingTransaction.valor || "",
        tipo: editingTransaction.tipo || "despesa",
        data: editingTransaction.data || getToday(),
        categoriaId: editingTransaction.categoriaId || "",
        formaPagamento: editingTransaction.formaPagamento || "pix",
        cartaoId: editingTransaction.cartaoId || "",
        parcelas: editingTransaction.parcelas || "",
        accountId: editingTransaction.accountId || "",
      });
    } else {
      resetForm();
    }
  }, [editingTransaction]);

  const inputClass = `
  w-full h-12 px-4 rounded-2xl outline-none cursor-pointer
  border
  ${
    themeName === "light"
      ? "bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400"
      : "bg-[#111827] border-white/[0.06] text-white placeholder:text-gray-500"
  }
`;

  const desktopInputClass = `
  w-full p-2 rounded-lg outline-none cursor-pointer
  ${theme.surface}
  border ${theme.border}
  ${theme.textPrimary}
`;

  const fieldClass = isMobile ? inputClass : desktopInputClass;

  const optionClass =
  themeName === "light"
    ? "bg-white text-slate-900"
    : "bg-[#111827] text-white";

  return (
    <div
      className={
        isMobile
          ? `
    w-full p-5 space-y-4
    ${theme.textPrimary}
    ${themeName === "light" ? "bg-[#F4F7F6]" : "bg-[#07111F]"}
  `
          : `
        fixed right-4 top-5 h-[calc(100vh-40px)] w-[320px]
        ${theme.surface}
        border ${theme.border}
        ${theme.textPrimary}
        p-5 rounded-2xl backdrop-blur-md
        overflow-y-auto space-y-3
      `
      }
    >
      <h2 className="text-lg font-semibold mb-4">
        {editingTransaction ? "Editar lançamento" : "Novo lançamento"}
      </h2>

      {/* DESCRIÇÃO */}
      <input
        className={fieldClass}
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
      />

      {/* CATEGORIA */}
      <CategoryPicker
        selected={form.categoriaId}
        onChange={(id) => setForm({ ...form, categoriaId: id })}
      />

      {/* VALOR */}
      <input
        className={fieldClass}
        type="number"
        placeholder="Valor"
        value={form.valor}
        onChange={(e) => setForm({ ...form, valor: e.target.value })}
      />

      {/* DATA */}
      <DatePicker
        value={form.data}
        onChange={(date) => setForm({ ...form, data: date })}
      />

      {/* TIPO */}
      <div
        className={`
    flex gap-2 p-1 rounded-2xl border
    ${
      themeName === "light"
        ? "bg-white/50 border-slate-200/70"
        : "bg-[#111827] border-white/[0.06]"
    }
  `}
      >
        {["receita", "despesa"].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setForm({ ...form, tipo: t })}
            className={`
    flex-1 h-11 rounded-xl text-sm font-medium transition-all
    ${
      form.tipo === t
        ? t === "receita"
          ? "bg-emerald-400 text-black shadow-[0_10px_25px_rgba(16,185,129,0.18)]"
          : "bg-red-400 text-white shadow-[0_10px_25px_rgba(239,68,68,0.18)]"
        : themeName === "light"
          ? "text-slate-500 hover:bg-white/60"
          : "text-gray-300 hover:bg-white/[0.04]"
    }
  `}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* PAGAMENTO */}
      <select
        className={fieldClass}
        value={form.formaPagamento}
        onChange={(e) => {
          const formaPagamento = e.target.value;

          setForm({
            ...form,
            formaPagamento,
            cartaoId: ["credito", "debito", "vale"].includes(formaPagamento)
              ? form.cartaoId
              : "",
            parcelas: formaPagamento === "credito" ? form.parcelas : "",
            accountId: ["pix", "debito", "dinheiro"].includes(formaPagamento)
              ? form.accountId
              : "",
          });
        }}
      >
        <option className={optionClass} value="pix">Pix</option>
        <option className={optionClass} value="debito">Débito</option>
        <option className={optionClass} value="credito">Crédito</option>
        <option className={optionClass} value="dinheiro">Dinheiro</option>
        <option className={optionClass} value="vale">Vale</option>
      </select>

      {["credito", "debito", "vale"].includes(form.formaPagamento) && (
        <select
          className={fieldClass}
          value={form.cartaoId}
          onChange={(e) => {
            const cartaoId = e.target.value;
            const selectedCard = cards.find(
              (c) => String(c.id) === String(cartaoId),
            );

            setForm({
              ...form,
              cartaoId,
              accountId:
                form.formaPagamento === "debito" && selectedCard?.accountId
                  ? selectedCard.accountId
                  : form.accountId,
            });
          }}
        >
          <option className={optionClass} value="">Selecionar cartão</option>

          {cards
            .filter((c) => {
              if (form.formaPagamento === "credito") {
                return c.tipo === "credito" || c.tipo === "multiplo";
              }

              if (form.formaPagamento === "debito") {
                return c.tipo === "debito" || c.tipo === "multiplo";
              }

              if (form.formaPagamento === "vale") {
                return c.tipo === "vale";
              }

              return false;
            })
            .map((c) => (
              <option className={optionClass} key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
        </select>
      )}

      {form.formaPagamento === "credito" && (
        <input
          className={fieldClass}
          type="number"
          placeholder="Parcelas"
          value={form.parcelas}
          onChange={(e) => setForm({ ...form, parcelas: e.target.value })}
        />
      )}

      {["pix", "debito", "dinheiro"].includes(form.formaPagamento) && (
        <select
          className={fieldClass}
          value={form.accountId}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
        >
          <option className={optionClass} value="">Selecionar conta</option>

          {accounts.map((a) => (
            <option className={optionClass} key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
        </select>
      )}

      {/* BOTÃO */}
      <button
        onClick={handleSubmit}
        className={
          isMobile
            ? `
        w-full h-12 rounded-2xl
        bg-emerald-400
        text-black
        font-medium
        shadow-[0_14px_40px_rgba(16,185,129,0.22)]
        active:scale-[0.98]
        transition-all
      `
            : `
        w-full h-12 rounded-2xl
        bg-emerald-400
        text-black
        font-medium
        shadow-[0_14px_40px_rgba(16,185,129,0.22)]
        transition-all
      `
        }
      >
        {editingTransaction ? "Salvar" : "Adicionar"}
      </button>

      {editingTransaction && (
        <button
          onClick={() => {
            setEditingTransaction(null);
            resetForm();

            if (isMobile) {
              setShowMobileForm(false);
            }
          }}
          className={
            isMobile
              ? `
          w-full h-12 rounded-2xl border
          ${
            themeName === "light"
              ? "bg-slate-200/70 border-slate-200 text-slate-700"
              : "bg-white/10 border-white/[0.06] text-white"
          }
          active:scale-[0.98]
          transition-all
        `
              : `
          w-full h-12 rounded-2xl border
          ${
            themeName === "light"
              ? "bg-slate-200/70 border-slate-200 text-slate-700"
              : "bg-white/10 border-white/[0.06] text-white"
          }
        `
          }
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
