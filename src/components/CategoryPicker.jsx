import { useState } from "react";
import { useCategories } from "../contexts/CategoryContext";

export default function CategoryPicker({ selected, onChange }) {
  const { categories, add } = useCategories();
  const [novaCategoria, setNovaCategoria] = useState("");

  function handleSelect(id) {
    onChange(id);
  }

  function handleAdd() {
    const nome = novaCategoria.trim();
    if (!nome) return;

    const existente = categories.find(
      (c) => c.nome.toLowerCase() === nome.toLowerCase(),
    );

    if (existente) {
      onChange(existente.id);
      setNovaCategoria("");
      return;
    }

    const nova = add({ nome });

    if (nova?.id) {
      onChange(nova.id);
    }

    setNovaCategoria("");
  }

  return (
    <div className="w-full p-2 bg-[#111827] rounded-lg space-y-3">
      <p className="text-xs text-gray-400">Categoria</p>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isSelected = selected === c.id;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelect(c.id)}
              className={`px-3 py-1 rounded-full text-xs transition border cursor-pointer ${
                isSelected
                  ? "bg-emerald-400 text-black"
                  : "bg-[#0f172a] text-gray-300"
              }`}
            >
              {c.nome}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="Nova categoria"
          className="flex-1 p-2 bg-[#0f172a] rounded text-sm outline-none"
        />

        <button
          type="button"
          onClick={handleAdd}
          className="bg-emerald-400 text-black px-3 rounded text-xs cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}
