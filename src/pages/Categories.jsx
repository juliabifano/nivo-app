import { useState } from "react";
import Card from "../components/ui/Card";
import SectionHeader from "../components/ui/SectionHeader";
import { useCategories } from "../contexts/CategoryContext";
import { useTheme } from "../theme/useTheme";
import { useNavigate } from "react-router-dom";
import OnboardingProgress from "../components/onboarding/OnboardingProgress";

export default function Categories() {
  const { categories = [], add, remove } = useCategories();
  const { theme, themeName } = useTheme();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");

  async function handleAdd() {
    const value = nome.trim();
    if (!value) return;

    await add({ nome: value });
    setNome("");
  }

  const sortedCategories = [...categories].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR"),
  );

  const onboardingActive =
  localStorage.getItem("nivo-onboarding-active") === "true";

  return (
    <div
      className={`
        h-full overflow-hidden
        px-4 pt-5 pb-28 lg:p-6
        flex justify-center
        ${theme.textPrimary}
      `}
    >
      <div className="w-full max-w-3xl h-full min-h-0 flex flex-col gap-6 overflow-hidden">
        <SectionHeader
          title="Categorias"
          subtitle="Organize seus lançamentos por tipo de gasto"
          icon={
            <img
              src={
                themeName === "light"
                  ? "/logo-ni-preta.svg"
                  : "/logo-ni-branca.svg"
              }
              className="w-6 h-6 object-contain"
            />
          }
        />

        <OnboardingProgress />

        <Card className="p-5" variant="glass">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="flex gap-3"
          >
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nova categoria"
              className={`
        flex-1 min-w-0 h-12 px-4 rounded-2xl outline-none border
        ${
          themeName === "light"
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-[#0B1220] border-white/[0.08] text-white"
        }
      `}
            />

            <button
              type="submit"
              className="
        h-12 px-5 rounded-2xl
        bg-emerald-400 text-black
        font-semibold
        shrink-0
        active:scale-[0.98]
        transition-all
      "
            >
              +
            </button>
          </form>
        </Card>

        {onboardingActive && categories.length > 0 && (
          <button
            onClick={() => navigate("/cards")}
            className="
                h-12 px-5 rounded-2xl
                flex items-center gap-3
                bg-emerald-400/8
                border border-emerald-400/15
                text-emerald-300
                font-medium
                hover:bg-emerald-400/12
                hover:border-emerald-400/25
                transition-all
              "
              >
                <span
                  className="
                  w-6 h-6 rounded-full
                  flex items-center justify-center
                  text-xs font-semibold
                  bg-emerald-400/15
                  border border-emerald-400/20
                "
                >
                  →
                </span>
            Continuar para Cartões 
          </button>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-8">
          {categories.length === 0 ? (
            <Card className="p-8 text-center" variant="glass">
              <p className={`text-sm ${theme.textSecondary}`}>
                Nenhuma categoria criada ainda.
              </p>
            </Card>
          ) : (
            sortedCategories.map((category) => (
              <Card
                key={category.id}
                className="p-4 flex items-center justify-between gap-4"
                variant="glass"
                hover="subtle"
              >
                <div>
                  <p className="font-medium">{category.nome}</p>
                  <p className={`text-xs mt-1 ${theme.textSecondary}`}>
                    Categoria personalizada
                  </p>
                </div>

                <button
                  onClick={() => remove(category.id)}
                  className="
                    h-9 px-4 rounded-xl
                    bg-red-500/10
                    border border-red-500/20
                    text-red-300
                    text-sm
                    hover:bg-red-500/15
                    transition-all
                    cursor-pointer
                  "
                >
                  Excluir
                </button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
