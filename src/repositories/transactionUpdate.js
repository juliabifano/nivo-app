export async function updateTransactionRecord(client, id, transaction, userId) {
  const { data, error } = await client
    .from("transactions")
    .update({
      descricao: transaction.descricao,
      valor: transaction.valor,
      tipo: transaction.tipo,
      categoria_id: transaction.categoriaId,
      data: transaction.data,
      forma_pagamento: transaction.formaPagamento,
      cartao_id: transaction.cartaoId,
      account_id: transaction.accountId,
      parcelas: transaction.parcelas,
      is_preview: transaction.isPreview,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  // RLS pode permitir SELECT e filtrar silenciosamente o UPDATE.
  // Uma resposta sem registro não confirma que a alteração foi salva.
  const lookup = await client
    .from("transactions")
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (lookup.error) throw lookup.error;
  const failure = new Error(lookup.data
    ? "Não foi possível atualizar esta transação. Verifique a permissão de edição da sua conta."
    : "Esta transação não está mais disponível. Atualize a página e tente novamente.");
  failure.code = lookup.data ? "TRANSACTION_UPDATE_NOT_CONFIRMED" : "TRANSACTION_NOT_FOUND";
  throw failure;
}

export function getTransactionSaveError(error, fallback) {
  return ["TRANSACTION_UPDATE_NOT_CONFIRMED", "TRANSACTION_NOT_FOUND"].includes(error?.code)
    ? error.message
    : fallback;
}
