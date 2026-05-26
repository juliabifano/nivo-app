import { useState, useEffect } from "react";
import { useCards } from "../contexts/CardContext";
import { BANKS, getBank } from "../data/banks";
import { useAccounts } from "../contexts/AccountContext";
import { useTheme } from "../theme/useTheme";

export default function RightSidebarCards({
  editandoCartao,
  setEditandoCartao,
  isMobile = false,
  setShowMobileForm,
}) {
  const { cards, add, update } = useCards();
  const { accounts } = useAccounts();
  const { theme, themeName } = useTheme();

  const [form, setForm] = useState({
    nome: "",
    banco: "",
    limite: "",
    saldoInicial: "",
    vencimento: "",
    fechamento: "",
    tipo: "credito",
    diaReset: "",
    accountId: "",
  });

  useEffect(() => {
    if (editandoCartao) {
      setForm({
        nome: editandoCartao.nome || "",
        banco: editandoCartao.banco || "",
        numeroCartao: editandoCartao.numeroCartao || "",
        tipo: editandoCartao.tipo || "credito",

        limite: editandoCartao.limite || "",
        saldoInicial: editandoCartao.saldo || "",
        vencimento: editandoCartao.vencimento || "",
        fechamento: editandoCartao.fechamento || "",
        diaReset: editandoCartao.diaReset || "",
        accountId: editandoCartao.accountId || "",
      });
    }
  }, [editandoCartao]);

  const handleAdd = () => {
    if (!form.nome) return;

    if (form.tipo === "vale" && !form.saldoInicial) return;

    if (["credito", "multiplo"].includes(form.tipo) && !form.limite) return;

    const numeroLimpo = form.numeroCartao?.replace(/\s/g, "");

    if (numeroLimpo && !validarCartao(numeroLimpo)) {
      alert("Número de cartão inválido");
      return;
    }

    const payload = {
      nome: form.nome,
      banco: form.banco,
      numeroCartao: numeroLimpo,
      tipo: form.tipo,
      accountId: form.accountId || null,

      limite: ["credito", "multiplo"].includes(form.tipo)
        ? Number(form.limite || 0)
        : undefined,

      saldo: form.tipo === "vale" ? Number(form.saldoInicial || 0) : undefined,

      diaReset: form.tipo === "vale" ? Number(form.diaReset || 1) : undefined,

      vencimento: ["credito", "multiplo"].includes(form.tipo)
        ? Number(form.vencimento)
        : undefined,

      fechamento: ["credito", "multiplo"].includes(form.tipo)
        ? Number(form.fechamento)
        : undefined,
    };

    if (editandoCartao) {
      update(editandoCartao.id, payload);
      setEditandoCartao(null);
    } else {
      add(payload);
    }

    setForm({
      nome: "",
      banco: "",
      limite: "",
      saldoInicial: "",
      vencimento: "",
      fechamento: "",
      tipo: "credito",
      diaReset: "",
      accountId: "",
    });

    if (isMobile) {
      setShowMobileForm(false);
    }
  };

  const validarCartao = (num) => {
    if (!num) return false;

    const digits = String(num).replace(/\D/g, "");

    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  };

  const gerarCartaoFake = () => {
    let num = "";

    for (let i = 0; i < 16; i++) {
      num += Math.floor(Math.random() * 10);
    }

    return num.replace(/(.{4})/g, "$1 ").trim();
  };

  const inputClass = `
  w-full h-12 px-4 rounded-2xl outline-none cursor-pointer
  border
  ${
    themeName === "light"
      ? "bg-white/80 border-slate-200/80 text-slate-900 placeholder:text-slate-400"
      : "bg-[#111827] border-white/[0.06] text-white placeholder:text-gray-500"
  }
`;

  const desktopInputClass = `
  w-full p-2 rounded-lg outline-none cursor-pointer
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
        fixed right-4 top-5 h-[calc(100vh-40px)] w-[320px] z-40
        ${theme.surface}
        border ${theme.border}
        ${theme.textPrimary}
        p-5 space-y-3 rounded-2xl shadow-xl backdrop-blur-md
      `
      }
    >
      <h2 className="text-lg font-semibold mb-4">
        {editandoCartao ? "Editar cartão" : "Adicionar cartão"}
      </h2>

      {/* NOME */}
      <input
        className={fieldClass}
        placeholder="Nome do cartão"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
      />

      {/* NÚMERO */}
      <input
        className={fieldClass}
        placeholder="Número do cartão (opcional)"
        value={form.numeroCartao || ""}
        maxLength={19}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");
          value = value.replace(/(.{4})/g, "$1 ").trim();
          setForm({ ...form, numeroCartao: value });
        }}
      />

      {/* BANCO */}
      <select
        className={fieldClass}
        value={form.banco}
        onChange={(e) => {
          const banco = e.target.value;

          const contasDoBanco = accounts.filter((a) => a.banco === banco);

          setForm({
            ...form,
            banco,
            accountId: contasDoBanco.length === 1 ? contasDoBanco[0].id : "",
          });
        }}
      >
        <option className={optionClass} value="">Selecionar banco</option>

        {Object.entries(BANKS).map(([key, bank]) => (
          <option className={optionClass} key={key} value={key}>
            {bank.nome}
          </option>
        ))}
      </select>

      {accounts.filter((a) => a.banco === form.banco).length === 0 && (
        <p className={`text-xs ${theme.textSecondary}`}>
          Nenhuma conta desse banco
        </p>
      )}

      {/* CONTA */}
      <select
        className={fieldClass}
        value={form.accountId}
        onChange={(e) => setForm({ ...form, accountId: e.target.value })}
      >
        <option className={optionClass} value="">Conta vinculada</option>

        {accounts
          .filter((a) => a.banco === form.banco)
          .map((a) => (
            <option className={optionClass} key={a.id} value={a.id}>
              {a.nome}
            </option>
          ))}
      </select>

      {/* TIPO */}
      <select
        className={fieldClass}
        value={form.tipo}
        onChange={(e) => {
          const tipo = e.target.value;

          setForm({
            ...form,
            tipo,
            limite: tipo === "vale" ? "" : form.limite,
            saldoInicial: tipo === "vale" ? form.saldoInicial : "",
            diaReset: tipo === "vale" ? form.diaReset : "",
            vencimento: tipo === "vale" ? "" : form.vencimento,
            fechamento: tipo === "vale" ? "" : form.fechamento,
          });
        }}
      >
        <option className={optionClass} value="credito">Crédito</option>
        <option className={optionClass} value="debito">Débito</option>
        <option className={optionClass} value="multiplo">Múltiplo</option>
        <option className={optionClass} value="vale">Vale</option>
      </select>

      {/* CAMPOS DINÂMICOS */}
      {form.tipo === "vale" && (
        <>
          {/* SALDO */}
          <input
            className={fieldClass}
            type="number"
            placeholder="Saldo inicial"
            value={form.saldoInicial || ""}
            onChange={(e) => setForm({ ...form, saldoInicial: e.target.value })}
          />

          {/* RESET */}
          <input
            className={fieldClass}
            type="number"
            placeholder="Dia do reset"
            value={form.diaReset || ""}
            onChange={(e) => setForm({ ...form, diaReset: e.target.value })}
          />
        </>
      )}

      {["credito", "multiplo"].includes(form.tipo) && (
        <>
          {/* LIMITE */}
          <input
            className={fieldClass}
            type="number"
            placeholder="Limite"
            value={form.limite}
            onChange={(e) => setForm({ ...form, limite: e.target.value })}
          />

          {/* VENCIMENTO */}
          <input
            className={fieldClass}
            type="number"
            placeholder="Dia do vencimento"
            value={form.vencimento}
            onChange={(e) => setForm({ ...form, vencimento: e.target.value })}
          />

          {/* FECHAMENTO */}
          <input
            className={fieldClass}
            type="number"
            placeholder="Dia do fechamento"
            value={form.fechamento || ""}
            onChange={(e) => setForm({ ...form, fechamento: e.target.value })}
          />
        </>
      )}

      {/* PREVIEW */}
      {form.banco && (
        <div
          className="relative rounded-xl overflow-hidden mt-2 h-[140px]"
          style={{
            background: `linear-gradient(135deg, ${
              getBank(form.banco).cor
            }, rgba(0,0,0,0.6))`,
          }}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* LOGO 🔥 */}
          <img
            src={getBank(form.banco).logo}
            alt={getBank(form.banco).nome}
            className="absolute top-3 right-3 w-10 h-10 object-contain opacity-90"
          />

          {/* conteúdo */}
          <div className="relative z-10 p-4 text-white flex flex-col justify-between h-full">
            <div>
              <p className="text-sm opacity-80">{getBank(form.banco).nome}</p>
              <p className="font-semibold">{form.nome || "Nome do cartão"}</p>
            </div>

            <p className="text-xs">
              {form.tipo === "vale" ? "Saldo" : "Limite"}:{" "}
              {form.tipo === "vale"
                ? Number(form.saldoInicial || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : Number(form.limite || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
            </p>
          </div>
        </div>
      )}

      {/* BOTÃO */}
      <button
        onClick={handleAdd}
        className={
          isMobile
            ? `
      w-full
      h-12
      rounded-2xl
      bg-emerald-400
      text-black
      font-medium
      active:scale-[0.98]
      transition-all
    `
            : "cursor-pointer w-full bg-emerald-400 text-black p-2 rounded-lg"
        }
      >
        {editandoCartao ? "Salvar alterações" : "Adicionar"}
      </button>

      <button
        type="button"
        onClick={() => setForm({ ...form, numeroCartao: gerarCartaoFake() })}
        className="text-xs text-blue-400 mt-1 cursor-pointer"
      >
        Gerar cartão fake
      </button>

      {editandoCartao && (
        <button
          onClick={() => {
            setEditandoCartao(null);

            setForm({
              nome: "",
              banco: "",
              numeroCartao: "",
              limite: "",
              saldoInicial: "",
              vencimento: "",
              fechamento: "",
              tipo: "credito",
              diaReset: "",
              accountId: "",
            });

            if (isMobile) {
              setShowMobileForm(false);
            }
          }}
          className={
            isMobile
              ? `
      w-full h-12 rounded-2xl border
      ${
        themeName === "light"
          ? "bg-slate-200/70 border-slate-200 text-slate-700"
          : "bg-white/10 border-white/[0.06] text-white"
      }
      active:scale-[0.98]
      transition-all
    `
              : `
      cursor-pointer w-full h-12 rounded-2xl border
      ${
        themeName === "light"
          ? "bg-slate-200/70 border-slate-200 text-slate-700"
          : "bg-gray-700 border-white/[0.06] text-white"
      }
    `
          }
        >
          Cancelar edição
        </button>
      )}
    </div>
  );
}
