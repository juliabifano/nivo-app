import { useState, useEffect } from "react";
import { useAccounts } from "../contexts/AccountContext";
import { BANKS } from "../data/banks";

export default function RightSidebarAccounts({
  editing,
  setEditing,
  isMobile = false,
  setShowMobileForm,
}) {
  const { add, update } = useAccounts();

  const [form, setForm] = useState({
    nome: "",
    banco: "",
    tipo: "corrente",
    saldoInicial: "",
  });

  useEffect(() => {
    if (editing) {
      setForm(editing);
    } else {
      resetForm();
    }
  }, [editing]);

  function resetForm() {
    setForm({
      nome: "",
      banco: "",
      tipo: "corrente",
      saldoInicial: "",
    });
  }

  function handleSubmit() {
    if (!form.nome) return;

    if (editing) {
      update(editing.id, form);
      setEditing(null);
    } else {
      add(form);
    }

    resetForm();

    if (isMobile) {
      setShowMobileForm(false);
    }
  }

  return (
    <div
      className={
        isMobile
          ? "w-full p-5 space-y-4"
          : "fixed right-4 top-5 w-[320px] bg-[#0B0F1A]/70 p-5 rounded-2xl border border-gray-800 space-y-3"
      }
    >
      <h2 className="text-lg font-semibold">
        {editing ? "Editar conta" : "Nova conta"}
      </h2>

      <input
        placeholder="Nome"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
        className={
          isMobile
            ? "w-full h-12 px-4 bg-[#111827] border border-white/[0.06] rounded-2xl outline-none focus:border-emerald-400/40 transition-all"
            : "w-full p-2 bg-[#111827] rounded"
        }
      />

      <select
        value={form.banco}
        onChange={(e) => setForm({ ...form, banco: e.target.value })}
        className={
          isMobile
            ? "w-full h-12 px-4 bg-[#111827] border border-white/[0.06] rounded-2xl outline-none focus:border-emerald-400/40 transition-all"
            : "w-full p-2 bg-[#111827] rounded"
        }
      >
        <option value="">Selecionar banco</option>

        {Object.entries(BANKS).map(([key, bank]) => (
          <option key={key} value={key}>
            {bank.nome}
          </option>
        ))}
      </select>

      <select
        value={form.tipo}
        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        className={
          isMobile
            ? "w-full h-12 px-4 bg-[#111827] border border-white/[0.06] rounded-2xl outline-none focus:border-emerald-400/40 transition-all"
            : "w-full p-2 bg-[#111827] rounded"
        }
      >
        <option value="corrente">Corrente</option>
        <option value="poupanca">Poupança</option>
        <option value="carteira">Carteira</option>
      </select>

      <input
        type="number"
        placeholder="Saldo inicial"
        value={form.saldoInicial}
        onChange={(e) => setForm({ ...form, saldoInicial: e.target.value })}
        className={
          isMobile
            ? "w-full h-12 px-4 bg-[#111827] border border-white/[0.06] rounded-2xl outline-none focus:border-emerald-400/40 transition-all"
            : "w-full p-2 bg-[#111827] rounded"
        }
      />

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
        flex
        items-center
        justify-center
        active:scale-[0.98]
        transition-all
      `
            : `
        w-full
        bg-emerald-400
        text-black
        p-2
        rounded
      `
        }
      >
        {editing ? "Salvar" : "Adicionar"}
      </button>

      {editing && (
        <button
          onClick={() => {
            setEditing(null);

            if (isMobile) {
              setShowMobileForm(false);
            }
          }}
          className="
    w-full
    h-12
    rounded-2xl
    bg-white/10
    text-white
    active:scale-[0.98]
    transition-all
  "
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
