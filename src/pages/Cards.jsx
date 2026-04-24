import { useState } from "react";
import { useBudget } from "../contexts/BudgetContext";
import { motion, AnimatePresence } from "framer-motion";
import RightSidebarCards from "../components/RightSidebarCards";
import { getBank } from "../data/banks";
import { generateInvoice } from "../utils/invoices";

export default function Cards() {
  const { cartoes = [], setCartoes, transactions = [] } = useBudget();

  const [selected, setSelected] = useState(null);
  const [editandoCartao, setEditandoCartao] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [tab, setTab] = useState("transacoes");

  const formatCurrency = (v) =>
    Number(v || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const getTransacoes = (id) =>
    transactions.filter((t) => String(t.cartaoId) === String(id));

  const getGasto = (id) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return getTransacoes(id)
      .filter((t) => {
        const d = new Date(t.data);

        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + Number(t.valor), 0);
  };

  const formatCardNumber = (num) => {
    if (!num) return "•••• •••• •••• 0000";
    const digits = num.replace(/\D/g, "");
    return `•••• •••• •••• ${digits.slice(-4)}`;
  };

  const getLastResetDate = (diaReset) => {
    if (!diaReset) return null;

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    const dataResetMesAtual = new Date(ano, mes, diaReset);

    // Se ainda não chegou no dia do reset esse mês
    if (hoje < dataResetMesAtual) {
      return new Date(ano, mes - 1, diaReset);
    }

    return dataResetMesAtual;
  };

  const getInvoicePeriod = (month, year, fechamento) => {
    const diaFechamento = fechamento || 10;

    // fim da fatura (dia de fechamento)
    const end = new Date(year, month - 1, diaFechamento);

    // início = dia seguinte do fechamento anterior
    const start = new Date(year, month - 2, diaFechamento + 1);

    return { start, end };
  };

  const getCurrentInvoiceDate = (card) => {
    const hoje = new Date();
    const diaHoje = hoje.getDate();

    let mes = hoje.getMonth() + 1;
    let ano = hoje.getFullYear();

    if (diaHoje > (card.fechamento || 10)) {
      mes += 1;

      if (mes > 12) {
        mes = 1;
        ano += 1;
      }
    }

    return { mes, ano };
  };

  return (
    <div className="flex h-screen ">
      {/* GRID */}
      <div className="flex-1 p-6 overflow-y-auto pr-[360px] relative z-0">
        <h1 className="text-2xl font-semibold mb-6">Cartões</h1>

        <div className="flex flex-wrap gap-6">
          {cartoes.map((c) => {
            const banco = getBank(c.banco);

            const cor = banco.cor;
            const logo = banco.logo;
            const nomeBanco = banco.nome;

            const imagem = `/cards/${banco.key}.svg`;

            const gasto = getGasto(c.id);

            let limite = Number(c.limite || 0);
            let saldo = Number(c.saldo || 0);

            let disponivel = 0;
            let percent = 0;

            if (c.tipo === "credito" || c.tipo === "multiplo") {
              disponivel = limite - gasto;
              percent = limite > 0 ? (gasto / limite) * 100 : 0;
            }

            if (c.tipo === "vale") {
              const lastReset = getLastResetDate(c.diaReset);

              const gastoPeriodo = transactions
                .filter((t) => {
                  if (t.cartaoId !== c.id) return false;

                  const data = new Date(t.data);
                  return lastReset ? data >= lastReset : true;
                })
                .reduce((acc, t) => acc + Number(t.valor), 0);

              disponivel = saldo - gastoPeriodo;
              percent = saldo > 0 ? (gastoPeriodo / saldo) * 100 : 0;
            }

            // trava em 100%
            percent = Math.min(percent, 100);

            const getBarColor = () => {
              if (percent > 80) return "bg-red-400";
              if (percent > 50) return "bg-yellow-400";
              return "bg-emerald-400";
            };

            return (
              <motion.div
                key={c.id}
                onClick={() => setSelected(c)}
                className="relative w-[380px] h-[220px] rounded-2xl p-5 cursor-pointer overflow-hidden group"
                style={{
                  backgroundImage: `url(${imagem})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: `0 10px 40px ${cor}40`,
                }}
                whileHover={{
                  scale: 1.04,
                  rotateX: 4,
                  rotateY: -4,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/30 z-0" />

                {/* GLASS */}
                <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none z-0" />

                {/* SHINE */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -left-1/2 top-0 w-[50%] h-full bg-white/10 skew-x-[-20deg] opacity-0 group-hover:opacity-100 group-hover:animate-shine" />
                </div>

                {/* GLOW */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                  style={{
                    boxShadow: `0 0 40px ${cor}80`,
                  }}
                />

                {/* LOGO */}
                <img
                  src={logo}
                  className="absolute top-4 right-4 w-10 h-10 object-contain z-10"
                />

                {/* BOTÕES */}
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditandoCartao(c);
                    }}
                    className="text-xs bg-white/20 px-2 py-1 rounded cursor-pointer backdrop-blur"
                  >
                    Editar
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(c);
                    }}
                    className="text-xs bg-red-500/70 px-2 py-1 rounded cursor-pointer backdrop-blur"
                  >
                    Excluir
                  </button>
                </div>

                {/* CONTEÚDO */}
                <div className="text-white relative z-10">
                  <p className="text-xs opacity-70 uppercase">
                    {nomeBanco || c.banco}
                  </p>

                  <p className="text-xs opacity-60 mt-1">
                    {c.tipo === "credito" && "Crédito"}
                    {c.tipo === "debito" && "Débito"}
                    {c.tipo === "multiplo" && "Crédito + Débito"}
                    {c.tipo === "vale" && "Vale"}
                  </p>

                  <p className="font-semibold text-lg mt-1">{c.nome}</p>

                  <p className="text-xs mt-2 opacity-60 font-mono tracking-widest">
                    {formatCardNumber(c.numeroCartao)}
                  </p>

                  <div className="mt-6">
                    {(c.tipo === "credito" || c.tipo === "multiplo") && (
                      <>
                        <p className="text-sm">
                          Limite: {formatCurrency(limite)}
                        </p>

                        <p className="text-xs opacity-70">
                          Disponível: {formatCurrency(disponivel)}
                        </p>
                      </>
                    )}

                    {c.tipo === "vale" && (
                      <>
                        <p className="text-sm">
                          Saldo: {formatCurrency(saldo)}
                        </p>
                        <p className="text-xs opacity-70">
                          Restante: {formatCurrency(disponivel)}
                        </p>
                      </>
                    )}

                    {((["credito", "multiplo"].includes(c.tipo) &&
                      limite > 0) ||
                      (c.tipo === "vale" && saldo > 0)) && (
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-1.5 rounded-full ${getBarColor()}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SIDEBAR */}
      <RightSidebarCards
        editandoCartao={editandoCartao}
        setEditandoCartao={setEditandoCartao}
      />

      {/* VIEW EXPANDIDA */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="w-[600px] max-h-[80vh] rounded-2xl p-6 overflow-y-auto"
              style={{
                background: `linear-gradient(135deg, ${
                  getBank(selected.banco).cor
                }, #0b0f1a)`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-xl font-semibold">
                {selected.nome}
              </h2>

              {(() => {
                const gastoSelecionado = getGasto(selected.id);
                const limiteSelecionado = Number(selected.limite || 0);
                const saldoSelecionado = Number(selected.saldo || 0);

                let disponivelSelecionado = 0;

                if (
                  selected.tipo === "credito" ||
                  selected.tipo === "multiplo"
                ) {
                  disponivelSelecionado = limiteSelecionado - gastoSelecionado;
                }

                if (selected.tipo === "vale") {
                  const lastReset = getLastResetDate(selected.diaReset);

                  const gastoPeriodo = transactions
                    .filter((t) => {
                      if (t.cartaoId !== selected.id) return false;

                      const data = new Date(t.data);
                      return lastReset ? data >= lastReset : true;
                    })
                    .reduce((acc, t) => acc + Number(t.valor), 0);

                  disponivelSelecionado = saldoSelecionado - gastoPeriodo;
                }

                return (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-xs text-gray-300">
                        {selected.tipo === "vale" ? "Saldo" : "Limite"}
                      </p>

                      <p className="text-white font-semibold">
                        {formatCurrency(
                          selected.tipo === "vale"
                            ? saldoSelecionado
                            : limiteSelecionado,
                        )}
                      </p>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-xs text-gray-300">Utilizado</p>
                      <p className="text-red-400 font-semibold">
                        {formatCurrency(gastoSelecionado)}
                      </p>
                    </div>

                    <div className="bg-white/10 p-3 rounded-lg">
                      <p className="text-xs text-gray-300">Disponível</p>
                      <p className="text-emerald-400 font-semibold">
                        {formatCurrency(disponivelSelecionado)}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-5 flex flex-col gap-3">
                {/* HEADER + AÇÕES */}
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">Detalhes do cartão</h3>

                  {(selected.tipo === "credito" ||
                    selected.tipo === "multiplo") && (
                    <button
                      onClick={() => {
                        const { mes, ano } = getCurrentInvoiceDate(selected);

                        const fatura = generateInvoice({
                          transactions,
                          card: selected,
                          month: mes,
                          year: ano,
                        });

                        setTab("fatura");
                      }}
                      className="px-3 py-1 rounded bg-white/10 text-white text-sm hover:bg-white/20 transition cursor-pointer"
                    >
                      Gerar fatura
                    </button>
                  )}
                </div>

                {/* ABAS */}
                <div className="flex gap-3 mt-2">
                  {["resumo", "transacoes", "fatura"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setTab(item)}
                      className={`text-sm px-3 py-1 rounded cursor-pointer ${
                        tab === item
                          ? "bg-white/20 text-white"
                          : "text-white/60"
                      }`}
                    >
                      {item === "resumo" && "Resumo"}
                      {item === "transacoes" && "Transações"}
                      {item === "fatura" && "Fatura"}
                    </button>
                  ))}
                </div>

                {/* RESUMO */}
                {tab === "resumo" && (
                  <div className="text-white text-sm mt-3">
                    Aqui você pode depois colocar gráficos ou saldo do cartão.
                  </div>
                )}

                {/* TRANSAÇÕES */}
                {tab === "transacoes" && (
                  <div className="flex flex-col gap-3 mt-3">
                    {getTransacoes(selected.id).map((t) => (
                      <div
                        key={t.id}
                        className="flex justify-between bg-white/10 p-3 rounded-lg"
                      >
                        <span className="text-white text-sm">
                          {t.descricao.toUpperCase()}
                        </span>
                        <span className="text-white/70 text-sm">
                          {formatCurrency(t.valor)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* FATURA */}
                {tab === "fatura" &&
                  (() => {
                    const { mes, ano } = getCurrentInvoiceDate(selected);

                    const fatura = generateInvoice({
                      transactions,
                      card: selected,
                      month: mes,
                      year: ano,
                    });

                    const { start, end } = getInvoicePeriod(
                      mes,
                      ano,
                      selected.fechamento,
                    );

                    return (
                      <div className="mt-3 text-white">
                        <p className="text-lg font-semibold mb-3">
                          Fatura do cartão
                        </p>

                        <p className="text-sm text-white/60 mb-2">
                          {start.toLocaleDateString("pt-BR")} →{" "}
                          {end.toLocaleDateString("pt-BR")}
                        </p>

                        <p className="mb-4 text-white/70">
                          Total: {formatCurrency(fatura.total)}
                        </p>

                        <div className="flex flex-col gap-2">
                          {fatura.transactions.length === 0 ? (
                            <p className="text-white/50 text-sm text-center mt-4">
                              Nenhuma compra nesta fatura
                            </p>
                          ) : (
                            [...fatura.transactions]
                              .sort(
                                (a, b) => new Date(a.data) - new Date(b.data),
                              )
                              .map((t) => (
                                <div
                                  key={t.id}
                                  className="flex justify-between bg-white/10 p-2 rounded"
                                >
                                  <span>{t.descricao}</span>
                                  <span>{formatCurrency(t.valor)}</span>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DELETE */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              className="bg-[#111827]/70 p-6 rounded-2xl w-[460px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-lg font-semibold mb-2">
                Excluir cartão
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Tem certeza que deseja excluir{" "}
                <span className="text-white font-medium">
                  {confirmDelete.nome}
                </span>
                ?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded bg-white/10 text-white cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    setCartoes(
                      cartoes.filter((c) => c.id !== confirmDelete.id),
                    );
                    setConfirmDelete(null);
                  }}
                  className="px-4 py-2 rounded bg-red-500 text-white cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
