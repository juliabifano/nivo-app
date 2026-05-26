import { useState, useEffect } from "react";
import { useAccounts } from "../contexts/AccountContext";
import { BANKS } from "../data/banks";
import { useTheme } from "../theme/useTheme";

export default function RightSidebarAccounts({
  editing,
  setEditing,
  isMobile = false,
  setShowMobileForm,
}) {
  const { add, update } = useAccounts();
  const { theme, themeName } = useTheme();

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

  const inputClass = `
    w-full h-12 px-4 rounded-2xl outline-none border transition-all
    ${
      themeName === "light"
        ? "bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:border-emerald-400/40"
        : "bg-[#111827] border-white/[0.06] text-white placeholder:text-gray-500 focus:border-emerald-400/40"
    }
  `;

  const desktopInputClass = `
    w-full p-2 rounded-lg outline-none border transition-all
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
            w-full p-5 space-y-4 pb-32
            ${theme.textPrimary}
            ${themeName === "light" ? "bg-[#F4F7F6]" : "bg-[#07111F]"}
          `
          : `
            fixed right-4 top-5 w-[320px]
            ${theme.surface}
            border ${theme.border}
            ${theme.textPrimary}
            p-5 rounded-2xl space-y-3
            backdrop-blur-md
          `
      }
    >
      <h2 className="text-lg font-semibold">
        {editing ? "Editar conta" : "Nova conta"}
      </h2>

      <input
        placeholder="Nome"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
        className={fieldClass}
      />

      <select
        value={form.banco}
        onChange={(e) => setForm({ ...form, banco: e.target.value })}
        className={fieldClass}
      >
        <option className={optionClass} value="">Selecionar banco</option>

        {Object.entries(BANKS).map(([key, bank]) => (
          <option className={optionClass} key={key} value={key}>
            {bank.nome}
          </option>
        ))}
      </select>

      <select
        value={form.tipo}
        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        className={fieldClass}
      >
        <option className={optionClass} value="corrente">Corrente</option>
        <option className={optionClass} value="poupanca">Poupança</option>
        <option className={optionClass} value="carteira">Carteira</option>
      </select>

      <input
        type="number"
        placeholder="Saldo inicial"
        value={form.saldoInicial}
        onChange={(e) => setForm({ ...form, saldoInicial: e.target.value })}
        className={fieldClass}
      />

      <button
        onClick={handleSubmit}
        className="
          w-full h-12 rounded-2xl
          bg-emerald-400 text-black
          font-medium
          flex items-center justify-center
          shadow-[0_14px_40px_rgba(16,185,129,0.22)]
          active:scale-[0.98]
          transition-all
        "
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
          className={`
            w-full h-12 rounded-2xl border
            ${
              themeName === "light"
                ? "bg-slate-200/70 border-slate-200 text-slate-700"
                : "bg-white/10 border-white/[0.06] text-white"
            }
            active:scale-[0.98]
            transition-all
          `}
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
