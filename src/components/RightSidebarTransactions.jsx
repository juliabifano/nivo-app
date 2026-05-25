import { useState, useEffect } from "react";
import DatePicker from "../components/DatePicker";
import CategoryPicker from "../components/CategoryPicker";
import { useCards } from "../contexts/CardContext";
import { useAccounts } from "../contexts/AccountContext";

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

  return (
    <div
      className={
        isMobile
          ? "w-full p-5 space-y-4"
          : "fixed right-4 top-5 h-[calc(100vh-40px)] w-[320px] bg-[#0B0F1A]/70 p-5 rounded-2xl border border-gray-800 backdrop-blur-md overflow-y-auto space-y-3"
      }
    >
      <h2 className="text-lg font-semibold mb-4">
        {editingTransaction ? "Editar lançamento" : "Novo lançamento"}
      </h2>

      {/* DESCRIÇÃO */}
      <input
        className={
          isMobile
            ? `
      w-full
      h-12
      px-4
      bg-[#111827]
      border border-white/[0.06]
      rounded-2xl
      outline-none
    `
            : "w-full p-2 bg-[#111827] rounded-lg"
        }
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
        className={
          isMobile
            ? `
      w-full
      h-12
      px-4
      bg-[#111827]
      border border-white/[0.06]
      rounded-2xl
      outline-none
    `
            : "w-full p-2 bg-[#111827] rounded-lg"
        }
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
      <div className="flex gap-2 bg-[#111827] p-1 rounded-xl">
        {["receita", "despesa"].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setForm({ ...form, tipo: t })}
            className={`flex-1 p-2 rounded-lg ${
              form.tipo === t
                ? t === "receita"
                  ? "bg-emerald-400 text-black"
                  : "bg-red-400 text-white"
                : "text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* PAGAMENTO */}
      <select
        className={
          isMobile
            ? `
      w-full
      h-12
      px-4
      bg-[#111827]
      border border-white/[0.06]
      rounded-2xl
      cursor-pointer
    `
            : "w-full p-2 bg-[#111827] rounded-lg cursor-pointer"
        }
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
        <option value="pix">Pix</option>
        <option value="debito">Débito</option>
        <option value="credito">Crédito</option>
        <option value="dinheiro">Dinheiro</option>
        <option value="vale">Vale</option>
      </select>

      {["credito", "debito", "vale"].includes(form.formaPagamento) && (
        <select
          className={
            isMobile
              ? `
      w-full
      h-12
      px-4
      bg-[#111827]
      border border-white/[0.06]
      rounded-2xl
      cursor-pointer
    `
              : "w-full p-2 bg-[#111827] rounded-lg cursor-pointer"
          }
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
          <option value="">Selecionar cartão</option>

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
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
        </select>
      )}

      {form.formaPagamento === "credito" && (
        <input
          className={
            isMobile
              ? `
      w-full
      h-12
      px-4
      bg-[#111827]
      border border-white/[0.06]
      rounded-2xl
      outline-none
    `
              : "w-full p-2 bg-[#111827] rounded-lg"
          }
          type="number"
          placeholder="Parcelas"
          value={form.parcelas}
          onChange={(e) => setForm({ ...form, parcelas: e.target.value })}
        />
      )}

      {["pix", "debito", "dinheiro"].includes(form.formaPagamento) && (
        <select
          className={
            isMobile
              ? `
      w-full
      h-12
      px-4
      bg-[#111827]
      border border-white/[0.06]
      rounded-2xl
      cursor-pointer
    `
              : "w-full p-2 bg-[#111827] rounded-lg cursor-pointer"
          }
          value={form.accountId}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
        >
          <option value="">Selecionar conta</option>

          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
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
      w-full
      h-12
      rounded-2xl
      bg-emerald-400
      text-black
      font-medium
      active:scale-[0.98]
      transition-all
    `
            : "w-full bg-emerald-400 text-black p-2 rounded-lg"
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
        w-full
        h-12
        rounded-2xl
        bg-white/10
        text-white
        active:scale-[0.98]
        transition-all
      `
              : "w-full bg-gray-700 text-white p-2 rounded-lg"
          }
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
