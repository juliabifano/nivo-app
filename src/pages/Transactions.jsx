import { useState } from "react";
import { useBudget } from "../contexts/BudgetContext";
import DeleteIcon from "../assets/icons/Bin.svg?react";
import EditIcon from "../assets/icons/Edit.svg?react";
import RightSidebarTransactions from "../components/RightSidebarTransactions";

export default function Transactions() {
  const {
    transactions = [],
    setTransactions,
    categorias = [],
    setCategorias,
    cartoes = [],
  } = useBudget();

  const [editandoId, setEditandoId] = useState(null);
  const [filtroPagamento, setFiltroPagamento] = useState("todos");
  const [filtroCartao, setFiltroCartao] = useState("");

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const formatDateBR = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const createInitialForm = () => ({
    descricao: "",
    categoria: "",
    valor: "",
    tipo: "despesa",
    data: getToday(),
    formaPagamento: "pix",
    cartao: "",
    parcelas: "",
  });

  const [form, setForm] = useState(createInitialForm());

  const resetForm = () => {
    setEditandoId(null);
    setForm(createInitialForm());
  };

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const paymentLabels = {
    pix: "Pix",
    debito: "Débito",
    credito: "Crédito",
    dinheiro: "Dinheiro",
  };

  const handleAdd = () => {
    if (!form.descricao || !form.valor || !form.data) return;

    const valorTotal = Number(form.valor);
    const parcelas = Number(form.parcelas) || 1;

    const cartaoSelecionado = cartoes.find((c) => c.id === form.cartao);

    if (form.formaPagamento === "credito") {
      if (
        cartaoSelecionado &&
        !["credito", "multiplo"].includes(cartaoSelecionado.tipo)
      ) {
        alert("Esse cartão não é compatível com crédito");
        return;
      }
    }

    if (form.formaPagamento === "debito") {
      if (
        cartaoSelecionado &&
        !["debito", "multiplo"].includes(cartaoSelecionado.tipo)
      ) {
        alert("Esse cartão não é compatível com débito");
        return;
      }
    }

    if (editandoId) {
      setTransactions(
        transactions.map((item) =>
          item.id === editandoId
            ? {
                ...form,
                id: editandoId,
                valor: valorTotal,
                totalParcelas: parcelas,
              }
            : item,
        ),
      );

      resetForm();
      return;
    }

    const newTransaction = {
      ...form,
      id: crypto.randomUUID(),
      valor: valorTotal,
      totalParcelas: parcelas,
    };

    setTransactions([newTransaction, ...transactions]);
    resetForm();
  };

  return (
    <div className="flex h-screen overflow-hidden  text-white">
      {/* CENTRO */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px] flex justify-center mb-5">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          <h1 className="text-2xl font-semibold">Lançamentos</h1>

          {/* FILTROS */}
          <div className="flex gap-2 mb-4">
            <select
              value={filtroPagamento}
              onChange={(e) => {
                setFiltroPagamento(e.target.value);
                setFiltroCartao("");
              }}
              className="bg-[#111827] border border-white/10 p-2 rounded-lg cursor-pointer"
            >
              <option value="todos">Todos</option>
              <option value="pix">Pix</option>
              <option value="debito">Débito</option>
              <option value="credito">Crédito</option>
              <option value="dinheiro">Dinheiro</option>
            </select>

            {(filtroPagamento === "credito" ||
              filtroPagamento === "debito") && (
              <select
                value={filtroCartao}
                onChange={(e) => setFiltroCartao(e.target.value)}
                className="bg-[#111827] border border-white/10 p-2 rounded-lg cursor-pointer"
              >
                <option value="">Todos cartões</option>

                {cartoes
                  .filter((c) => {
                    if (filtroPagamento === "credito") {
                      return c.tipo === "credito" || c.tipo === "multiplo";
                    }

                    if (filtroPagamento === "debito") {
                      return c.tipo === "debito" || c.tipo === "multiplo";
                    }

                    return true;
                  })
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* LISTA */}
          <div className="flex flex-col gap-3">
            {transactions
              .filter((t) => {
                if (
                  filtroPagamento !== "todos" &&
                  t.formaPagamento !== filtroPagamento
                ) {
                  return false;
                }

                if (filtroCartao && t.cartao !== filtroCartao) {
                  return false;
                }

                return true;
              })
              .map((t) => (
                <div
                  key={t.id}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group"
                >
                  <div>
                    <p className="font-medium">
                      {t.descricao?.charAt(0).toUpperCase() +
                        t.descricao?.slice(1)}
                    </p>

                    <p className="text-xs text-gray-400">
                      {t.categoria} • {paymentLabels[t.formaPagamento]} •{" "}
                      {formatDateBR(t.data)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={
                        t.tipo === "receita"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }
                    >
                      {formatCurrency(t.valor)}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setForm({
                            ...t,
                            parcelas: t.totalParcelas || "",
                          });
                          setEditandoId(t.id);
                        }}
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          setTransactions(
                            transactions.filter((i) => i.id !== t.id),
                          )
                        }
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <RightSidebarTransactions
        form={form}
        setForm={setForm}
        handleAdd={handleAdd}
        editandoId={editandoId}
        setEditandoId={setEditandoId}
        cartoes={cartoes}
        categorias={categorias}
        setCategorias={setCategorias}
      />
    </div>
  );
}
