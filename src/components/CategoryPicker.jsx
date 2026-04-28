import { useState } from "react";

export default function CategoryPicker({
  categorias = [],
  selected = [],
  setSelected,
  setCategorias,
}) {
  const [novaCategoria, setNovaCategoria] = useState("");

  const toggleCategoria = (cat) => {
    const jaSelecionada = selected.includes(cat);

    if (jaSelecionada) {
      setSelected(selected.filter((c) => c !== cat));
    } else {
      setSelected([...selected, cat]);
    }
  };

  const adicionarCategoria = () => {
    const nova = novaCategoria.trim();
    if (!nova) return;

    const existe = categorias.some(
      (c) => c.toLowerCase() === nova.toLowerCase(),
    );

    if (!existe) {
      setCategorias([...categorias, nova]);
    }

    setSelected([...selected, nova]);
    setNovaCategoria("");
  };

  const removerCategoria = (cat) => {
    setCategorias(categorias.filter((c) => c !== cat));
    setSelected(selected.filter((c) => c !== cat));
  };

  return (
    <div className="w-full p-2 bg-[#111827] rounded-lg space-y-3">
      <p className="text-xs text-gray-400">Categorias</p>

      {/* categorias */}
      <div className="flex flex-wrap gap-2">
        {categorias.map((cat) => {
          const isSelected = selected.includes(cat);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategoria(cat)}
              className={`px-3 py-1 rounded-full text-xs transition border cursor-pointer ${
                isSelected
                  ? "bg-emerald-400 text-black border-emerald-300"
                  : "bg-[#0f172a] text-gray-300 border-transparent hover:bg-[#1f2937]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* adicionar categoria */}
      <div className="flex gap-2 mt-2">
        <input
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") adicionarCategoria();
          }}
          placeholder="Nova categoria"
          className="flex-1 p-2 bg-[#0f172a] rounded text-sm outline-none"
        />

        <button
          type="button"
          onClick={adicionarCategoria}
          className="bg-emerald-400 text-black px-3 rounded text-xs"
        >
          +
        </button>
      </div>

      {/* deletar (modo simples, opcional visual)
      <div className="flex flex-wrap gap-1 mt-2">
        {categorias.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => removerCategoria(cat)}
            className="text-[10px] text-red-400 hover:text-red-300"
          >
            {cat} ✕
          </button>
        ))}
      </div> */}
    </div>
  );
}
