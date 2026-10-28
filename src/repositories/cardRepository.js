import { supabase } from "../lib/supabase";

function normalizeCard(card) {
  return {
    ...card,
    userId: card.user_id,
    saldoInicial: card.saldo_inicial,
    diaReset: card.dia_reset,
    accountId: card.account_id,
    createdAt: card.created_at,
  };
}

export async function getCards(userId) {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map(normalizeCard);
}

export async function createCard(card) {
  const payload = {
    id: card.id,
    user_id: card.user_id,
    nome: card.nome,
    banco: card.banco,
    tipo: card.tipo,
    limite: card.limite,
    saldo_inicial: card.saldoInicial,
    vencimento: card.vencimento,
    fechamento: card.fechamento,
    dia_reset: card.diaReset,
    account_id: card.accountId,
    cor: card.cor,
    created_at: card.createdAt,
  };

  const { data, error } = await supabase
    .from("cards")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return null;
  }

  return normalizeCard(data);
}

export async function updateCard(id, card) {
  const payload = {
    nome: card.nome,
    banco: card.banco,
    tipo: card.tipo,
    limite: card.limite,
    saldo_inicial: card.saldoInicial,
    vencimento: card.vencimento,
    fechamento: card.fechamento,
    dia_reset: card.diaReset,
    account_id: card.accountId,
    cor: card.cor,
  };

  const { data, error } = await supabase
    .from("cards")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return null;
  }

  return normalizeCard(data);
}

export async function deleteCard(id) {
  const { error } = await supabase.from("cards").delete().eq("id", id);

  if (error) {
    console.error(error);
    alert(error.message);
  }
}