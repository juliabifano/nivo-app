import { getBank } from "../data/banks";
import { paymentIcons } from "../utils/paymentIcons";

export function getPaymentVisual({ item, cards = [], accounts = [] }) {
  const card = cards.find((c) => String(c.id) === String(item.cartaoId));

  if (card?.banco) {
    return getBank(card.banco).logo;
  }

  const account = accounts.find(
    (a) =>
      String(a.id) === String(item.accountId) ||
      String(a.id) === String(item.contaId),
  );

  if (account?.banco) {
    return getBank(account.banco).logo;
  }

  return paymentIcons[item.formaPagamento] || paymentIcons.default;
}