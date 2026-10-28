import { supabase } from "../lib/supabase";

function normalizeBudgetItem(item) {
  return {
    ...item,

    userId: item.user_id,
    categoriaId: item.categoria_id,

    valorMensal: item.valor_mensal,

    formaPagamento: item.forma_pagamento,
    cartaoId: item.cartao_id,
    accountId: item.account_id,

    diaVencimento: item.dia_vencimento,

    createdAt: item.created_at,
  };
}

export async function getBudgetItems(userId) {
  const { data, error } = await supabase
    .from("budget_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map(normalizeBudgetItem);
}

export async function createBudgetItem(item) {
  const payload = {
    id: item.id,
    user_id: item.user_id,

    descricao: item.descricao,
    categoria_id: item.categoriaId,

    valor_mensal: item.valorMensal,
    tipo: item.tipo,

    meses: item.meses,

    forma_pagamento: item.formaPagamento,
    cartao_id: item.cartaoId,
    account_id: item.accountId,

    dia_vencimento: item.diaVencimento,

    created_at: item.createdAt,
  };

  const { data, error } = await supabase
    .from("budget_items")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return null;
  }

  return normalizeBudgetItem(data);
}

export async function updateBudgetItem(id, item) {
  const payload = {
    descricao: item.descricao,
    categoria_id: item.categoriaId,

    valor_mensal: item.valorMensal,
    tipo: item.tipo,

    meses: item.meses,

    forma_pagamento: item.formaPagamento,
    cartao_id: item.cartaoId,
    account_id: item.accountId,

    dia_vencimento: item.diaVencimento,
  };

  const { data, error } = await supabase
    .from("budget_items")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return null;
  }

  return normalizeBudgetItem(data);
}

export async function deleteBudgetItem(id) {
  const { error } = await supabase
    .from("budget_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert(error.message);
  }
}