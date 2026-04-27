export default function CategoryPicker({
  categorias,
  selected = [],
  setSelected,
  setCategorias,
}) {
  return (
    <div className="w-full p-2 bg-[#111827] rounded-lg max-h-40 overflow-y-auto">
      <p className="text-xs text-gray-400 mb-2">Categorias</p>

      <div className="flex flex-wrap gap-2">
        {categorias.map((cat) => {
          const selecionada = selected.includes(cat);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                if (selecionada) {
                  setSelected(selected.filter((c) => c !== cat));
                } else {
                  setSelected([...selected, cat]);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs transition cursor-pointer border ${
                selecionada
                  ? "bg-emerald-400 text-black border-emerald-300"
                  : "bg-[#0f172a] text-gray-300 border-transparent hover:bg-[#1f2937]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* NOVA CATEGORIA */}
      {setCategorias && (
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 p-2 bg-[#0f172a] rounded text-sm outline-none"
            placeholder="Nova categoria"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const nova = e.target.value.trim();
                if (!nova) return;

                if (
                  !categorias.some(
                    (c) => c.toLowerCase() === nova.toLowerCase(),
                  )
                ) {
                  setCategorias([...categorias, nova]);
                }

                setSelected([...selected, nova]);

                e.target.value = "";
              }
            }}
          />

          <button
            type="button"
            onClick={(e) => {
              const input = e.target.previousSibling;
              const nova = input.value.trim();
              if (!nova) return;

              if (
                !categorias.some(
                  (c) => c.toLowerCase() === nova.toLowerCase(),
                )
              ) {
                setCategorias([...categorias, nova]);
              }

              setSelected([...selected, nova]);

              input.value = "";
            }}
            className="bg-emerald-400 text-black px-3 rounded text-xs"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}