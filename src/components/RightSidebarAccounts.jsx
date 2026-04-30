import { useState, useEffect } from "react";
import { useAccounts } from "../contexts/AccountContext";
import { BANKS } from "../data/banks";

export default function RightSidebarAccounts({ editing, setEditing }) {
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
  }

  return (
    <div className="fixed right-4 top-5 w-[320px] bg-[#0B0F1A]/70 p-5 rounded-2xl border border-gray-800 space-y-3">
      <h2 className="text-lg font-semibold">
        {editing ? "Editar conta" : "Nova conta"}
      </h2>

      <input
        placeholder="Nome"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
        className="w-full p-2 bg-[#111827] rounded"
      />

      <select
        value={form.banco}
        onChange={(e) => setForm({ ...form, banco: e.target.value })}
        className="w-full p-2 bg-[#111827] rounded"
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
        className="w-full p-2 bg-[#111827] rounded"
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
        className="w-full p-2 bg-[#111827] rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-emerald-400 text-black p-2 rounded"
      >
        {editing ? "Salvar" : "Adicionar"}
      </button>

      {editing && (
        <button
          onClick={() => setEditing(null)}
          className="w-full bg-gray-700 p-2 rounded"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
