export type FxRates = {
  fundingNgnPerUsd: number;
  payoutNgnPerUsd: number;
};

export type FxQuote = {
  serviceCharge: number;
  fxFee: number;
  totalDue: number;
};

function money(n: number) {
  return Number(n.toFixed(2));
}

export function quoteCheckout(
  principal: number,
  serviceRate: number,
  rates: FxRates | null,
): FxQuote {
  const serviceCharge = money(principal * serviceRate);
  const subtotal = money(principal + serviceCharge);
  const funding = Number(rates?.fundingNgnPerUsd);
  const payout = Number(rates?.payoutNgnPerUsd);
  if (!(funding > 0) || !(payout > 0) || payout >= funding) {
    return { serviceCharge, fxFee: 0, totalDue: subtotal };
  }

  const totalDue = money((subtotal * funding) / payout);
  const fxFee = money(Math.max(0, totalDue - subtotal));
  return { serviceCharge, fxFee, totalDue: money(subtotal + fxFee) };
}
