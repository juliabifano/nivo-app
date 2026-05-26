import { useState } from "react";
import { useCategories } from "../contexts/CategoryContext";
import { useTheme } from "../theme/useTheme";

export default function CategoryPicker({ selected, onChange }) {
  const { categories, add } = useCategories();
  const { theme, themeName } = useTheme();

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
    <div
      className={`
        w-full p-3 rounded-2xl space-y-3 border
        ${
          themeName === "light"
            ? "bg-white/60 border-slate-200/70"
            : "bg-[#111827] border-white/[0.06]"
        }
      `}
    >
      <p className={`text-xs ${theme.textSecondary}`}>Categoria</p>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isSelected = selected === c.id;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelect(c.id)}
              className={`
                px-3 py-1 rounded-full text-xs transition border cursor-pointer
                ${
                  isSelected
                    ? "bg-emerald-400 text-black border-emerald-400"
                    : themeName === "light"
                      ? "bg-white/70 text-slate-600 border-slate-200 hover:bg-white"
                      : "bg-[#0f172a] text-gray-300 border-white/20 hover:bg-white/10"
                }
              `}
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
          className={`
            flex-1 h-10 px-3 rounded-xl text-sm outline-none border
            ${
              themeName === "light"
                ? "bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400"
                : "bg-[#0f172a] border-white/[0.06] text-white placeholder:text-gray-500"
            }
          `}
        />

        <button
          type="button"
          onClick={handleAdd}
          className="
            h-10 px-3 rounded-xl
            bg-emerald-400 text-black
            text-xs font-semibold
            cursor-pointer
            active:scale-[0.98]
            transition-all
          "
        >
          +
        </button>
      </div>
    </div>
  );
}
