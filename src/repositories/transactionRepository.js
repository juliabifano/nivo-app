import { supabase } from "../lib/supabase";
import { updateTransactionRecord } from "./transactionUpdate.js";

function normalizeTransaction(transaction) {
  return {
    ...transaction,

    userId: transaction.user_id,
    categoriaId: transaction.categoria_id,

    formaPagamento: transaction.forma_pagamento,
    cartaoId: transaction.cartao_id,
    accountId: transaction.account_id,

    invoicePaymentId: transaction.invoice_payment_id,
    cardInvoiceId: transaction.card_invoice_id,
    schedulePaymentId: transaction.schedule_payment_id,

    isPreview: transaction.is_preview,
    invoiceSnapshot: transaction.invoice_snapshot,

    createdAt: transaction.created_at,
  };
}

export async function getTransactions(userId) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data || []).map(normalizeTransaction);
}

export async function createTransaction(transaction) {
  const payload = {
    id: transaction.id,
    user_id: transaction.user_id,

    descricao: transaction.descricao,
    valor: transaction.valor,
    tipo: transaction.tipo,

    categoria_id: transaction.categoriaId,
    data: transaction.data,

    forma_pagamento: transaction.formaPagamento,
    cartao_id: transaction.cartaoId,
    account_id: transaction.accountId,

    parcelas: transaction.parcelas,
    origem: transaction.origem,

    invoice_payment_id: transaction.invoicePaymentId,
    card_invoice_id: transaction.cardInvoiceId,
    schedule_payment_id: transaction.schedulePaymentId,

    is_preview: transaction.isPreview,
    invoice_snapshot: transaction.invoiceSnapshot,

    created_at: transaction.createdAt,
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return null;
  }

  return normalizeTransaction(data);
}

export async function updateTransaction(id, transaction, userId) {
  const data = await updateTransactionRecord(supabase, id, transaction, userId);
  return normalizeTransaction(data);
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);

  if (error) {
    console.error(error);
  }
}

export async function deleteSchedulePaymentTransactions(userId, paymentId) {
  // Inclui duplicatas antigas e pagamentos de fatura registrados pela Agenda.
  const value = JSON.stringify(paymentId);
  const { data, error } = await supabase
    .from("transactions")
    .delete()
    .eq("user_id", userId)
    .or(`schedule_payment_id.eq.${value},invoice_payment_id.eq.${value}`)
    .select("id");

  if (error) throw error;
  return (data || []).map((transaction) => transaction.id);
}
