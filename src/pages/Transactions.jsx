import { useState } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import TransactionList from "../components/TransactionList";
import RightSidebarTransactions from "../components/RightSidebarTransactions";
import { filterTransactions } from "../core/selectors/transactionSelectors";
import { mapTransactionsWithCategory } from "../core/selectors/categorySelectors";
import { useCategories } from "../contexts/CategoryContext";

export default function Transactions() {
  const { transactions, add, update, remove } = useTransactions();
  const { categories } = useCategories();

  const [editingTransaction, setEditingTransaction] = useState(null);

  const [filters, setFilters] = useState({
    tipo: "todos",
    categoriaId: "",
  });

  const filtradas = filterTransactions(transactions, filters);

  const ordenadas = [...filtradas].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.data);
    const dateB = new Date(b.createdAt || b.data);

    return dateB - dateA;
  });

  const prontas = mapTransactionsWithCategory(ordenadas, categories);

  return (
    <div className="flex h-screen overflow-hidden text-white">
      {/* CENTRO */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px] flex justify-center mb-5">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Lançamentos</h1>

          <div className="flex gap-2">
            {["todos", "receita", "despesa"].map((t) => (
              <button
                key={t}
                onClick={() => setFilters({ ...filters, tipo: t })}
                className={`px-3 py-1 rounded-lg ${
                  filters.tipo === t
                    ? "bg-emerald-400 text-black"
                    : "bg-[#1f2937] text-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={filters.categoriaId}
            onChange={(e) =>
              setFilters({ ...filters, categoriaId: e.target.value })
            }
          >
            <option value="">Todas categorias</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          {/* LISTA */}
          <TransactionList
            transactions={prontas}
            onDelete={remove}
            onEdit={setEditingTransaction}
          />
        </div>
      </div>

      {/* SIDEBAR */}
      <RightSidebarTransactions
        onAdd={add}
        onUpdate={update}
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
      />
    </div>
  );
}
