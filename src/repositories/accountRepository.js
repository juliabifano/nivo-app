import { supabase } from "../lib/supabase";

function normalizeAccount(account) {
  return {
    ...account,
    userId: account.user_id,
    saldoInicial: account.saldo_inicial,
    createdAt: account.created_at,
  };
}

export async function getAccounts(userId) {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map(normalizeAccount);
}

export async function createAccount(account) {
  const payload = {
    id: account.id,
    user_id: account.user_id,
    nome: account.nome,
    banco: account.banco,
    tipo: account.tipo,
    saldo_inicial: account.saldoInicial,
    cor: account.cor,
    created_at: account.createdAt,
  };

  const { data, error } = await supabase
    .from("accounts")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return null;
  }

  return normalizeAccount(data);
}

export async function updateAccount(id, account) {
  const payload = {
    nome: account.nome,
    banco: account.banco,
    tipo: account.tipo,
    saldo_inicial: account.saldoInicial,
    cor: account.cor,
  };

  const { data, error } = await supabase
    .from("accounts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return null;
  }

  return normalizeAccount(data);
}

export async function deleteAccount(id) {
  const { error } = await supabase.from("accounts").delete().eq("id", id);

  if (error) {
    console.error(error);
    alert(error.message);
  }
}